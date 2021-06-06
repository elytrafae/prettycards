
class utility {
	static loadCSSFromLink(url) {
		var e = document.createElement("link");
		e.rel  = 'stylesheet';
		e.type = 'text/css';
		e.href = url;
		document.head.appendChild(e);
	}
}

export {utility};