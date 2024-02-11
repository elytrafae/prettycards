
import { utility, Pair } from "./utility";
import { Currency } from "./shared_types/currency";
// Unused. Provides no benefit whatsoever
//class Card {
//
//    constructor(/**@type {Object} */ data) {
//        for (var key in data) {
//            this[key] = data[key];
//        }
//    }
//
//}

/*
{
    "status": "success",
    "idCard": 147,
    "reward": "DUST",
    "quantity": 500,
    "claim": 22
}
*/

class CardCollection {

    constructor(/**@type {Array.<Object>} */ cards) {
        /**@type {Array.<Object>} */
        this.cards = [];

        for (var i=0; i < cards.length; i++) {
            var card = cards[i];
            this.cards[card.fixedId || card.id] = {...card};
        }
    }

    /**@returns {Object|null} */
    getCard(/**@type {number} */ id) {
        return this.cards[id] || null;
    }

}

class FriendshipItem {

    static REWARD_LEVELS = 5; // The gap between reward levels
    static MAX_FRIENDSHIP_REWARD_LEVEL = 200;
    //static rewardTypes = ['gold', 'dust', 'pack', 'drPack', 'ucp'];
    //static baseValueRewards = [100, 100, 1, 1, 5];

    constructor(/**@type {Object} */ data) {
        /**@type {number} */
        this.cardId = data.idCard;
        /**@type {number} */
        this.xp = data.xp;
        /**@type {number} */
        this.claim = data.claim;
    }

    /**@returns The number of rewards that can be claimed */
    getCollectableRewardCount() {
        return Math.floor(Math.min(this.getLevel(), FriendshipItem.MAX_FRIENDSHIP_REWARD_LEVEL)/FriendshipItem.REWARD_LEVELS) - this.claim;
    }

    getLevel() {
        return window.getLevel(this.xp);
    }

    render(/**@type {object} */ collectionCard, /**@type {HTMLElement} */ container, /**@type {function} */ func = ($elem, /**@type {FriendshipItem}*/ fi) => {}) {
        var level = this.getLevel();
        var $card = utility.appendCardFriendship(collectionCard, window.$(container), level, this.xp - utility.getXpForLevel(level - 1), window.distanceNextLevel(level));
        func($card, this);
    }

    /**@returns {Promise<Pair<Currency,number>>} */
    claimOnce() {
        return new Promise((resolve, reject) => {
            window.$.post("/FriendshipConfig", JSON.stringify({action: "claim", idCard: this.cardId}), (data) => {
                if (data.status !== "success") {
                    reject(data);
                    return;
                }
                this.claim = data.claim;
                //console.log(data)
                var currency = friendshipRewardStringToCurrency(data.reward);
                if (!currency) {
                    console.warn("UNKNOWN CURRENCY: " + data.reward);
                    reject("UNKNOWN CURRENCY: " + data.reward);
                }
                resolve(new Pair(currency, data.quantity));
            }).error((e) => {
                reject(e);
            });
        });
    }

}

class FriendshipData {

    constructor(/**@type {object} */ data) {
        /**@type {CardCollection} */
        this.collection = new CardCollection(JSON.parse(data.collection));
        /**@type {Array.<FriendshipItem|undefined>} */
        this.friendshipItems = [];

        var fis = JSON.parse(data.friendshipItems);
        for (var i=0; i < fis.length; i++) {
            var fi = fis[i];
            this.friendshipItems[fi.idCard] = new FriendshipItem(fi);
        }
    }

    // Add ClaimAll and RenderAll

    #getItemsAfterFilter(filter = (/**@type FriendshipItem */ item) => {return true;}) {
        var items = [];
        for (var i=0; i < this.friendshipItems.length; i++) {
            var item = this.friendshipItems[i];
            if (item && filter(item)) {
                items.push(item);
            }
        }
        return items;
    }

    renderAll(/**@type {HTMLElement} */ parent, filter = (/**@type FriendshipItem */ item) => {return true;}, func = ($elem, /**@type {FriendshipItem}*/ fi) => {}) {
        var items = this.#getItemsAfterFilter(filter);
        items.sort((a, b) => {return b.xp - a.xp;});

        items.forEach((item) => {
            item.render(this.collection.getCard(item.cardId), parent, func);
        })
    }

    claimAll(callbackPerSuccess = (/**@type {FriendshipItem} */ item, /**@type {Pair<Currency,number>} */ reward) => {}, callbackAtEnd = () => {}) {
        var items = this.#getItemsAfterFilter((item) => {return item.getCollectableRewardCount();});
        var c = 0;
        items.forEach((item) => {
            c += item.getCollectableRewardCount();
        });
        if (c == 0) {
            callbackAtEnd();
            return;
        }
        items.forEach((item) => {
            for (var i=0; i < item.getCollectableRewardCount(); i++) {
                item.claimOnce().then((reward) => {
                    callbackPerSuccess(item, reward);
                }).finally(() => {
                    c--;
                    if (c <= 0) {
                        callbackAtEnd();
                    }
                });
            }
        });
    }



}

/**@returns {Promise.<FriendshipData>} */
function getFriendshipData() {
    return new Promise((resolve, reject) => {
        window.$.getJSON("/FriendshipConfig", {}, (data) => {
            resolve(new FriendshipData(data));
        }).error((e) => {
            reject(e);
        });
    });
}

/**@returns {Currency|null} */
function friendshipRewardStringToCurrency(/**@type {String} */ string) {
    switch (string) {
        case "GOLD": return Currency.GOLD;
        case "DUST": return Currency.DUST;
        case "UCP": return Currency.UCP;
        case "PACK": return Currency.UT_PACK;
        case "DR_PACK": return Currency.DR_PACK;
        case "SHINY_PACK": return Currency.SHINY_PACK;
        default: return null;
    }
}

export {getFriendshipData};