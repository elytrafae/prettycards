
var numberOfSongsCardsHave = { //How many Jingles does a Card have in my Git Folder?
	Chara : 3,
	Asgore : 3,
	Sans : 5,
	"The Heroine" : 5,
	Susie : 2
};

var israndom = true; //Sould the Jingle be selected randomly or based on how many times was the card played?
var nums = {}; //This counts how many times a given Card's Jingle has been played!

function ProcessJingle(card) {
	var name = card.card_data.name;
	console.log("Card Name", name);
	/*if (typeof(nums[name]) != "number") {
		for (let key in numberOfSongsCardsHave) {
			if (key == name) {
				nums[name] = (nums[name] || 0) + 1;
				break;
			}
		}
		if (typeof(nums[name]) != "number") {console.log("ProcessJingle returned!");return;}
	} else {
		nums[name]++;
	}*/
	if ((numberOfSongsCardsHave[name]) && numberOfSongsCardsHave[name] > 0) {
		nums[name] = (nums[name] || 0) + 1;
	} else {
		console.log("ProcessJingle returned!");
		return false;
	}
	console.log(name, nums[name]);
	var song_nr = (israndom ? getRandomInt(1, numberOfSongsCardsHave[name]) : ((nums[name]-1) % numberOfSongsCardsHave[name])+1)
	card.card_Jingle = PlaySFX("https://raw.githubusercontent.com/CMD-God/prettycards/master/audio/cards/" + name + "/intro_" + song_nr + ".ogg");
	return true;
}

function PlaySFX(url) {
	var e = document.createElement("audio");
	e.src = url;
	e.onended = e.onerror = function(e) {e.target.remove();};
	document.head.appendChild(e);
	e.autoplay = true;
	return e;
}