
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

const ELO_PER_DIVISION = 25;

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
    static XP = new Currency("PrettyCards_UserLV", () => {return window.$('<span>XP</span>')[0]}, Currency.speedFunction(50, 5, 3000)).setCountPerTick(5);
    static ELO = new Currency("Contributor", () => {return window.$('<span>ELO</span>')[0]}, Currency.speedFunction(50, 5, ELO_PER_DIVISION));

    static UT_PACK = new Currency("", () => {return window.$('<img src="images/icons/pack.png">')[0]}, Currency.speedFunction(250, 100, 50));
    static DR_PACK = new Currency("", () => {return window.$('<img src="images/icons/drPack.png">')[0]}, Currency.speedFunction(250, 100, 50));
    static SHINY_PACK = new Currency("rainbowText", () => {return window.$('<img src="images/icons/shinyPack.gif">')[0]}, Currency.speedFunction(200, 100, 25));
    static SUPER_PACK = new Currency("yellow", () => {return window.$('<img src="images/icons/superPack.gif">')[0]}, Currency.speedFunction(500, 200, 25));
    static FINAL_PACK = new Currency("DTFragment", () => {return window.$('<img src="images/icons/finalPack.gif">')[0]}, Currency.speedFunction(500, 200, 25));

    /**@type {Map.<number,CardCurrency>} */
    static CARD_CURRENCIES = new Map();

    // TODO: Add Currencies for cosmetics, too, similar to cards. They definitely be obtained from quests.
    // Note to self: This whole thing became FAR bigger than initially anticipated

    constructor(/**@type {String} */ textClass, /**@type {Function} */ icon, /**@type {Function} */ speed) {
        /**@type {String} */ 
        this.textClass = textClass;
        /**@type {Function} */
        this.icon = icon;
        /**@type {Function} */
        this.speed = speed;
        /**@type {number} */
        this.countPerTick = 1;
    }

    /**@returns {CardCurrency} */
    static getOrCreateCardCurrency(/**@type {number} */ cardId) {
        if (!Currency.CARD_CURRENCIES.has(cardId)) {
            var currency = new CardCurrency(cardId);
            Currency.CARD_CURRENCIES.set(cardId, currency);
            RewardManager.addCardCurrencyToOrder(currency);
        }
        return Currency.CARD_CURRENCIES.get(cardId);
    }

    /**@returns {HTMLElement} */
    getCurrencyIcon()  {
        return this.icon();
    }

    applyTextClass(/**@type {HTMLElement} */ elem) {
        if (this.textClass == "") {
            return;
        }
        elem.classList.add(this.textClass);
    }

    /**@returns {number} */
    getSpeedForAmount(amount)  {
        return this.speed(amount);
    }

    /**@returns {Currency} */
    setCountPerTick(/**@type {number} */ nr) {
        this.countPerTick = nr;
        return this;
    }

    static speedFunction(slowSpeed, fastSpeed, scaleAmount) {
        return (amount) => {
            return Math.ceil(fastSpeed + (slowSpeed - fastSpeed)*(1 - Math.min(amount, scaleAmount)/scaleAmount));
        }
    }

}

class CardCurrency extends Currency {

    constructor(/**@type {number} */ cardId) {
        super("", () => {}, () => {return 500;});
        /**@type {number} */
        this.cardId = cardId;
    }

