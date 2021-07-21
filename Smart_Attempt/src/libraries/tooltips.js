
import {utility} from "/src/libraries/utility.js";
import $ from "/src/third_party/jquery-3.6.0.min.js";

const defaultSettings = {
	orientations : ["bottom", "top", "left", "right"],
	css: "background-color: black; border: 1px solid white; border-radius: 10px; padding: 5px; z-index: 2222;",
	padding: 6,
	onNoSpace : function (data) { // Fired if every single orientation fails to place the tooltip (aka there is absolutely no space in any direction.)
		DestroyTooltip(data);
	}
}

const orientationFunctions = {
	bottom : function(windowRect, tooltipRect, elementRect, padding, tooltip) {
		if (elementRect.top + elementRect.height + padding + tooltipRect.height > windowRect.height) {
			return false;
		}
		tooltip.style.top = (elementRect.top + elementRect.height + padding) + "px";
		var x = elementRect.left + elementRect.width/2 - tooltipRect.width/2;
		if (x < 0) {
			x = 0;
		} else if (x > windowRect.width - tooltipRect.width) {
			x = windowRect.width - tooltipRect.width;
		}
		tooltip.style.left = x + "px";
		return true;
	},
	top : function(windowRect, tooltipRect, elementRect, padding, tooltip) {
		if (elementRect.top - padding - tooltipRect.height < 0) {
			return false;
		}
		tooltip.style.top = (elementRect.top - padding - tooltipRect.height) + "px";
		var x = elementRect.left + elementRect.width/2 - tooltipRect.width/2;
		if (x < 0) {
			x = 0;
		} else if (x > windowRect.width - tooltipRect.width) {
			x = windowRect.width - tooltipRect.width;
		}
		tooltip.style.left = x + "px";
		return true;
	},
	left : function(windowRect, tooltipRect, elementRect, padding, tooltip) {
		if (tooltipRect.width + padding > elementRect.left) {
			return false;
		}
		tooltip.style.left = (elementRect.left - padding - tooltipRect.width) + "px";
		var y = elementRect.top + elementRect.height/2 - tooltipRect.height/2;
		if (y < 0) {
			y = 0;
		} else if (y > windowRect.height - tooltipRect.height) {
			y = windowRect.height - tooltipRect.height;
		}
		tooltip.style.top = y + "px";
		return true;
	},
	right : function(windowRect, tooltipRect, elementRect, padding, tooltip) {
		if (elementRect.left + elementRect.width + tooltipRect.width + padding > windowRect.width) {
			return false;
		}
		tooltip.style.left = (elementRect.left + elementRect.width + padding) + "px";
		var y = elementRect.top + elementRect.height/2 - tooltipRect.height/2;
		if (y < 0) {
			y = 0;
		} else if (y > windowRect.height - tooltipRect.height) {
			y = windowRect.height - tooltipRect.height;
		}
		tooltip.style.top = y + "px";
		return true;
	},
}

// Internal Function
function CreateTooltip(data) {
	console.log("Create Tooltip", data);
	var tooltip = data.tooltipElement;
	tooltip.style.top = "0px";
	tooltip.style.left = "0px";
	var element = data.element;
	document.body.appendChild(tooltip);
	
	var windowRect = window.document.body.getBoundingClientRect();
	var tooltipRect = tooltip.getBoundingClientRect();
	var elementRect = element.getBoundingClientRect();
	console.log(windowRect, tooltipRect, elementRect);
	for (var i=0; i < data.settings.orientations.length; i++) {
		var orientation = data.settings.orientations[i];
		if (orientationFunctions[orientation](windowRect, tooltipRect, elementRect, data.settings.padding, tooltip)) {
			console.log("Proper orientation found!", orientation);
			return;
		}
	}
	console.log("No proper placement found!");
	data.settings.onNoSpace(data);
}

function DestroyTooltip(data) {
	console.log("Destroy Tooltip", data);
	data.tooltipElement.remove();
}

function AddTooltip(element, content, settings) {
	var final_settings = utility.completeCopy(defaultSettings);
	settings = settings || {};
	for (var key in settings) {
		final_settings[key] = settings[key];
	}
	
	var tooltip = document.createElement("DIV");
	tooltip.style = "position: absolute;" + final_settings.css;
	tooltip.innerHTML = content;
	
	var data = {element: element, content: content, settings: final_settings, tooltipElement : tooltip};
	var $ele = $(element);
	$ele.mouseenter(function (e) {
		CreateTooltip(data);
	});
	$ele.mouseleave(function (e) {
		DestroyTooltip(data);
	});
	$(tooltip).mouseenter(function (e) {
		DestroyTooltip(data);
	})
}

export {AddTooltip};