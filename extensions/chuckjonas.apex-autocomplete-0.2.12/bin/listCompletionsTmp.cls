public class IntakePortal_Controller extends rkl.RKPortalController_2{

    public Contact employee {get; private set;}

    public String recordId {get; private set;}

    public String[] nearMiss {get; private set;}

    private rkl.PortalSecurity security;
    public rkl.PortalSecurity.Portal_Settings portalSettings {get; private set;}


    public IntakePortal_Controller(rkl.JS_Search ign) {

        recordId = System.currentPagereference().getParameters().get('incId');
        if(recordId != null && recordId.trim() == '') {
            recordId = null;
        }

        try {
            // Get login definition from url parameter
            this.security = new rkl.PortalSecurity(ApexPages.currentPage().getParameters().get('portalGroup'));
        } catch (rkl.PortalSecurity.InvalidPortalGroupException e) {
            this.security = null;
            return;
        }

        this.portalSettings = security.portalSettings;

        this.nearMiss = readFieldSet('Near_Miss','Intake__c');

    }

    private static String[] readFieldSet(String fieldSetName, String objectName){
        Map<String, Schema.SObjectType> globalDescribeMap = Schema.getGlobalDescribe();
        Schema.SObjectType sObjectTypeObj = globalDescribeMap.get(objectName);
        Schema.DescribeSObjectResult resultObj = sObjectTypeObj.getDescribe();

        Schema.FieldSet fieldSetObj = resultObj.FieldSets.getMap().get(fieldSetName);
        String[] result = new String[]{};
        for(Schema.FieldSetMember field : fieldSetObj.getFields()){
            result.add(field.getFieldPath().);
        }
        return result;
    }

    public PageReference pageLoad(){

        if (this.security == null) {
            return Page.rkl__PortalSecurityGroupError;
        }

        if (!this.security.authorized) {
            PageReference loginPage = Page.rkl__PortalLogin;
            loginPage.getParameters().put('portalGroup', this.security.portalSettings.portalGroup);
            loginPage.getParameters().put('errMsg', this.security.errMessage);
            return loginPage;
        }

        List<Contact> contacts = [SELECT Id, Site_Access_Approved__c, FirstName, LastName, Phone, Location__c FROM Contact WHERE Id=:this.security.personId];
        if(contacts.size()==1 && recordId == null) {
            employee = contacts[0];  // Only set employee details for first record
        }

        return null;

    }

    @RemoteAction
    public static Object retrieveTemplate(Map<String, Object> config) {

        //Pull template name from config and do something with it
        String templateName = (String)config.get('templateName');

        // Retrieve Contact.Employee RecordTypeId for two lookup searches below
        String contactRecordTypeId = '';
        List<RecordType> recordTypes = [select id from RecordType where sobjecttype = 'Contact' and name = 'Employee'];
        if (recordTypes.size() == 1) {
            contactRecordTypeId = recordTypes[0].id;
        }

        // Template Definitions
        if (templateName == 'demoTemplate') {   // Main Template
            return demoTemplate();
        } 
        else if (templateName == 'Employee_Injury') {   //Additional Templates
            return rkl.RKPBuilder.createBuilder('Employee_Injury', 'Intake_Detail__c', 'Employee_Injury')
                .fieldsetSection('Employee_Injuries_Injuries', 'Injuries')//dynamic logic required, lookup required
                    .configureMember('Injured_Employee__c')
                        .put('searchFields', 'Intake_Contact_Search_Grid')
                        .put('resultFields', 'Intake_Contact_Company_Driver')
                        .put('baseCondition', 'RecordType.Name = \"Employee\"')
                        .sub('mixin')
                            .put('src', 'Intake_Contact_Injured_Employee')
                            .put('dst', 'Intake_Detail_Injured_Employee')
                        .subdone()
                    .done()
                .fieldsetSection('Employee_Injury_OSHA', 'OSHA')
            .finalize();

        } 
        else if (templateName == 'Auto_Non_Employee_Injury') {
            return rkl.RKPBuilder.createBuilder('Auto_Non_Employee_Injury', 'Intake_Detail__c', 'X3rd_Party_Auto_Bodily_Injury')
                .fieldsetSection('X3rd_Party_Auto_Bodily_Injury_Injuries', 'Auto Non Employee Injury')
            .finalize();

        } 
        else if (templateName == 'Auto_Non_Employee_Property_Damage') {
            return rkl.RKPBuilder.createBuilder('Auto_Non_Employee_Property_Damage', 'Intake_Detail__c', 'X3rd_Party_Auto_Damage')
                .section('Auto_Non_Employee_Property_Damage', 'Auto Non Employee Property Damage')
                    .fieldset('X3rd_Party_Auto_Damage_3rd_Party_Vehicle')
                    .fieldset('X3rd_Party_Auto_Bodily_Injury_3rd_Party')
                .finalize();

        } 
        else if (templateName == 'Company_Auto_Damage') {
            return rkl.RKPBuilder.createBuilder('Auto_Company_Vehicle', 'Intake_Detail__c', 'Company_Auto_Damage')
                .fieldsetSection('Company_Auto_Damage_Company_Driver', 'Auto Company Vehicle')//dynamic logic required, lookup required
                    .configureMember('Company_Driver__c')
                        .put('searchFields', 'Intake_Contact_Search_Grid')
                        .put('resultFields', 'Intake_Contact_Lookup_Grid')
                        .put('baseCondition', 'RecordType.Name = \"Employee\"')
                        .sub('mixin')
                            .put('src', 'Intake_Contact_Company_Driver')
                            .put('dst', 'Intake_Detail_Company_Driver')
                        .subdone()
                    .done()
                .fieldsetSection('Company_Auto_Damage_Company_Vehicle', 'Auto Company Vehicle')//dynamic logic required
                    .configureMember('Company_Vehicle_Lookup__c')
                        .put('searchFields', 'Intake_Vehicle_Search_Grid')
                        .put('resultFields', 'Intake_Vehicle_Lookup_Grid')
                        .put('baseCondition', 'RecordType.Name = \"Vehicle\"')
                        .sub('mixin')
                            .put('src', 'Intake_Asset_Company_Vehicle')
                            .put('dst', 'Intake_Detail_Company_Vehicle')
                        .subdone()
                    .done()
            .finalize();
        } 
        else if (templateName == 'X3rd_Party_Bodily_Injury') {
            return rkl.RKPBuilder.createBuilder('3rd_Party_Bodily_Injury', 'Intake_Detail__c', 'X3rd_Party_Bodily_Injury')
                .fieldsetSection('X3rd_Party_Bodily_Injury_Injuries', '3rd Party Bodily Injury')//dynamic logic required
            .finalize();
        } 
        else if (templateName == 'X3rd_Party_Auto_Bodily_Injury'){
            //todo
            return rkl.RKPBuilder.createBuilder('3rd_Party_Auto_Bodily_Injury', 'Intake_Detail__c', 'X3rd_Party_Auto_Bodily_Injury')
                .fieldsetSection('X3rd_Party_Auto_Bodily_Injury_Injuries', 'Auto Non Employee Injury')//dynamic logic required
            .finalize();
        }
        else if (templateName == 'X3rd_Party_Auto_Damage'){
            //todo
            return rkl.RKPBuilder.createBuilder('3rd_Party_Auto_Damage', 'Intake_Detail__c', 'X3rd_Party_Auto_Damage')
                .fieldsetSection('X3rd_Party_Auto_Damage_3rd_Party_Vehicle', 'Auto Non Employee Property Damage')
            .finalize();
        }
        else if (templateName == 'X3rd_Party_Property_Damage') {
            return rkl.RKPBuilder.createBuilder('3rd_Party_Property_Damage', 'Intake_Detail__c', 'X3rd_Party_Property_Damage')
                .fieldsetSection('X3rd_Party_Property_Damage_Property_Dama', '3rd Party Property Damage')//dynamic logic required
            .finalize();
        }
        else if (templateName == 'Company_Property_Damage') {
            return rkl.RKPBuilder.createBuilder('Company_Property_Damage', 'Intake_Detail__c', 'Company_Property_Damage')
                .fieldsetSection('Company_Property_Damage_Company_Property', 'Company Property Damage')//lookup required
                    .configureMember('Company_Property__c')
                        .put('searchFields', 'Intake_Property_Search_Grid')
                        .put('resultFields', 'Intake_Property_Lookup_Grid')
                    .done()
            .finalize();
        }
        else {
            return null;
        }  // End template definitions

    }


    public static Object demoTemplate() {

        return rkl.RKPBuilder.createBuilder('demoTemplate','Intake__c')
            .fieldsetSection('Intake_Description', 'General Incident Details')//dynamic logic required, lookup required, validation rules required
                .configureMember('Incident_Location__c')
                    .put('searchFields', 'Intake_Location_Lookup_Search')
                    .put('resultFields', 'Intake_Location_Lookup_Grid')
                    .put('selectionValue', 'rkl__Node_Name__c')
                    // .put('dependentField', new List<Map<String,Object>>{
                    //     new Map<String,Object>{
                    //         'srcField' => 'sub_location_floor__c',
                    //         'qryField' => 'rkl__Parent_Node__c',
                    //         'qryOperator' => '='
                    // }})
                    // .put('dependentField', new List<Map<String,Object>>{
                    //     new Map<String,Object>{
                    //         'srcField' => 'sub_location_room_number__c',
                    //         'qryField' => 'rkl__Parent_Node__c',
                    //         'qryOperator' => '='
                    // }})
                .done()
                // .configureMember('Sub_Location_Floor__c')
                //     .put('searchFields', 'Location_Lookup')
                //     .put('resultFields', 'Location_Lookup')
                //     .put('baseCondition', 'Hierarchy_Sublocation__c.Hierarchy__c = Incident_Location__c')
                //     .sub('mixin')
                //         .put('src', 'Intake_Portal_Sub_Location')
                //         .put('dst', 'Intake_Portal_Sub_Location')
                //     .subdone()
                // .done()
                // .configureMember('Sub_Location_Room_Number__c')
                //     .put('searchFields', 'Location_Lookup')
                //     .put('resultFields', 'Location_Lookup')
                //     .put('baseCondition', 'Hierarchy_Sublocation__c.Hierarchy__c = Incident_Location__c')
                //     .sub('mixin')
                //         .put('src', 'Intake_Portal_Sub_Location')
                //         .put('dst', 'Intake_Portal_Sub_Location')
                //     .subdone()
                // .done()
            //.fieldsetSection('Intake_Portal_Sub_Location')
            .fieldsetSection('Near_Miss', 'Near Miss')
            .fieldsetSection('Involved_Parties', 'Involved Parties')//dynamic logic required
            .fieldsetSection('Witnesses', 'Witnesses')//dynamic logic required

            .relatedSection('Employee_Injury', 'Employee Injury', 'Employee_Injury', 'Intake_Detail__c', 'intake__c')

            .relatedSection('3rd_Party_Auto_Bodily_Injury', '3rd Party Auto Bodily Injury', 'X3rd_Party_Auto_Bodily_Injury', 'Intake_Detail__c', 'intake__c')

            .relatedSection('3rd_Party_Auto_Damage', '3rd Party Auto Damage', 'X3rd_Party_Auto_Damage', 'Intake_Detail__c', 'intake__c')

            .relatedSection('Company_Auto_Damage', 'Company Auto Damage', 'Company_Auto_Damage', 'Intake_Detail__c', 'intake__c')

            .relatedSection('3rd_Party_Bodily_Injury', '3rd Party Bodily Injury', 'X3rd_Party_Bodily_Injury', 'Intake_Detail__c', 'intake__c')

            .relatedSection('3rd_Party_Property_Damage', '3rd Party Property Damage', 'X3rd_Party_Property_Damage', 'Intake_Detail__c', 'intake__c')

            .relatedSection('Company_Property_Damage', 'Company Property Damage', 'Company_Property_Damage', 'Intake_Detail__c', 'intake__c')

            .section('Submit')
                .plainText('Submit_Instructions_1', 'Please review all preceding sections before clicking the \"Submit\" button below.')
                .plainText('Submit_Instructions_2', 'You will be unable to change your provided answers once \"Submit\" is clicked.')
                .attach('Attachments')
        .finalize();
    }
}