    /**@returns {HTMLElement} */
    getCurrencyIcon()  {
        var cont = document.createElement("SPAN");
        cont.innerHTML = window.$.i18n(`{{CARD:${this.cardId}|1}}`);
        return cont;
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
        
        /**@type {HTMLElement} */
        this.container = document.createElement("SPAN");
        /**@type {HTMLElement} */
        this.amountElement = document.createElement("SPAN");

        this.container.className = "PrettyCards_GameEnd_RewardSourceContainer PrettyCards_Hidden";
        this.container.innerHTML = ` <span class="glyphicon glyphicon-${this.source.iconName}">`;
        this.container.prepend(this.amountElement);
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

    tick(/**@type {number} */ count) {
        this.passedAmount = Math.min(this.passedAmount + count, this.amount);
        this.amountElement.innerHTML = "+" + this.passedAmount;
        this.container.classList.remove("PrettyCards_Hidden");
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
        /**@type {HTMLElement} */
        this.container = document.createElement("DIV");
        currency.applyTextClass(this.container);
        this.container.classList.add("PrettyCards_Hidden");
        this.container.classList.add("PrettyCards_GameEnd_RewardRow");

        /**@type {HTMLElement} */
        this.totalAmountElement = document.createElement("SPAN");
        /**@type {HTMLElement} */
        this.instanceContainer = document.createElement("SPAN");

        this.container.innerHTML = "+ ";
        this.container.appendChild(this.totalAmountElement);
        this.container.appendChild(document.createTextNode(" "));
        this.container.appendChild(this.currency.getCurrencyIcon());
        this.container.appendChild(document.createTextNode(" ("));
        this.container.appendChild(this.instanceContainer);
        this.container.appendChild(document.createTextNode(" )"));
    }

    addInstance(/**@type {RewardSourceInstance} */ inst, /**@type {boolean} */ front = false) {
        this.totalAmount += inst.amount;
        this.tickSpeed = this.currency.getSpeedForAmount(this.totalAmount);
        for (var i=0; i < this.sources.length; i++) {
            if (this.sources[i].attemptMerge(inst)) {
                return;
            }
        }
        if (front) {
            this.sources.unshift(inst);
            this.instanceContainer.prepend(inst.container);
        } else {
            this.sources.push(inst);
            this.instanceContainer.appendChild(inst.container);
        }
        
    }

    tick() {
        var shouldTick = true;
        var totalDisplayedAmount = 0;
        for (var i=0; i < this.sources.length; i++) {
            var source = this.sources[i];
            if (shouldTick && !source.finishedTicking()) {
                shouldTick = false; // We should only tick the first one!
                source.tick(this.currency.countPerTick);
            }
            totalDisplayedAmount += source.passedAmount;
        }
        if (!shouldTick) { // If something ticked . . .
            this.totalAmountElement.innerHTML = totalDisplayedAmount;
            this.container.classList.remove("PrettyCards_Hidden");
        }
        setTimeout(this.tick.bind(this), this.tickSpeed);
    }

}

class RewardManager {

    static #ORDER = [
        Currency.GOLD, 
        Currency.DUST, 
        Currency.UCP, 
        Currency.DTFRAG, 
        Currency.UT_PACK, 
        Currency.DR_PACK, 
        Currency.SHINY_PACK, 
        Currency.SUPER_PACK, 
        Currency.FINAL_PACK,
        Currency.ELO,
        Currency.XP,
    ];

    constructor() {
        /**@type {Map.<Currency,RewardRow>} */
        this.rows = new Map();
        /**@type {HTMLElement} */
        this.container = document.createElement("DIV");
    }

    static getCurrencyOrder() {
        return RewardManager.#ORDER;
    }

    addReward(/**@type {Currency} */ currency, /**@type {RewardSourceInstance} */ inst, /**@type {boolean} */ front = false) {
        if (!this.rows.has(currency)) {
            var row = new RewardRow(currency);
            this.#appendContainer(row);
            this.rows.set(currency, row);
        }
        this.rows.get(currency).addInstance(inst, front);
    }

    #appendContainer(/**@type {RewardRow} */ row) {
        if (this.rows.size <= 0) {
            this.container.appendChild(row.container);
        }
        var rowsInFront = 0;
        var i=0;
        while (i < RewardManager.#ORDER.length && RewardManager.#ORDER[i] != row.currency) {
            if (this.rows.has(RewardManager.#ORDER[i])) {
                rowsInFront++;
            }
            i++;
        }
        if (this.rows.size == rowsInFront) {
            this.container.appendChild(row.container);
            return;
        }
        this.container.insertBefore(row.container, this.container.children[rowsInFront]);
    }

