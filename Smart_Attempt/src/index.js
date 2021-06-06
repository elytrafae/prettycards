
import {PrettyCards_plugin, settings} from "./libraries/underscript_checker.js";

import {InitPacks} from "./page_specific/packs.js";


console.log("This is a brand new userscript! ^^");

if (settings.packs.value() && underscript.onPage('Packs')) {
	console.log("Packs page!", InitPacks);
	InitPacks();
}