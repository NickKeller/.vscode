// Class responsible for storing line items of the quote
// Their are three groups of line items:
//   1: New - Add activations on the quote
//   2: Renewed - active products that are being fully added to the quote
//   3: Dropped - active products where the quantity has decrease

public class Quote {

    public List<SpotlightLineItem> renewedProducts {
        get{
            List<SpotlightLineItem> l = renewedProductsMap.values();
            l.sort();
            return l;
        }
        private set;
    }
    public List<SpotlightLineItem> deletedProducts {
        get{
            List<SpotlightLineItem> l = deletedProductsMap.values();
            l.sort();
            return l;
        }
        private set;
    }
    public List<SpotlightLineItem> newProducts {
        get{
            List<SpotlightLineItem> l = newProductsMap.values();
            l.sort();
            return l;
        }
        private set;

    }

    public Map<String, QuoteProduct> activeProductsMap {get; private set;}

    //this should really be refactored to a single map (or set with a implemented hashcode)
    //Tracking of what type should be moved to the ProductLineItem
    public Map<String,SpotlightLineItem> renewedProductsMap {get; set;}
    public Map<String,SpotlightLineItem> deletedProductsMap {get; set;}
    public Map<String,SpotlightLineItem> newProductsMap     {get; set;}

    public Map<String,SpotlightLineItem> allProductsMap {
        get{
            Map<String,SpotlightLineItem> l = new Map<String,SpotlightLineItem>();
            l.putAll(renewedProductsMap);
            l.putAll(deletedProductsMap);
            l.putAll(newProductsMap);
            return l;
        }
    }

    public TotalSummary summary {
        get{
            return new TotalSummary(this);
        }
    }

    public QuoteInventory inventoryValidator;

    public Id accountId;
    public CurrencyExchange.CurrencyType localCurrency;
    public CurrencyExchange exchange;

    public transient List<ApexPages.Message> loadMessages;

    private Opportunity opp;

    private Boolean isTopDoctor;


    public Quote(Opportunity opp) {
        this.opp = opp;
        this.accountId = opp.accountId;
        renewedProductsMap = new Map<String,SpotlightLineItem>();
        deletedProductsMap = new Map<String,SpotlightLineItem>();
        newProductsMap = new Map<String,SpotlightLineItem>();

        inventoryValidator = new QuoteInventory();

        DoctorInfoService doctorInfo = DoctorInfoService.getInstance(accountId);
        isTopDoctor = doctorInfo.isTopDoctor;
        localCurrency = doctorInfo.currencyType;

    }


    public void load(){

        List<OpportunityLineItem> lineItems = QuoteLineItem.getOpportunityProducts(opp.Id);
        List<Sold_Package__c> soldPackages = QuotePackage.getSoldPackages(opp.Id);
        load(lineItems, soldPackages, false);
    }

    /**
     * Loads the saved inventory line items
     * @param lineItems         the OLI to reconstruct
     * @param activeProductsMap the "Active Products" that OLI might relate to
     */
    public void load(List<OpportunityLineItem> lineItems,
                        List<Sold_Package__c> soldPackages,
                        Boolean forProvisioning){
        loadMessages = new List<ApexPages.Message>();

        CurrencyExchange.CurrencyType savedCurrency = CurrencyExchange.parseCurrencyType(opp.Currency__c);
        if(!forProvisioning){
            initExchange(savedCurrency);
        }

        //instanciate current account products
        createActiveProducts();

        //process saved Opportunity Line Items
        Map<Id,List<OpportunityLineItem>> packageLineItems = new Map<Id,List<OpportunityLineItem>>();
        List<OpportunityLineItem> droppedPackages = new List<OpportunityLineItem>();

        //build saved line items
        for(OpportunityLineItem li : lineItems){
            if(li.Sold_Package__c != null){ //handle packages
                if(li.Type__c == QuoteLineItem.TYPE_DROP){
                    droppedPackages.add(li);
                    continue;
                }
                if(packageLineItems.containsKey(li.Sold_Package__c)){
                    packageLineItems.get(li.Sold_Package__c).add(li);
                }else{
                    packageLineItems.put(li.Sold_Package__c, new OpportunityLineItem[] { li });
                }
            }else if(li.Sponsorship__c != null){ //build from active product
                restoreActiveProductLineItem(li);
            }else{ //build with new product
                restoreNewProductLineItem(li);
            }
        }

        //setup packages from line items
        loadPackages(soldPackages, packageLineItems);
        handleSavedDroppedPackages(droppedPackages);

        Boolean currencyChanged = localCurrency != savedCurrency;
        if(!forProvisioning && currencyChanged){
            Decimal transferExchangeRate = 1/exchange.getExchangeRate(savedCurrency);
            for(SpotlightLineItem li : allProductsMap.values()){
                if(li.price != null){
                    li.price = (transferExchangeRate * li.price).setScale(2);
                }
            }
        }
    }

