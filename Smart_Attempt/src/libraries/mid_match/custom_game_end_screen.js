
import { loadCSS } from "../css_loader";
import css from "../../css/CustomGameEndScreen.css";
import { PrettyCards_plugin, prettycards, addSetting } from "../underscript_checker";
import { Currency } from "../shared_types/currency";
import { getFriendshipData } from "../friendship_reward_processor";
import { utility, Pair } from "../utility";
import { translationManager } from "../translation/translation_manager";
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

const ELO_BASE = 1100;

const ELO_PER_DIVISION = 30;

const DIVISIONS = [
    "COPPER_III",
    "COPPER_II",
    "COPPER_I",
    "IRON_III",
    "IRON_II",
    "IRON_I",
    "GOLD_III",
    "GOLD_II",
    "GOLD_I",
    "EMERALD_III",
    "EMERALD_II",
    "EMERALD_I",
    "SAPPHIRE_III",
    "SAPPHIRE_II",
    "SAPPHIRE_I",
    "AMETHYST_III",
    "AMETHYST_II",
    "AMETHYST_I",
    "RUBY_III",
    "RUBY_II",
    "RUBY_I",
    "DIAMOND_III",
    "DIAMOND_II",
    "DIAMOND_I",
    "ONYX_III",
    "ONYX_II",
    "ONYX_I",
    "MASTER_III",
    "MASTER_II",
    "MASTER_I",
    "LEGEND"
];

/**@returns {CardCurrency} */
function getOrCreateCardCurrency(/**@type {number} */ cardId) {
    var existedBefore = Currency.CARD_CURRENCIES.has(cardId);
    var currency = Currency.getOrCreateCardCurrency(cardId);
    if (!existedBefore) {
        RewardManager.addCardCurrencyToOrder(currency);
    }
    return currency;
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
        audio.volume = utility.getUnderscriptVolumeSettingValue("sfx");
        audio.src = `https://github.com/elytrafae/prettycards/raw/master/audio/sfx/Rank${startElo < endElo ? "Up" : "Down"}.ogg`;

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
                ELOpart.innerHTML = " (" + (startElo + passedAmount) + ")";
            } else {
                ELOpart.innerHTML = "";
            }
        }
        return data;
    }

}

class GameEndTypes {

    static WIN = new GameEndTypes("game-game-victory", "", "/musics/uty_victory.ogg");
    static LEAVE_WIN = new GameEndTypes("game-game-victory", "", "/musics/dogsong.ogg").setSubtitleFunction(leaveWinSubtitleFunction).setChangeTitleFunction((title) => {return '"' + title + '"';});
    static LOSE = new GameEndTypes("game-game-over", "", "/musics/uty_gameover.ogg");
    static DRAW = new GameEndTypes("pc-game-draw", "", "https://github.com/elytrafae/prettycards/raw/master/audio/bgms/mus_star.ogg").setSubtitleFunction(drawSubtitleFunction);
    static CHARA = new GameEndTypes("game-died", "red", "/musics/toomuch.ogg");

    constructor(/**@type {String} */ textKey, /**@type {String} */ textClass, /**@type {String} */ song) {
        /**@type {String} */
        this.textKey = textKey;
        /**@type {String} */
        this.textClass = textClass;
        /**@type {String} */
        this.songSrc = song;
        /**@type {function} */
        this.subtitleFunction = () => {return document.createElement("DIV");};
        /**@type {function} */
        this.changeTitleFunction = (/**@type {string} */ title) => {return title;};
    }

    /**@returns {GameEndTypes} */
    setSubtitleFunction(/**@type {Function}*/ func) {
        this.subtitleFunction = func;
        return this;
    }

    /**@returns {GameEndTypes} */
    setChangeTitleFunction(/**@type {Function}*/ func) {
        this.changeTitleFunction = func;
        return this;
    }

    /**@returns {HTMLElement} */
    getSubtitle() {
        return this.subtitleFunction();
    }

}

function leaveWinSubtitleFunction() {
    var cont = document.createElement("DIV");
    var img = document.createElement("IMG");
    img.src = "images/annoyingDog.gif";
    cont.appendChild(img.cloneNode());
    var text = document.createElement("SPAN");
    text.innerHTML = " " + window.$.i18n("game-opponent-left") + " ";
    cont.appendChild(text);
    cont.appendChild(img);
    return cont;
}

