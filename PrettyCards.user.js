// ==UserScript==
// @name         PrettyCards
// @namespace    http://tampermonkey.net/
// @version      1.0-pre
// @description  Make Undercards look fabulous!
// @author       CMD_God
// @match        https://*.undercards.net/*
// @exclude      https://*.undercards.net/*/*
// @grant        none
// @require      https://raw.githubusercontent.com/CMD-God/prettycards/master/Utility.js
// @require      https://raw.githubusercontent.com/CMD-God/prettycards/master/TextLibrary.js
// ==/UserScript==

//https://media.discordapp.net/attachments/147063257436258305/637627137276510208/y47orgr08su31.png <------ FACTS!

function openPageSpecific() {
	var length = location.pathname.length, temp;
	if ((temp = location.pathname.indexOf(".")) === -1 && (temp = location.pathname.indexOf("/")) === -1) {
		temp = null;
	}
	loadScript("https://raw.githubusercontent.com/CMD-God/prettycards/master/PageSpecific/" + location.pathname.substring(1, temp || length) + ".js");
}

openPageSpecific();


onPage("Play", function() {
    console.log("PrettyCards: Playing");
    var mainCont = document.getElementsByClassName("mainContent")[0];
    //console.log(mainCont);

    var gameModesMenu = document.getElementById("phase1");

    var origGMCont = document.getElementById("gameModes");

    var newCont = document.createElement("DIV");

    // Images + text are 0-2, 3-5 is the functional things!
    var origGameModes = document.querySelectorAll("#gameModes td");
    //console.log(origGameModes);

    var gameModeBTNs = document.querySelectorAll("#gameModes .btn");
    //console.log(gameModeBTNs);


    // New Casual Mode Thingy
    var casualArts = document.getElementsByClassName("standardClasseArtifacts");
    //console.log(casualArts);

    var casual = document.createElement("table");
    casual.style = "width: 100%; height: 10em; background-color:black; border: 2px solid white; margin-bottom: 1em;";

    var cr = document.createElement("tr");
    casual.appendChild(cr);

    var c1 = document.createElement("td");
    c1.style = "width: 34%; height: 100%; display: inline-block; text-align: center; background-image: url(../images/deltaruneEvent.png);";
    c1.innerHTML = '<h2 data-i18n="[html]game-type-standard">STANDARD</h2>';
    cr.appendChild(c1);

    var c2 = document.createElement("td");
    c2.style = "width: 33%; height: 100%; padding: 1em 2.2em; text-align: center; display: inline-block;";
    cr.appendChild(c2);

    var c3 = document.createElement("td");
    c3.style = "width: 33%; height: 100%; padding: 1em; text-align: center; display: inline-block;";
    cr.appendChild(c3);

    c2.appendChild(document.getElementById("standardDecks"));
    for (var i=(casualArts.length-1); i >= 0; i--) {
        var art = casualArts[i];
        var art_childs = Array.from(art.children);
        art.innerHTML = "";
        //console.log(art_childs);
        for (var k=0; k < art_childs.length; k++) {
            art.appendChild(art_childs[k]);
            var s = document.createElement("span");
            s.style.color = (art_childs[k].getAttribute("legendary") === "true" ? "yellow" : "white");
            s.style["margin-left"] = "0.5em";
            s.innerHTML = art_childs[k].name;
            art.appendChild(s);
            art.appendChild(document.createElement("br"));
        }
        art.style["margin-top"] = "1em";
        c2.appendChild(art);
    }
    gameModeBTNs[0].style["margin-top"] = "2.8em";
    gameModeBTNs[0].style.height = "2.8em";
    c3.appendChild(gameModeBTNs[0]);

    newCont.appendChild(casual);

    // New Ranked Mode Thingy
    var rankedArts = document.getElementsByClassName("rankedClasseArtifacts");

    var ranked = document.createElement("table");
    ranked.style = "width: 100%; height: 10em; background-color:black; border: 2px solid white; margin-bottom: 1em;";

    var rr = document.createElement("tr");
    ranked.appendChild(rr);

    var r3 = document.createElement("td");
    r3.style = "width: 33%; height: 100%; display: inline-block; text-align: center; padding: 1emtext-align: center;";
    r3.appendChild(document.querySelectorAll("#rankedMode h3")[0]);
    rr.appendChild(r3);

    var r2 = document.createElement("td");
    r2.style = "width: 33%; height: 100%; padding: 1em 2.2em; text-align: center; display: inline-block;";
    rr.appendChild(r2);

    var r1 = document.createElement("td");
    r1.style = "width: 34%; height: 100%; padding: 1em; text-align: center; display: inline-block;  background-image: url(../images/ranked.png);";
    r1.innerHTML = '<h2 data-i18n="[html]game-type-ranked">RANKED</h2><br><a href="rewards.jsp" data-i18n="[html]play-rewards">End of season rewards</a>';
    rr.appendChild(r1);

    r2.appendChild(document.getElementById("rankedDecks"));
    for (var i=(rankedArts.length-1); i >= 0; i--) {
        var art = rankedArts[i];
        var art_childs = Array.from(art.children);
        art.innerHTML = "";
        //console.log(art_childs);
        for (var k=0; k < art_childs.length; k++) {
            art.appendChild(art_childs[k]);
            var s = document.createElement("span");
            s.style.color = (art_childs[k].getAttribute("legendary") === "true" ? "yellow" : "white");
            s.style["margin-left"] = "0.5em";
            s.innerHTML = art_childs[k].name;
            art.appendChild(s);
            art.appendChild(document.createElement("br"));
        }
        art.style["margin-top"] = "1em";
        r2.appendChild(art);
    }
    gameModeBTNs[1].style["margin-top"] = "1em";
    gameModeBTNs[1].style.height = "2.8em";
    r3.appendChild(gameModeBTNs[1]);
    newCont.appendChild(ranked);

    // New Custom Mode Thingy
    var custom = document.createElement("table");
    custom.style = "width: 100%; height: 10em; background-color:black; border: 2px solid white; margin-bottom: 1em;";

    var cur = document.createElement("tr");
    custom.appendChild(cur);

    var cu1 = document.createElement("td");
    cu1.style = "width: 34%; height: 100%; display: inline-block; text-align: center; background-image: url(../images/custom.png);";
    cu1.innerHTML = '<h2 data-i18n="[html]game-type-custom">CUSTOM</h2>';
    cur.appendChild(cu1);

    var cu2 = document.createElement("td");
    cu2.style = "width: 66%; height: 100%; padding: 1em 2.2em; text-align: center; display: inline-block;";
    cur.appendChild(cu2);

    gameModeBTNs[2].style["margin-top"] = "2.8em";
    gameModeBTNs[2].style.height = "2.8em";
    cu2.appendChild(gameModeBTNs[2]);
    newCont.appendChild(custom);

    // Delete and Place
    gameModesMenu.innerHTML = '';
    gameModesMenu.appendChild(newCont);
});

