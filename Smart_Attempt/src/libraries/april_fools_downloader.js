import { prettycards } from "./underscript_checker";

const normal_prefix = "/images/";
const april_prefix = "/images/aprilFools/";
const json_file_name = "aprilFools2022.json";

var card_id_list = [];

function downloadAprilFoolsImageForCard(card) {
    console.log("Processing Card: ", card.name);
    return new Promise( (accept, reject) => {
        if (card.rarity != "DETERMINATION" && card.rarity != "LEGENDARY" && card.rarity != "TOKEN") {
            accept();
            return;
        }
        var april_data;
        var normal_data;
    
        const normal_url = normal_prefix + "cards/" + card.image + ".png";
        const april_url = april_prefix + "cards/" + card.image + ".png";
        function result() {
            if (april_data && normal_data) {
                // console.log(april_data, normal_data);
                if (april_data != normal_data) {
                    console.log("DIFFERENT IMAGES FOUND!");
                    card_id_list.push(card.fixedId || card.id);
                    var a = document.createElement("A");
                    a.download = card.name + ".png";
                    a.href = april_url;
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                }
                accept();
            }
        }
    
        window.$.get(normal_url, {}, function(data) {normal_data = data; result();});
        window.$.get(april_url, {}, function(data) {april_data = data; result();});
    } );
}

function downloadAprilFoolsImages() {
    var i = 0;
    card_id_list = [];
    function next() {
        downloadAprilFoolsImageForCard(window.allCards[i]).then(() => {
            i++;
            if (i < window.allCards.length) {
                next();
            } else {
                var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(card_id_list));
                var a = document.createElement("A");
                a.download = json_file_name;
                a.href = dataStr;
                document.body.appendChild(a);
                a.click();
                a.remove();
            }
        });
    }
    next();
}

prettycards.downloadAprilFoolsImages = downloadAprilFoolsImages;