function drawSubtitleFunction() {
    var text = document.createElement("SPAN");
    text.className = "PrettyCards_BarelyVisibleHallucinationMachine gray";
    text.innerHTML = translationManager.getRandomFromValueList("pc-game-draw-messages");
    setTimeout(() => {
        text.className = "PrettyCards_Transparent";
        text.innerHTML = "Too slow~";
    }, 22000);
    return text;
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
        Currency.CARD_SKIN,
        Currency.PROFILE_SKIN,
        Currency.AVATAR,
        Currency.EMOTE,
        Currency.ELO,
        Currency.XP,
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
    var nr = Math.floor((elo - ELO_BASE)/ELO_PER_DIVISION);
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
        var currency = getOrCreateCardCurrency(rewardCount);
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

    if (data.oldGold) {
        addGoldSources(data, newData.rewardManager);
    }

    var levelUpPair = returnReward(data.rewardType === "CARD" ? data.rewardType : data.rewardStringKey, data.rewardQuantity, newData.rewardManager, RewardSource.LEVELUP);
    var bonusPair = returnReward(data.bonusRewardType === "CARD" ? data.bonusRewardType : data.bonusRewardStringKey, data.bonusRewardQuantity, newData.rewardManager, RewardSource.SPECIAL);

    if (data.newXp && data.oldXp) {
        newData.rewardManager.addReward(Currency.XP, new RewardSourceInstance(RewardSource.MATCH, data.newXp - data.oldXp));
        newData.rewardManager.addBarForCurrency(Currency.XP, BarData.returnXPData(data.oldJaugeSize, data.jaugeSize, data.oldJaugeSize - data.xpUntilNextLevel, levelUpPair, newData.rewardManager, parseInt($('.level').html()) /* Yes, this is how Onu gets the LV */ ));
    }

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
    //newData.rewardManager.addReward(Currency.PROFILE_SKIN, new RewardSourceInstance(RewardSource.QUEST, 1));
    ////////////
    return newData;
}

var landNoise = new Audio();
var collectNoise = new Audio();
landNoise.src = "https://github.com/elytrafae/prettycards/raw/master/audio/sfx/mus_intronoise.ogg";

