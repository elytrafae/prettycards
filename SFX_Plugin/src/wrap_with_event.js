
import {plugin, settings} from "/src/underscript_checker.js";

function WrapWithEvent(func_name) {
	var old_func = window[func_name];
	window[func_name] = function() {
		old_func.apply(null, arguments);
		plugin.events.emit(func_name, Array.from(arguments));
	}
}

export {WrapWithEvent};