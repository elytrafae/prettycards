
// The data is copy-pasted and adapted from play.js
// var rewardTypes = ['gold', 'pack', 'drPack', 'utyPack', 'superPack', 'gold', 'pack', 'drPack', 'utyPack', 'dtFragment', 'ucp', 'ucp', 'ucp', 'ucp', 'ucp', 'ucp', 'ucp', 'ucp', 'ucp', 'ucp'];
// var rewardValues = [1000, 10, 10, 10, 1, 2000, 20, 20, 20, 1, 10, 10, 15, 15, 20, 20, 25, 25, 30, 30];

import { friendshipRewardStringToCurrency } from "./friendship_reward_processor";
import { Currency } from "./shared_types/currency";
import { Pair } from "./utility";

const RANKED_REWARD_LEVEL_INTERVAL = 10;

/** @type {Array<Pair<Currency,number>>} */
var rewards = [
    new Pair(Currency.GOLD, 1000),
    new Pair(Currency.UT_PACK, 10),
    new Pair(Currency.DR_PACK, 10),
    new Pair(Currency.UTY_PACK, 10),
    new Pair(Currency.SUPER_PACK, 1),
    new Pair(Currency.GOLD, 2000),
    new Pair(Currency.UT_PACK, 20),
    new Pair(Currency.DR_PACK, 20),
    new Pair(Currency.UTY_PACK, 20),
    new Pair(Currency.DTFRAG, 1),
    new Pair(Currency.UCP, 10),
    new Pair(Currency.UCP, 10),
    new Pair(Currency.UCP, 15),
    new Pair(Currency.UCP, 15),
    new Pair(Currency.UCP, 20),
    new Pair(Currency.UCP, 20),
    new Pair(Currency.UCP, 25),
    new Pair(Currency.UCP, 25),
    new Pair(Currency.UCP, 30),
    new Pair(Currency.UCP, 30),
];

/** @returns {Promise<Pair<Array<Pair<Currency,number>>,number>>} */
function fetchAndProcessRankedRewards() {
    return new Promise((resolve, reject) => {
        window.$.getJSON("/PlayConfig", {}, (data) => {
            if (data.rankedClaim && data.winsRanked) {
                resolve(processWinsAndClaims(data.rankedClaim, data.winsRanked));
            } else {
                reject("Malformed response from server " + data);
            }
        }).error((e) => {
            reject(e);
        });
    });

}

/** @returns {Pair<Array<Pair<Currency,number>>, number>} */
function processWinsAndClaims(/** @type {number} */ claimed, /** @type {number} */ wins) {
    var maxClaim = Math.min(Math.floor(wins / RANKED_REWARD_LEVEL_INTERVAL), rewards.length);
    var arr = [];
    for (var i=claimed; i < maxClaim; i++) {
        arr.push(rewards[i]);
    }
    return new Pair(arr, (claimed+1) * RANKED_REWARD_LEVEL_INTERVAL);
}

/** @returns {Promise<Pair<Currency,number>>} */
function claimNextRankedReward() {
    return new Promise((resolve, reject) => {
        //window.$.get("/Play", {}, (page) => { // Fuck sending only necessary requests, I guess.
            window.$.post("/PlayConfig", `{"action": "claim"}`, (data) => {
                if (data.status === "success") {
                    var currency = friendshipRewardStringToCurrency(data.reward);
                    if (!currency) {
                        reject("Could not parse " + data.reward + " as currency");
                    }
                    resolve(new Pair(currency, data.quantity));
                } else {
                    reject("Maintanance or other error from server " + data);
                }
            }).error((e) => {
                reject(e);
            });
       // }).error((e) => {
        //    reject(e);
        //});
    });
}

export {fetchAndProcessRankedRewards, claimNextRankedReward, RANKED_REWARD_LEVEL_INTERVAL}