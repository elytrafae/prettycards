
import { loadCSS } from "../css_loader";
import css from "../../css/CustomGameEndScreen.css";
import { prettycards } from "../underscript_checker";
loadCSS(css);

const CONTRIB_GOLD = 10; // Yes, Onu hardcoded this. Surprised?

/*{
    "action": "getVictory",
    "gameType": "RANKED",
    "disconnected": false,
    "golds": 5934,
    "isDonator": false,
    "oldGold": 5919,
    "oldXp": 5709561,
    "newXp": 5710123,
    "nbLevelPassed": 0,
    "oldJaugeSize": 6000,
    "jaugeSize": 6000,
    "xpUntilNextLevel": 3189,
    "queueGoldBonus": 0,
    "oldDivision": "AMETHYST_I",
    "newDivision": "AMETHYST_I",
    "oldElo": 1775,
    "newElo": 1783
}*/

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
    "ONYX_IV",
    "ONYX_III",
    "ONYX_II",
    "ONYX_I",
    "MASTER_IV",
    "MASTER_III",
    "MASTER_II",
    "MASTER_I",
    "LEGEND"
];

class GameEndTypes {

    static WIN = new GameEndTypes("game-game-victory", "", "/musics/dr2_victory.ogg");
    static LEAVE_WIN = new GameEndTypes("game-game-victory", "", "/musics/dogsong.ogg");
    static LOSE = new GameEndTypes("game-game-over", "", "/musics/dr2_gameover.ogg");
    static DRAW = new GameEndTypes("pc-game-draw", "", "https://github.com/CMD-God/prettycards/raw/master/audio/bgms/mus_star.ogg");
    static CHARA = new GameEndTypes("game-died", "red", "/musics/toomuch.ogg");

    constructor(/**@type {String} */ textKey, /**@type {String} */ textClass, /**@type {String} */ song) {
        /**@type {String} */
        this.textKey = textKey;
        /**@type {String} */
        this.textClass = textClass;
        /**@type {String} */
        this.songSrc = song;
    }

}

class RewardSource {

    static MATCH = new RewardSource("match", "piggy-bank");
    static SPECIAL = new RewardSource("special", "star");
    static CONTRIBUTOR = new RewardSource("contributor", "euro");
    static QUEUE = new RewardSource("queue", "time");
    static LEVELUP = new RewardSource("levelup", "gift");
    static QUEST = new RewardSource("levelup", "calendar");
    static FRIENDSHIP = new RewardSource("friendship", "heart");

    constructor(/**@type {String} */ id, /**@type {String} */ iconName) {
        /**@type {String} */
        this.id = id;
        /**@type {String} */
        this.iconName = iconName;
    }

}

class RewardSourceInstance {

    constructor(/**@type {RewardSource} */ source, /**@type {number} */ amount) {
        /**@type {RewardSource} */
        this.source = source;
        /**@type {number} */
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
        sources.push(new RewardSourceInstance(RewardSource.CONTRIBUTOR, CONTRIB_GOLD));
        goldDiff -= CONTRIB_GOLD;
    }
    if (data.queueGoldBonus) {
        sources.push(new RewardSourceInstance(RewardSource.QUEUE, data.queueGoldBonus));
        goldDiff -= data.queueGoldBonus;
    }
    sources.unshift(new RewardSourceInstance(RewardSource.MATCH, goldDiff));

    return sources;
}

function transformMatchEndData(data) {
    var newData = {
        endType : data.action === "getVictory" ? (data.disconnected ? GameEndTypes.LEAVE_WIN : GameEndTypes.WIN) : (data.action == "getGameRemoved" ? GameEndTypes.DRAW : GameEndTypes.LOSE),
        oldGold : data.oldGold,
        goldSources : returnGoldSources(data),
        oldLevelBarSize: data.oldJaugeSize,
        newLevelBarSize : data.jaugeSize
    }
    return newData;
}

function displayMatchResults(data) {
    //console.log(data, data.endType, data.endType.textKey, window.$(data.endType.textKey));
    var landNoise = new Audio();
    landNoise.src = "https://github.com/CMD-God/prettycards/raw/master/audio/sfx/mus_intronoise.ogg";

    var bgm = new Audio();
    bgm.src = data.endType.songSrc;

    var backdrop = document.createElement("DIV");
    backdrop.className = "PrettyCards_GameEnd_Backdrop";
    window.$(backdrop).css("top", -window.innerHeight + "px").animate({"top": "0px"}, 1000, "easeInQuad", () => {
        // anim done
        landNoise.play();
        setTimeout(() => {

        })
    });
    var container = document.createElement("DIV");
    container.className = "PrettyCards_GameEnd_Content";

    var title = document.createElement("DIV");
    title.className = "PrettyCards_GameEnd_Title " + data.endType.textClass;
    title.innerHTML = window.$.i18n(data.endType.textKey);
    container.appendChild(title);

    backdrop.appendChild(container);

    window.document.body.appendChild(backdrop);
}

prettycards.GameEndTypes = GameEndTypes;
prettycards.displayMatchResults = displayMatchResults;

export {DIVISIONS, getDivisionForElo};