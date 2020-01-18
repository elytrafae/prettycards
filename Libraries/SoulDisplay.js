
var soulCards;

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

PrettyCards_plugin.events.on('CardsLoad', function() {
	soulCards = {};
	for (var i=0; i < allCards.length; i++) {
		var card = allCards[i];
		if (card.soul) {
			if (typeof(soulCards[card.soul.name]) === "undefined" || !soulCards[card.soul.name]) {
				soulCards[card.soul.name] = [];
			}
			soulCards[card.soul.name].push(card);
		}
	}
});

GM_addStyle(".PrettyCards_SoulImage {width: 5em;}")

GM_addStyle(".PrettyCards_SoulHover {background-color: black; border: white solid 4px; width: 20em; text-align: justify;}");
GM_addStyle(".PrettyCards_SoulHover_Desc {color: white; padding: 0.3em;}");
GM_addStyle(".PrettyCards_SoulHover_Name {text-align: center; font-size: 2em;}");
GM_addStyle(".PrettyCards_SoulHover_Soul {position: absolute; transform: translate(-50%, -50%); top: 0em; left: 0em;}");
GM_addStyle(".PrettyCards_SoulHover_ClickMe {color:white}");
function AddSoulHover(ele, soul, side, moreText) {
	var soul_data = GetSoulData(soul);
	var html =	'<div class="PrettyCards_SoulHover">'+
					'<img class="PrettyCards_SoulHover_Soul PrettyCards_SoulImage" src="https://raw.githubusercontent.com/CMD-God/prettycards/master/img/Souls/' + soul + '.png">'+
					'<p class="PrettyCards_SoulHover_Name '+ soul +'" data-i18n="[html]'+ soul_data.soulStringKey +'">' + soul_data.name + '</p>'+
					'<p class="PrettyCards_SoulHover_Desc" data-i18n="[html]'+ soul_data.soulDescStringKey +'">'+ soul_data.desc + '</p>'+
					'<p class="PrettyCards_SoulHover_ClickMe">' + (moreText || '(Click for more info)') + '</p>'+
				'</div>';
	AddTooltip(ele, html, side || 4);
}

GM_addStyle(".PrettyCards_PopUpCardContainer {margin: auto;}");
GM_addStyle(".PrettyCards_PopUpCardContainer .card {margin: 2px; display: inline-table;}");

function _SoulClickFunc(e) {
    var ele = e.target;
    //console.log(ele.getAttribute("data-soul"));
    var data = GetSoulData(ele.getAttribute("data-soul") || ele.getAttribute("class"));
    var card_cont = $(document.createElement("div"));
    card_cont.addClass("PrettyCards_PopUpCardContainer");
    var list = soulCards[data.id];
    //console.log(list);
    if (list) {
        for (var i=0; i < list.length; i++) {
            window.appendCard(card_cont, list[i]);
        }
    }
    //console.log(card_cont);
    var text$ = $('<div><img class="PrettyCards_SoulHover_Soul PrettyCards_SoulImage" src="https://raw.githubusercontent.com/CMD-God/prettycards/master/img/Souls/' + data.id + '.png"/>'+
                  '<p class="PrettyCards_SoulHover_Name '+ data.id +'" data-i18n="[html]'+ data.soulStringKey +'">' + data.name + '</p>'+
                  '<p class="PrettyCards_SoulHover_Desc" data-i18n="[html]'+ data.soulDescStringKey +'">'+ data.desc + '</p>' +
                  (list ? '<p>'+ data.name +'\'s Spells:</p>' : '')+'</div>');
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
}

function AddSoulClick(ele) {
    ele.addEventListener("click", _SoulClickFunc);
}

