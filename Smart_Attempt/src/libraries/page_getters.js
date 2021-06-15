
// Functions that get specific data from the page that SHOULD be stored as variables or smth.

class pagegetters {
	
	static get gold() {
		return Number(document.getElementById("golds").innerHTML);
	}
	
	static get ucp() {
		return Number(document.getElementById("ucp").innerHTML);
	}
	
	static GetNumberOfPacks(code_id) {
		return Number(document.getElementById("nb" + code_id + "s").innerHTML);
	}
}

console.log("Page Getters Loaded!", pagegetters);

export {pagegetters};