    private void initExchange(CurrencyExchange.CurrencyType savedCurrency){
        Boolean currencyChanged = localCurrency != savedCurrency;

        if(currencyChanged){
            loadMessages.add(new ApexPages.Message(
                    ApexPages.Severity.WARNING,
                    'Currency has changed since Quote was first created.  Line Item prices have been transfered from '
                        + savedCurrency.name() + ' to ' + localCurrency.name())
            );
        }

        if(!currencyChanged && opp.Exchange_Rate_Date__c != null && opp.Exchange_Rates__c != null && opp.Exchange_Rate_Date__c.addDays(7) > DateTime.now()){
            exchange = (CurrencyExchange) JSON.deserialize(opp.Exchange_Rates__c, CurrencyExchange.class);
            System.debug(exchange);
        }else{
            exchange = CurrencyExchange.getExchange(localCurrency);
            opp.Exchange_Rates__c = JSON.serialize(exchange);
            opp.Exchange_Rate_Date__c = DateTime.now();
            System.debug(exchange);
        }
    }

    private void restoreActiveProductLineItem(OpportunityLineItem li){
        QuoteProduct p = activeProductsMap.get(li.Sponsorship__c);
        if(p == null){
            String linkString = '<a href="/' + li.Sponsorship__c + '">'+li.Sponsorship__r.Name+'</a>';
            loadMessages.add(new ApexPages.Message(
                    ApexPages.Severity.WARNING,
                    'Line Items referencing sponsorships that are no longer active have been removed! <br />' + linkString)
            );
            return;
        }
        SpotlightLineItem.SavedSpotlightLineItem pli = new SpotlightLineItem.SavedSpotlightLineItem(p,li, isTopDoctor);
        ActiveProductActions actions = ((IActiveProduct) p).getActions();
        //add to quote
        if(actions.deleted){
            deletedProductsMap.put(pli.product.getProductKey(),pli);
        }else if(actions.increased){
            newProductsMap.put(pli.product.getProductKey(),pli);
        }else if(actions.renewed){
            renewedProductsMap.put(pli.product.getProductKey(),pli);
        }
        updateInventory(pli);
    }

    private void restoreNewProductLineItem(OpportunityLineItem li){
        QuoteInventory.Inventory inventory = inventoryValidator.getInventory(li.Dr_Spotlight__r);
        QuoteProduct pr = new SpotlightProduct(li.Dr_Spotlight__r, inventory, this);
        SpotlightLineItem.SavedSpotlightLineItem pli = new SpotlightLineItem.SavedSpotlightLineItem(pr,li, isTopDoctor);
        newProductsMap.put(pli.product.getProductKey(),pli);
        updateInventory(pli);
    }