// How to open ALL packs (and make fancy animations)
var count = 0;
window.openPacks = function(type, _count) {
    var pack_cout = Number(document.getElementById("nb" + type + "Packs").innerHTML)
    if (_count === true) {
        count = pack_cout;
    } else {
        count = _count;
    }
    const rarity = [ 'DETERMINATION', 'LEGENDARY', 'EPIC', 'RARE', 'COMMON' ];
    const results = {};
    function clearResults() {
        results.pack_type = type;
        results.packs = count;
        results.normal_cards = 0;
        results.shiny_cards = 0;
        rarity.forEach((key) => results[key] = {});
    }
    clearResults();
    //console.log(type + " Pack Count: ", count);
    window.$(document).ajaxComplete((event, xhr, settings) => {
      //console.log("Event Fired!", event, xhr, settings);
      //if (settings.url !== 'PacksConfig' || !settings.data) return;
      const data = JSON.parse(settings.data);
      if (data.status || xhr.responseJSON.action !== 'getCards') {return};
          //results.packs += 1;
          JSON.parse(xhr.responseJSON.cards).forEach((card) => {
              //console.log(card);
              const result = results[card.rarity] = results[card.rarity] || {};
              const c = result[card.name] = result[card.name] || { normal:0, shiny:0, card_data: card }
              if (card.shiny) {
                  results.shiny_cards++;
                  c.shiny++;
              } else {
                  results.normal_cards++;
                  c.normal++;
              };
          });
        count--;
        //console.log(count);
        if (count === 0) {
            // Do stuff when all packs are opened
            console.log("The cards: ", results);

            results.list = [];
            for (var i=rarity.length-1; i >= 0;i--) {
                var rar = results[rarity[i]];
                for (var key in rar) {
                    //console.log(key , " || ", rar, rar[key]);
                    rar[key].name = key;
                    results.list.push(rar[key]);
                }
            }
            //console.log(results);
            //console.log(JSON.stringify(results));
            showCards(results);
        }
    });
    for (var i=0; i < count; i++) {
        window.openPack("open" + type + "Pack");
        window.canOpen = true;
    }
    document.getElementById("nb" + type + "Packs").innerHTML = pack_cout - count;
}

