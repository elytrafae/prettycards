
/* Profile HTML Example (Anywhere where it says "your" should be replaced with "enemy" if applied to the, well, enemy's side)
<table class="profile" id="user26827" style="background-image: url(&quot;../images/profiles/Summer_Mew_Mew.png&quot;);">
    <tbody>
        <tr>
            <td class="leftPart">
                <span id="yourRank">
                    <span style="font-size:20px">
                        <span class="AMETHYST_NEON">A </span>
                    </span>
                </span>
                <span id="yourMainGroup"></span> 
                <span class="playerInfo">
                    <span class="soul" id="yourSoulImg">
                        <img onclick="soulInfo($(this).attr('data-soul'));" data-soul="KINDNESS" class="KINDNESS" src="images/souls/KINDNESS.png" title="KINDNESS">
                    </span> 
                    <span id="yourUsername" onclick="soulInfo($(this).attr('data-soul'));" class="KINDNESS" data-soul="KINDNESS">elytrafae</span>
                    <span class="blue">
                        <span data-i18n="[html]stat-lv">LV</span>
                        <span id="yourLevel">1003</span>
                    </span>
                </span> 
                <span id="yourArtifacts" class="artifacts" onclick="artifactsInfo(this);">
                    <span class="artifact-group">
                        <img class="artifact-img  PrettyCards_Artifact_LEGENDARY" name="Collection" image="Collection" legendary="true" artifactid="28" src="images/artifacts/Collection.png"> 
                    </span>
                </span>
            </td>
            <td id="yourHp" class="centerPart" style="opacity: 1;">
                <span class="custom-vars"></span>
                <progress class="hpBar" max="30" value="13"></progress><span class="playerHP"><span class="hp">13</span>/<span class="maxHp">30</span> <span data-i18n="[html]{{HP}}"><span class="hp-color">HP</span></span></span>
            </td>
            <td class="rightPart">
                <button id="endTurnBtn" class="btn btn-sm btn-success" onclick="endTurn();" disabled=""><span class="glyphicon glyphicon-retweet"></span></button>
                <span class="stats-group"><img src="images/board/turn.png" title="Current turn."> <span class="stats-value turn">10</span></span>
                <span class="stats-group"><img src="images/board/cards.png" title="Number of cards left in the deck."> <span class="stats-value deckSize">12</span></span>
                <span class="stats-group"><img src="images/board/hand.png" title="Number of cards in hand."> <span class="stats-value handSize">6</span></span>
                <span class="stats-group"><img src="images/board/gold.png" title="Amount of golds left."> <span class="stats-value golds">2</span></span>
                <button class="btn btn-sm btn-dark btn-dustpile" onclick="openDustpile(true);"><span class="glyphicon glyphicon-trash"></span></button>
                <button id="btn-config" class="btn btn-sm btn-primary" onclick="openSettings();"><span class="glyphicon glyphicon-cog"></span></button>
                <a id="btn-exit" class="btn btn-sm btn-danger" href="/" style="display: none;"><span class="glyphicon glyphicon-home"></span></a>
            </td>
        </tr>
    </tbody>
</table>
*/

function ApplyBattleProfileSkin() {
    // Potential idea for buttons: Hide the original buttons, add new ones that just press the old buttons for max compat
    // Also, maybe use a bitmap for the server communicating which features are on/off?

    // Insert part for changing .yourRank/.enemyRank if needed
    // Insert part for changing soul image (.profile .soul img)
    // Insert part for potentially changing stuff about the health bar (.profile .hpBar) (most likely just add a CSS class and only change stuff that way)
    // Insert part to edit the end turn button (#endTurnBtn, only do this for the current player, otherwise jank might arise)
    // Insert part to edit the icons (.stats-group img) (The turn should be skipped for the enemy, then everything else in order. They have no other distinguishing features)
    // Insert part to edit Dustpile Button (.btn-dustpile)
    // Insert part to edit Settings Button (.btn-config)
    // Insert part to edit exit button (.btn-exit) (This is only visible in spectator mode!) (Also, it is not an actual button, but a link!)
}