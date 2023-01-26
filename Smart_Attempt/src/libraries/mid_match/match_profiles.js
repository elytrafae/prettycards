
import {PrettyCards_plugin, settings, addSetting} from "/src/libraries/underscript_checker.js";

PrettyCards_plugin.events.on("connect", function (data) {
	console.log("CONNECT DATA", data);
    console.log(JSON.parse(data.you));

    var yourData = JSON.parse(data.you);

    // Test
    var ele = document.createElement("SPAN");
    ele.innerHTML = "PROFILE";
    ele.onclick = function() {
        openProfile(yourData);
    }
    document.querySelector(".playerInfo").appendChild(ele);
});


// Test
PrettyCards_plugin.events.on("getVictory getDefeat", function (data) {
    console.log("GAME END DATA: ", data);
});

function convertUser(fullData, you = true) {
    var data;
    var groups;
    var mainGroup;
    if (you) {
        data = fullData.you;
        groups = fullData.yourGroups;
        mainGroup = fullData.yourMainGroup;
    } else {
        data = fullData.enemy;
        groups = fullData.enemyGroups;
        mainGroup = fullData.enemyMainGroup;
    }

    data = JSON.parse(data);
    groups = JSON.parse(groups);
    mainGroup = JSON.parse(mainGroup);

    var user = {
        avatar: data.avatar,
        shinyAvatar: data.shinyAvatar,
        id: data.id,
        username: data.username,
        usernameSafe: data.usernameSafe,
        avatar: data.avatar,
        profileSkin: data.profileSkin,
        frameSkin: data.frameSkin,
        winsRanked: data.winsRanked,
        lossesRanked: data.lossesRanked,
        division: data.division,
        oldDivision: data.oldDivision,
        level: data.level,
        eloRanked: data.eloRanked,
        winStreak: data.winStreak,
        groups: groups,
        mainGroup: mainGroup,
        premium: data.premium,
        gameId: fullData.gameId
    };
    return user;
}

function openProfile(fullData, you = true) {

    var user = convertUser(fullData, you);

    var span = $('<span>UGLY WORKAROUND :( </span>');
    span.data('infos', {
        user: user,
        id: 69420, // Message id. I hope it won't matter later.
        message: "gotta love how dirty this is",
        me: user.id == window.selfId,
        rainbow: false,
        deleted: false,
        idRoom: -22 // Hopefully won't cause issues :hue:
    })
    window.getInfo(span[0]);
}