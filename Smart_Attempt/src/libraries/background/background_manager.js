
// This is for testing only for now.
// import {} from "/src/libraries/background/custom_backgrounds.js";

import {PrettyCards_plugin, settings, addSetting} from "/src/libraries/underscript_checker.js";

var background_sizes = ["Auto", "Cover", "Contain"];
var background_positions_x = ["Left", "Center", "Right"];
var background_positions_y = ["Top", "Center", "Bottom"];

function SetBackgroundProperties() {
	// Dirty, but the most secure.
	document.documentElement.style.height = '100%';
	document.body.style.minHeight = '100%';
	
	// The real magic.
	document.body.style.backgroundSize = settings.background_size.value().toLowerCase();
	document.body.style.backgroundPositionX = settings.background_position_x.value().toLowerCase();
	document.body.style.backgroundPositionY = settings.background_position_y.value().toLowerCase();
}

addSetting({
	'key': 'background_size',
	'name': 'Background Size', // Name in settings page
	'note': 'Change the size of the background based on your preferred logic.',
	'type': 'select',
	'refresh': false, // true to add note "Will require you to refresh the page"
	'disabled': false,
	'options': background_sizes,
	'default': () => background_sizes[1], // default value
	'onChange': SetBackgroundProperties
});

addSetting({
	'key': 'background_position_x',
	'name': 'Background Position X', // Name in settings page
	'note': 'Change the horizontal position of the background.',
	'type': 'select',
	'refresh': false, // true to add note "Will require you to refresh the page"
	'disabled': false,
	'options': background_positions_x,
	'default': () => background_positions_x[1], // default value
	'onChange': SetBackgroundProperties
});

addSetting({
	'key': 'background_position_y',
	'name': 'Background Position Y', // Name in settings page
	'note': 'Change the vertical position of the background.',
	'type': 'select',
	'refresh': false, // true to add note "Will require you to refresh the page"
	'disabled': false,
	'options': background_positions_y,
	'default': () => background_positions_y[1], // default value
	'onChange': SetBackgroundProperties
});

SetBackgroundProperties();

PrettyCards_plugin.events.on("connect", SetBackgroundProperties);