    private void handleSavedDroppedPackages(List<OpportunityLineItem> droppedPackages){
        //load dropped packages
        for(OpportunityLineItem li : droppedPackages){
            QuotePackage p = (QuotePackage) activeProductsMap.get(li.Sold_Package__c);
            IActiveProduct ap = (IActiveProduct) p;
            ap.getActions().deleted = true;
            ap.getActions().markedDeleted = true;
            PackageLineItem.SavedPackageLineItem pli = new PackageLineItem.SavedPackageLineItem(p, li.Sold_Package__r, isTopDoctor);
            pli.quantity = (Integer) SponsorshipHelper.convertImpressionsToBundles(li.Sold_Package__r.Monthly_Impressions__c);
            deletedProductsMap.put(pli.product.getProductKey(),pli);

            for(QuotePackage.PackageProduct pkgProduct : p.products){
                pkgProduct.inventory.recalculateInventory();
            }
        }
    }

    public Map<String, QuoteProduct> createActiveProducts(){
        activeProductsMap = new Map<String, QuoteProduct>();

        Map<Id, List<Sponsorship__c>> soldPkgMap = new Map<Id, List<Sponsorship__c>>();
        for(Sponsorship__c sponsorship : DoctorInfoService.getInstance(accountId).getActiveSponsorships()){
            if(sponsorship.Sold_Package__c == null){
                QuoteInventory.Inventory inventory = inventoryValidator.getInventory(sponsorship.Dr_Spotlight__r);
                SpotlightProduct.ActiveSpotlightProduct p = new SpotlightProduct.ActiveSpotlightProduct(sponsorship, inventory, this);
                activeProductsMap.put(p.getActiveProductId(), p);
            }else{
                if(soldPkgMap.containsKey(sponsorship.Sold_Package__c)){
                    soldPkgMap.get(sponsorship.Sold_Package__c).add(sponsorship);
                }else{
                    soldPkgMap.put(sponsorship.Sold_Package__c,new Sponsorship__c[]{ sponsorship });
                }
            }
        }

        if(soldPkgMap.size() > 0){
            for(Sold_Package__c soldPkg : [SELECT Package_Definition__r.Id,
                    Package_Definition__r.Name,
                    Monthly_Impressions__c,
                    Bundle_Price__c,
                    Prorate__c,
                    Standard_Bundle_Price__c,
                    Renewing_On__c,
                    Currency__c,
                    (SELECT Region__c FROM Sold_Package_Region__r)
                    FROM Sold_Package__c WHERE Id IN :soldPkgMap.keySet()]){

                Set<Id> regionIds = new Set<Id>();
                for(Sold_Package_Region__c pkgRegion : soldPkg.Sold_Package_Region__r){
                    regionIds.add(pkgRegion.Region__c);
                }

                List<Sponsorship__c> sponsorships = soldPkgMap.get(soldPkg.Id);
                QuotePackage.ActivePackage pkg = new QuotePackage.ActivePackage(soldPkg, this);
                for(Sponsorship__c sponsorship : sponsorships){
                    Dr_Spotlight__c spotlight = sponsorship.Dr_Spotlight__r;
                    QuoteInventory.Inventory inventory = inventoryValidator.getInventory(spotlight);
                    QuotePackage.ActivePackageProduct p = new QuotePackage.ActivePackageProduct(sponsorship, inventory, pkg, this);
                    pkg.addProduct(p);
                }

                pkg.addMissingProducts(this);
                activeProductsMap.put(pkg.getActiveProductId(), pkg);
            }
        }

        return activeProductsMap;
    }

