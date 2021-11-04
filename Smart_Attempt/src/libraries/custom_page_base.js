
var custom_pages = ["CustomCardSkins"];

function IsOnCustomPage() {
	for (var i = 0; i < custom_pages.length; i++) {
		if (window.underscript.onPage("CustomCardSkins")) {
			return true;
		}
	}
	return false;
}

if (IsOnCustomPage()) {
	
}