
function WrapAvatar(/** @type {HTMLElement} */ avatar) {
    var div = document.createElement("DIV");
    if (avatar.parentNode) {
        avatar.after(div);
    }
    div.appendChild(avatar);
    div.className = avatar.className;
    div.classList.add("PrettyCards_AvatarWrapper");
    avatar.className = "PrettyCards_ActualAvatarImage";
    return div;
}

