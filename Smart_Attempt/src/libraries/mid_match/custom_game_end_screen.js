
import { loadCSS } from "../css_loader";
import css from "../../css/CustomGameEndScreen.css";
import { PrettyCards_plugin, prettycards } from "../underscript_checker";
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

/**@template L,R */
class Pair {
    
    constructor(/**@type {L} */ left, /**@type {R} */ right) {
        /**@type {L} */
        this.left = left;
        /**@type {R} */
        this.right = right;
    }

    getLeft() {
        return this.left;
    }

    getRight() {
        return this.right;
    }

}

class BarData {

    constructor(/**@type {number} */ firstSize, /**@type {number} */ secondSize, /**@type {number} */ startValue, /**@type {String} */ firstClass, /**@type {String} */ secondClass) {
        /**@type {number} */ 
        this.firstSize = firstSize;
        /**@type {number} */ 
        this.secondSize = secondSize;
        /**@type {number} */ 
        this.startValue = startValue;
        /**@type {String} */ 
        this.firstClass = firstClass;
        /**@type {String} */ 
        this.secondClass = secondClass;
        /**@type {String} */
        this.firstTextClass = "PrettyCards_Hidden";
        /**@type {String} */
        this.secondTextClass = "PrettyCards_Hidden";

        /**@type {HTMLElement} */
        this.container = document.createElement("DIV");
        this.container.style.position = "relative";

        /**@type {HTMLElement} */
        this.bar = document.createElement("PROGRESS");
        this.bar.classList.add(this.firstClass);
        this.bar.setAttribute("min", 0);
        this.bar.setAttribute("max", this.firstSize);
        this.bar.setAttribute("value", this.startValue);

        /**@type {HTMLElement} */
        this.barText = document.createElement("DIV");
        this.barText.classList.add(this.firstTextClass);
        this.barText.className = "PrettyCards_GameEnd_BarText";

        this.container.appendChild(this.bar);
        this.container.appendChild(this.barText);

        /**@type {boolean} */
        this.didTipOver = false;
        /**@type {Function} */
        this.tipOverFunction = () => {};

        /**@type {boolean} */
        this.customRow = false;
        /**@type {HTMLElement} */
        this.customRowElement = document.createElement("DIV");
        /**@type {function} */
        this.customRowFunction = () => {}
    }

    /**@returns {BarData} */
    setTextClasses(/**@type {String} */ firstTextClass, /**@type {String} */ secondTextClass) {
        this.barText.classList.remove(this.firstTextClass);
        this.barText.classList.add(firstTextClass);

        this.firstTextClass = firstTextClass;
        this.secondTextClass = secondTextClass;
        return this;
    }

    /**@returns {boolean} */
    hasCustomRow() {
        return this.customRow;
    }

    updateCustomRow(/**@type {number} */ passedAmount) {
        this.customRowFunction(passedAmount);
    }

    updateBar(/**@type {number} */ passedAmount) {
        var newValue = this.startValue + passedAmount;
        var newDisplayedValue = newValue;
        var usingSecondData = false;

        if (newDisplayedValue >= this.firstSize) {
            newDisplayedValue -= this.firstSize;
            usingSecondData = true;
        }
        if (newDisplayedValue < 0) {
            newDisplayedValue += this.secondSize;
            usingSecondData = true;
        }
        if (usingSecondData && !this.didTipOver) {
            this.didTipOver = true;
            this.bar.classList.remove(this.firstClass);
            this.bar.classList.add(this.secondClass);
            this.barText.classList.remove(this.firstTextClass);
            this.barText.classList.add(this.secondTextClass);
            this.bar.setAttribute("max", this.secondSize);
            this.onTipOver();
        }

        this.barText.innerHTML = newDisplayedValue + "/" + this.bar.getAttribute("max");
        this.bar.setAttribute("value", newDisplayedValue);
    }

    onTipOver() {
        // TODO: Add level-up/rank change code
        this.tipOverFunction();
    }

