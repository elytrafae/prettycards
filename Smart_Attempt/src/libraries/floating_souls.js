import {utility} from "/src/libraries/utility.js";

/** @returns {HTMLImageElement} */
function getImageClone(image) {
    // Made by feildmaster
    if (typeof image === 'string') { // Temporary fix - elytrafae
        return utility.getArtifactImage(image);
    }
    var newImage = image.cloneNode();
    newImage.onerror = image.onerror;
    return newImage;
}

function createFloatingSoul(/**@type {HTMLImageElement}*/ image, containerClass, leftClass, rightClass, isBig = false) {
    console.log(image, containerClass, leftClass, rightClass, isBig);
    var container = document.createElement("DIV");
    container.className = "PrettyCards_SplitSoul_Container " + (isBig ? "PrettyCards_SplitSoul_Big " : "") + String(containerClass);

    var left = document.createElement("DIV");
    left.className = "PrettyCards_SplitSoul_Left";
    var leftImage = getImageClone(image);
    leftImage.className += leftClass;
    left.appendChild(leftImage);
    container.appendChild(left);

    var right = document.createElement("DIV");
    right.className = "PrettyCards_SplitSoul_Right";
    var rightImage = getImageClone(image);
    rightImage.className += rightClass;
    right.appendChild(rightImage);
    container.appendChild(right);

    return container;
}

export {createFloatingSoul}