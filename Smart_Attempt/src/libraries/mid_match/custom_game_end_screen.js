
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

class Currency {

    static GOLD = new Currency("yellow", () => {return window.$('<img src="images/icons/gold.png">')[0]}, Currency.speedFunction(100, 5, 500));
    static UCP = new Currency("ucp", () => {return window.$(`<span>${window.$.i18n("reward-ucp")}</span>`)[0]}, Currency.speedFunction(200, 10, 500));
    static DUST = new Currency("gray", () => {return window.$('<img src="images/icons/dust.png">')[0]}, Currency.speedFunction(100, 5, 500));
    static DTFRAG = new Currency("DTFragment", () => {return window.$('<img src="images/dtFragment.png">')[0]}, Currency.speedFunction(500, 100, 10));

    static UT_PACK = new Currency("", () => {return window.$('<img src="images/icons/pack.png">')[0]}, Currency.speedFunction(250, 100, 50));
    static DR_PACK = new Currency("", () => {return window.$('<img src="images/icons/drPack.png">')[0]}, Currency.speedFunction(250, 100, 50));
    static SHINY_PACK = new Currency("rainbowText", () => {return window.$('<img src="images/icons/shinyPack.gif">')[0]}, Currency.speedFunction(200, 100, 25));
    static SUPER_PACK = new Currency("yellow", () => {return window.$('<img src="images/icons/superPack.gif">')[0]}, Currency.speedFunction(500, 200, 25));
    static FINAL_PACK = new Currency("DTFragment", () => {return window.$('<img src="images/icons/finalPack.gif">')[0]}, Currency.speedFunction(500, 200, 25));

    constructor(/**@type {String} */ textClass, /**@type {Function} */ icon, /**@type {Function} */ speed) {
        /**@type {String} */ 
        this.textClass = textClass;
        /**@type {Function} */
        this.icon = icon;
        /**@type {Function} */
        this.speed = speed;
    }

    /**@returns {HTMLElement} */
    getCurrencyIcon()  {
        return this.icon();
    }

    applyTextClass(/**@type {HTMLElement} */ elem) {
        elem.classList.add(this.textClass);
    }

    /**@returns {number} */
    getSpeedForAmount(amount)  {
        return this.speed(amount);
    }

    static speedFunction(slowSpeed, fastSpeed, scaleAmount) {
        return (amount) => {
            return Math.ceil(fastSpeed + (slowSpeed - fastSpeed)*(1 - Math.min(amount, scaleAmount)/scaleAmount));
        }
    }

}

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
        /**@type {number} */
        this.passedAmount = 0;
    }

    /**@returns {boolean} */
    attemptMerge(/**@type {RewardSourceInstance} */ other) {
        if (other.source != this.source) {
            return false;
        }
        this.amount += other.amount;
        this.passedAmount += other.passedAmount;
        return true;
    }

    /**@returns {boolean} */
    finishedTicking() {
        return this.passedAmount >= this.amount;
    }

    tick() {
        this.passedAmount = Math.min(this.passedAmount + 1, this.amount);
    }

}

class RewardRow {

    constructor(/**@type {Currency} */ currency) {
        /**@type {Currency} */ 
        this.currency = currency;
        /**@type {Array.<RewardSourceInstance>} */
        this.sources = [];
        /**@type {Boolean} */
        this.displaySources = true;
        /**@type {number} */
        this.totalAmount = 0;
        /**@type {number} */
        this.tickSpeed = 1000; // Dummy number that should not cause issues later.
    }

    addInstance(/**@type {RewardSourceInstance} */ inst) {
        this.totalAmount += inst.amount;
        this.tickSpeed = this.currency.getSpeedForAmount(this.totalAmount);
        for (var i=0; i < this.sources.length; i++) {
            if (this.sources[i].attemptMerge(inst)) {
                return;
            }
        }
        this.sources.push(inst);
    }

    // TODO: Make it so rendering does not re-make ALL of the elements every tick!

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
            bgm.loop = true;
            bgm.play();
        }, 1000);
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