/*
var soul_observer = new MutationObserver(function(mutation_rec) {
    console.log(mutation_rec);
    for (var i=0; i < mutation_rec.length; i++) {
        var mutations = mutation_rec[i];
        for (var k=0; k < mutations.addedNodes.length; k++) {
            var ele = mutations.addedNodes[k];
            if ((ele.getAttribute("data-soul") !== null)) {
                ele.removeEventListener("click", _SoulClickFunc);
                var e = ele.querySelector(".tooltiptext");
                if (e !== null) {e.remove()};
                AddSoulHover(ele, ele.getAttribute("data-soul") || ele.getAttribute("class"));
                AddSoulClick(ele);
            }
        }
    }
    //var list = document.querySelectorAll("[data]");
    //console.log(list);
});
soul_observer.observe(document.body, {childList: true, attributes: true});*/

function _OnSelectSoul(e) {
    var img = e.target || e.targetElement;
    var select = img.parentElement.parentElement.PrettyCards_OriginalSoulSelect;
    console.log(select);
    var soulid = img.getAttribute("PrettyCards_SoulSelected");
    select.value = soulid;

    var heart = img.parentElement.parentElement.heart;
    heart.src = 'https://raw.githubusercontent.com/CMD-God/prettycards/master/img/Souls/' + soulid + '.png';
    heart.parentElement.querySelector(".tooltiptext").remove();
	AddSoulHover(heart.parentElement, soulid, 4, "(Click to change!)");

    if ("createEvent" in document) {
        var evt = document.createEvent("HTMLEvents");
        evt.initEvent("change", false, true);
        select.dispatchEvent(evt);
    } else {
        select.fireEvent("onchange");
    }
    if (SoulSelectDialog !== null) {
        SoulSelectDialog.close();
        SoulSelectDialog = null;
    }
}

var SoulSelectDialog;
GM_addStyle(".PrettyCards_SoulDiv {margin: 0.2em; display: inline-block;}");
function _SoulSelectClick(e) {
    if (soulCards) {
        var cont = document.createElement("div");
        cont.style = "text-align: justify;"
        cont.heart = e.target;
        cont.PrettyCards_OriginalSoulSelect = e.target.PrettyCards_OriginalSoulSelect;
        for (var i=0; i < cont.PrettyCards_OriginalSoulSelect.children.length; i++) {
            //txt += '<img src="https://raw.githubusercontent.com/CMD-God/prettycards/master/img/Souls/' + key + '.png" class="PrettyCards_SoulImage">';
			var sel = cont.PrettyCards_OriginalSoulSelect.children[i];
			var key = sel.value;
            var div = document.createElement("div");
            div.className = "PrettyCards_SoulDiv";
            var img = document.createElement("img");
            img.className = "PrettyCards_SoulImage";
            img.src = 'https://raw.githubusercontent.com/CMD-God/prettycards/master/img/Souls/' + key + '.png';
            img.setAttribute("PrettyCards_SoulSelected", key);
            img.onclick = _OnSelectSoul;
            AddSoulHover(div, key, 3, "(Click to select!)");
            div.appendChild(img);
            cont.appendChild(div);
        }
        console.log(cont);
        SoulSelectDialog = BootstrapDialog.show({
            title: "Choose your soul!",
            message: $(cont),
            buttons: [{
                label: $.i18n('dialog-cancel'),
                cssClass: 'btn-primary',
                action: function (dialog) {
                    dialog.close();
                }
            }]
        });
    }
}

function CustomizeSoulSelectObj(select, startSoul, side) {
    var div = document.createElement("div");
    div.style = "text-align: center;";
    var img = document.createElement("IMG");
    img.src = 'https://raw.githubusercontent.com/CMD-God/prettycards/master/img/Souls/' + (startSoul || select.value) + '.png';
    img.onclick = _SoulSelectClick;
    img.PrettyCards_OriginalSoulSelect = select;
    AddSoulHover(div, (startSoul || select.value), side || 4, "(Click to change!)");
    div.appendChild(img);
    select.parentNode.insertBefore(div, select.nextSibling);
    select.style.display = "none";
	return div
}

/*
if (lastOpenedDialog !== null) {
                        lastOpenedDialog.close();
                    }
*/
