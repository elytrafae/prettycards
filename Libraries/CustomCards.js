

if (settings.easter_egg_cards.value()) {
  var bonusExtensions = ["DDLC"];
  var bonusTribes = ["CHIBI"];

  GM_addStyle(".cardImage {background-size:cover!important}");

  for (var i=0; i < bonusExtensions.length; i++) {
    var ext = bonusExtensions[i];
    GM_addStyle(".monster.ext_"+ ext +" .cardFrame {background-image: url('https://raw.githubusercontent.com/CMD-God/prettycards/master/img/CardFrames/" + ext + "/frame_monster.png');}");
    GM_addStyle(".spell.ext_"+ ext +" .cardFrame {background-image: url('https://raw.githubusercontent.com/CMD-God/prettycards/master/img/CardFrames/" + ext + "/frame_spell.png');}");
  }

  GM_addStyle(".card.ext_DDLC .cardBackground {background-image: url('https://raw.githubusercontent.com/CMD-God/prettycards/master/img/CardFrames/DDLC/frame_background.png'); top: 7px; height: 231px;}");
  GM_addStyle(".cardHeader, .cardFooter { background-color: rgb(0, 0, 0, 0); }");

  PrettyCards_plugin.events.on("appendCard()", function(data) {
      var html$ = data.element;
      var card = data.card;
    if (card.fixedId >= customCardsStart) {
      html$.addClass("ext_" + card.extension);
      html$.find(".cardImage").css('background', "url('https://raw.githubusercontent.com/CMD-God/prettycards/master/img/Cards/" + card.extension + "/" + card.image + '.' + card.imageExtension + "') no-repeat");
      console.log("card extension", card.extension);
      if ((card.extension !== "BASE") && (card.extension !== "DELTARUNE")) {
        html$.find('.cardRarity').css('background', 'transparent url(\'https://raw.githubusercontent.com/CMD-God/prettycards/master/img/RarityIcons/' + card.extension + '_' + card.rarity + '.png\') no-repeat');
      };
      var tribe_elements = html$.find(".cardTribes").children();
      console.log("tribe elements: ", tribe_elements);
      for (var i=0; i < card.tribes.length; i++) {
        var tribe = card.tribes[i];
        if (bonusTribes.includes(tribe)) {
          console.log(tribe, " is a custom tribe!");
          tribe_elements[i].src = "https://raw.githubusercontent.com/CMD-God/prettycards/master/img/Tribes/" + tribe + ".png";
        }
      }
    }
  });

  /*function AppendCustomCard(container, card) {
      var html$ = window.appendCard(container, card);
      html$.addClass("ext_" + card.extension);
      html$.find(".cardImage").css('background', "url('https://raw.githubusercontent.com/CMD-God/prettycards/master/img/Cards/" + card.extension + "/" + card.image + '.' + card.imageExtension + "') no-repeat");
      console.log("card extension", card.extension);
      if ((card.extension !== "BASE") && (card.extension !== "DELTARUNE")) {
        html$.find('.cardRarity').css('background', 'transparent url(\'https://raw.githubusercontent.com/CMD-God/prettycards/master/img/RarityIcons/' + card.extension + '_' + card.rarity + '.png\') no-repeat');
      };
  }*/


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
          id : customCardsStart,
          fixedId : customCardsStart,
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
          typeSkin: 0,
          imageExtension : "png"
      },
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
            id : customCardsStart+1,
            fixedId : customCardsStart+1,
            typeCard : 0,
            name : "Chibi Natsuki",
            image : "Chibi_Natsuki",
            cost : 3,
            rarity : "COMMON",
            originalCost : 3,
            shiny : false,
            quantity : 1,
            extension : "DDLC",
            tribes : ["CHIBI"],
            selectCards : [],
            ownerId : 0,
            typeSkin: 0,
            imageExtension : "png"
        },
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
              id : customCardsStart+2,
              fixedId : customCardsStart+2,
              typeCard : 0,
              name : "Chibi Yuri",
              image : "Chibi_Yuri",
              cost : 3,
              rarity : "COMMON",
              originalCost : 3,
              shiny : false,
              quantity : 1,
              extension : "DDLC",
              tribes : ["CHIBI"],
              selectCards : [],
              ownerId : 0,
              typeSkin: 0,
              imageExtension : "png"
          },
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
                id : customCardsStart+3,
                fixedId : customCardsStart+3,
                typeCard : 0,
                name : "Chibi Monika",
                image : "Chibi_Monika",
                cost : 5,
                rarity : "COMMON",
                originalCost : 5,
                shiny : false,
                quantity : 1,
                extension : "DDLC",
                tribes : ["CHIBI"],
                selectCards : [],
                ownerId : 0,
                typeSkin: 0,
                imageExtension : "png"
            }
  ];

  PrettyCards_plugin.events.on('CardsLoad', function() {
  	console.log("It worked!");
  	for (var i=0; i < _CustomCards.length; i++) {
  		window.allCards.push(_CustomCards[i]);
      var shiny = JSON.parse(JSON.stringify(_CustomCards[i]));
      shiny.shiny = true;
      window.collection.push(_CustomCards[i]);
      window.collection.push(shiny);
      for (var key in window.deckCollections) {
        window.deckCollections[key].push(_CustomCards[i]);
        window.deckCollections[key].push(shiny);
      }
  	}
    console.log("underscript.onPage('Decks')", underscript.onPage("Decks"));
    if (underscript.onPage("Decks")) {
      for (var key in window.deckCollections) {
        deckCollections[key].sort(function (a, b) {
            return compare(a.cost, b.cost) || $.i18n('card-name-' + a.id, 1).localeCompare($.i18n('card-name-' + b.id, 1)) || (a.shiny - b.shiny);
       });
        console.log("Deck Collection", key, deckCollections[key]);
      }
      //refreshDeckList();
      console.log("Decks page insertion complete!");
    }
  });
  console.log("CardsLoad event added!", PrettyCards_plugin.events);


}
