import {utility} from "/src/libraries/utility.js";

/** @returns {HTMLImageElement} */
function getImage(image) {
    if (typeof image === 'string') {
        return utility.getArtifactImage(image);
    }
    return image.cloneNode();
}

function createFloatingSoul(/**@type {HTMLImageElement}*/ image, containerClass, leftClass, rightClass, isBig = false) {
    console.log(image, containerClass, leftClass, rightClass, isBig);
    var container = document.createElement("DIV");
    container.className = "PrettyCards_SplitSoul_Container " + (isBig ? "PrettyCards_SplitSoul_Big " : "") + String(containerClass);

    var left = document.createElement("DIV");
    left.className = "PrettyCards_SplitSoul_Left";
    var leftImage = getImage(image);
    leftImage.className += leftClass;
    left.appendChild(leftImage.cloneNode());
    container.appendChild(left);

    var right = document.createElement("DIV");
    right.className = "PrettyCards_SplitSoul_Right";
    var rightImage = getImage(image);
    rightImage.className += rightClass;
    right.appendChild(rightImage);
    container.appendChild(right);

    return container;
}

export {createFloatingSoul}