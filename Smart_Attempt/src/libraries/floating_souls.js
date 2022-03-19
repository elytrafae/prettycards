
function createFloatingSoul(image, containerClass, leftClass, rightClass) {
    var container = document.createElement("DIV");
    container.className = "PrettyCards_SplitSoul_Container " + containerClass;

    var left = document.createElement("DIV");
    left.className = "PrettyCards_SplitSoul_Left";
    left.innerHTML = `<img src="${image}" class="${leftClass}">`;
    container.appendChild(left);

    var right = document.createElement("DIV");
    right.className = "PrettyCards_SplitSoul_Right";
    right.innerHTML = `<img src="${image}" class="${rightClass}">`;
    container.appendChild(right);

    return container;
}

export {createFloatingSoul}