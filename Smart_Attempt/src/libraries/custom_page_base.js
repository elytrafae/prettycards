
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
	/*
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
	*/
	
	document.querySelector("html").innerHTML = `<head><meta name="generator" content="HTML Tidy for HTML5 (experimental) for Windows https://github.com/w3c/tidy-html5/tree/c63cc39" /><meta http-equiv="Content-Type" content="text/html; charset=UTF-8" /><meta name="viewport" content="width=980" /><title>Undercards - Decks</title><script async="" src="https://www.google-analytics.com/analytics.js" /><script src="/cdn-cgi/apps/head/_3BaSiQPYcNq6WZWfoK8A-gcc90.js" /><style data-tippy-stylesheet="">.tippy-tooltip[data-animation=fade][data-state=hidden]{opacity:0}.tippy-iOS{cursor:pointer!important;-webkit-tap-highlight-color:transparent}.tippy-popper{pointer-events:none;max-width:calc(100vw - 10px);transition-timing-function:cubic-bezier(.165,.84,.44,1);transition-property:transform}.tippy-tooltip{position:relative;color:#fff;border-radius:4px;font-size:14px;line-height:1.4;background-color:#333;transition-property:visibility,opacity,transform;outline:0}.tippy-tooltip[data-placement^=top]&amp;gt;.tippy-arrow{border-width:8px 8px 0;border-top-color:#333;margin:0 3px;transform-origin:50% 0;bottom:-7px}.tippy-tooltip[data-placement^=bottom]&amp;gt;.tippy-arrow{border-width:0 8px 8px;border-bottom-color:#333;margin:0 3px;transform-origin:50% 7px;top:-7px}.tippy-tooltip[data-placement^=left]&amp;gt;.tippy-arrow{border-width:8px 0 8px 8px;border-left-color:#333;margin:3px 0;transform-origin:0 50%;right:-7px}.tippy-tooltip[data-placement^=right]&amp;gt;.tippy-arrow{border-width:8px 8px 8px 0;border-right-color:#333;margin:3px 0;transform-origin:7px 50%;left:-7px}.tippy-tooltip[data-interactive][data-state=visible]{pointer-events:auto}.tippy-tooltip[data-inertia][data-state=visible]{transition-timing-function:cubic-bezier(.54,1.5,.38,1.11)}.tippy-arrow{position:absolute;border-color:transparent;border-style:solid}.tippy-content{padding:5px 9px}</style><link rel="icon" href="images/favicon.ico" /><link href="css/bootstrap.min.css" rel="stylesheet" type="text/css" /><link href="css/bootstrap-dialog.min.css" rel="stylesheet" type="text/css" /><link href="css/style.css?v=064002" rel="stylesheet" type="text/css" /><!-- <link href="css/decks.css?v=064002" rel="stylesheet" type="text/css" /> --><link href="css/cards.css?v=064002" rel="stylesheet" type="text/css" /><link href="css/frames.css?v=064002" rel="stylesheet" type="text/css" /><link href="css/newChat.css?v=064002" rel="stylesheet" type="text/css" /></head><body><header><img id="logo" src="/images/undercardsLogoChapter2.png" alt="" /></header><div class="mainContent"></div><script src="js/jquery.min.js" type="text/javascript" /> <script>var translateVersion = &amp;#39;0424&amp;#39;;</script> <script src="js/mobile.js?v=064002" type="text/javascript" /> <script src="js/popper.min.js?v=064002" type="text/javascript" /> <script src="js/tippy-bundle.iife.min.js?v=064002" type="text/javascript" /> <script src="js/jquery-i18n.min.js?v=064002" type="text/javascript" /> <script src="js/translation.js?v=064002" type="text/javascript" /> <script src="js/jquery-ui.min.js" type="text/javascript" /> <script src="js/jquery.ui.touch-punch.min.js" type="text/javascript" /> <script src="js/bootstrap.min.js" type="text/javascript" /> <script src="js/bootstrap-dialog.min.js" type="text/javascript" /> <script src="js/helper.js?v=064002" type="text/javascript" /> <script src="js/chat.js?v=064002" type="text/javascript" /> <script src="js/html2canvas.min.js" type="text/javascript" /> <script src="js/card.js?v=064002" type="text/javascript" /> </body>`;
}