    startTicking() {
        var j=0;
        for (var i=0; i < RewardManager.#ORDER.length; i++) {
            var currency = RewardManager.#ORDER[i];
            if (this.rows.has(currency)) {
                var row = this.rows.get(currency);
                setTimeout(row.tick.bind(row), j*800);
                j++;
            }
        }
    }

    static addCardCurrencyToOrder(/**@type {CardCurrency} */ currency) {
        RewardManager.#ORDER.splice(4, 0, currency); // 4 is the index. This should put it right after DT FRAGS
    }

}

function getDivisionForElo(elo) {
    var nr = Math.floor((elo - 1200)/ELO_PER_DIVISION);
    return DIVISIONS[Math.min(nr, DIVISIONS.length-1)];
}

function getDivisionEnd(elo) {
    return (Math.floor(elo/ELO_PER_DIVISION)+1)*ELO_PER_DIVISION - 1;
}

function addGoldSources(data, /**@type {RewardManager} */ rewardManager) {
    var goldDiff = data.golds - data.oldGold;
    if (data.isDonator) {
        rewardManager.addReward(Currency.GOLD, new RewardSourceInstance(RewardSource.CONTRIBUTOR, CONTRIB_GOLD));
        goldDiff -= CONTRIB_GOLD;
    }
    if (data.queueGoldBonus) {
        rewardManager.addReward(Currency.GOLD, new RewardSourceInstance(RewardSource.QUEUE, data.queueGoldBonus));
        goldDiff -= data.queueGoldBonus;
    }
    rewardManager.addReward(Currency.GOLD, new RewardSourceInstance(RewardSource.MATCH, goldDiff), true);
}

function processReward(/**@type {String} */ rewardType, /**@type {number} */ rewardCount, /**@type {RewardManager} */ rewardManager, /**@type {RewardSource} */ source) {
    if (!rewardType) {
        return;
    }
    if (rewardType === 'CARD') {
        // Yes, in case of cards, Onu uses the count as the ID, and the count is always 1.
        var currency = Currency.getOrCreateCardCurrency(rewardCount);
        rewardManager.addReward(currency, new RewardSourceInstance(source, 1));
        return;
    }
    var currency = getCurrencyFromTypeString(rewardType);
    if (!currency) {
        console.warn("Could not find Currency type for string ", rewardType);
        return;
    }
    rewardManager.addReward(currency, new RewardSourceInstance(source, rewardCount));
}

function getCurrencyFromTypeString(/**@type {String} */ rewardType) {
    var type = rewardType.split("-");
    type.shift();
    type = type.join("-");
    switch (type) {
        case "dust": return Currency.DUST;
        case "pack": return Currency.UT_PACK;
        case "gold": return Currency.GOLD;
        case "xp": return Currency.XP;
        case "super-pack": return Currency.SUPER_PACK;
        case "shiny-pack": return Currency.SHINY_PACK;
        case "final-pack": return Currency.FINAL_PACK;
        case "ucp": return Currency.UCP;
        case "dt-fragment": return Currency.DTFRAG;
        case "dr-pack": return Currency.DR_PACK;
        case "avatar": return null;
        case "card-skin": return null;
        case "profile-skin": return null;
        case "emote": return null;
        default: return null;
    }
}