function displayMatchResults(data) {

    //console.log(data, data.endType, data.endType.textKey, window.$(data.endType.textKey));

    var friendshipData = getFriendshipData();
    var questData = getQuests();

    var bgm = new Audio();
    bgm.volume = utility.getUnderscriptVolumeSettingValue("result");
    bgm.src = data.endType.songSrc;

    collectNoise.volume = utility.getUnderscriptVolumeSettingValue("sfx");
    collectNoise.src = "https://github.com/elytrafae/prettycards/raw/master/audio/sfx/RewardCollect.ogg";

    var leaveRow = document.createElement("DIV");

    var backdrop = document.createElement("DIV");
    window.document.body.appendChild(backdrop);
    backdrop.className = "PrettyCards_GameEnd_Backdrop";
    window.$(backdrop).css("top", -window.innerHeight + "px").animate({"top": "0px"}, 1000, "easeInQuad", () => {
        // anim done
        landNoise.volume = utility.getUnderscriptVolumeSettingValue("sfx");
        landNoise.play();
        setTimeout(() => {
            bgm.loop = true;
            bgm.volume = 0.7;
            bgm.play();

            data.rewardManager.startTicking(() => {
                leaveRow.classList.remove("PrettyCards_Hidden");
                rewardCollectionRows.forEach((row) => {row.classList.remove("PrettyCards_Hidden");});
            });
        }, 1000);
    });
    var container = document.createElement("DIV");
    container.className = "PrettyCards_GameEnd_Content";

    var title = document.createElement("DIV");
    title.className = "PrettyCards_GameEnd_Title " + data.endType.textClass;
    title.innerHTML = data.endType.changeTitleFunction(window.$.i18n(data.endType.textKey));
    container.appendChild(title);

    var subtitle = document.createElement("DIV");
    subtitle.className = "PrettyCards_GameEnd_Subtitle";
    subtitle.appendChild(data.endType.getSubtitle());
    container.appendChild(subtitle);

    container.appendChild(data.rewardManager.container);

    leaveRow.className = "PrettyCards_Hidden PrettyCards_GameEnd_LeaveRow";
    var leaveBtn = document.createElement("BUTTON");
    leaveBtn.className = "btn btn-success";
    leaveBtn.innerHTML = window.$.i18n("pc-game-leave");
    leaveBtn.onclick = () => {window.location = "/Play";};
    leaveRow.appendChild(leaveBtn);
    container.appendChild(leaveRow);

    container.appendChild(createRewardCollectSection(
        "pc-game-friendship-header",
        "pc-game-collect-all",
        "PrettyCards_GameEnd_FriendshipCards",
        (fd, friendshipCards, friendshipContainer, rewardManager) => {
            fd.renderAll(friendshipCards, (fi) => {return fi.getCollectableRewardCount();}, ($elem, fi) => {
                $elem.addClass("friendship-not-claimed");
                $elem.off("click").click(() => {
                    //console.log(fi, fi2);
                    fi.claimOnce().then((pair) => {
                        collectNoise.currentTime = 0;
                        collectNoise.play();
                        rewardManager.addReward(pair.getLeft(), new RewardSourceInstance(RewardSource.FRIENDSHIP, pair.getRight()));
                        if (fi.getCollectableRewardCount() <= 0) {
                            $elem.remove();
                            friendshipContainer.style.display = friendshipCards.children.length > 0 ? "block" : "none";
                        }
                    });
                });
            });
        },
        (fd, friendshipButton, renderFriendship) => {
            fd.claimAll(
                (fi, reward) => {
                    collectNoise.currentTime = 0;
                    collectNoise.play();
                    data.rewardManager.addReward(reward.getLeft(), new RewardSourceInstance(RewardSource.FRIENDSHIP, reward.getRight()));
                },
                () => {
                    renderFriendship(fd);
                    friendshipButton.removeAttribute("disabled");
                }
            );
        },
        friendshipData,
        data.rewardManager
    ));

    container.appendChild(createRewardCollectSection(
        "pc-game-quest-header",
        "pc-game-collect-all",
        "",
        (qd, dump, container, /**@type {RewardManager}*/ rewardManager) => {
            qd.forEach((quest) => {
                if (!quest.claimable) {
                    return;
                }
                var row = document.createElement("DIV");
                row.className = "PrettyCards_GameEnd_QuestRow";

                var progress = quest.progress;
                row.innerHTML = `
                    <div class="PrettyCards_GameEnd_QuestText ${quest.claimable ? "green" : ""}">${quest.name}</div>
                    <div class="PrettyCards_GameEnd_QuestProgress"><progress class="${progress.complete ? "EMERALDBar" : "xpBar"}" value="${progress.value}" max="${progress.max}" style="width: 100px;"></progress> ${progress.value} / ${progress.max}</div>`;


                var rewardCell = document.createElement("DIV");
                row.appendChild(rewardCell);
                var pair = processQuestReward(rewardCell, quest.reward);
                rewardCell.classList.add("PrettyCards_GameEnd_QuestReward");

                var claimCell = document.createElement("DIV");
                claimCell.className = "PrettyCards_GameEnd_QuestClaim";
                var claimButton = document.createElement("BUTTON");
                claimButton.className = "btn btn-success";
                claimButton.innerHTML = window.$.i18n("quests-claim");
                var numberId = parseInt(quest.id);
                if (!isNaN(numberId)) {
                    claimButton.onclick = () => {
                        claimButton.setAttribute("disabled", "true");
                        collectQuestReward(numberId).then((data) => {
                            rewardManager.addReward(pair.getLeft(), new RewardSourceInstance(RewardSource.QUEST, pair.getRight()));
                            row.remove();
                            container.style.display = dump.children.length > 0 ? "block" : "none";
                            collectNoise.currentTime = 0;
                            collectNoise.play();
                        }).catch(() => {
                            claimButton.removeAttribute("disabled");
                            container.style.display = dump.children.length > 0 ? "block" : "none";
                        });
                    }
                }
                claimCell.appendChild(claimButton);
                row.appendChild(claimCell);

                dump.appendChild(row);
            });
        },
        (data, button, renderFunc) => {
            //console.log(button, button.parentElement, .);
            // My code in 2016 be like
            var buttons = button.parentElement.parentElement.querySelectorAll("button.btn.btn-success");
            for (var i=0; i < buttons.length; i++) {
                buttons[i].click();
            }
        },
        questData,
        data.rewardManager
    ));

    backdrop.appendChild(container);
}

