
class Utility {
	loadCSSFromLink(url) {
		var e = document.createElement("link");
		e.rel  = 'stylesheet';
		e.type = 'text/css';
		e.href = url;
		document.head.appendChild(e);
	}
	
	// Some code I found on stack overflow. Let's see if it works . . . 
	copyCSS(from_element, to_element) {
		const styles = window.getComputedStyle(from_element);
		if (styles.cssText !== "") {
			to_element.style.cssText = styles.cssText;
		} else {
			const to_styles = window.getComputedStyle(to_element);
			const cssText = Object.values(styles).reduce(
				(css, propertyName) =>
					`${css}${propertyName}:${styles.getPropertyValue(
						propertyName
					)};`
			);
			to_element.style.cssText = cssText
		}
	}
}

var utility = new Utility();

export {utility};