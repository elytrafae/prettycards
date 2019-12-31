
var soulCards = {};

function GetSoulData(soul_name) {
	console.log("GetSoulData: soul_name: ", soul_name);
	var soulStringKey = 'soul-' + soul_name.replace('_', '-').toLowerCase();
    var soulDescStringKey = soulStringKey + '-desc';
    var name = $.i18n(soulStringKey);
	var desc = $.i18n(soulDescStringKey);

	console.log(name, desc);

	return {name: name, desc: desc, id: soul_name, soulStringKey : soulStringKey, soulDescStringKey : soulDescStringKey }
}

window.soulInfo = function(soul_name) {
	GetSoulData(soul_name);
}

function GetSoulCards() {
	soulCards = {};
	if (allCards) {
		if (allCards.length > 0) {
			for (var i=0; i < allCards.length; i++) {
				var card = allCards[i];
				if (card.soul) {
					if (!soulCards[card.soul.name]) {
						soulCards[card.soul.name] = [];
					}
					soulCards[card.soul.name].push(card);
				}
			}
			//console.log("soulCards: ", soulCards);
		} else {
			console.log("Cards Not Fetched yet. Retry in 1 second.");
			setTimeout(GetSoulCards, 1000);
		}
	} else {
		console.log("This page does not handle cards!");
	}
}

GetSoulCards();

GM_addStyle(".PrettyCards_SoulHover {background-color: black; border: white solid 4px; width: 20em;}");
GM_addStyle(".PrettyCards_SoulHover_Desc {color: white; padding: 0.3em;}");
GM_addStyle(".PrettyCards_SoulHover_Name {text-align: center; font-size: 2em;}");
GM_addStyle(".PrettyCards_SoulHover_Soul {width: 5em; position: absolute; transform: translate(-50%, -50%); top: 0em; left: 0em;}");
GM_addStyle(".PrettyCards_SoulHover_ClickMe {color:white}");
function AddSoulHover(ele, soul, side) {
	var soul_data = GetSoulData(soul);
	var html =	'<div class="PrettyCards_SoulHover">'+
					'<img class="PrettyCards_SoulHover_Soul" src="https://raw.githubusercontent.com/CMD-God/prettycards/master/img/Souls/' + soul + '.png">'+
					'<p class="PrettyCards_SoulHover_Name '+ soul +'" data-i18n="[html]'+ soul_data.soulStringKey +'">' + soul_data.name + '</p>'+
					'<p class="PrettyCards_SoulHover_Desc" data-i18n="[html]'+ soul_data.soulDescStringKey +'">'+ soul_data.desc + '</p>'+
					'<p class="PrettyCards_SoulHover_ClickMe">(Click for more info)</p>'+
				'</div>';
	AddTooltip(ele, html, side || 4);
}

GM_addStyle(".PrettyCards_PopUpCardContainer {margin: auto;}");
GM_addStyle(".PrettyCards_PopUpCardContainer table {margin: 2px; display: inline-table;}");
function AddSoulClick(ele) {
    ele.addEventListener("click", function(e) {
        var ele = e.target;
        //console.log(ele.getAttribute("data-soul"));
        var data = GetSoulData(ele.getAttribute("data-soul") || ele.getAttribute("class"));
        var card_cont = $(document.createElement("div"));
        card_cont.addClass("PrettyCards_PopUpCardContainer");
        var list = soulCards[data.id];
        //console.log(list);
        for (var i=0; i < list.length; i++) {
            window.appendCard(card_cont, list[i]);
        }
        //console.log(card_cont);
        var text$ = $('<div><img class="PrettyCards_SoulHover_Soul" src="https://raw.githubusercontent.com/CMD-God/prettycards/master/img/Souls/' + data.id + '.png"/>'+
					'<p class="PrettyCards_SoulHover_Name '+ data.id +'" data-i18n="[html]'+ data.soulStringKey +'">' + data.name + '</p>'+
					'<p class="PrettyCards_SoulHover_Desc" data-i18n="[html]'+ data.soulDescStringKey +'">'+ data.desc + '</p>' +
                    '<p>'+ data.name +'\'s Spells:</p></div>');
        text$.append(card_cont);
        //console.log(text$);
        BootstrapDialog.show({
            title: data.name,
            message: text$,
            buttons: [{
                label: $.i18n('dialog-ok'),
                cssClass: 'btn-primary',
                action: function (dialog) {
                    dialog.close();
                }
            }]
        });
    });
}

function SoulPopUp(id, name, desc) {

}