    public void loadPackages(List<Sold_Package__c> soldPackages, Map<Id,List<OpportunityLineItem>> packageLineItems){
        for(Sold_Package__c soldPkg : soldPackages){
            QuotePackage pkg;
            if(soldPkg.Renewing_On__c == null){
                pkg = new QuotePackage(soldPkg.Package_Definition__r, this);
            }else{ //find the related active package
                for(QuoteProduct qp : activeProductsMap.values()){
                    if(qp instanceOf QuotePackage.ActivePackage){
                        QuotePackage.ActivePackage ap = (QuotePackage.ActivePackage) qp;
                        if(ap.soldPkgId == soldPkg.Renewing_On__c){
                            pkg = (QuotePackage.ActivePackage) ap;
                        }
                    }
                }
            }

            if(pkg == null){
                System.debug('Could not find active package for renewing package : ' + soldPkg.Id);
            }

            if(packageLineItems.containsKey(soldPkg.Id)){
                PackageLineItem.SavedPackageLineItem pkgLi = new PackageLineItem.SavedPackageLineItem(pkg, soldPkg, isTopDoctor);

                for(OpportunityLineItem lineItem : packageLineItems.get(soldPkg.Id)){
                    pkg.regions.add(lineItem.Dr_Spotlight__r.Region__r);
                }

                if(pkg instanceOf QuotePackage.ActivePackage){
                    renewedProductsMap.put(pkg.getProductKey(), pkgLi);
                }else{
                    newProductsMap.put(pkg.getProductKey(), pkgLi);
                }

                for(OpportunityLineItem lineItem : packageLineItems.get(soldPkg.Id)){
                    QuoteInventory.Inventory inventory = inventoryValidator.getInventory(lineItem.Dr_Spotlight__r);
                    QuotePackage.PackageProduct p = pkg.addProduct(lineItem.Dr_Spotlight__r, inventory, this);
                    SpotlightLineItem pli = p.lineItem;
                    pli.impressions = lineitem.Number_of_Bundles__c * 100;
                    inventory.addQuotedLineItem(pli);
                }

                pkgli.price = soldpkg.Bundle_Price__c;
                pkgLi.quantity = (Integer) SponsorshipHelper.convertImpressionsToBundles(soldPkg.Monthly_Impressions__c);
            }
        }
    }


    /**
     * Saves the lineitems on the quote to the opportunity
     * @param opp: the opportunity to save the lineitems to
     */
    public void save(){
        List<OpportunityLineItem> toInsert = new List<OpportunityLineItem>();
        List<OpportunityLineItem> toUpdate = new List<OpportunityLineItem>();

        //get all line items that are currently on the opp
        Map<Id,OpportunityLineItem> oliToDeleteMap = new Map<Id,OpportunityLineItem>([SELECT Id
                                                            FROM OpportunityLineItem
                                                            WHERE OpportunityId = :opp.Id]);

        //get all packages that are currently on the opp
        Map<Id,Sold_Package__c> pkgToDeleteMap = new Map<Id,Sold_Package__c>([SELECT ID
                                                                                FROM Sold_Package__c
                                                                                WHERE Opportunity__c = :opp.Id]);

        //validate each line item
        List<SpotlightLineItem> badLineItems = new List<SpotlightLineItem>();
        for(SpotlightLineItem li : allProductsMap.values()){
            String error = li.validate();
            if(error != null){
                badLineItems.add(li);
                ApexPages.addMessage(new ApexPages.Message(ApexPages.Severity.WARNING, 'A Line Item on Product: '
                                                + li.product.getName()
                                                + ' was invalid and has been removed from the quote! Reason: '
                                                + error));
                continue;
            }

            //create opp line items (most product types just return 1 item in list)
            //Add to either update or insert list
            //remove packages and oli no longer in quote
            for(OpportunityLineItem oli : li.createOpportunityLineItems(opp)){
                pkgToDeleteMap.remove(oli.Sold_Package__c);
                if(oli.Id == null){
                    toInsert.add(oli);
                }else{
                    oliToDeleteMap.remove(oli.Id);
                    toUpdate.add(oli);
                }
            }
        }

        //remove bad items
        for(SpotlightLineItem li : badLineItems){
            removeProduct(li.product.getProductKey());
        }

        //delete items that are no longer on the quote

        delete pkgToDeleteMap.values();
        delete oliToDeleteMap.values();

        //insert and update lineitems
        insert toInsert;
        update toUpdate;

        //update opporunity
        opp.One_time_charge_credit__c = summary.prorate;
        opp.Sale_Amount__c = summary.monthly;
        opp.Sale_Amount_USD__c = exchange.getExchangeRate(CurrencyExchange.DEFAULT_CURRENCY) * summary.monthly;
        opp.Currency__c = CurrencyExchange.getCurrencySetting(localCurrency).Id;
        update opp;

    }