    static returnEmpty() {
        return new BarData(0, 0, 0, "PrettyCards_Hidden", "PrettyCards_Hidden");
    }

    static returnXPData(/**@type {number} */ firstSize, /**@type {number} */ secondSize, /**@type {number} */ startValue, /**@type {Pair.<Currency,RewardSourceInstance>} */ reward, /**@type {RewardManager} */ manager, /**@type {number} */ lv) {
        var data = new BarData(firstSize, secondSize, startValue, "xpBar", "xpBar");
        data.setTextClasses("PrettyCards_XPBarText", "PrettyCards_XPBarText");

        var separator = document.createElement("SPAN");

        data.tipOverFunction = () => {
            playSound("/sounds/levelUp.wav");
            lv++;
            separator.innerHTML = window.$.i18n("pc-game-levelup");
            separator.className = "GOLD_NEON";
            if (reward) {
                manager.addReward(reward.getLeft(), reward.getRight());
            }
        }
        data.customRow = true;
        var LVpart = document.createElement("SPAN");
        data.customRowElement.appendChild(LVpart);
        
        separator.style.width = "180px";
        separator.style.display = "inline-block";
        data.customRowElement.appendChild(separator);
        var XPpart = document.createElement("SPAN");
        data.customRowElement.appendChild(XPpart);
        data.customRowFunction = (passedAmount) => {
            LVpart.innerHTML = "LV " + lv;
            XPpart.innerHTML = "+ " + passedAmount + " XP";
        }
        return data;
    }

    static returnEloData(/**@type {number} */ startValue, /**@type {number} */ startElo, /**@type {number} */ endElo, /**@type {String} */ startDivision, /**@type {String} */ endDivision) {
        var startArena = startDivision.split("_")[0];
        var endArena = endDivision.split("_")[0];
        var startClass = startArena === "LEGEND" ? "PrettyCards_Hidden" : (startArena + "Bar");
        var endClass = endArena === "LEGEND" ? "PrettyCards_Hidden" : (endArena + "Bar");
        var data = new BarData(ELO_PER_DIVISION, ELO_PER_DIVISION, startValue, startClass, endClass);
        data.setTextClasses(startArena === "LEGEND" ? "PrettyCards_Hidden" : (startArena + "_NEON"), endArena === "LEGEND" ? "PrettyCards_Hidden" : (endArena + "_NEON"));
        
        // I'm not using "playSound" here because I want to pre-load the sound.
        var audio = new Audio();
        audio.src = `https://github.com/CMD-God/prettycards/raw/master/audio/sfx/Rank${startElo < endElo ? "Up" : "Down"}.ogg`;

        var divisionPart = document.createElement("SPAN");
        data.tipOverFunction = () => {
            if (startDivision !== endDivision) {
                audio.play();
                divisionPart.innerHTML = window.$.i18n("{{DIVISION:" + endDivision + "}}");
            }
        }

        data.customRow = true;
        divisionPart.style.fontSize = "1.4em";
        divisionPart.innerHTML = window.$.i18n("{{DIVISION:" + startDivision + "}}");
        data.customRowElement.appendChild(divisionPart);
        //var separator = document.createElement("SPAN");
        //separator.innerHTML = " ";
        //data.customRowElement.appendChild(separator);
        var ELOpart = document.createElement("SPAN");
        ELOpart.className = "LEGEND_NEON";
        data.customRowElement.appendChild(ELOpart);
        data.customRowFunction = (passedAmount) => {
            var arena = data.didTipOver ? endArena : startArena;
            if (arena === "LEGEND") {
                ELOpart.innerHTML = " (" + passedAmount + ")";
            } else {
                ELOpart.innerHTML = "";
            }
        }
        return data;
    }

}

class Currency {

