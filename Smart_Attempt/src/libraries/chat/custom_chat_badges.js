import { utility } from "../utility";
import {PrettyCards_plugin, settings} from "/src/libraries/underscript_checker.js";
import $ from "/src/third_party/jquery-3.6.0.min.js";

const PC_STAFF_BADGE = {
    id: 220,
    priority: 10,
    name: "PrettyCards_Staff",
    icon: "PC_Staff"
}

const PC_MINISTAFF_BADGE = {
    id: 221,
    priority: 10,
    name: "PrettyCards_MiniStaff",
    icon: "PC_MiniStaff"
}

const PC_OWNER_BADGE = {
    id: 222,
    priority: 10,
    name: "PrettyCards_Owner",
    icon: "PC_Owner"
}

const BADGE_999 = {
    id: 999,
    priority: 15,
    name: "Overachiever",
    icon: "Overachiever"
}

const BADGE_9999 = {
    id: 9999,
    priority: 15,
    name: "Grassless",
    icon: "Grassless"
}

const CUTIE = {
    id: 277,
    priority: 16,
    name: "Cutie",
    icon: "Cutie"
}

class CustomChatBadgeSystem {

    #oldFn;
    chatRoleUserData = {};
    #customBadges = [PC_STAFF_BADGE, PC_MINISTAFF_BADGE, PC_OWNER_BADGE, BADGE_999, BADGE_9999, CUTIE];
    static #INSTANCE = new CustomChatBadgeSystem();

    constructor() {
        this.#initialize();
    }

    static getInstance() {
        return CustomChatBadgeSystem.#INSTANCE;
    }

    #initialize() {
        $.getJSON("https://raw.githubusercontent.com/CMD-God/prettycards/master/json/customChatRoles.json", {}, (data) => {
            this.chatRoleUserData = data;
            PrettyCards_plugin.events.emit.singleton("PrettyCards:customChatRolesData", this.chatRoleUserData);
        })
        
        PrettyCards_plugin.events.on("PrettyCards:onPageLoad", () => {
            utility.loadCSSFromGH("CustomChatBadges");
            this.#oldFn = window.appendMessage;
            window.appendMessage = (chatMessage, idRoom, isPrivate) => {
                this.#processMessage(chatMessage);
                this.#oldFn(chatMessage, idRoom, isPrivate);
                this.#correctCustomIcons(chatMessage, idRoom, isPrivate);
            }
        
        })
    }

    #processMessage(message) {
        var user = message.user;
        if (user.pc_touched) {
            return;
        }
        user.pc_touched = true;
        var staffBadge = null;
        var isMainBadge;
        if (this.#findInChatBadgeList(user.id, "pc_staff")) {
            staffBadge = PC_STAFF_BADGE;
            isMainBadge = user.mainGroup.priority >= 8; // Only set this as the main group if the previous main group is Tester or worse.
        } else if (this.#findInChatBadgeList(user.id, "pc_ministaff")) {
            staffBadge = PC_MINISTAFF_BADGE;
            isMainBadge = false;
        } else if (this.#findInChatBadgeList(user.id, "pc_owner")) {
            staffBadge = PC_OWNER_BADGE;
            isMainBadge = true;
        }
        if (staffBadge) {
            user.groups.push(staffBadge);
            if (isMainBadge) {
                var oldMain = user.groups.find((group) => group.id === user.mainGroup.id);
                if (oldMain) {
                    oldMain.priority = 10;
                }
                user.mainGroup = staffBadge;
            }
            
        }
        if (user.level >= 9999) {
            user.groups.push(BADGE_9999);
        } else if (user.level >= 999) {
            user.groups.push(BADGE_999);
        }
        if (this.#findInChatBadgeList(user.id, "cutie")) {
            user.groups.push(CUTIE);
        }
        user.groups.sort((a, b) => a.priority - b.priority);
    }

    #correctCustomIcons(message, idRoom, isPrivate) {
        var room = isPrivate ? 'chat-private-' + idRoom : 'chat-public-' + idRoom;
        var $chat = $('#' + room);
        var icons = $chat.find("#message-" + message.id).find(".groupIcon");
        for (var i=0; i < icons.length; i++) {
            var icon = icons[i];
            var title = icon.getAttribute("title");
            var badge = this.#customBadges.find((badge) => badge.name == title);
            if (badge) {
                icon.src = this.#getCustomBadgeURL(badge.icon);
            }
        }
    }

    #getCustomBadgeURL(icon) {return `https://raw.githubusercontent.com/CMD-God/prettycards/master/img/ChatBadges/${icon}.png`;}

    #findInChatBadgeList(userId, listName) {
        if (!this.chatRoleUserData[listName]) {
            console.warn("List name", listName, "in", this.chatRoleUserData, "does not exist!");
            return false;
        }
        return this.chatRoleUserData[listName].find((u) => {return u.id === userId});
    }

    getChatBadgeIcon(icon) {
        var customBadge = this.#customBadges.find((badge) => badge.icon == icon);
        if (customBadge) {
            return this.#getCustomBadgeURL(icon);
        } else {
            return `images/${icon}.png`;
        }
    }

    #getCuteFaceForId(id) {
        var badge = this.#findInChatBadgeList(id, "cutie");
        if (badge) {
            return badge.face;
        }
        return null;
    }

    #getStaffBadgeForId(id) {
        return this.#findInChatBadgeList(id, "pc_staff") || this.#findInChatBadgeList(id, "pc_ministaff") || this.#findInChatBadgeList(id, "pc_owner");  
    }

    #getStaffCreditForId(id) {
        var badge = this.#getStaffBadgeForId(id);
        if (badge) {
            return badge.credit;
        }
        return null;
    }

    getStatusStringForId(id) {
        var cutie_face = this.#getCuteFaceForId(id);
        var staff_credit = this.#getStaffCreditForId(id);
        var str = "";
        if (staff_credit) {
            str += ` <span class="PrettyCards_Staff">(${staff_credit})</span>`
        }
        if (cutie_face) {
            str += ` <span class="Cutie">(${cutie_face})</span>`
        }
        return str;
    }

    isStaffMember(id) {
        return new Promise( (resolve, reject) => {
            try {
                PrettyCards_plugin.events.on("PrettyCards:customChatRolesData", () => {
                    var badge = this.#getStaffBadgeForId(id);
                    if (badge) {
                        resolve(badge);
                    } else {
                        reject("NO_PERMS");
                    }
                });
            } catch (e) {
                console.error(e);
                reject("ERROR_INSIDE");
            }
        });
    }

}

export {CustomChatBadgeSystem};