    public void addRenewedProduct(IActiveProduct product){
        QuoteProduct p = (QuoteProduct) product;
        if(!allProductsMap.containsKey(p.getProductKey())){
            product.getActions().renewed = true;
            product.getActions().markedRenewed = true;

            SpotlightLineItem pli = p.createProductLineItem(isTopDoctor);
            renewedProductsMap.put(p.getProductKey(), pli);

            updateInventory(pli);
            pli.handleQuantityChange();
        }
    }

    public void addDeletedProduct(IActiveProduct product){
        QuoteProduct p = (QuoteProduct) product;
        if(!allProductsMap.containsKey(p.getProductKey())){
            product.getActions().deleted = true;
            product.getActions().markedDeleted = true;

            SpotlightLineItem pli = p.createProductLineItem(isTopDoctor);
            deletedProductsMap.put(p.getProductKey(), pli);
            updateInventory(pli);
        }
    }

    public void addNewProduct(QuoteProduct product){
        if(!allProductsMap.containsKey(product.getProductKey())){
           if(product instanceOf IActiveProduct){
               ActiveProductActions actions = ((IActiveProduct) product).getActions();
               actions.increased = true;
               actions.markedIncreased = true;
           }

           SpotlightLineItem pli = product.createProductLineItem(isTopDoctor);
           newProductsMap.put(product.getProductKey(), pli);
           updateInventory(pli);
        }
    }

    public SpotlightLineItem removeProduct(String productId){
        SpotlightLineItem pli = null;
        if(renewedProductsMap.containsKey(productId)){
            pli = removeRenewedByProduct(productId);
        }
        if(deletedProductsMap.containsKey(productId)){
            pli = removeDeletedByProduct(productId);
        }
        if(newProductsMap.containsKey(productId)){
            pli = removeNewByProduct(productId);
        }
        return pli;
    }

    public SpotlightLineItem removeRenewedByProduct(String productId){
        SpotlightLineItem pli = renewedProductsMap.remove(productId);
        if(pli.product InstanceOf QuotePackage){
            QuotePackage pkg = (QuotePackage) pli.product;
            pkg.resetProductInventory();
        }else{
            removeFromInventory(pli);
        }
        return pli;
    }

    public SpotlightLineItem removeDeletedByProduct(String productId){

        SpotlightLineItem pli = deletedProductsMap.remove(productId);
        if(pli.product InstanceOf QuotePackage){

            QuotePackage pkg = (QuotePackage) pli.product;
            pkg.resetProductInventory();
        }else{
            removeFromInventory(pli);
        }
        return pli;
    }

    public SpotlightLineItem removeNewByProduct(String productId){
        SpotlightLineItem pli = newProductsMap.remove(productId);
        if(pli.product InstanceOf QuotePackage){

            QuotePackage pkg = (QuotePackage) pli.product;
            pkg.resetProductInventory();
        }else{
            removeFromInventory(pli);
        }
        return pli;
    }

    private void updateInventory(SpotlightLineItem pli){
        if(!(pli.product InstanceOf SpotlightProduct) || pli.product.isProUpgrade){
            return;
        }
        SpotlightProduct sp = (SpotlightProduct) pli.product;
        QuoteInventory.Inventory inventory = sp.inventory;

        if(inventory != null){
           inventory.addQuotedLineItem(pli);
        }

    }

    private void removeFromInventory(SpotlightLineItem pli){
        if(!(pli.product InstanceOf SpotlightProduct) || pli.product.isProUpgrade){
            return;
        }
        SpotlightProduct sp = (SpotlightProduct) pli.product;
        QuoteInventory.Inventory inventory = sp.inventory;

        if(inventory != null){
            inventory.removeQuotedLineItem(pli.product.getProductKey());
        }

    }

}