    static GOLD = new Currency("yellow", () => {return window.$('<img src="images/icons/gold.png">')[0]}, Currency.speedFunction(100, 5, 500));
    static UCP = new Currency("ucp", () => {return window.$(`<span>${window.$.i18n("reward-ucp")}</span>`)[0]}, Currency.speedFunction(200, 10, 200));
    static DUST = new Currency("gray", () => {return window.$('<img src="images/icons/dust.png">')[0]}, Currency.speedFunction(100, 5, 500));
    static DTFRAG = new Currency("DTFragment", () => {return window.$('<img src="images/dtFragment.png">')[0]}, Currency.speedFunction(500, 100, 10));
    static XP = new Currency("PrettyCards_UserLV", () => {return window.$('<span>XP</span>')[0]}, Currency.speedFunction(50, 5, 3000), "0.8em").setCountPerTick(5);
    static ELO = new Currency("Contributor", () => {return window.$('<span>ELO</span>')[0]}, Currency.speedFunction(50, 5, ELO_PER_DIVISION), "0.8em");

    static UT_PACK = new Currency("", () => {return window.$('<img src="images/icons/pack.png">')[0]}, Currency.speedFunction(250, 100, 50));
    static DR_PACK = new Currency("", () => {return window.$('<img src="images/icons/drPack.png">')[0]}, Currency.speedFunction(250, 100, 50));
    static SHINY_PACK = new Currency("rainbowText", () => {return window.$('<img src="images/icons/shinyPack.gif">')[0]}, Currency.speedFunction(200, 100, 25));
    static SUPER_PACK = new Currency("yellow", () => {return window.$('<img src="images/icons/superPack.gif">')[0]}, Currency.speedFunction(500, 200, 25));
    static FINAL_PACK = new Currency("DTFragment", () => {return window.$('<img src="images/icons/finalPack.gif">')[0]}, Currency.speedFunction(500, 200, 25));

    static CARD_SKIN = new Currency("", () => {return window.$(`<span>${window.$.i18n("reward-card-skin")}</span>`)[0]}, Currency.speedFunction(500, 200, 25));
    static PROFILE_SKIN = new Currency("", () => {return window.$(`<span>${window.$.i18n("reward-profile-skin")}</span>`)[0]}, Currency.speedFunction(500, 200, 25));
    static AVATAR = new Currency("", () => {return window.$(`<span>${window.$.i18n("reward-avatar")}</span>`)[0]}, Currency.speedFunction(500, 200, 25));
    static EMOTE = new Currency("", () => {return window.$(`<span>${window.$.i18n("reward-emote")}</span>`)[0]}, Currency.speedFunction(500, 200, 25));

    /**@type {Map.<number,CardCurrency>} */
    static CARD_CURRENCIES = new Map();

    // TODO: Add Currencies for cosmetics, too, similar to cards. They definitely be obtained from quests.
    // Note to self: This whole thing became FAR bigger than initially anticipated

    constructor(/**@type {String} */ textClass, /**@type {Function} */ icon, /**@type {Function} */ speed, /**@type {String} */ padding = "0") {
        /**@type {String} */ 
        this.textClass = textClass;
        /**@type {Function} */
        this.icon = icon;
        /**@type {Function} */
        this.speed = speed;
        /**@type {number} */
        this.countPerTick = 1;
        /**@type {number} */
        this.padding = padding;
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
    static LEVELUP = new RewardSource("levelup", "arrow-up");
    static QUEST = new RewardSource("quest", "calendar");
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
        /**@type {HTMLElement} */
        this.iconElement = document.createElement("SPAN");

        this.container.className = "PrettyCards_GameEnd_RewardSourceContainer PrettyCards_Hidden";
        this.iconElement.className = `glyphicon glyphicon-${this.source.iconName}`;
        this.iconElement.appendChild(returnTooltip(window.$.i18n(`pc-rewardsource-${source.id}`)));

        this.container.appendChild(this.amountElement);
        this.container.appendChild(document.createTextNode(" "));
        this.container.appendChild(this.iconElement);
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
        if (this.amount < 0) {
            return this.passedAmount <= this.amount;
        }
        return this.passedAmount >= this.amount;
    }

