
import { prettycards } from "../underscript_checker";

// The main idea is that once we have allCards, the server doesn't need to send the entire card every time.
// Instead, it can simply only send an ID and what changed relative to allCards
// This will save a bunch of data outside of games, and can help during them, too!

// This is a helper function, a strict equals function to 
// make me able to compare objects by value instead of by refernce.
// IMPORTANT: CANNOT HANDLE RECURSIVE REFERENCES!
function equalCheck(o1, o2) {
    if (typeof(o1) !== typeof(o2)) {
        return false;
    }
    if (typeof(o1) !== "object") {
        return o1 === o2;
    }
    for (var key in o1) {
        if (!equalCheck(o1[key], o2[key])) {
            return false;
        }
    }
    return true;
}

function minifyCard(cardData) {
    var fixedId = cardData.fixedId;
    var id = cardData.id;
    var baseCard = window.getCard(fixedId || id);
    if (!baseCard) {
        return cardData;
    }
    var newData = {};
    for (var key in cardData) {
        if (!equalCheck(cardData[key], baseCard[key])) {
            newData[key] = cardData[key];
        }
    }
    if (id) {
        newData.id = id;
    }
    if (fixedId) {
        newData.fixedId = fixedId;
    }
    return newData;
}

function optimizeCardArray(cardArray) {
    for (var i=0; i < cardArray.length; i++) {
        cardArray[i] = minifyCard(cardArray[i]);
    }
}

// Not really good, but it'll do for now
function isCardArray(array = []) {
    if (array.length <= 0) {
        return;
    }
    return array[0].extension;
}

function fetchAndOptimizeCards(command, keepOnuStrings = true) {
    $.getJSON("/" + command, {}, (data) => {
        var origSize = JSON.stringify(data).length;
        for (var key in data) {
            var onustring = false;
            if (typeof(data[key]) === "string") {
                data[key] = JSON.parse(data[key]);
                onustring = true;
            }
            if (isCardArray(data[key])) {
                optimizeCardArray(data[key]);
            }
            if (keepOnuStrings && onustring) {
                data[key] = JSON.stringify(data[key]);
            }
        }
        var optimizedSize = JSON.stringify(data).length;
        console.log("Minified Data: ", data);
        console.log("Original Size: ", origSize);
        console.log("Improved Size: ", optimizedSize);
        console.log(`The improved version is %c${optimizedSize/origSize*100}%c\% of the original size!`, "color: #e000d9;", "");
    })
}

prettycards.concepts.optimization = {};
prettycards.concepts.optimization.minifyCard = minifyCard;
prettycards.concepts.optimization.fetchAndOptimizeCards = fetchAndOptimizeCards;