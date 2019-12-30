
var numberOfSongsCardsHave = { //Howe many Jingles does a Card have in my Git Folder?
	Chara : 3
};

var israndom = false; //Sould the Jingle be selected randomly or based on how many times was the card played?
var nums = {}; //This counts how many times a given Card's Jingle has been played!

function ProcessJingle(card) {
	var name = card.name;
	for (let key in numberOfSongsCardsHave) {
		if (key == name) {
			nums[name] = (nums[name] || 0) + 1;
			break;
		}
	}
	if (typeof(nums[name]) != "number") {return;}
	console.log(name, nums[name]);
	
}