    tick(/**@type {number} */ count) {
        if (this.amount > 0) {
            this.passedAmount = Math.min(this.passedAmount + count, this.amount);
        } else {
            this.passedAmount = Math.max(this.passedAmount - count, this.amount);
        }
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
        this.container.style.padding = this.currency.padding;

        /**@type {HTMLElement} */
        this.breakdownContainer = document.createElement("DIV");

        /**@type {HTMLElement} */
        this.customContainer = document.createElement("DIV");
        this.customContainer.className = "PrettyCards_GameEnd_RewardRow PrettyCards_Hidden";

        this.breakdownContainer.classList.add("PrettyCards_Hidden");
        this.breakdownContainer.classList.add("PrettyCards_GameEnd_RewardRow");

        /**@type {HTMLElement} */
        this.totalAmountElement = document.createElement("SPAN");
        /**@type {HTMLElement} */
        this.instanceContainer = document.createElement("SPAN");
        /**@type {HTMLElement} */
        this.barContainer = document.createElement("DIV");
        this.barContainer.className = "PrettyCards_GameEnd_BarRow PrettyCards_Hidden";

        /**@type {BarData} */
        this.barData;
        this.setBarData(BarData.returnEmpty());

        this.breakdownContainer.innerHTML = "+ ";
        this.breakdownContainer.appendChild(this.totalAmountElement);
        this.breakdownContainer.appendChild(document.createTextNode(" "));
        this.breakdownContainer.appendChild(this.currency.getCurrencyIcon());
        this.breakdownContainer.appendChild(document.createTextNode(" ("));
        this.breakdownContainer.appendChild(this.instanceContainer);
        this.breakdownContainer.appendChild(document.createTextNode(" )"));

        this.container.appendChild(this.breakdownContainer);
        this.container.appendChild(this.customContainer);
        this.container.appendChild(this.barContainer);
    }

    setBarData(/**@type {BarData} */ barData) {
        if (this.barData) {
            this.barContainer.removeChild(this.barData.container);
            this.customContainer.removeChild(this.barData.customRowElement);
        }
        this.barData = barData;
        this.barContainer.appendChild(this.barData.container);
        this.customContainer.appendChild(this.barData.customRowElement);
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
            this.barContainer.classList.remove("PrettyCards_Hidden");
            this.barData.updateBar(totalDisplayedAmount);
            // Keeping this if statement because the else clause is important to only be on else.
            if (this.barData.customRow) {
                this.barData.updateCustomRow(totalDisplayedAmount);
                this.customContainer.classList.remove("PrettyCards_Hidden");
            } else {
                this.breakdownContainer.classList.remove("PrettyCards_Hidden");
            }
            
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
        Currency.CARD_SKIN,
        Currency.PROFILE_SKIN,
        Currency.AVATAR,
        Currency.EMOTE,
    ];

    constructor() {
        /**@type {Map.<Currency,RewardRow>} */
        this.rows = new Map();
        /**@type {HTMLElement} */
        this.container = document.createElement("DIV");
        /**@type {boolean} */
        this.alreadyStartedTicking = false;
    }

    static getCurrencyOrder() {
        return RewardManager.#ORDER;
    }