function transformMatchEndData(data) {
    var newData = {
        endType : data.action === "getVictory" ? (data.disconnected ? GameEndTypes.LEAVE_WIN : GameEndTypes.WIN) : (data.action == "getGameRemoved" ? GameEndTypes.DRAW : GameEndTypes.LOSE),
        oldGold : data.oldGold,
        rewardManager: new RewardManager(),
        oldLevelBarSize: data.oldJaugeSize,
        newLevelBarSize : data.jaugeSize
    }
    addGoldSources(data, newData.rewardManager);
    newData.rewardManager.addReward(Currency.XP, new RewardSourceInstance(RewardSource.MATCH, data.newXp - data.oldXp));
    if (data.oldElo && data.newElo) {
        newData.rewardManager.addReward(Currency.ELO, new RewardSourceInstance(RewardSource.MATCH, data.newElo - data.oldElo));
    }
    processReward(data.rewardType === "CARD" ? data.rewardType : data.rewardStringKey, data.rewardQuantity, newData.rewardManager, RewardSource.LEVELUP);
    processReward(data.bonusRewardType === "CARD" ? data.bonusRewardType : data.bonusRewardStringKey, data.bonusRewardQuantity, newData.rewardManager, RewardSource.SPECIAL);

    // Test code
    newData.rewardManager.addReward(Currency.GOLD, new RewardSourceInstance(RewardSource.QUEST, 300));
    newData.rewardManager.addReward(Currency.DUST, new RewardSourceInstance(RewardSource.QUEST, 450));
    newData.rewardManager.addReward(Currency.UT_PACK, new RewardSourceInstance(RewardSource.QUEST, 3));

    newData.rewardManager.addReward(Currency.GOLD, new RewardSourceInstance(RewardSource.FRIENDSHIP, 200));
    newData.rewardManager.addReward(Currency.DUST, new RewardSourceInstance(RewardSource.FRIENDSHIP, 100));
    newData.rewardManager.addReward(Currency.UT_PACK, new RewardSourceInstance(RewardSource.FRIENDSHIP, 5));
    newData.rewardManager.addReward(Currency.DR_PACK, new RewardSourceInstance(RewardSource.FRIENDSHIP, 5));

    newData.rewardManager.addReward(Currency.UCP, new RewardSourceInstance(RewardSource.QUEST, 100));
    newData.rewardManager.addReward(Currency.SHINY_PACK, new RewardSourceInstance(RewardSource.QUEST, 3));
    newData.rewardManager.addReward(Currency.SUPER_PACK, new RewardSourceInstance(RewardSource.QUEST, 1));
    newData.rewardManager.addReward(Currency.FINAL_PACK, new RewardSourceInstance(RewardSource.QUEST, 1));
    ////////////
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

            data.rewardManager.startTicking();
        }, 1000);
    });
    var container = document.createElement("DIV");
    container.className = "PrettyCards_GameEnd_Content";

    var title = document.createElement("DIV");
    title.className = "PrettyCards_GameEnd_Title " + data.endType.textClass;
    title.innerHTML = window.$.i18n(data.endType.textKey);
    container.appendChild(title);

    container.appendChild(data.rewardManager.container);
    

    backdrop.appendChild(container);
    window.document.body.appendChild(backdrop);
}

prettycards.GameEndTypes = GameEndTypes;
prettycards.displayMatchResults = displayMatchResults;
prettycards.testMatchResults = () => {
    displayMatchResults(transformMatchEndData(
        {
            "action": "getVictory",
            "gameType": "RANKED",
            "disconnected": false,
            "golds": 5944,
            "isDonator": false,
            "oldGold": 5919,
            "oldXp": 5709561,
            "newXp": 5710123,
            "nbLevelPassed": 0,
            "oldJaugeSize": 6000,
            "jaugeSize": 6000,
            "xpUntilNextLevel": 3189,
            "queueGoldBonus": 10,
            "oldDivision": "AMETHYST_I",
            "newDivision": "AMETHYST_I",
            "oldElo": 1775,
            "newElo": 1783,
            "rewardStringKey": "reward-dt-fragment",
            "rewardType": "DTFRAGMENT",
            "rewardQuantity": 4,
            "bonusRewardStringKey": "card",
            "bonusRewardType": "CARD",
            "bonusRewardQuantity": 518,
        }
    ));
};

export {DIVISIONS, getDivisionForElo};