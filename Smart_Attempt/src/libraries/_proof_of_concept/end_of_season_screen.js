import { getDivisionForElo } from "../mid_match/custom_game_end_screen";
import { prettycards } from "../underscript_checker";

function returnRewardString(imageUrl, count) {
    if (count == 0) {return "";}
    return `
    <div>
        <div style="height: 128px; display: flex;align-items: center;">
            <img style="width:68px;" src="${imageUrl}">
        </div>
        <div style="font-size: 28px;">x ${count}</div>
    </div>`;
}

function viewEndOfSeasonScreen(elo) {
    var endDivision = getDivisionForElo(elo);

    var packCount = Math.min(Math.floor((elo - 1200)/25) + 1, 50);
    var dtFragCount = 0;
    if (endDivision.startsWith("AMETHYST")) {
        dtFragCount = 1;
    } else if (endDivision.startsWith("RUBY")) {
        dtFragCount = 2;
    } else if (endDivision.startsWith("DIAMOND")) {
        dtFragCount = 3;
    } else if (endDivision.startsWith("LEGEND")) {
        dtFragCount = 4;
    }

    var divisionStr = `<div style="font-size: 50px;">${window.$.i18n(`{{DIVISION:${endDivision}}}`)}</div>`;
    if (endDivision === "LEGEND") {
        divisionStr += `<div style="font-size:30px;">With ${elo} ELO!</div>`;
    }

    var rewardStr = returnRewardString("https://raw.githubusercontent.com/CMD-God/prettycards/master/img/Packs/UndertalePack.png", packCount) + 
        returnRewardString("https://raw.githubusercontent.com/CMD-God/prettycards/master/img/Packs/DeltarunePack.png", packCount) + 
        returnRewardString("images/dtFragment.png", dtFragCount);

    var ele = window.$(`
        <div style="text-align: center;">
            <div>Last season, you reached</div>
            ${divisionStr}
            <div style="margin: 10px 0;">Your rewards are:</div>

            <div style="display: flex;
            flex-direction: row;
            flex-wrap: nowrap;
            align-content: center;
            justify-content: space-around;
            align-items: center;
            margin: 0 20px;">${rewardStr}</div>

        </div>
    `);

    window.BootstrapDialog.show({
        title: "End of season rewards!",
        message: ele,
        buttons: [{
            label: $.i18n('dialog-ok'),
            cssClass: 'btn-primary',
            action: function(dialog) {
                dialog.close();
            }
        }]
    });

}

prettycards.concepts = {};
prettycards.concepts.viewEndOfSeasonScreen = viewEndOfSeasonScreen;