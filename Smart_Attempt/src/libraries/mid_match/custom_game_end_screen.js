
const CONTRIB_GOLD = 10; // Yes, Onu hardcoded this. Surprised?

const DIVISIONS = [
    "COPPER_IV",
    "COPPER_III",
    "COPPER_II",
    "COPPER_I",
    "IRON_IV",
    "IRON_III",
    "IRON_II",
    "IRON_I",
    "GOLD_IV",
    "GOLD_III",
    "GOLD_II",
    "GOLD_I",
    "EMERALD_IV",
    "EMERALD_III",
    "EMERALD_II",
    "EMERALD_I",
    "SAPPHIRE_IV",
    "SAPPHIRE_III",
    "SAPPHIRE_II",
    "SAPPHIRE_I",
    "AMETHYST_IV",
    "AMETHYST_III",
    "AMETHYST_II",
    "AMETHYST_I",
    "RUBY_IV",
    "RUBY_III",
    "RUBY_II",
    "RUBY_I",
    "DIAMOND_IV",
    "DIAMOND_III",
    "DIAMOND_II",
    "DIAMOND_I",
    "LEGEND"
];

class GoldSource {

    constructor(sourceName, amount) {
        this.sourceName = sourceName;
        this.amount = amount;
    }

}

function getDivisionForElo(elo) {
    var nr = Math.floor((elo - 1200)/25);
    return DIVISIONS[Math.min(nr, DIVISIONS.length-1)];
}

function getDivisionEnd(elo) {
    return (Math.floor(elo/25)+1)*25 - 1;
}

function returnGoldSources(data) {
    var goldDiff = data.golds - data.oldGold;
    var sources = [];
    if (data.isDonator) {
        sources.push(new GoldSource("CONTRIBUTOR", CONTRIB_GOLD));
        goldDiff -= CONTRIB_GOLD;
    }
    if (data.queueGoldBonus) {
        sources.push(new GoldSource("QUEUE", data.queueGoldBonus));
        goldDiff -= data.queueGoldBonus;
    }
    sources.unshift(new GoldSource("MATCH", goldDiff));

    return sources;
}

function transformMatchEndData(data) {
    var newData = {
        endType : data.action === "getVictory" ? (data.disconnected ? "LEAVE_WIN" : "WIN") : (data.action == "getGameRemoved" ? "DRAW" : "LOSE"),
        oldGold : data.oldGold,
        goldSources : returnGoldSources(data),
        oldLevelBarSize: data.oldJaugeSize,
        newLevelBarSize : data.jaugeSize
    }
}

export {DIVISIONS, getDivisionForElo};