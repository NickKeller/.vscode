# JavaScript
## Visual Studio Code JavaScript Snippets
-------------------

[![Version](http://vsmarketplacebadge.apphb.com/version/xabikos.JavaScriptSnippets.svg)](https://marketplace.visualstudio.com/items?itemName=xabikos.JavaScriptSnippets)
[![Installs](http://vsmarketplacebadge.apphb.com/installs/xabikos.JavaScriptSnippets.svg)](https://marketplace.visualstudio.com/items?itemName=xabikos.JavaScriptSnippets)
[![Ratings](https://vsmarketplacebadge.apphb.com/rating/xabikos.JavaScriptSnippets.svg)](https://marketplace.visualstudio.com/items?itemName=xabikos.JavaScriptSnippets)

This extension contains code snippets for JavaScript in ES6 syntax for [Visual Studio Code][code] editor (supports both JavaScript and TypeScript).

## Installation

In order to install an extension you need to open the Extensions Tab in Sidebar (Ctrl + Shift + X or Cmd + Shift + X).
You can manage your installed extensions there or install new ones. Search for *JavaScript Code Snippets* and install it.

## Supported languages (file extensions)
* JavaScript (.js)
* TypeScript (.ts)
* JavaScript React (.jsx)
* TypeScript React (.tsx)
* Html (.html)

## Snippets

Below is a list of all available snippets and the triggers of each one. The **⇥** means the `TAB` key.

### Import and export
| Trigger  | Content |
| -------: | ------- |
| `imp→`   | imports entire module `import fs from 'fs';`|
| `imn→`   | imports entire module without module name `import 'animate.css'` |
| `imd→`   | imports only a portion of the module using destructing  `import {rename} from 'fs';` |
| `ime→`   | imports everything as alias from the module `import * as localAlias from 'fs';` |
| `ima→`   | imports only a portion of the module as alias `import { rename  as localRename } from 'fs';` |
| `enf→`   | exports name function `export const log = (parameter) => { console.log(parameter);};` |
| `edf→`   | exports default function `export default  (parameter) => { console.log(parameter);};` |
| `ecl→`   | exports default class `export default class Calculator { };` |
| `ece→`   | exports default class by extending a base one `export default class Calculator extends BaseClass { };` |

### Class helpers
| Trigger  | Content |
| -------: | ------- |
| `con→`   | adds default constructor in the class `constructor() {}`|
| `met→`   | creates a method inside a class `add() {}` |
| `pge→`   | creates a getter property `get propertyName() {return value;}` |
| `pse→`   | creates a setter property `set propertyName(value) {}` |

### Various methods
| Trigger  | Content |
| -------: | ------- |
| `fre→`   | forEach loop in ES6 syntax `array.forEach(currentItem => {})`|
| `fof→`   | for ... of loop `for(let item of object) {}` |
| `fin→`   | for ... in loop `for(let item in object) {}` |
| `anfn→`  | creates an anonymous function `(params) => {}` |
| `nfn→`   | creates a named function `const add = (params) => {}` |
| `dob→`   | destructing object syntax `const {rename} = fs` |
| `dar→`   | destructing array syntax `const [first, second] = [1,2]` |
| `sti→`   | set interval helper method `setInterval(() => {});` |
| `sto→`   | set timeout helper method `setTimeout(() => {});` |
| `prom→`  | creates a new Promise `return new Promise((resolve, reject) => {});`|

### Console methods
| Trigger  | Content |
| -------: | ------- |
| `cas→`   | console alert method `console.assert(expression, object)`|
| `ccl→`   | console clear `console.clear()` |
| `cco→`   | console count `console.count(label)` |
| `cdi→`   | console dir `console.dir` |
| `cer→`   | console error `console.error(object)` |
| `cgr→`   | console group `console.group(label)` |
| `cge→`   | console groupEnd `console.groupEnd()` |
| `clg→`   | console log `console.log(object)` |
| `ctr→`   | console trace `console.trace(object)` |
| `cwa→`   | console warn `console.warn` |
| `cin→`   | console info `console.info` |

[code]: https://code.visualstudio.com/