function add_Packs_CSS() {
    GM_addStyle("#packsCont {width: 100%; table-layout: fixed; position: relative;}");
    GM_addStyle("#packsCont td {width: 50%; height: 10em;}");
    GM_addStyle("#packsCont td table {width: 100%; height: 100%; text-align: center; border: 2px solid white;}");
    GM_addStyle("#packsCont .pack_image {height: 100%;}");
    GM_addStyle("#packsCont .btn {height: 2.8em;}");
    GM_addStyle("#packsCont .button_row {height: 3.5em;}");
    GM_addStyle("#packsCont .button_row td {height: 3.5em;}");
    GM_addStyle("#openCardsCont {position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-color: black; display: none;z-index: 100;}");
    GM_addStyle("#openCardsCont #packCont {position: absolute; top: 50%; left: 50%; z-index: 10000; transform: translate(-50%, -50%);}");
    GM_addStyle("#openCardsCont #packCont p {font-size: 2.5em; text-align: center;}")
    GM_addStyle("#openCardsCont #packCont img {height: 230px;}");
    GM_addStyle("#openCardsCont .card_cont {position: absolute; transform: translate(-50%, -50%); top: 50%; left: 50%; display: none;}");
    GM_addStyle("#openCardsCont .card_img {}");
    GM_addStyle("#openCardsCont .card_cont .card {display: none; border: 0px;}");
    GM_addStyle("#openCardsCont .card_cont .card .cardName {font-size: 12px;}");
    GM_addStyle("#openCardsCont .pack_shard {position: absolute; top: 50%; left: 50%; background-repeat:no-repeat; width: 230px; height: 115px; background-size: 100% 200%;z-index: 10001; display: none; pointer-events: none;}");
    GM_addStyle("#cardsOpen {display: none;}");
    GM_addStyle("#openCardsCont .cardCover {position: absolute; top: 0; left: 0; background-repeat:no-repeat; width: 100%; height: 100%; pointer-events: none;}");
    GM_addStyle("#openCardsCont .cardCover.DTCover {animation-name: PrettyCards_DTGlow; animation-duration: 3s; animation-iteration-count: infinite; transition-timing-function: ease; opacity: 0.3; box-shadow: 0px 0px 20px 5px rgba(255, 0, 0, 0.4);}");
    //GM_addStyle("@keyframes PrettyCards_DTGlow {0% {background-color: black; box-shadow: 0px 0px 25px 5px rgba(255, 0, 0, 0.7);} 10% {background-color: red;} 20% {background-color: black;} 27% {background-color: #880000;} 30% {background-color: red;} 33% {background-color: black;} 36% {background-color: red;} 39% {background-color: black;} 50% {background-color: black; box-shadow: 0px 0px 30px 20px rgba(255, 0, 0, 0.9);} 60% {background-color: red;} 75% {background-color: black;} 80% {background-color: red;} 100% {box-shadow: 0px 0px 25px 5px rgba(255, 0, 0, 0.7);}}");
    GM_addStyle("@keyframes PrettyCards_DTGlow {0% {background-color: black; box-shadow: 0px 0px 25px 5px rgba(255, 0, 0, 0.7);} 50% {background-color: red; box-shadow: 0px 0px 30px 20px rgba(255, 0, 0, 0.9);} 100% {background-color: black; box-shadow: 0px 0px 25px 5px rgba(255, 0, 0, 0.7);}}");
    GM_addStyle("#openCardsCont .cardCover.LEGENDARYCover {animation-name: PrettyCards_LEGENDARYGlow; animation-duration: 2s; transition-timing-function: ease; animation-iteration-count: infinite; box-shadow: 0px 0px 20px 5px rgba(255, 255, 0, 0.4);}");
    GM_addStyle("#openCardsCont .cardCover.LEGENDARYCover div {animation-name: PrettyCards_LEGENDARYStar; transition-timing-function: ease; animation-duration: 2s; animation-iteration-count: infinite; position: absolute; transform: translate(-50%, -50%); width: 3em; height:3em; background-repeat: no-repeat; background-position:center; background-size: 100% 100%; background-image: url('data:image/png;base64,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');}");
    GM_addStyle("@keyframes PrettyCards_LEGENDARYGlow {0% {box-shadow: 0px 0px 20px 5px rgba(255, 255, 0, 0.7);} 50% {box-shadow: 0px 0px 25px 20px rgba(255, 255, 0, 0.9);} 100% {box-shadow: 0px 0px 20px 5px rgba(255, 255, 0, 0.7);}}");
    GM_addStyle("@keyframes PrettyCards_LEGENDARYStar {0% {width:0em; height:0em; opacity: 1;} 50% {width:4em; height:4em; opacity: 1;} 55% {width:4em; height:4em; opacity: 1;} 100% {width:5em; height:5em; opacity: 0;}}");
}

