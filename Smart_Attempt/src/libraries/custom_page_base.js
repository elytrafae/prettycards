
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
	console.log("CUSTOM PAGE!");
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function() { 
		console.log(xmlHttp.readyState, xmlHttp.status, xmlHttp.responseText, xmlHttp);
		if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
			document.querySelector("html").innerHTML = xmlHttp.responseText;
		}
	}
	xmlHttp.open("GET", "https://raw.githubusercontent.com/CMD-God/prettycards/master/html_templates/undercards.html", true); // true for asynchronous 
	xmlHttp.send(null);
}