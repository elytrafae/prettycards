
// On second thought, this isn't as great as I thought it would be...

// Please only use this for the purposes of interfaces.

import { Currency } from "./currency";

// JS sucks, I know
class Reward {

    /** @returns {Currency} */
    getCurrency() {
        return null;
    }

    getAmount() {
        return 0;
    }

    canCombineWith(/** @type {Reward} */ other) {
        return false;
    }

    renderIntoTableCell(/** @type {HTMLElement} */ cell, /** @type {HTMLElement} */ row) {

    }

    /** @returns {HTMLElement} */
    renderRewardText() {
        return null;
    }

}

class CommonReward {

    constructor(/** @type {Currency} */ currency, /** @type {number} */ amount) {}

}