    addReward(/**@type {Currency} */ currency, /**@type {RewardSourceInstance} */ inst, /**@type {boolean} */ front = false) {
        var newRow = !this.rows.has(currency);
        if (newRow) {
            var row = new RewardRow(currency);
            this.#appendContainer(row);
            this.rows.set(currency, row);
        }
        var row = this.rows.get(currency);
        row.addInstance(inst, front);
        if (newRow && this.alreadyStartedTicking) {
            row.tick();
        }
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

    startTicking(/**@type {Function} */ cb = () => {}) {
        this.alreadyStartedTicking = true;
        var j=0;
        for (var i=0; i < RewardManager.#ORDER.length; i++) {
            var currency = RewardManager.#ORDER[i];
            if (this.rows.has(currency)) {
                var row = this.rows.get(currency);
                setTimeout(row.tick.bind(row), j*800);
                j++;
            }
        }
        setTimeout(cb, j*800);
    }

    addBarForCurrency(/**@type {Currency} */ currency, /**@type {BarData} */ data) {
        if (!this.rows.has(currency)) {
            return;
        }
        this.rows.get(currency).setBarData(data);
    }

    static addCardCurrencyToOrder(/**@type {CardCurrency} */ currency) {
        RewardManager.#ORDER.splice(4, 0, currency); // 4 is the index. This should put it right after DT FRAGS
    }

}

function getDivisionForElo(elo) {
    var nr = Math.floor((elo - 1200)/ELO_PER_DIVISION);
    return DIVISIONS[Math.min(nr, DIVISIONS.length-1)];
}

function getDivisionStart(elo) {
    return (Math.floor(elo/ELO_PER_DIVISION))*ELO_PER_DIVISION;
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

/**@returns {Pair.<Currency,RewardSourceInstance>|null} */
function returnReward(/**@type {String} */ rewardType, /**@type {number} */ rewardCount, /**@type {RewardManager} */ rewardManager, /**@type {RewardSource} */ source) {
    if (!rewardType) {
        return null;
    }
    if (rewardType === 'CARD') {
        // Yes, in case of cards, Onu uses the count as the ID, and the count is always 1.
        var currency = Currency.getOrCreateCardCurrency(rewardCount);
        return new Pair(currency, new RewardSourceInstance(source, 1));
    }
    var currency = getCurrencyFromTypeString(rewardType);
    if (!currency) {
        console.warn("Could not find Currency type for string ", rewardType);
        return null;
    }
    return new Pair(currency, new RewardSourceInstance(source, rewardCount));
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
        case "avatar": return Currency.AVATAR;
        case "card-skin": return Currency.CARD_SKIN;
        case "profile-skin": return Currency.PROFILE_SKIN;
        case "emote": return Currency.EMOTE;
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

    var levelUpPair = returnReward(data.rewardType === "CARD" ? data.rewardType : data.rewardStringKey, data.rewardQuantity, newData.rewardManager, RewardSource.LEVELUP);
    var bonusPair = returnReward(data.bonusRewardType === "CARD" ? data.bonusRewardType : data.bonusRewardStringKey, data.bonusRewardQuantity, newData.rewardManager, RewardSource.SPECIAL);

    newData.rewardManager.addReward(Currency.XP, new RewardSourceInstance(RewardSource.MATCH, data.newXp - data.oldXp));
    newData.rewardManager.addBarForCurrency(Currency.XP, BarData.returnXPData(data.oldJaugeSize, data.jaugeSize, data.oldJaugeSize - data.xpUntilNextLevel, levelUpPair, newData.rewardManager, parseInt($('.level').html()) /* Yes, this is how Onu gets the LV */ ));
    if (data.oldElo && data.newElo) {
        newData.rewardManager.addReward(Currency.ELO, new RewardSourceInstance(RewardSource.MATCH, data.newElo - data.oldElo));
        var minEloDivision = getDivisionStart(data.oldElo);
        newData.rewardManager.addBarForCurrency(Currency.ELO, BarData.returnEloData(data.oldElo - minEloDivision, data.oldElo, data.newElo, data.oldDivision, data.newDivision));
    }
    
    if (bonusPair) {
        newData.rewardManager.addReward(bonusPair.getLeft(), bonusPair.getRight());
    }

    // Test code
    /*
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
    */
    ////////////
    return newData;
}

var landNoise = new Audio();
landNoise.src = "https://github.com/CMD-God/prettycards/raw/master/audio/sfx/mus_intronoise.ogg";

function displayMatchResults(data) {
    //console.log(data, data.endType, data.endType.textKey, window.$(data.endType.textKey));

    var bgm = new Audio();
    bgm.src = data.endType.songSrc;

    var leaveRow = document.createElement("DIV");

    var backdrop = document.createElement("DIV");
    backdrop.className = "PrettyCards_GameEnd_Backdrop";
    window.$(backdrop).css("top", -window.innerHeight + "px").animate({"top": "0px"}, 1000, "easeInQuad", () => {
        // anim done
        landNoise.play();
        setTimeout(() => {
            bgm.loop = true;
            bgm.play();

            data.rewardManager.startTicking(() => {
                leaveRow.classList.remove("PrettyCards_Hidden");
            });
        }, 1000);
    });
    var container = document.createElement("DIV");
    container.className = "PrettyCards_GameEnd_Content";

    var title = document.createElement("DIV");
    title.className = "PrettyCards_GameEnd_Title " + data.endType.textClass;
    title.innerHTML = window.$.i18n(data.endType.textKey);
    container.appendChild(title);

    container.appendChild(data.rewardManager.container);

    leaveRow.className = "PrettyCards_Hidden PrettyCards_GameEnd_LeaveRow";
    var leaveBtn = document.createElement("BUTTON");
    leaveBtn.className = "btn btn-success";
    leaveBtn.innerHTML = window.$.i18n("pc-game-leave");
    leaveBtn.onclick = () => {window.location = "/Play";};
    leaveRow.appendChild(leaveBtn);
    container.appendChild(leaveRow);

    backdrop.appendChild(container);
    window.document.body.appendChild(backdrop);
}

function playSound(src) {
    var audio = new Audio();
    audio.src = src;
    audio.play();
}

function returnTooltip(/**@type {String} */ text) {
    var container = document.createElement("DIV");
    var textElem = document.createElement("DIV");
    var arrowElem = document.createElement("DIV");
    textElem.innerHTML = text;

    container.className = "PrettyCards_GameEnd_Tooltip";
    textElem.className = "PrettyCards_GameEnd_TooltipText";
    arrowElem.className = "PrettyCards_GameEnd_TooltipArrow";

    container.appendChild(textElem);
    container.appendChild(arrowElem);
    return container;
}

prettycards.GameEndTypes = GameEndTypes;
prettycards.displayMatchResults = displayMatchResults;
prettycards.testMatchResults = () => {
    displayMatchResults(transformMatchEndData(
        {
            "action": "getVictory",
            //"action": "getDefeat",
            "gameType": "RANKED",
            "disconnected": false,
            "golds": 5944,
            "isDonator": false,
            "oldGold": 5919,
            "oldXp": 5709561,
            "newXp": 5713123,
            "nbLevelPassed": 0,
            "oldJaugeSize": 6000,
            "jaugeSize": 6000,
            "xpUntilNextLevel": 3189,
            "queueGoldBonus": 10,
            //"oldDivision": "AMETHYST_I",
            //"newDivision": "AMETHYST_I",
            "oldDivision": "LEGEND",
            "newDivision": "LEGEND",
            "oldElo": 1888,
            "newElo": 1900,
            "rewardStringKey": "reward-dt-fragment",
            "rewardType": "DTFRAGMENT",
            "rewardQuantity": 4,
            "bonusRewardStringKey": "card",
            "bonusRewardType": "CARD",
            "bonusRewardQuantity": 518,
        }
    ));
};

/* I should have planned ahead more for all of this . . .
PrettyCards_plugin.events.on("getVictory getDefeat", function (data) {
    displayMatchResults(transformMatchEndData(data));
});
*/

var endEvents = ["getVictory", "getDefeat"];
PrettyCards_plugin.events.on("PreGameEvent", function (data) {
    console.log(data);
    if (endEvents.includes(data.action)) {
        displayMatchResults(transformMatchEndData(data));
        this.canceled = true;
    }
    //
});


export {DIVISIONS, getDivisionForElo};