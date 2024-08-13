
/*
Avatar decoration ideas:
    - Delta Rune
    - Ice Crown
    - Angel
    - Devil
    - Dark Fountain
    - Infernal Wings
*/

import { PrettyCards_plugin } from "../underscript_checker";

import { loadCSS } from "../../libraries/css_loader";
import css from "../../css/AvatarDecorations.css";
loadCSS(css);

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

PrettyCards_plugin.events.on("PrettyCards:onPageLoad", () => {
    var navbarAvatar = document.querySelector(".navbar .avatar");
    if (navbarAvatar) {
        AddDeltaRune(WrapAvatar(navbarAvatar));
    }
});


function AddDeltaRune(/** @type {HTMLElement} */ wrappedAvatar) {
    const classPrefix = "PrettyCards_CommonAvatarDecoComponent PrettyCards_AvatarDeco_DeltaRune";
    var leftWing = document.createElement("DIV");
    leftWing.className = classPrefix + "LeftWing";
    var rightWing = document.createElement("DIV");
    rightWing.className = classPrefix + "RightWing";
    var body = document.createElement("DIV");
    body.className = classPrefix + "Body";
    var triangles = document.createElement("DIV");
    triangles.className = classPrefix + "Triangles";
    wrappedAvatar.append(leftWing, rightWing, body, triangles);
    return wrappedAvatar;
}