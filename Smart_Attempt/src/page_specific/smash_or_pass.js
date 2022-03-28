import { PrettyCards_plugin } from "../libraries/underscript_checker";

function initStuff() {
    console.log("ALL CARDS: ", window.allCards);
}

function InitSmashOrPass() {
    PrettyCards_plugin.events.on("PrettyCards:onPageLoad", function() {
        if (window.allCards && window.allCards.length > 0) {
            initStuff();
        } else {
            window.document.addEventListener('allCardsReady', function() {
                initStuff();
            });
        }

        document.getElementsByClassName("mainContent")[0].innerHTML = `
            <div id="PrettyCards_SOP_Phase1">
                <h1>Welcome to Undercards Smash or Pass!</h1>
                <h2>What is Smash or Pass?</h2>
                <p>In case you have been living under a rock, Smash or Pass is a game where characters from a certain media are presented, one by one, and the player has to decide whether or not they would "smash" it. Interpret that as you will.</p>
                <p>Newer variations of the game can also include other categories, such as "befriend", but the main concept is this.</p>
                <p>After all the characters have been given a verdict, statistics follow, which can be analized, shared with friends or just posted online for the whole world to judge you!</p>
                <h2>Why do this with Undercards?</h2>
                <p>Because it's fun, and certain cards can spark interesting discussions in a civil and understanding environment.</p>
                <p>I recommend everyone take this in a light-hearted, fun way.</p>
                <h2>Are you sick in the head?!</h2>
                <p>Yes. :3</p>
                <br>
                <button class="btn btn-success">Onto the settings!</button>
                <button class="btn btn-danger">I wanna chicken out!</button>
            </div>
            <div id="PrettyCards_SOP_Phase2"></div>
            <div id="PrettyCards_SOP_Phase3"></div>
            <div id="PrettyCards_SOP_Phase4"></div>
        `;
    });
}

export {InitSmashOrPass};