
// Functions that get specific data from the page that SHOULD be stored as variables or smth.

class pagegetters {
	
	static get gold() {
		return Number(document.getElementById("golds").innerHTML);
	}
	
	static get ucp() {
		return Number(document.getElementById("ucp").innerHTML);
	}
}

console.log("Page Getters Loaded!", pagegetters);