

function appendSuperposCard(card, parent, normalCount = 3, shinyCount = 1) {
    var displayCount = (normalCount > 0 || shinyCount > 0);
    var height = 270;
    if (!displayCount) {
        height = 246;
    }
    console.log(normalCount, shinyCount, displayCount);
    var half_style = `height: 100%; width: 50%; overflow-x: hidden;`;
    var cont = $(`
        <div style="display: flex; width: 176px; height: ${height}px;">
            <div class="PrettyCards_SuperposCard_Left" style="${half_style}"></div>
            <div class="PrettyCards_SuperposCard_Right" style="${half_style}"></div>
        </div>
    `);
    var orgShiny = card.shiny;
    card.shiny = false;
    var e1 = window.appendCard(card, cont.find(".PrettyCards_SuperposCard_Left"));
    card.shiny = true;
    var e2 = window.appendCard(card, cont.find(".PrettyCards_SuperposCard_Right"));
    e2.css("position", "relative");
    e2.css("left", "-100%");
    card.shiny = orgShiny;

    if (displayCount) {
        e1.append('<div class="cardQuantity" style="text-align:left; padding-left: 0.8em;">x <span class="nb">' + normalCount + '</span></div>');
        e2.append('<div class="cardQuantity rainbowText" style="text-align:right; padding-right: 0.8em;">x <span class="nb">' + shinyCount + '</span></div>');
    }

    parent.append(cont);
    return cont;
}

prettycards.concepts.appendSuperposCard = appendSuperposCard;