var element_list = [];
function showCards(results) {
    // This is the function which shows all the cards
    var img_name;
    // I know that I keep arguing about YanDev using ifs and switch cases for asset loading when he could use parsing . . .
    // But please believe me when I say that this is the cleanest method I could go about this.
    switch (results.pack_type) {
        case "" : img_name = "pack.png"; break;
        case "DR" : img_name = "drPack.png"; break;
        case "Shiny" : img_name = "shinyPack.gif"; break;
        case "Super" : img_name = "superPack.gif"; break;
        case "Final" : img_name = "finalPack.gif"; break;
    }
    pack.src = "images/icons/" + img_name;
    pack_count.innerHTML = "x " + results.packs;
    pack_cont.style.display = "block";
    bg.style = "display: block";

    document.body.style["overflow-x"] = "hidden";
    document.body.style["overflow-y"] = "hidden";

    element_list = [];
    for (var i=0; i < results.list.length;i++) {
        var card = results.list[i].card_data;
        var extension = card.extension;
        var rarity = card.rarity;
        var e = document.createElement("DIV");
        e.className = "card_cont";
        e.rarity = rarity;
        e.style["z-index"] = 101 + results.list.length - i;

        var img = document.createElement("IMG");
        img.src = "images/cardsBack/" + extension + "Card" + rarity + ".png";
        img.className = "card_img";
        e.appendChild(img);

        pack_shard1.style["background-image"] = "url('" + img.src + "')";
        pack_shard2.style["background-image"] = "url('" + img.src + "')";

        //e.innerHTML += window.createCard(card);
        var useless = document.createElement("div"); // Insert Unnecessary Aqua Is Useless Joke Here
        if (results.list[i].shiny > 0) {card.shiny = true;} else {card.shiny = false;}
        var thingy = window.appendCard(useless, card)[0];
        var tbody = thingy.firstElementChild;

        var row = document.createElement("tr");
        tbody.appendChild(row);

        var td = document.createElement("td");
        td.id = "quantity";
        td.innerHTML = (results.list[i].normal > 0 ? ('<span>' + results.list[i].normal + "x</span>") : "")
        td.innerHTML += (results.list[i].shiny > 0 ? (' <span class="rainbowText">' + results.list[i].shiny + 'x</span>') : "");
        td.setAttribute("colspan", "4");
        row.appendChild(td);

        e.appendChild(thingy);
        //console.log(thingy);
        //img.card_data = card;

        all_cards_cont.appendChild(e);
        element_list.push(e);
    }

    opening_state = 1;
    click = 0;
    opening_timer = 0;
    lastCard = -1;
}

function hideCards() {
    document.body.style["overflow-x"] = "auto";
    document.body.style["overflow-y"] = "auto";
    /*
    var es = document.getElementsByClassName("card_cont");
    for (var i=1; i<es.lenght;i++) {es[i].remove();};*/
    all_cards_cont.innerHTML = "";
    element_list = [];
    //console.log("Element List: ", element_list);
    click = 0;
    bg.style.display = "none";
    opening_state = 0;
    var pack_icons = document.getElementsByClassName("pack_image");
    for (var i=0; i < pack_icons.length; i++) {
        pack_icons[i].className = "pack_image";
    }
}

var opening_state = 0;
var click = 0;
var lastCard = -1;
var opening_timer = 0;

