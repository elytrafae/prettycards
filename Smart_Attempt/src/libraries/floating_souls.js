
function createFloatingSoul(image, containerClass, leftClass, rightClass, isBig = false, backupImage = null) {
    var container = document.createElement("DIV");
    container.className = "PrettyCards_SplitSoul_Container " + (isBig ? "PrettyCards_SplitSoul_Big " : "") + containerClass;

    var left = document.createElement("DIV");
    left.className = "PrettyCards_SplitSoul_Left";
    var leftImage = document.createElement("IMG");
    leftImage.className = leftClass;
    if (backupImage) {
        leftImage.onerror = () => {
            leftImage.onerror = () => {};
            leftImage.src = backupImage;
        }
    }
    leftImage.src = image;
    left.appendChild(leftImage);
    container.appendChild(left);

    var right = document.createElement("DIV");
    right.className = "PrettyCards_SplitSoul_Right";
    var rightImage = document.createElement("IMG");
    rightImage.className = rightClass;
    if (backupImage) {
        rightImage.onerror = () => {
            rightImage.onerror = () => {};
            rightImage.src = backupImage;
        }
    }
    rightImage.src = image;
    right.appendChild(rightImage);
    container.appendChild(right);

    return container;
}

export {createFloatingSoul}