function playSound(src) {
    var audio = new Audio();
    audio.volume = utility.getUnderscriptVolumeSettingValue("sfx");
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
            "disconnected": true,
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
            "oldDivision": "AMETHYST_I",
            "newDivision": "AMETHYST_I",
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

prettycards.testMatchResultsDraw = () => {displayMatchResults({
    endType : GameEndTypes.DRAW,
    rewardManager: new RewardManager()
});};

/* I should have planned ahead more for all of this . . .
PrettyCards_plugin.events.on("getVictory getDefeat", function (data) {
    displayMatchResults(transformMatchEndData(data));
});
*/

var customGameEndScreenSetting = addSetting({
    'key': 'custom_game_end',
    'name': 'Custom Game End Screen', // Name in settings page
    'type': 'boolean',
    'refresh': false, // true to add note "Will require you to refresh the page"
    'default': true, // default value
});

var shakeSetting = addSetting({
    'key': 'custom_game_end_death_anim',
    'name': 'Custom Game End Screen: Death Animation', // Name in settings page
    'note': "Should the death animation play with the Custom Game End Screen? I honestly do not know if this should be on or off.",
    'type': 'boolean',
    'refresh': false, // true to add note "Will require you to refresh the page"
    'default': true, // default value
});

var endEvents = ["getVictory", "getDefeat"];
PrettyCards_plugin.events.on("PreGameEvent", function (data) {
    if (!customGameEndScreenSetting.value()) {
        return;
    }
    if (endEvents.includes(data.action)) {
        gameEndHandler(data.action === "getVictory", () => {
            displayMatchResults(transformMatchEndData(data));
        });
        this.canceled = true;
    }
    //
});

function gameEndHandler(didWin, callback) {
    window.music.pause();
    window.musicEnabled = false;
    window.finish = true;
    window.$('.spellPlayed').remove();
    window.$('#enemyMute').remove();
    window.$('#game-history').remove();
    if (window.settingsDialog !== null) { window.settingsDialog.close(); }
    if (window.selectCardDialog !== null) { window.selectCardDialog.close(); }
    if (window.dustpileDialog !== null) { window.dustpileDialog.close(); }
    var shakeElements = [window.$('#user' + (didWin ? window.opponentId : window.userId)), window.$(didWin ? "#enemyAvatar" : "#yourAvatar")];
    if (window.shakeEnabled && shakeSetting.value()) {
        shakeElements.forEach((e) => {
            e.effect("shake");
        });
        setTimeout(() => {
            shakeElements.forEach((e) => {
                e.effect("puff");
            });
            playSound('/sounds/dust.wav');
            setTimeout(() => {
                callback();
            }, 750);
        }, 750);
    } else {
        callback();
    }
}

PrettyCards_plugin.events.on('getError:before getGameError:before', function (data) {
    if (!customGameEndScreenSetting.value()) {
        return;
    }
    // For some reason Onu displays the same message for both cases.
    // However, I want to prepare for when this gets fixed.
    var actualMessage = JSON.parse(JSON.parse(data.message).args)[0];
    console.log(data, actualMessage);
    if (actualMessage != "game-turn-limit" && actualMessage != "game-time-limit") {
        return;
    }
    this.canceled = true;
    displayMatchResults({
        endType : GameEndTypes.DRAW,
        rewardManager: new RewardManager()
    });
});

var rewardCollectionRows = [];

function createRewardCollectSection(titleKey, buttonKey, dumpClassName, renderFunc, claimAllFunc, dataPromise, rewardManager) {
    var container = document.createElement("DIV");
    container.className = "PrettyCards_Hidden";
    container.style.display = "none";
    container.style.marginTop = "30px";
    //container.appendChild(container);

    var header = document.createElement("DIV");
    header.className = "PrettyCards_GameEnd_FriendshipHeader";
    container.appendChild(header);

    var title = document.createElement("DIV");
    title.innerHTML = window.$.i18n(titleKey);
    title.style.fontSize = "2.5em";
    header.appendChild(title);

    var button = document.createElement("BUTTON");
    button.innerHTML = window.$.i18n(buttonKey);
    button.className = "btn btn-primary";
    header.appendChild(button);

    var dump = document.createElement("DIV");
    dump.className = dumpClassName;
    container.appendChild(dump);

    function renderAll(data) {
        dump.innerHTML = "";
        renderFunc(data, dump, container, rewardManager);
        container.style.display = dump.children.length > 0 ? "block" : "none";
    }

    dataPromise.then((data) => {
        button.onclick = function() {
            button.setAttribute("disabled", true);
            claimAllFunc(data, button, renderAll);
        };

        renderAll(data);
    });

    rewardCollectionRows.push(container);
    return container;
}

function getQuests() {
    var questArray = PrettyCards_plugin.quests.getQuests();
    if (questArray && questArray.length > 0) {
        return Promise.resolve(questArray);
    }
    return PrettyCards_plugin.quests.update().then((resData) => resData.quests);
}
var common_rewards = [
    Currency.GOLD,
    Currency.DUST,
    Currency.DTFRAG,
    Currency.UT_PACK,
    Currency.DR_PACK,
    Currency.SHINY_PACK,
    Currency.SUPER_PACK,
    Currency.FINAL_PACK
];

/**@returns {Pair<Currency,number>|null} */
function processQuestReward(/**@type {HTMLElement}*/ rewardCont, reward) {
    //console.log(reward);
    var currency = utility.feildItemsToMyCurrencies(reward.type);
    if (currency === Currency.UCP) {
        rewardCont.innerHTML = window.$.i18n("quests-ucp", reward.reward);
        return new Pair(Currency.UCP, parseInt(reward.reward));
    }

    if (currency && common_rewards.includes(currency)) {
        rewardCont.innerHTML = currency.getCurrencyIcon().outerHTML + '<span class="white">x' + reward.reward + '</span>';
        currency.applyTextClass(rewardCont);
        return new Pair(currency, parseInt(reward.reward));
    }

    if (reward.type === window.underscript.constants.CARD || currency === Currency.CARD_SKIN) {
        //console.log("CARD", reward);
        var data = reward.reward;
        if (typeof(data) == "string") {
            data = {card : data};
        }
        var hoverText = document.createElement("SPAN");
        hoverText.innerHTML = data.name ? data.name : window.$.i18n(`card-name-${data.card}`, 1);
        hoverText.dataset.rewardHoverData = JSON.stringify(data);
        hoverText.className = "cyan";
        rewardCont.appendChild(hoverText);

        var c = Currency.CARD_SKIN;
        if (reward.type === window.underscript.constants.CARD) {
            c = getOrCreateCardCurrency(parseInt(data.card));
        }
        return new Pair(c, 1);
    }

    if (currency === Currency.PROFILE_SKIN) {
        rewardCont.parentElement.style.backgroundImage = 'url(' + reward.reward + ')';
        rewardCont.parentElement.style.backgroundPosition = "center center";
        rewardCont.parentElement.style.backgroundSize = "cover";
        return new Pair(Currency.PROFILE_SKIN, 1);
    };

    if (currency === Currency.AVATAR) {
        rewardCont.innerHTML = `<img class="avatar ${reward.reward.rarity}" src="${reward.reward.image}">`
        return new Pair(Currency.AVATAR, 1);
    };

    console.warn("Unhandled reward type: ", reward.type, reward);

    rewardCont.innerHTML = `???`;
    return null;
}

var nrToSkinClass = [
    "standard-skin",
    "full-skin",
    "breaking-skin"
];

window.underscript.lib.tippy(document.body, {
    target: "[data-reward-hover-data]",
    theme: "undercards",
    animateFill: false,
    onShow(i) {
        var data = JSON.parse(i.reference.dataset.rewardHoverData); // Element this triggered on
        var card = window.appendCard(window.getCard(Number(data.card)), $("<DIV>"));
        if (data.name) {
            //console.log(data);
            var cardImageBG = 'url("' + data.src + '")';
            card.find(".cardImage").css("background-image", cardImageBG);
            card.removeClass("standard-skin").addClass(nrToSkinClass[parseInt(data.type)] || "");
            var cardSkinInfo = data.name + '<br/>' + '<span class="Artist">' + data.author + '</span>';
            card.find(".cardDesc div").html(cardSkinInfo);
        }
        //console.log(card[0], data.type);
        i.setContent(card[0]); // Set to generated card image
    },
});


function collectQuestReward(/**@type {number}*/ id) {
    return new Promise((resolve, reject) => {
        window.$.post("/Quests", {questId: id, dailyQuest: id}, (data) => {
            // Nothing is expected
            resolve(data);
        }).error((e) => {
            reject(e);
        })
    });
}

prettycards.collectQuestReward = collectQuestReward;

export {DIVISIONS, getDivisionForElo};