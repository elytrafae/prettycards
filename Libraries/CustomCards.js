
var bonusExtensions = ["DDLC"];

GM_addStyle(".cardImage {background-size:cover!important}");

for (var i=0; i < bonusExtensions.length; i++) {
  var ext = bonusExtensions[i];
  GM_addStyle(".monster.ext_"+ ext +" .cardFrame {url('https://raw.githubusercontent.com/CMD-God/prettycards/master/img/CardFrames/" + ext + "/frame_monster.png')}");
  GM_addStyle(".spell.ext_"+ ext +" .cardFrame {url('https://raw.githubusercontent.com/CMD-God/prettycards/master/img/CardFrames/" + ext + "/frame_spell.png')}");
}

GM_addStyle(".cardBackground.ext_DDLC {url('https://raw.githubusercontent.com/CMD-God/prettycards/master/img/CardFrames/DDLC/frame_background.png')}");

function AppendCustomCard(container, card) {
    var html$ = window.appendCard(container, card);
    html$.addClass("ext_" + card.extension);
    html$.find(".cardImage").css('background', "#000 url('https://raw.githubusercontent.com/CMD-God/prettycards/master/img/Cards/" + card.extension + "/" + card.image + '.' + card.imageExtension + "') no-repeat");
    html$.find('.cardRarity').css('background', 'transparent url(\'https://raw.githubusercontent.com/CMD-God/prettycards/master/img/RarityIcons/' + card.extension + '_' + card.rarity + '.png\') no-repeat');
}


var _CustomCards = [
	{
        attack : 1,
        hp : 1,
        maxHp : 1,
        originalAttack : 1,
        originalHp : 1,
        dodge : 0,
        thorns : 0,
        armor : 0,
        paralyzed : 0,
        silence : false,
        kr : 0,
        cantAttack : false,
        charge : false,
        taunt : false,
        ranged : false,
        invulnerable : false,
        haste : false,
        transparency : false,
        anotherChance : false,
        candy : false,
        id : 2000,
        fixedId : 2000,
        typeCard : 0,
        name : "Chibi Sayori",
        image : "Chibi_Sayori",
        cost : 3,
        rarity : "COMMON",
        originalCost : 3,
        shiny : false,
        quantity : 1,
        extension : "DDLC",
        tribes : ["CHIBI"],
        selectCards : [],
        ownerId : 0,
        imageExtension : "png"
    }
];


underscript.eventManager.on('CardsLoad', function() {
	console.log("It worked!");
	for (var i=0; i < _CustomCards.length; i++) {
		window.allCards.push(_CustomCards[i]);
	}
});
console.log("CardsLoad event added!", underscript.eventManager);