function cardOpenUpdate() {
    //console.log(click);
    var middle = window.innerWidth/2;
    if (opening_state === 1) {
        opening_timer++;
        pack_cont.style.transform = 'translate(-50%, -' + (50 + Math.sin(Math.radians(opening_timer))*8) + '%)';
        if (click > 0) {
            element_list.forEach((e) => {e.style.top = "50%"; e.style.display = "block";});
            click = 0;
            opening_state = 2;
            opening_timer = 0;
            pack_cont.style.transform = null;
            pack_shard1.style.display = "block";
            pack_shard2.style.display = "block";
            pack_cont.style.display = "none";
            pack_shard1.style.opacity = 1;
            pack_shard2.style.opacity = 1;
        }
    } else if (opening_state === 2) {
        //Insert Breaking Animation Here
        opening_timer++;
        pack_shard1.style.top = (50 - opening_timer*4) + "%";
        pack_shard2.style.top = (50 + opening_timer*4) + "%";
        pack_shard1.style.opacity = 1.3 - opening_timer/8;
        pack_shard2.style.opacity = 1.3 - opening_timer/8;
        if (opening_timer >= 30) {
            pack_shard1.style.top = null;
            pack_shard2.style.top = null;
            pack_shard1.style.opacity = 0;
            pack_shard2.style.opacity = 0;
            opening_timer = 0;
            opening_state = 3;
            click = 0;
        }
    } else if (opening_state === 3) {
        opening_timer++;
        var diff = (middle-200)/element_list.length;
        for (var i = 0; i < element_list.length; i++) {
            var e = element_list[i];
            e.style.left = String(Math.max(Math.min(middle - (middle-200)*opening_timer/20 + diff*2*i, middle), 200)) + "px";
            //console.log(e.style.left);
        }
        //element_list.forEach((e) => {e.style.left = String(middle - (middle-200)*opening_timer/20) + "px"; console.log(e.style.left);});
        if (opening_timer >= 50) {
            element_list.forEach((e) => {e.style.left = "200px";});
            opening_state = 4;
            opening_timer = 0
            click = 0;
        }
    } else if (opening_state === 4) {
        opening_timer++;
        if (click >= element_list.length) {hideCards(); return;}
        if (lastCard < click) {
            opening_timer = 0;
            lastCard = click;
            if (click < element_list.length-1) {
                var card = element_list[click+1];
                console.log(card.rarity);
                if (card.rarity === "DETERMINATION") {
                    console.log("DT Triggered");
                    var cover = document.createElement("div");
                    cover.className = "cardCover DTCover";
                    card.appendChild(cover);
                } else if (card.rarity === "LEGENDARY") {
                    console.log("Legendary Triggered");
                    var legy_cover = document.createElement("div");
                    legy_cover.className = "cardCover LEGENDARYCover";
                    var s_max = 4
                    for (var s=0; s < s_max; s++) {
                        legy_cover.innerHTML += '<div style="top:' + (10 + s/s_max*90) + '%; left:' + getRandomInt(15,85) + '%; animation-delay: ' + getRandomInt(0, 15)/10 + 's;"></div>';
                    }
                    card.appendChild(legy_cover);
                };
            };
        }
        if (click > 0) {
            //console.log("click: ", click);
            for (var k=0; k< click;k++) {
                var str = element_list[k].style.left;
                element_list[k].style.left = String( Number(str.slice(0, -2)) + middle/20) + "px";
            }
        }
        if (opening_timer <= 20) {
            var ele = element_list[click];
            if (opening_timer <= 10) {
                ele.style.transform = 'translate(-50%, -50%) scaleX(' + 1-opening_timer/10 + ')';
                ele.children[0].style.display = "block";
            } else {
                ele.style.transform = 'translate(-50%, -50%) scaleX(' + (opening_timer-10)/10 + ')';
                ele.children[0].style.display = "none";
                if (ele.children.length > 2) {
                    ele.children[2].style.display = "none";
                }
                ele.children[1].style.display = "block";
            }
            ele.style.left = String(200 - (200-middle)*opening_timer/20) + "px";
        }
    }
}
////////////////////////

var bg, pack_cont, pack, pack_count, pack_shard1, pack_shard2, all_cards_cont;

