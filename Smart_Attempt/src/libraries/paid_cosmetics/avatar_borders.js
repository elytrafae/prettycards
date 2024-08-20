
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

import { loadCSS } from "../css_loader";
import css from "../../css/AvatarBorders.css";
import { utility } from "../utility";
loadCSS(css);



PrettyCards_plugin.events.on("PrettyCards:onPageLoad", () => {
    //QuerySelectorAddBorderIfExists(".navbar .avatar", "Test");

    // The mobile navbar copies the original navbar, but just in case it's too late . . .
    //QuerySelectorAddBorderIfExists(".PrettyCards_NavBarProfile .avatar", "Test");
});

function QuerySelectorAddBorderIfExists(/** @type {string} */ querySelector, /** @type {string|null} */ borderImg = null) {
    AddBorderIfExists(document.querySelector(querySelector), borderImg);
}

function AddBorderIfExists(/** @type {HTMLElement} */ avatar, /** @type {string|null} */ borderImg = null) {
    if (avatar) {
        AddBorder(WrapAvatar(avatar), borderImg);
    }
}

function WrapAvatar(/** @type {HTMLElement} */ avatar) {
    if (!avatar.src) {
        return avatar;
    }
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

function AddBorder(/** @type {HTMLElement} */ wrappedAvatar, /** @type {string|null} */ borderImg = null) {
    if (!borderImg) {
        return wrappedAvatar;
    }

    var borderURL = `url(${utility.asset("img/AvatarBorders/" + borderImg + ".png")})`;

    var border = document.createElement("DIV");
    border.style.backgroundImage = borderURL;
    border.className = "PrettyCards_AvatarBorder";
    wrappedAvatar.appendChild(border);

    var borderColor = document.createElement("DIV");
    borderColor.className = "PrettyCards_AvatarBorderColor";
    borderColor.style.maskImage = borderURL;
    border.appendChild(borderColor);
    
    wrappedAvatar.classList.add("PrettyCards_AvatarBorderChanged");
    return wrappedAvatar;
}

function RenderImageWithBorder(/** @type {string} */ avatarImgAddr, /** @type {string} */ borderImgAddr = null, /** @type {string} */ rarity = "COMMON") {
    var avatarImg = null;
    var borderImg = null;

    function TrueRender() {
        // Do shit here
    }

    utility.preloadImage(avatarImgAddr).then((avatarImage) => {
        avatarImg = avatarImage;
        if (borderImg) {
            TrueRender();
        }
    });
    utility.preloadImage(utility.asset("img/AvatarBorders/" + borderImgAddr + ".png")).then((borderImage) => {
        borderImg = borderImage;
        if (avatarImg) {
            TrueRender();
        }
    });

}

/*
function AddDeltaRune(wrappedAvatar) {
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
    */