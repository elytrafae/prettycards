import { PrettyCards_plugin, settings , addSetting } from "../underscript_checker";
import { utility } from "../utility";

var ads = [
    {
        text: "ThiS [[Number ONE rated SalesMASCOT]] is DROWNing in [[KROMER]]!!! CLICK HERE!!!",
        bgImage: "https://a-z-animals.com/media/2023/01/iStock-1283011874-1024x683.jpg",
        bgSize: "cover",
        bgPosition: "center",
        color: "red",
        picSrc: "images/cards/Golden_Mascot.png",
        textSize: 2,
        link: "https://www.youtube.com/watch?v=ETxmCCsMoD0"
    },
    {
        text: "Do you hate this [[VILE DOG]]?<br>CLICK HERE!",
        bgImage: "https://www.hartz.com/wp-content/uploads/2022/04/small-dog-owners-1.jpg",
        bgSize: "contain",
        bgPosition: "center",
        color: "darkblue",
        picSrc: "images/cards/Bulldogzer.png",
        textSize: 2,
        link: "https://i.imgur.com/lLwWBvH.png"
    },
    {
        text: "Does your neighbors grass look [delicious and natural]? You can have the same [delicious outdoor floor], JUST BUY NOW!",
        bgImage: "https://cdn.britannica.com/22/215522-050-8315BB78/green-grass-close-up.jpg",
        bgSize: "contain",
        bgPosition: "center",
        color: "purple",
        textSize: 2,
        link: "https://store.steampowered.com/app/1944240/Touch_Some_Grass/"
    },
    {
        text: "K N O W L E D G E",
        bgColor: "yellow",
        bgImage: "https://images.theconversation.com/files/45159/original/rptgtpxd-1396254731.jpg?ixlib=rb-1.1.0&q=45&auto=format&w=1356&h=668&fit=crop",
        bgSize: "50%",
        bgPosition: "center",
        color: "#696969",
        textSize: 3,
        link: "https://undercards.fandom.com/wiki/Undercards_Wikia",
        centerText: true
    },
    {
        text: "Looking for a little fun with \\[\\[{{CARD:723|1}}\\]\\] in your area~?",
        bgImage: "https://t4.ftcdn.net/jpg/03/22/89/73/360_F_322897394_X2JQen9I6ECDSsQZoESOJ87dfebaGaAe.jpg",
        bgSize: "cover",
        bgPosition: "center",
        color: "#220000",
        picSrc: "images/cards/HOTSINGLE.png",
        textSize: 2,
        link: "https://i.redd.it/6ztypom2wy661.jpg",
        centerText: true
    },
    {
        text: "Club music for any<br>&gt[[MAN, WOMAN OR CHILD]]&lt!!",
        bgImage: "https://www.bettaeventhire.com.au/wp-content/uploads/2019/10/shutterstock_139152893.jpg",
        bgSize: "cover",
        bgPosition: "center",
        color: "cyan",
        picSrc: "images/cards/Dancer_Mettaton.png",
        textSize: 2,
        link: "https://www.youtube.com/watch?v=x_QgxpTeKzM",
    },
    {
        text: "Hey   EVERY   !!!IT's ME!! Wan to be [[Number 1 Rated Salesman1997]]? Click HERE for the [[Specil Deal]]",
        bgImage: "https://media.tenor.com/FOgfl0x7RiUAAAAC/spamton-dancing.gif",
        bgSize: "contain",
        bgPosition: "unset",
        color: "green",
        picSrc: "images/cards/Spamton.png",
        textSize: 1.5,
        link: "https://i.imgur.com/BbgWGW5.png",
    },
    {
        text: "are YOU [[All Alone On A Late Night?]]????? Want more [[PRIME ENTERTAINMENT!]] CLICK HERE!!!",
        bgImage: "https://media.discordapp.net/attachments/1089991272174993519/1090257788938240131/Sanest_libteg.jpg",
        bgSize: "contain",
        bgPosition: "unset",
        color: "green",
        picSrc: "images/cards/Sand_Dog.png",
        textSize: 1.75,
        link: "https://youtu.be/4X2y5_k2zEw",
    }
]

var adSetting = addSetting({
	'key': 'spamton_ads',
	'name': 'Enable Spamton Ads', // Name in settings page
    'note': '[[NumberOneRatedSetting1997]]',
	'type': 'select',
	'refresh': false, // true to add note "Will require you to refresh the page"
    'options': ["OFF", "SEASONAL", "ON"],
	'default': "SEASONAL", // default value
    'category': "april",
    'hidden': function() {return utility.getSeasonNumber() < 81},
});

PrettyCards_plugin.events.on("BootstrapDialog:show", function(data) {
    var isSettingOff = adSetting.value() == "OFF";
    if (adSetting.value() == "SEASONAL") {
        isSettingOff = utility.getSeasonMonth() != 3;
    }
    if (isSettingOff || data.$modalContent.find(".mulligan")[0]) {
        return;
    }

    var ad = utility.getRandomFromArray(ads);
    //var ad = ads[ads.length-1];
    var adContainer = document.createElement("DIV");

    var bgText = `background-color: ${ad.bgColor || "black"};`;
    if (ad.bgImage) {
        bgText = `background-image: url(${ad.bgImage}); background-size: ${ad.bgSize || "auto"}; background-position: ${ad.bgPosition || "unset"}`;
    }

    var finalText = window.$.i18n(ad.text.replaceAll("   ", " &nbsp "));//.replaceAll("[", "\\[").replaceAll("]", "\\]"));

    adContainer.style = `${bgText};border: 5px solid white;border-width: 0 5px;margin: 0;padding: 5px; display:flex; user-select: none; justify-content: space-between;`;
    adContainer.innerHTML = `<p style="font-size: ${ad.textSize || 2}em; color: ${ad.color || white}">${finalText}</p>${ad.picSrc ? `<img src="${ad.picSrc}">` : ""}`;

    if (data.$modalContent.find(".PrettyCards_ArtifactDisplayName")[0]) {
        adContainer.style.borderWidth = "0 5px 5px 5px";
    }

    if (ad.link) {
        adContainer.style.cursor = "pointer";
        adContainer.onclick = function() {
            window.open(ad.link, "_blank");
        }
    }

    if (ad.centerText) {
        adContainer.querySelector("p").style.width = "100%";
        adContainer.querySelector("p").style.textAlign = "center";
    }

    data.$modalContent[0].insertBefore(adContainer, data.$modalFooter[0]);
})