onPage("Packs", function() {
    add_Packs_CSS();

    /// For testing
    var test_button = document.createElement("button");
    test_button.innerHTML = "Test Opening Animation";
    test_button.onclick = function() {showCards(JSON.parse(this.test_JSON))};
    document.body.appendChild(test_button);
    var test_JSON = '{"pack_type":"","packs":1,"normal_cards":4,"shiny_cards":0,"list":[{"normal":10,"shiny":5,"card_data":{"attack":2,"hp":3,"maxHp":3,"originalAttack":2,"originalHp":3,"dodge":0,"thorns":0,"armor":0,"paralyzed":0,"silence":false,"kr":0,"cantAttack":false,"charge":false,"taunt":false,"ranged":false,"invulnerable":false,"haste":false,"transparency":false,"anotherChance":false,"candy":false,"id":400,"fixedId":400,"typeCard":0,"name":"Cogwheel","image":"Cogwheel","cost":2,"rarity":"COMMON","originalCost":2,"shiny":false,"quantity":1,"extension":"BASE","selectCards":[],"ownerId":0,"imageExtension":"png"},"name":"Cogwheel"},{"normal":1,"shiny":3,"card_data":{"attack":1,"hp":6,"maxHp":6,"originalAttack":1,"originalHp":6,"dodge":0,"thorns":0,"armor":0,"paralyzed":0,"silence":false,"kr":0,"cantAttack":false,"charge":false,"taunt":false,"ranged":false,"invulnerable":false,"haste":false,"transparency":false,"anotherChance":false,"candy":false,"id":238,"fixedId":238,"typeCard":0,"name":"Script Bomb","image":"Script_Bomb","cost":3,"rarity":"DETERMINATION","originalCost":3,"shiny":false,"quantity":1,"extension":"BASE","tribe":"BOMB","selectCards":[],"ownerId":0,"imageExtension":"png"},"name":"Script Bomb"},{"normal":1,"shiny":0,"card_data":{"attack":5,"hp":6,"maxHp":6,"originalAttack":5,"originalHp":6,"dodge":0,"thorns":0,"armor":0,"paralyzed":0,"silence":false,"kr":0,"cantAttack":false,"charge":false,"taunt":false,"ranged":false,"invulnerable":false,"haste":false,"transparency":false,"anotherChance":false,"candy":false,"id":120,"fixedId":120,"typeCard":0,"name":"G Follower 3","image":"G_Follower_3","cost":8,"rarity":"LEGENDARY","originalCost":8,"shiny":false,"quantity":1,"extension":"BASE","tribe":"G_FOLLOWER","selectCards":[],"ownerId":0,"imageExtension":"png"},"name":"G Follower 3"},{"normal":1,"shiny":0,"card_data":{"attack":1,"hp":3,"maxHp":3,"originalAttack":1,"originalHp":3,"dodge":0,"thorns":1,"armor":0,"paralyzed":0,"silence":false,"kr":0,"cantAttack":false,"charge":false,"taunt":false,"ranged":false,"invulnerable":false,"haste":false,"transparency":false,"anotherChance":false,"candy":false,"id":435,"fixedId":435,"typeCard":0,"name":"Ficus Licker","image":"Ficus_Licker","cost":2,"rarity":"COMMON","originalCost":2,"target":"ALLY_MONSTER","shiny":false,"quantity":1,"extension":"BASE","selectCards":[],"ownerId":0,"imageExtension":"png"},"name":"Ficus Licker"} ,{"normal":1,"shiny":0,"card_data":{"attack":2,"hp":3,"maxHp":3,"originalAttack":2,"originalHp":3,"dodge":0,"thorns":0,"armor":0,"paralyzed":0,"silence":false,"kr":0,"cantAttack":false,"charge":false,"taunt":false,"ranged":false,"invulnerable":false,"haste":false,"transparency":false,"anotherChance":false,"candy":false,"id":400,"fixedId":400,"typeCard":0,"name":"Cogwheel","image":"Cogwheel","cost":2,"rarity":"COMMON","originalCost":2,"shiny":false,"quantity":1,"extension":"BASE","selectCards":[],"ownerId":0,"imageExtension":"png"},"name":"Cogwheel"},{"normal":1,"shiny":0,"card_data":{"attack":1,"hp":6,"maxHp":6,"originalAttack":1,"originalHp":6,"dodge":0,"thorns":0,"armor":0,"paralyzed":0,"silence":false,"kr":0,"cantAttack":false,"charge":false,"taunt":false,"ranged":false,"invulnerable":false,"haste":false,"transparency":false,"anotherChance":false,"candy":false,"id":238,"fixedId":238,"typeCard":0,"name":"Script Bomb","image":"Script_Bomb","cost":3,"rarity":"COMMON","originalCost":3,"shiny":false,"quantity":1,"extension":"BASE","tribe":"BOMB","selectCards":[],"ownerId":0,"imageExtension":"png"},"name":"Script Bomb"},{"normal":1,"shiny":0,"card_data":{"attack":5,"hp":6,"maxHp":6,"originalAttack":5,"originalHp":6,"dodge":0,"thorns":0,"armor":0,"paralyzed":0,"silence":false,"kr":0,"cantAttack":false,"charge":false,"taunt":false,"ranged":false,"invulnerable":false,"haste":false,"transparency":false,"anotherChance":false,"candy":false,"id":120,"fixedId":120,"typeCard":0,"name":"G Follower 3","image":"G_Follower_3","cost":8,"rarity":"COMMON","originalCost":8,"shiny":false,"quantity":1,"extension":"BASE","tribe":"G_FOLLOWER","selectCards":[],"ownerId":0,"imageExtension":"png"},"name":"G Follower 3"},{"normal":1,"shiny":0,"card_data":{"attack":1,"hp":3,"maxHp":3,"originalAttack":1,"originalHp":3,"dodge":0,"thorns":1,"armor":0,"paralyzed":0,"silence":false,"kr":0,"cantAttack":false,"charge":false,"taunt":false,"ranged":false,"invulnerable":false,"haste":false,"transparency":false,"anotherChance":false,"candy":false,"id":435,"fixedId":435,"typeCard":0,"name":"Ficus Licker","image":"Ficus_Licker","cost":2,"rarity":"COMMON","originalCost":2,"target":"ALLY_MONSTER","shiny":false,"quantity":1,"extension":"BASE","selectCards":[],"ownerId":0,"imageExtension":"png"},"name":"Ficus Licker"}]}';
    test_button.test_JSON = test_JSON;
    ///////////////

    var list = document.querySelectorAll(".mainContent br");
    for (var i=0; i < list.length; i++) {
        list[i].remove();
    }
    list = null;

    var mainCont = document.getElementsByClassName("mainContent")[0];
    var rows = document.querySelectorAll(".mainContent p");
    //console.log(rows);

    var buyIcons = document.querySelectorAll(".mainContent p .height-48.interact");
    //console.log(buyIcons);

    var contAll = document.createElement("table");
    contAll.id = "packsCont";
    var row1 = document.createElement("tr");
    var row2 = document.createElement("tr");
    var row3 = document.createElement("tr");

    var ut_pack = document.createElement("td");
    ut_pack.setAttribute("colspan", 2);
    var ut_pack_table = document.createElement("table");
    ut_pack.appendChild(ut_pack_table);
    ut_pack_table.innerHTML = '<tr><td><img id="btnOpen" src="images/icons/pack.png" class="pack_image"></td><td><p style="font-size: 1.8em;">Undertale Pack</p><p style="font-size: 0.9em;">Contains 4 random Undertale Cards.</p><p style="font-size: 0.9em;">You have: <span id="nbPacks">' + document.getElementById("nbPacks").innerHTML + '</span></p></td></tr>' +
        '<tr class="button_row"><td><button class="btn btn-success" onclick="addPack(\'addPack\')";>Buy (100 <img src="images/icons/gold.png" class="height-16">)</button></td><td><button class="btn btn-success" onclick="addPack(\'addPackUcp\')";>Buy (<span class="ucp">10</span> UCP)</button></td></tr>'+
        '<tr class="button_row"><td><button class="btn btn-primary" onclick="openPacks(\'\', 1)">Open one</button></td><td><button class="btn btn-primary" onclick="openPacks(\'\', true)">Open ALL!</button></td></tr>';

    row1.appendChild(ut_pack);

    var dr_pack = document.createElement("td");
    dr_pack.setAttribute("colspan", 2);
    var dr_pack_table = document.createElement("table");
    dr_pack.appendChild(dr_pack_table);
    dr_pack_table.innerHTML = '<tr><td><img id="btnOpen" src="images/icons/drPack.png" class="pack_image"></td><td><p style="font-size: 1.8em;">Deltarune Pack</p><p style="font-size: 0.9em;">Contains 4 random Deltarune Cards.</p><p style="font-size: 0.9em;">You have: <span id="nbDRPacks">' + document.getElementById("nbDRPacks").innerHTML + '</span></p></td></tr>' +
        '<tr class="button_row"><td><button class="btn btn-success" onclick="addPack(\'addDRPack\')";>Buy (150 <img src="images/icons/gold.png" class="height-16">)</button></td><td><button class="btn btn-success" onclick="addPack(\'addDRPackUcp\')";>Buy (<span class="ucp">10</span> UCP)</button></td></tr>'+
        '<tr class="button_row"><td><button class="btn btn-primary" onclick="openPacks(\'DR\', 1)">Open one</button></td><td><button class="btn btn-primary" onclick="openPacks(\'DR\', true)">Open ALL!</button></td></tr>';

    row1.appendChild(dr_pack);

    var shiny_pack = document.createElement("td");
    shiny_pack.setAttribute("colspan", 2);
    var shiny_pack_table = document.createElement("table");
    shiny_pack.appendChild(shiny_pack_table);
    shiny_pack_table.innerHTML = '<tr><td><img id="btnOpen" src="images/icons/shinyPack.gif" class="pack_image"></td><td><p style="font-size: 1.8em;">Shiny Pack</p><p style="font-size: 0.9em;">Contains 4 random Shiny Cards.</p><p style="font-size: 0.9em;">You have: <span id="nbShinyPacks">' + document.getElementById("nbShinyPacks").innerHTML + '</span></p></td></tr>' +
        '<tr class="button_row"><td colspan=2>Shiny Packs Can\'t be purchased!</td></tr>'+
        '<tr class="button_row"><td><button class="btn btn-primary" onclick="openPacks(\'Shiny\', 1)">Open one</button></td><td><button class="btn btn-primary" onclick="openPacks(\'Shiny\', true)">Open ALL!</button></td></tr>';

    row2.appendChild(shiny_pack);

    var super_pack = document.createElement("td");
    super_pack.setAttribute("colspan", 2);
    var super_pack_table = document.createElement("table");
    super_pack.appendChild(super_pack_table);
    super_pack_table.innerHTML = '<tr><td><img id="btnOpen" src="images/icons/superPack.gif" class="pack_image"></td><td><p style="font-size: 1.8em;">Super Pack</p><p style="font-size: 0.9em;">'+
        'Contains a random <img src="images/rarity/BASE_COMMON.png" title="COMMON">/<img src="images/rarity/DELTARUNE_COMMON.png" title="COMMON">, <img src="images/rarity/BASE_RARE.png" title="RARE">/<img src="images/rarity/DELTARUNE_RARE.png" title="RARE">, <img src="images/rarity/BASE_EPIC.png" title="EPIC">/<img src="images/rarity/DELTARUNE_EPIC.png" title="EPIC"> and <img src="images/rarity/BASE_LEGENDARY.png" title="LEGENDARY">/<img src="images/rarity/DELTARUNE_LEGENDARY.png" title="LEGENDARY"> card.</p>'+
        '<p style="font-size: 0.9em;">You have: <span id="nbSuperPacks">' + document.getElementById("nbSuperPacks").innerHTML + '</span></p></td></tr>' +
        '<tr class="button_row"><td colspan=2>Super Packs Can\'t be purchased!</td></tr>'+
        '<tr class="button_row"><td><button class="btn btn-primary" onclick="openPacks(\'Super\', 1)">Open one</button></td><td><button class="btn btn-primary" onclick="openPacks(\'Super\', true)">Open ALL!</button></td></tr>';

    row2.appendChild(super_pack);

    var I_M_JUST_A_WASTE_OF_SPACE = document.createElement("td");
    I_M_JUST_A_WASTE_OF_SPACE.style.opacity = 0;

    row3.appendChild(I_M_JUST_A_WASTE_OF_SPACE);

    var final_pack = document.createElement("td");
    final_pack.setAttribute("colspan", 2);
    var final_pack_table = document.createElement("table");
    final_pack.appendChild(final_pack_table);
    final_pack_table.innerHTML = '<tr><td><img id="btnOpen" src="images/icons/finalPack.gif" class="pack_image"></td><td><p style="font-size: 1.8em;">Final Pack</p><p style="font-size: 0.9em;">'+
        'Contains a random <img src="images/rarity/BASE_RARE.png" title="RARE">/<img src="images/rarity/DELTARUNE_RARE.png" title="RARE">, <img src="images/rarity/BASE_EPIC.png" title="EPIC">/<img src="images/rarity/DELTARUNE_EPIC.png" title="EPIC">, <img src="images/rarity/BASE_LEGENDARY.png" title="LEGENDARY">/<img src="images/rarity/DELTARUNE_LEGENDARY.png" title="LEGENDARY"> and <img src="images/rarity/BASE_DETERMINATION.png" title="DETERMINATION">/<img src="images/rarity/DELTARUNE_DETERMINATION.png" title="DETERMINATION"> card.</p>'+
        '<p style="font-size: 0.9em;">You have: <span id="nbFinalPacks">' + document.getElementById("nbFinalPacks").innerHTML + '</span></p></td></tr>' +
        '<tr class="button_row"><td colspan=2>Final Packs Can\'t be purchased!</td></tr>'+
        '<tr class="button_row"><td><button class="btn btn-primary" onclick="openPacks(\'Final\', 1)">Open one</button></td><td><button class="btn btn-primary" onclick="openPacks(\'Final\', true)">Open ALL!</button></td></tr>';

    row3.appendChild(final_pack);

    contAll.appendChild(row1);
    contAll.appendChild(row2);
    contAll.appendChild(row3);
    mainCont.appendChild(contAll);

    //console.log("rows", rows)
    rows[rows.length-1].remove();
    rows[rows.length-2].remove();

    bg = document.createElement("div");
    bg.id = "openCardsCont";
    bg.onclick = function() {click++};
    document.body.appendChild(bg);

    pack_cont = document.createElement("div");
    pack_cont.id = "packCont";
    bg.appendChild(pack_cont);

    pack = document.createElement("img");
    pack.src = "images/icons/pack.png";
    pack_cont.appendChild(pack);

    pack_count = document.createElement("p");
    pack_cont.appendChild(pack_count);

    pack_shard1 = document.createElement("div");
    pack_shard1.className = "pack_shard";
    pack_shard1.style = "background-position:center top; transform: translate(-50%, -100%);";
    pack_shard1.style["background-image"] = "url('" + "images/icons/pack.png" + "')";
    bg.appendChild(pack_shard1);

    pack_shard2 = document.createElement("div");
    pack_shard2.className = "pack_shard";
    pack_shard2.style = "background-position:center bottom; transform: translate(-50%, 0%);";
    pack_shard2.style["background-image"] = "url('" + "images/icons/pack.png" + "')";
    bg.appendChild(pack_shard2);

    all_cards_cont = document.createElement("div");
    bg.appendChild(all_cards_cont);

    updateFunctions.push(cardOpenUpdate);

    //console.log("Packs Page Done!");
});



(function() {
    'use strict';

    
})();