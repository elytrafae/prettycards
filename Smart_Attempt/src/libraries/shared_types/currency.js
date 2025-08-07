const ELO_PER_DIVISION = 25;

class Currency {

    static GOLD = new Currency("yellow", () => {return window.$('<img src="images/icons/gold.png">')[0]}, Currency.speedFunction(75, 5, 500)).setCountPerTick(5);
    static UCP = new Currency("ucp", () => {return window.$(`<span>${window.$.i18n("reward-ucp")}</span>`)[0]}, Currency.speedFunction(100, 10, 200));
    static DUST = new Currency("gray", () => {return window.$('<img src="images/icons/dust.png">')[0]}, Currency.speedFunction(75, 5, 500)).setCountPerTick(5);
    static DTFRAG = new Currency("DTFragment", () => {return window.$('<img src="images/dtFragment.png">')[0]}, Currency.speedFunction(500, 100, 10));
    static XP = new Currency("PrettyCards_UserLV", () => {return window.$('<span>XP</span>')[0]}, Currency.speedFunction(30, 5, 3000), "0.8em").setCountPerTick(10);
    static ELO = new Currency("Contributor", () => {return window.$('<span>ELO</span>')[0]}, Currency.speedFunction(50, 5, ELO_PER_DIVISION), "0.8em");

    static UT_PACK = new Currency("", () => {return window.$('<img src="images/icons/pack.png">')[0]}, Currency.speedFunction(250, 100, 50));
    static DR_PACK = new Currency("", () => {return window.$('<img src="images/icons/drPack.png">')[0]}, Currency.speedFunction(250, 100, 50));
    static UTY_PACK = new Currency("", () => {return window.$('<img src="images/icons/utyPack.png">')[0]}, Currency.speedFunction(250, 100, 50));
    static SHINY_PACK = new Currency("rainbowText", () => {return window.$('<img src="images/icons/shinyPack.png">')[0]}, Currency.speedFunction(200, 100, 25));
    static SUPER_PACK = new Currency("yellow", () => {return window.$('<img src="images/icons/superPack.png">')[0]}, Currency.speedFunction(500, 200, 25));
    static FINAL_PACK = new Currency("DTFragment", () => {return window.$('<img src="images/icons/finalPack.png">')[0]}, Currency.speedFunction(500, 200, 25));

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
            // Had to take this line out because this can't see the Reward Manager.
            // There is a dupe function where it's needed!
            //RewardManager.addCardCurrencyToOrder(currency);
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

export {Currency, CardCurrency};