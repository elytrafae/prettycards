
var spectate = false; 
var headerUrl = new URL(location.href); 
var spectateGameId = headerUrl.searchParams.get("gameId"); 
var spectatePlayerId = headerUrl.searchParams.get("playerId"); 
var tutorial = getLastPart(location.href) === "Tutorial"; 
var url; if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
    if (spectateGameId === null) { if (!tutorial) { url = "ws://" + location.hostname + ":8080/game"; } else { url = "ws://" + location.hostname + ":8080/gametutorial"; } } else {
        url = "ws://" + location.hostname + ":8080/spectate/" + spectateGameId; if (spectatePlayerId !== null) { url += '/' + spectatePlayerId; }
        spectate = true;
    }
} else {
    if (spectateGameId === null) { if (!tutorial) { url = "wss://" + location.hostname + "/game"; } else { url = "wss://" + location.hostname + "/gametutorial"; } } else {
        url = "wss://" + location.hostname + "/spectate/" + spectateGameId; if (spectatePlayerId !== null) { url += '/' + spectatePlayerId; }
        spectate = true;
    }
}
if (spectate) { $('#btn-exit').show(); $('#endTurnBtn').remove(); $('body').addClass('spectate'); }
var socketGame = null; window.onload = init; var divisions = ["COPPER_IV", "COPPER_III", "COPPER_II", "COPPER_I", "IRON_IV", "IRON_III", "IRON_II", "IRON_I", "GOLD_IV", "GOLD_III", "GOLD_II", "GOLD_I", "EMERALD_IV", "EMERALD_III", "EMERALD_II", "EMERALD_I", "SAPPHIRE_IV", "SAPPHIRE_III", "SAPPHIRE_II", "SAPPHIRE_I", "AMETHYST_IV", "AMETHYST_III", "AMETHYST_II", "AMETHYST_I", "RUBY_IV", "RUBY_III", "RUBY_II", "RUBY_I", "DIAMOND_IV", "DIAMOND_III", "DIAMOND_II", "DIAMOND_I", "ONYX_IV", "ONYX_III", "ONYX_II", "ONYX_I", "MASTER_IV", "MASTER_III", "MASTER_II", "MASTER_I", "LEGEND"]; var gameId; var userId; var opponentId; var userTurn; var time = 60; var monsterAttackId = -1; var waitingTarget = false; var audio = new Audio(); var music = new Audio(); var jingle = new Audio(); var turn = 0; var yourGroups; var yourMainGroup; var enemyGroups; var enemyMainGroup; var mulliganDialog; var finish = false; var mulliganCards = []; var gameEmotes; var gameEmotesDialog; var selectCardDialog = null; var numBackground = 1; var settingsDialog = null; var timerRequestDate = new Date(); var dragging = false; var bossBackground = 'muffet'; var $canPlayCards = null; var soundEnabled = localStorage.getItem("gameSoundsDisabled") === null; var musicEnabled = localStorage.getItem("gameMusicDisabled") === null; var profileSkinsEnabled = localStorage.getItem("profileSkinsDisabled") === null; var shakeEnabled = localStorage.getItem("shakeDisabled") === null; var gameEmotesEnabled = localStorage.getItem("gameEmotesDisabled") === null; var statsEnabled = localStorage.getItem("statsDisabled") === null; var vfxEnabled = localStorage.getItem("vfxDisabled") === null; var countTuto = 0; var canClick = true; var eventQueue = []; var actionWorking = false; var bypassQueueEvents = ["getGameRemoved", "getError", "getGameError", "getShowMulligan", "getHideMulligan", "refreshTimer", "connect", "getEmote"]; var youDoingEmote = false; var enemyDoingEmote = false; var enemyMute = false; var availableAttackTargets = {}; var dustpile = []; var dustpileDialog = null; var isYourDustpile = false; var totalTurnAnimationDuration = 0; var doingAnimation = false; var lockTime = 0; var animationCounter = 0; if (allCards.length > 0) { openSocket(); } else { document.addEventListener('allCardsReady', function () { openSocket(); }); }
function onOpenGame(event) { setInterval(function () { socketGame.send(JSON.stringify({ ping: "pong" })); }, 60000); }
function onMessageGame(event) {
    var data = JSON.parse(event.data); if (!bypassQueueEvents.contains(data.action)) { eventQueue.push(data); if (!actionWorking) { nextEvent(); } } else { bypassQueueEvent(data); }
    checkTuto(data);
}
function nextEvent() { doingAnimation = false; if (eventQueue.length > 0) { $('#endTurnBtn').prop("disabled", true); var data = eventQueue.shift(); runEvent(data); } else { actionWorking = false; if (userTurn === userId) { $('#endTurnBtn').prop("disabled", false); } } }
function jingleEnd() { if (musicEnabled) { music.play(); } }
function runEvent(data) {
    actionWorking = true; var waitTime = 0; if (data.action === "getUpdateHand") { $('#handCards').empty(); var hand = JSON.parse(data.hand); for (var i = 0; i < hand.length; i++) { var gameCard = hand[i]; var $appendedCard = appendCard(gameCard, $('#handCards')); $appendedCard.addClass('col-sm-1'); } } else if (data.action === "getPlayersStats") {
        var handsSize = JSON.parse(data.handsSize); var decksSize = JSON.parse(data.decksSize); var golds = JSON.parse(data.golds); var artifacts = JSON.parse(data.artifacts); for (var key in handsSize) { $('#user' + key + ' .handSize').html(handsSize[key]); }
        for (var key in decksSize) { $('#user' + key + ' .deckSize').html(decksSize[key]); }
        for (var key in golds) { $('#user' + key + ' .golds').html(golds[key]); }
        for (var key in artifacts) {
            var artifactsList = artifacts[key]; $('#user' + key + ' .artifacts').empty(); for (var i = 0; i < artifactsList.length; i++) {
                var customValue = artifactsList[i].custom; var disabledClass = artifactsList[i].disabled ? 'artifact-disabled' : ''; var customDisplay = ''; if (customValue > 0) { customDisplay = '<span class="artifact-custom">' + customValue + '</span>'; }
                $('#user' + key + ' .artifacts').append('<span class="artifact-group"><img class="artifact-img ' + disabledClass + '" name="' + artifactsList[i].name + '" image="' + artifactsList[i].image + '" legendary="' + artifactsList[i].legendary + '" artifactId="' + artifactsList[i].id + '" src="images/artifacts/' + artifactsList[i].image + '.png"/> ' + customDisplay + '</span>');
            }
        }
    } else if (data.action === "getMonsterPlayed") {
        waitTime = data.waitTime * 1000; var y = 0; var gameCard = JSON.parse(data.card); if (data.idPlayer === userId) { y = 1; $('#handCards #' + gameCard.id).remove(); }
        $('.temp').remove(); $appendedCard = appendCard(gameCard, $('[x="' + data.x + '"][y="' + y + '"]')); if (gameCard.rarity === "LEGENDARY" || gameCard.rarity === "DETERMINATION") { playJingle(gameCard.name); }
        makeClickable(); makeHoverable();
    } else if (data.action === "getSpellPlayed") {
        waitTime = data.waitTime * 1000; var gameCard = JSON.parse(data.card); $('.canPlay').removeClass('canPlay'); if (data.idPlayer === userId) { y = 1; $('#handCards #' + gameCard.id).remove(); }
        $('.temp').remove(); $('.spellPlayed').remove(); $('.doingEffect').remove(); var $spell = appendCard(gameCard, $('#board')); $spell.addClass('spellPlayed'); makeClickable(); makeHoverable(); $('.centerPart').removeClass('target'); $('.monster').removeClass('target'); setTimeout(function () { $spell.remove(); }, waitTime);
    } else if (data.action === "getShowCard") { waitTime = data.waitTime * 1000; var gameCard = JSON.parse(data.card); $('.temp').remove(); $('.spellPlayed').remove(); appendCard(gameCard, $('#board')); $('#board #' + gameCard.id).addClass('spellPlayed'); makeClickable(); makeHoverable(); $('.centerPart').removeClass('target'); $('.monster').removeClass('target'); setTimeout(function () { $('.spellPlayed').remove(); }, waitTime); } else if (data.action === "getCardDestroyedHandFull") { waitTime = data.waitTime * 1000; var gameCard = JSON.parse(data.card); $('.spellPlayed').remove(); var $card = appendCard(gameCard, $('#board')); $card.addClass('spellPlayed'); setTimeout(function () { playSound('dust'); $card.toggle('explode'); }, waitTime - 500); setTimeout(function () { $card.remove(); }, waitTime); } else if (data.action === "getTurnStart") {
        userTurn = data.idPlayer; if (userTurn === userId) { enableDraggable(); $('#endTurnBtn').prop("disabled", false); } else { disableDraggable(); }
        $('.monster').removeClass('canPlay'); $('#handCards .card').removeClass('canPlay'); turn = data.numTurn; if (userId === userTurn) { $('.turn').html(turn); }
        totalTurnAnimationDuration = 0; startTimer();
    } else if (data.action === "getTurnEnd") {
        if (selectCardDialog !== null) { selectCardDialog.close(); }
        $('#endTurnBtn').prop("disabled", true); $('#user' + data.idPlayer + ' .timer').hide(); stopTimer(); if (data.idPlayer === userId) { monsterAttackId = -1; $('body').removeClass('cursorTarget cursorAttack'); }
        $('#yourHp').css('opacity', 1); $('.monster').css('opacity', 1); $('.monster').removeClass('target'); $('.monster').removeClass('doingEffect'); $('.centerPart').removeClass('target'); $('.temp').remove(); $('.monster').show(); $('.spell').show();
    } else if (data.action === "updateCard") { var card = JSON.parse(data.card); var $card = $('#' + card.id); $card.find('.cardCost').html(card.cost); $card.find('.cardImage').html('<img src="images/cards/' + card.image + '.png" draggable="false"/>'); setInfoPowers($card, card); updateCardVisual($card, card); if (userId === userTurn) { enableDraggable(); } } else if (data.action === "getPlayableCards") { updatePlayableCards(data.playableCards, data.playableTriggers, data.availableAttackTargets); } else if (data.action === "getMonsterDestroyed") { playSound('dust'); removeCardHover(); $('#' + data.monsterId).toggle('explode'); $('#' + data.monsterId).remove(); } else if (data.action === "getPlaySound") { playSound(data.sound); } else if (data.action === "getFakeDeath") { waitTime = data.waitTime * 1000; var idMonster = data.idMonster; playSound('dust'); $('#' + idMonster).toggle('explode'); setTimeout(function () { $('#' + idMonster).toggle('explode'); playSound('dustReverse'); }, 1000); } else if (data.action === "getUpdatePlayerHp") { $('#user' + data.playerId + ' .hp').html(data.hp); $('#user' + data.playerId + ' .maxHp').html(data.maxHp); $('#user' + data.playerId + ' progress').attr('max', data.maxHp); $('#user' + data.playerId + ' progress').val(data.hp); var hpAnimation = data.animation; if (hpAnimation) { if (data.isDamage) { playSound('damage'); } else { playSound('heal'); } } } else if (data.action === "getUpdateSoul") { var soul = JSON.parse(data.soul); var idPlayer = data.idPlayer; updateSoul(idPlayer, soul); } else if (data.action === "getUpdateBoard") {
        $('#board td').empty(); var board = JSON.parse(data.board); var player1Id = data.player1Id; var yVal = 0; if (userId !== player1Id) { yVal = 1; }
        for (var i = 0; i < board.length; i++) {
            if (board[i] !== null) {
                var gameCard = board[i]; if (i <= 3) { appendCard(gameCard, $('[x="' + i + '"][y="' + yVal + '"]')); } else { var nb = i - 4; appendCard(gameCard, $('[x="' + nb + '"][y="' + Math.abs(yVal - 1) + '"]')); }
                makeClickable(); makeHoverable();
            }
        }
    }
    else if (data.action === "getVictory" && !spectate) {
        $('.spellPlayed').remove(); 
        $('#enemyMute').remove(); 
        $('#game-history').remove(); 
        if (settingsDialog !== null) { settingsDialog.close(); }
        if (selectCardDialog !== null) { selectCardDialog.close(); }
        if (dustpileDialog !== null) { dustpileDialog.close(); }
        music.pause(); 
        finish = true; 
        if (data.gameType === "STANDARD" || data.gameType === "BOSS" || data.gameType === "EVENT") {
            $('.arrows').remove(); $('.goldsAmount').html(data.golds); $('.xpAdded').html(data.newXp - data.oldXp); $('.xpBar').attr("max", data.oldJaugeSize); $('.xpBar').attr("value", data.oldJaugeSize - data.xpUntilNextLevel); $('.xpMax').html(data.oldJaugeSize); $('.stats').show(); var baseGold = data.golds; if (data.isDonator) { baseGold = baseGold - 10; $('.donatorZone').show(); }
            if (data.queueGoldBonus > 0) { baseGold = baseGold - data.queueGoldBonus; $('.queue-gold-bonus-value').html(data.queueGoldBonus); $('.queue-gold-bonus').show(); }
            $('.goldWon').html(baseGold - data.oldGold);
        } else if (data.gameType === "RANKED") {
            var oldDivisionName = '{{DIVISION:' + data.oldDivision + '}}'; var newDivisionName = '{{DIVISION:' + data.newDivision + '}}'; $('.oldDivision').append('<h2>' + $.i18n(oldDivisionName) + '</h2>'); $('.newDivision').append('<h2>' + $.i18n(newDivisionName) + '</h2>'); if (data.oldDivision === "LEGEND") { var diff = data.newElo - data.oldElo; $('.legendElo').html('<h3><span class="rainbowText">' + data.newElo + '</span> (<span class="green">+' + diff + '</span>)</h3>'); $('.legendElo').show(); $('#eloBarWinner').hide(); }
            var minEloDiv = getMinEloDivision(data.oldDivision); $('#eloBarWinner').addClass(getDivisionFirstPart(data.oldDivision) + "Bar"); $('#eloBarWinner').attr("min", 0); $('#eloBarWinner').attr("value", data.oldElo - minEloDiv); $('#eloBarWinner').attr("max", getNextEloDivision(data.oldDivision) - minEloDiv); $('.goldsAmount').html(data.golds); $('.xpAdded').html(data.newXp - data.oldXp); $('.xpBar').attr("max", data.oldJaugeSize); $('.xpBar').attr("value", data.oldJaugeSize - data.xpUntilNextLevel); $('.xpMax').html(data.oldJaugeSize); $('.statsRanked').show(); var baseGold = data.golds; if (data.isDonator) { baseGold = baseGold - 10; $('.donatorZone').show(); }
            if (data.queueGoldBonus > 0) { baseGold = baseGold - data.queueGoldBonus; $('.queue-gold-bonus-value').html(data.queueGoldBonus); $('.queue-gold-bonus').show(); }
            $('.goldWon').html(baseGold - data.oldGold);
        }
        if (data.rewardStringKey !== undefined) { if (data.rewardType === 'CARD') { $('.reward').html('<p>' + $.i18n("game-level-up") + ' ' + $.i18n("{{CARD:" + data.rewardQuantity + "|1}}") + ' x1</p>'); } else { $('.reward').html('<p>' + $.i18n("game-level-up") + ' <span class="yellow">' + $.i18n(data.rewardStringKey) + '</span> x' + data.rewardQuantity + '</p>'); } }
        if (data.bonusRewardStringKey !== undefined) { if (data.bonusRewardType === 'CARD') { $('.bonus-reward').html('<p>' + $.i18n("game-reward") + ': ' + $.i18n("{{CARD:" + data.bonusRewardQuantity + "|1}}") + ' x1</p>'); } else { $('.bonus-reward').html('<p>' + $.i18n("game-reward") + ': <span class="yellow">' + $.i18n(data.bonusRewardStringKey) + '</span> x' + data.bonusRewardQuantity + '</p>'); } }
        if (shakeEnabled) { $('#user' + opponentId).effect("shake"); $('#enemyAvatar').effect("shake"); }
        setTimeout(function () {
            $('#user' + opponentId).effect("puff"); $('#enemyAvatar').effect("puff"); playSound('dust'); setTimeout(function () {
                $('#handCards').hide(); $('#yourAvatar').hide(); $('#enemyAvatar').hide(); $('.rainbowAvatar').hide(); $('header').hide(); $('#phase2').hide(); $('#victory').show(); $('body').css('background', '#000'); setTimeout(function () {
                    $('#messageVictory').fadeIn(1000); if (data.oldDivision === data.newDivision) { if (!data.disconnected) { playMusic('dr2_victory'); } else { $('#messageVictory h1').html('"VICTORY"'); playMusic('dogsong'); $('.deco').show(); } }
                    if (data.gameType === "STANDARD" || data.gameType === "BOSS" || data.gameType === "RANKED" || data.gameType === "EVENT") {
                        var nbLevelPassed = data.nbLevelPassed; var xpAdded = data.newXp - data.oldXp; var min = data.oldJaugeSize - data.xpUntilNextLevel; var max = data.oldJaugeSize; if (nbLevelPassed === 0) { var i = 0; var intervalXp = setInterval(function () { i++; if (i <= xpAdded) { $('.xpBar').attr("value", min + i); $('.xp').html(min + i); } else { clearInterval(intervalXp); } }, 5); } else { var i = 0; var j = 0; var intervalXp = setInterval(function () { i++; j++; if (i <= xpAdded) { $('.xpBar').attr("value", min + j); $('.xp').html(min + j); if (min + j >= max) { $('.reward').show(); playSound('levelUp'); var newLevel = parseInt($('.level').html()); $('.level').html(newLevel + 1); $('.xpBar').attr("value", 0); $('.xpBar').attr("max", max); max = data.jaugeSize; $('.xpMax').html(max); min = 0; j = 0; setTimeout(function () { checkLimitedPack(newLevel + 1); }, 2000); } } else { clearInterval(intervalXp); } }, 5); }
                        if (data.gameType === "RANKED") {
                            var oldElo = data.oldElo; var newElo = data.newElo; var eloAmount = oldElo; var nextEloDivision = getNextEloDivision(data.oldDivision); var intervalElo = setInterval(function () {
                                if (eloAmount < newElo && eloAmount < nextEloDivision) { eloAmount = eloAmount + 0.1; $('#eloBarWinner').attr("value", eloAmount - minEloDiv); } else {
                                    clearInterval(intervalElo); if (data.oldDivision !== data.newDivision) {
                                        if (data.newDivision === "LEGEND") { $('#eloBarWinner').hide(); }
                                        var newMinEloDiv = getMinEloDivision(data.newDivision); $('#eloBarWinner').removeClass(getDivisionFirstPart(data.oldDivision) + "Bar"); $('#eloBarWinner').addClass(getDivisionFirstPart(data.newDivision) + "Bar"); $('#eloBarWinner').attr("min", 0); $('#eloBarWinner').attr("value", data.newElo - newMinEloDiv); $('#eloBarWinner').attr("max", getNextEloDivision(data.newDivision) - newMinEloDiv); $('.oldDivision').hide(); $('.newDivision').show(); playMusic('rankUp'); BootstrapDialog.show({ title: $.i18n('game-promotion'), type: BootstrapDialog.TYPE_SUCCESS, message: $.i18n('game-promotion-message', data.newDivision), buttons: [{ label: $.i18n('dialog-ok'), cssClass: 'btn-primary', action: function (dialog) { dialog.close(); } }] });
                                    }
                                }
                            }, 33);
                        }
                    }
                }, 1000);
            }, 1000);
        }, 750);
    }
    else if (data.action === "getDefeat" && !spectate) {
        $('#enemyMute').remove(); 
        $('.spellPlayed').remove(); 
        $('#game-history').remove(); 
        if (settingsDialog !== null) { settingsDialog.close(); }
        if (selectCardDialog !== null) { selectCardDialog.close(); }
        if (dustpileDialog !== null) { dustpileDialog.close(); }
        music.pause(); 
        finish = true; 
        if (data.endType === "Chara") {
            $('#gameover-title').html($.i18n('game-died')); 
            $('#gameover-title').css('color', '#f00');
        }
        if (data.gameType === "STANDARD" || data.gameType === "BOSS" || data.gameType === "EVENT") {
            $('.arrows').remove(); 
            $('.goldsAmount').html(data.golds); 
            $('.xpAdded').html(data.newXp - data.oldXp); 
            $('.xpBar').attr("max", data.oldJaugeSize); 
            $('.xpBar').attr("value", data.oldJaugeSize - data.xpUntilNextLevel); 
            $('.xpMax').html(data.oldJaugeSize); 
            $('.stats').show(); 
            var baseGold = data.golds; 
            if (data.queueGoldBonus > 0) { 
                baseGold = baseGold - data.queueGoldBonus; 
                $('.queue-gold-bonus-value').html(data.queueGoldBonus); 
                $('.queue-gold-bonus').show();
            }
            $('.goldWon').html(baseGold - data.oldGold);
        } else if (data.gameType === "RANKED") {
            var newDivisionName = '{{DIVISION:' + data.newDivision + '}}'; var oldDivisionName = '{{DIVISION:' + data.oldDivision + '}}'; 
            $('.oldDivision').append('<h2>' + $.i18n(oldDivisionName) + '</h2>'); 
            if (data.oldDivision === "LEGEND") {
                var diff = data.newElo - data.oldElo; 
                $('.legendElo').html('<h3><span class="rainbowText">' + data.newElo + '</span> (<span class="red">' + diff + '</span>)</h3>'); 
                $('.legendElo').show(); 
                $('#eloBarLooser').hide();
            }
            var minEloDiv = getMinEloDivision(data.oldDivision); 
            $('#eloBarLooser').addClass(getDivisionFirstPart(data.oldDivision) + "Bar"); 
            $('#eloBarLooser').attr("min", 0); 
            $('#eloBarLooser').attr("value", data.oldElo - minEloDiv); 
            $('#eloBarLooser').attr("max", getNextEloDivision(data.oldDivision) - minEloDiv); 
            $('.goldsAmount').html(data.golds); 
            $('.xpAdded').html(data.newXp - data.oldXp); 
            $('.xpBar').attr("max", data.oldJaugeSize); 
            $('.xpBar').attr("value", data.oldJaugeSize - data.xpUntilNextLevel); 
            $('.xpMax').html(data.oldJaugeSize); 
            $('.statsRanked').show(); 
            var baseGold = data.golds; 
            if (data.queueGoldBonus > 0) { 
                baseGold = baseGold - data.queueGoldBonus;
                $('.queue-gold-bonus-value').html(data.queueGoldBonus);
                $('.queue-gold-bonus').show();
            }
            $('.goldWon').html(baseGold - data.oldGold);
        }
        if (data.rewardStringKey !== undefined) { 
            if (data.rewardType === 'CARD') { 
                $('.reward').html('<p>' + $.i18n("game-level-up") + ' ' + $.i18n("{{CARD:" + data.rewardQuantity + "|1}}") + ' x1</p>');
            } else { 
                $('.reward').html('<p>' + $.i18n("game-level-up") + ' <span class="yellow">' + $.i18n(data.rewardStringKey) + '</span> x' + data.rewardQuantity + '</p>'); 
            }
        }
        if (data.bonusRewardStringKey !== undefined) { 
            if (data.bonusRewardType === 'CARD') { 
                $('.bonus-reward').html('<p>' + $.i18n("game-reward") + ': ' + $.i18n("{{CARD:" + data.bonusRewardQuantity + "|1}}") + ' x1</p>'); 
            } else { 
                $('.bonus-reward').html('<p>' + $.i18n("game-reward") + ': <span class="yellow">' + $.i18n(data.bonusRewardStringKey) + '</span> x' + data.bonusRewardQuantity + '</p>'); 
            }
        }
        if (data.endType !== "Chara") { 
            if (shakeEnabled) { 
                $('#user' + userId).effect("shake"); 
            } 
        } else { 
            playSound('hit'); 
            $('#handCards').hide(); 
            $('#yourAvatar').hide(); 
            $('#enemyAvatar').hide(); 
            $('.rainbowAvatar').hide(); 
            $('header').hide(); 
            $('#phase2').hide(); 
            $('body').css('background-image', 'url(images/99.png)'); 
            $('body').css('background-repeat', 'repeat'); 
            $('body').css('background-size', 'cover'); 
            $('#gameOver').show(); 
        }
        setTimeout(function () {
            if (data.endType !== "Chara") { 
                playSound('soulDeath'); 
                $('#handCards').hide(); 
                $('#yourAvatar').hide(); 
                $('#enemyAvatar').hide();
                 $('.rainbowAvatar').hide(); 
                 $('header').hide(); 
                 $('#phase2').hide(); 
                 $('body').css('background', '#000'); 
                 $('#gameOver').show(); 
                 $('#soul').append('<img src="images/broke.gif" draggable="false"/>'); 
                 audio.play(); 
            }
            setTimeout(function () {
                $('body').css('background', '#000'); 
                $('#soul img').removeAttr('src', ''); 
                $('#soul').remove(); 
                $('#messageDefeat').fadeIn(1000); 
                if (data.endType !== "Chara") { 
                    playMusic('dr2_gameover');
                } else { 
                    playMusic('toomuch'); 
                }
                if (data.gameType === "STANDARD" || data.gameType === "BOSS" || data.gameType === "RANKED" || data.gameType === "EVENT") {
                    var nbLevelPassed = data.nbLevelPassed; 
                    var xpAdded = data.newXp - data.oldXp; 
                    var min = data.oldJaugeSize - data.xpUntilNextLevel; 
                    var max = data.oldJaugeSize; 
                    if (nbLevelPassed === 0) { 
                        var i = 0; 
                        setInterval(function () { i++; if (i <= xpAdded) { $('.xpBar').attr("value", min + i); $('.xp').html(min + i); } }, 5); 
                    } else { 
                        var i = 0; 
                        var j = 0; 
                        setInterval(function () { 
                            i++; 
                            j++; 
                            if (i <= xpAdded) {
                                $('.xpBar').attr("value", min + j); 
                                $('.xp').html(min + j); 
                                if (min + j >= max) { 
                                    $('.reward').show(); 
                                    playSound('levelUp'); 
                                    var newLevel = parseInt($('.level').html()); 
                                    $('.level').html(newLevel + 1); 
                                    $('.xpBar').attr("value", 0); 
                                    $('.xpBar').attr("max", max); 
                                    max = data.jaugeSize; 
                                    $('.xpMax').html(max); 
                                    min = 0; 
                                    j = 0; 
                                    setTimeout(function () { 
                                        checkLimitedPack(newLevel + 1);
                                    }, 2000); 
                                }
                            }
                        }, 5);
                    }
                    if (data.gameType === "RANKED") { 
                        var oldElo = data.oldElo; 
                        var newElo = data.newElo; 
                        var eloAmount = oldElo; 
                        var intervalElo = setInterval(function () { 
                            if (eloAmount > newElo && data.oldElo % 25 > 0) { 
                                eloAmount = eloAmount - 0.1; 
                                $('#eloBarLooser').attr("value", eloAmount - minEloDiv); 
                            } else { 
                                clearInterval(intervalElo); 
                                if (data.oldDivision !== data.newDivision) { 
                                    $('.newDivision').append('<h2>' + $.i18n(newDivisionName) + '</h2>'); 
                                    $('.legendElo').hide(); 
                                    $('#eloBarLooser').show(); 
                                    var newMinEloDiv = getMinEloDivision(data.newDivision); 
                                    $('#eloBarLooser').removeClass(getDivisionFirstPart(data.oldDivision) + "Bar"); 
                                    $('#eloBarLooser').addClass(getDivisionFirstPart(data.newDivision) + "Bar"); 
                                    $('#eloBarLooser').attr("min", 0); 
                                    $('#eloBarLooser').attr("value", data.newElo - newMinEloDiv); 
                                    $('#eloBarLooser').attr("max", getNextEloDivision(data.newDivision) - newMinEloDiv); 
                                    $('.oldDivision').hide(); $('.newDivision').show(); 
                                    BootstrapDialog.show({ title: $.i18n('game-demotion'), type: BootstrapDialog.TYPE_DANGER, message: $.i18n('game-demotion-message', data.newDivision), buttons: [{ label: $.i18n('dialog-ok'), cssClass: 'btn-primary', action: function (dialog) { dialog.close(); } }] }); } } }, 33); }
                }
            }, 2200);
        }, 750);
    } else if (data.action === "getDoingEffect") {
        waitTime = data.waitTime * 1000; disableDraggable(); $('.canPlay').removeClass('canPlay'); $('.monster').removeClass('target'); $('.monster').css('opacity', 1); $('.spellPlayed').remove(); var gameCard = JSON.parse(data.card); var $card = $('#board .monster#' + gameCard.id); if ($card.length === 0) { $card = appendCard(gameCard, $('#board')); $card.addClass('spellPlayed'); }
        $card.addClass('doingEffect'); var affecteds = JSON.parse(data.affecteds); if (affecteds !== null) { for (var i = 0; i < affecteds.length; i++) { $('#' + affecteds[i]).addClass('affected'); } }
        if (data.playerAffected1 !== undefined) { $('#user' + data.playerAffected1 + ' .centerPart').addClass('affected'); }
        if (data.playerAffected2 !== undefined) { $('#user' + data.playerAffected2 + ' .centerPart').addClass('affected'); }
        setTimeout(function () { $('.card').removeClass('affected'); $('.centerPart').removeClass('affected'); $('.spellPlayed').remove(); $card.removeClass('doingEffect'); }, waitTime);
    } else if (data.action === "getSoulDoingEffect") {
        waitTime = data.waitTime * 1000; disableDraggable(); $('.monster').removeClass('canPlay'); $('.spell').removeClass('canPlay'); $('.monster').removeClass('target'); $('.monster').css('opacity', 1); var $soul = $('#user' + data.playerId + ' .soul'); $soul.addClass('doingEffect'); var affecteds = JSON.parse(data.affecteds); if (affecteds !== null) { for (var i = 0; i < affecteds.length; i++) { $('#' + affecteds[i]).addClass('affected'); } }
        if (data.playerAffected1 !== undefined) { $('#user' + data.playerAffected1 + ' .centerPart').addClass('affected'); }
        if (data.playerAffected2 !== undefined) { $('#user' + data.playerAffected2 + ' .centerPart').addClass('affected'); }
        setTimeout(function () { $soul.removeClass('doingEffect'); $('.card').removeClass('affected'); $('.centerPart').removeClass('affected'); enableDraggable(); }, waitTime);
    } else if (data.action === "getArtifactDoingEffect") {
        waitTime = data.waitTime * 1000; disableDraggable(); $('.monster').removeClass('canPlay'); $('.spell').removeClass('canPlay'); $('.monster').removeClass('target'); $('.monster').css('opacity', 1); var $artifacts = $('#user' + data.playerId + ' .artifacts'); $artifacts.addClass('doingEffect'); var affecteds = JSON.parse(data.affecteds); if (affecteds !== null) { for (var i = 0; i < affecteds.length; i++) { $('#' + affecteds[i]).addClass('affected'); } }
        if (data.playerAffected1 !== undefined) { $('#user' + data.playerAffected1 + ' .centerPart').addClass('affected'); }
        if (data.playerAffected2 !== undefined) { $('#user' + data.playerAffected2 + ' .centerPart').addClass('affected'); }
        setTimeout(function () { $artifacts.removeClass('doingEffect'); $('.card').removeClass('affected'); $('.centerPart').removeClass('affected'); enableDraggable(); }, waitTime);
    } else if (data.action === "getFight") {
        waitTime = data.waitTime * 1000; disableDraggable(); $('.target').removeClass('target'); $('#board .card').css('opacity', 0.5); $('#board #' + data.attackMonster).css('opacity', 1).addClass('fight'); $('#board #' + data.defendMonster).css('opacity', 1).addClass('fight'); $('#' + data.attackMonster + ' .cardAction').append('<img class="infoFight" src="/images/cardAssets/sword.png">'); $('#' + data.defendMonster + ' .cardAction').append('<img class="infoFight" src="/images/cardAssets/shield.png">'); $('.card').removeClass('canPlay'); setTimeout(function () {
            if (data.dmgMonster >= 7) { shakeScreen(); }
            $('#board .card').css('opacity', 1); $('.fight').removeClass('fight'); $('.infoFight').remove(); enableDraggable();
        }, waitTime);
    } else if (data.action === "getFightPlayer") {
        waitTime = data.waitTime * 1000; disableDraggable(); $('.target').removeClass('target'); $('#board .card').css('opacity', 0.5); $('#board #' + data.attackMonster).css('opacity', 1).addClass('fight'); $('#' + data.attackMonster + ' .cardAction').append('<img class="infoFight" src="/images/cardAssets/sword.png">'); $('#user' + data.defendPlayer + ' .centerPart').addClass('fight'); $('.card').removeClass('canPlay'); setTimeout(function () {
            if (data.dmgMonster >= 7) { shakeScreen(); }
            $('#board .card').css('opacity', 1); $('.fight').removeClass('fight'); $('.infoFight').remove(); enableDraggable();
        }, waitTime);
    } else if (data.action === "getMonsterTemp") {
        var gameCard = JSON.parse(data.monster); $('#handCards #' + gameCard.id).hide(); if (data.selectCards !== undefined) { showSelectCards(JSON.parse(data.selectCards)); } else { displayAvailableTargets(JSON.parse(data.availableTargets)); }
        var appendedCard = appendCard(gameCard, $('[x="' + data.x + '"][y="1"]')); appendedCard.addClass('temp').addClass('doingEffect'); if (!spectate) { $('body').addClass('cursorTarget'); }
        waitingTarget = true; $('.monster').removeClass('canPlay'); $('#handCards .card').removeClass('canPlay'); disableDraggable(); makeHoverable(); makeClickable();
    } else if (data.action === "getSpellTemp") {
        var gameCard = JSON.parse(data.spell); $('#handCards #' + gameCard.id).hide(); if (data.selectCards !== undefined) { showSelectCards(JSON.parse(data.selectCards)); } else { displayAvailableTargets(JSON.parse(data.availableTargets)); }
        var appendedCard = appendCard(gameCard, $('#board')); appendedCard.addClass('temp').addClass('doingEffect').addClass('spellPlayed'); if (!spectate) { $('body').addClass('cursorTarget'); }
        waitingTarget = true; $('.monster').removeClass('canPlay'); $('#handCards .card').removeClass('canPlay'); disableDraggable(); makeClickable(); makeHoverable();
    } else if (data.action === "getTempCancel") {
        waitingTarget = false; if (selectCardDialog !== null) { selectCardDialog.close(); }
        $('.monster').removeClass('target'); $('.card').removeClass('doingEffect'); $('.centerPart').removeClass('target'); $('body').removeClass('cursorTarget cursorAttack'); $('.temp').remove(); $('.card').show(); $('.monster').css('opacity', 1); $('.centerPart').css('opacity', 1); enableDraggable();
    } else if (data.action === "getTurn") { turn = data.turn; $('.turn').html(turn); } else if (data.action === "getBattleLog") { appendBattleLog(JSON.parse(data.battleLog)); } else if (data.action === "getResult") { $('.spellPlayed').remove(); finish = true; playMusic('dr2_victory'); BootstrapDialog.show({ title: $.i18n('game-results-title'), closable: false, message: $.i18n('game-results-text', data.winner, data.looser, $.i18n(data.cause)), buttons: [{ label: $.i18n('dialog-ok'), cssClass: 'btn-primary', action: function () { document.location.href = "/"; } }] }); } else if (data.action === "getBotDelay") { waitTime = data.waitTime * 1000; } else if (data.action === "getAnimation") { waitTime = data.waitTime * 1000; var animation = data.animation; animationCounter++; if (animation === 'BIG_DAMAGE') { shakeScreen(); } else if (animation === 'BLACK_OUT') { blackOut(); } else if (animation === 'SAVE') { saveAnimation(); } else if (animation === 'LOAD') { loadAnimation(); } else if (animation === 'SILENCE') { silenceAnimation(data.idTarget); } else if (animation === 'SPELL') { spellAnimation(); } else if (animation === 'ATTACK_BUFF') { attackBuffAnimation(data.idTarget); } else if (animation === 'HP_BUFF') { hpBuffAnimation(data.idTarget); } else if (animation === 'ATTACK_DEBUFF') { attackDebuffAnimation(data.idTarget); } else if (animation === 'HP_DEBUFF') { hpDebuffAnimation(data.idTarget); } else if (animation === 'FREEZE') { freezeAnimation(data.idTarget); } else if (animation === 'POISON') { poisonAnimation(data.idTarget); } else if (animation === 'HEAL') { healAnimation(data.target, data.idTarget); } else if (animation === 'HP_STAT') { hpStatAnimation(data.target, data.idTarget, data.value); } else if (animation === 'COST_STAT') { costStatAnimation(data.target, data.idTarget, data.value); } else if (animation === 'ATTACK_STAT') { attackStatAnimation(data.target, data.idTarget, data.value); } } else if (data.action === "getUpdateDustpile") { updateDustpile(data.dustpile); }
    if (waitTime > 0 && totalTurnAnimationDuration < 60 && data.action !== 'getBotDelay') { totalTurnAnimationDuration += data.waitTime; doingAnimation = true; }
    setTimeout(nextEvent, waitTime);
}
function bypassQueueEvent(data) {
    if (data.action === "getGameRemoved") { 
        BootstrapDialog.show({ title: $.i18n('dialog-error'), type: BootstrapDialog.TYPE_DANGER, closable: false, message: $.i18n('game-cant-join'), buttons: [{ label: $.i18n('dialog-ok'), cssClass: 'btn-primary', action: function () { document.location.href = "Play"; } }] }); } 
    else if (data.action === "getError") { 
        BootstrapDialog.show({ title: $.i18n('dialog-error'), type: BootstrapDialog.TYPE_DANGER, closable: false, message: translateFromServerJson(data.message), buttons: [{ label: $.i18n('dialog-ok'), cssClass: 'btn-primary', action: function () { document.location.href = "/"; } }] }); 
    } else if (data.action === "getGameError") { 
        BootstrapDialog.show({ title: $.i18n('dialog-error'), type: BootstrapDialog.TYPE_DANGER, closable: false, message: translateFromServerJson(data.message), buttons: [{ label: $.i18n('dialog-ok'), cssClass: 'btn-primary', action: function () { document.location.href = "Play"; } }] }); 
    } else if (data.action === "getShowMulligan") {
        $('#handCards').empty(); mulliganDialog = new BootstrapDialog({
            title: $.i18n('game-mulligan') + ' - <span class="timerMulligan">15</span>', closable: false, message: '<p>' + $.i18n("game-mulligan-information") + '</p><div class="mulligan"></div><br/>', cssClass: 'dialog-mulligan', buttons: [{ label: $.i18n('dialog-confirm'), cssClass: 'btn-primary', action: function () { sendMulligan(); } }], onshown: function (dialog) {
                var hand = JSON.parse(data.hand); for (var i = 0; i < hand.length; i++) { var gameCard = hand[i]; appendCard(gameCard, $('.mulligan')); $('.mulligan .card').addClass('col-sm-1'); }
                $('.mulligan .card').click(function () { var id = $(this).attr('id'); if (!mulliganCards.contains(id)) { mulliganCards.push(id); $(this).addClass('fight'); } else { mulliganCards.remove(id); $(this).removeClass('fight'); } }); var timeMulligan = 15; var intervalMulligan = setInterval(function () { timeMulligan--; $('.timerMulligan').html(timeMulligan); if (timeMulligan <= 0) { clearInterval(intervalMulligan); } }, 1000);
            }
        }); mulliganDialog.open();
    } else if (data.action === "getHideMulligan") { if (mulliganDialog !== undefined) { mulliganDialog.close(); } } else if (data.action === "refreshTimer") { var lag = new Date() - timerRequestDate; time = 600 - data.turnTime * 10 - lag / 100; } else if (data.action === "connect") {
        var you = JSON.parse(data.you); var enemy = JSON.parse(data.enemy); var handsSize = JSON.parse(data.handsSize); var decksSize = JSON.parse(data.decksSize); var golds = JSON.parse(data.golds); var hand = null; if (data.hand !== undefined) { hand = JSON.parse(data.hand); }
        var board = JSON.parse(data.board); var turnGame = data.turn; yourGroups = JSON.parse(data.yourGroups); yourMainGroup = JSON.parse(data.yourMainGroup); enemyGroups = JSON.parse(data.enemyGroups); enemyMainGroup = JSON.parse(data.enemyMainGroup); gameEmotes = JSON.parse(data.yourEmotes); userTurn = data.userTurn; gameId = data.gameId; userId = you.id; opponentId = enemy.id; totalTurnAnimationDuration = data.totalTurnAnimationDuration; lockTime = data.lockTime / 100; numBackground = randomInt(1, 41); if (data.gameType === 'BOSS') { numBackground = bossBackground; } else if (data.gameType === 'TUTORIAL') { numBackground = 'tuto'; }
        $('body').css('background', '#000 url(\'images/backgrounds/' + numBackground + '.png\') no-repeat'); $('body').css('background-size', 'cover'); $('#phase1').fadeOut(100); $('#phase2').fadeIn(100); $('#enemyInfos').attr('id', 'user' + enemy.id); $('#enemyUsername').html(enemy.username); $('#yourInfos').attr('id', 'user' + you.id); $('#yourUsername').html(you.username); $('#user' + you.id + ' .hp').html(you.hp); $('#user' + you.id + ' .maxHp').html(you.maxHp); $('#user' + you.id + ' progress').val(you.hp); $('#user' + you.id + ' progress').attr('max', you.maxHp); $('#user' + enemy.id + ' .hp').html(enemy.hp); $('#user' + enemy.id + ' .maxHp').html(enemy.maxHp); $('#user' + enemy.id + ' progress').val(enemy.hp); $('#user' + enemy.id + ' progress').attr('max', enemy.maxHp); $('.turn').html(turnGame); $('#enemyLevel').html(data.enemyLevel); $('#yourLevel').html(data.yourLevel); $('.level').html(data.yourLevel); $('#yourUsername').addClass(data.yourSoul); $('#enemyUsername').addClass(data.enemySoul); $('#yourUsername').attr('data-soul', data.yourSoul); $('#enemyUsername').attr('data-soul', data.enemySoul); $('#yourSoulImg').append('<img onclick="soulInfo($(this).attr(\'data-soul\'));" data-soul="' + data.yourSoul + '" class="' + data.yourSoul + '" src="images/souls/' + data.yourSoul + '.png" title="' + data.yourSoul + '"/>'); $('#enemySoulImg').append('<img onclick="soulInfo($(this).attr(\'data-soul\'));" data-soul="' + data.enemySoul + '" class="' + data.enemySoul + '" src="images/souls/' + data.enemySoul + '.png" title="' + data.enemySoul + '"/>'); turn = turnGame; if (userId === userTurn) { $('.timer').removeClass('enemy').addClass('ally'); } else { $('.timer').removeClass('ally').addClass('enemy'); }
        updateSoul(you.id, you.soul); updateSoul(enemy.id, enemy.soul); var yourAvatar = JSON.parse(data.yourAvatar); var enemyAvatar = JSON.parse(data.enemyAvatar); if (data.yourShinyAvatar) { $('.mainContent').prepend('<img id="yourShinyAvatar" src="images/shinyAvatar.gif" class="rainbowAvatar" draggable="false">'); }
        if (data.enemyShinyAvatar) { $('.mainContent').prepend('<img id="enemyShinyAvatar" src="images/shinyAvatar.gif" class="rainbowAvatar" draggable="false">'); }
        $('.mainContent').prepend('<img id="yourAvatar" class="avatar ' + yourAvatar.rarity + ' pointer" src="images/avatars/' + yourAvatar.image + '.png" draggable="false" onclick="showGameEmotes();"/>'); $('.mainContent').prepend('<img id="enemyAvatar" class="avatar ' + enemyAvatar.rarity + ' pointer" src="images/avatars/' + enemyAvatar.image + '.png" draggable="false" onclick="toggleMute();"/>'); if (profileSkinsEnabled) { var yourProfileSkin = JSON.parse(data.yourProfileSkin); var enemyProfileSkin = JSON.parse(data.enemyProfileSkin); $('#user' + you.id).css("background-image", "url(../images/profiles/" + yourProfileSkin.image + ".png)"); $('#user' + enemy.id).css("background-image", "url(../images/profiles/" + enemyProfileSkin.image + ".png)"); if (data.gameType !== "BOSS") { checkSpecialProfileSkin(yourProfileSkin); } }
        $('html').click(function () { playBackgroundMusic(numBackground); $('html').unbind('click'); }); if (data.gameType === "RANKED") { var yourDivision = '{{DIVISION:' + data.yourRank + '|short}}'; var enemyDivision = '{{DIVISION:' + data.enemyRank + '|short}}'; $('#yourRank').append('<span style="font-size:20px">' + $.i18n(yourDivision) + '</span>'); $('#enemyRank').append('<span style="font-size:20px">' + $.i18n(enemyDivision) + '</span>'); }
        if (you.oldDivision === "LEGEND") { $('#yourSide').addClass('OLD_LEGEND'); } else { $('#yourSide').addClass('OLD_' + you.oldDivision.substring(0, you.oldDivision.indexOf('_'))); }
        if (enemy.oldDivision === "LEGEND") { $('#enemySide').addClass('OLD_LEGEND'); } else { $('#enemySide').addClass('OLD_' + enemy.oldDivision.substring(0, enemy.oldDivision.indexOf('_'))); }
        if (yourGroups.contains("DETERMINATION")) { $('#yourMainGroup').html("<img src=\"images/rarity/DETERMINATION.png\" title=\"Old Determination Player\" class=\"groupIcon\"/>"); }
        if (enemyGroups.contains("DETERMINATION")) { $('#enemyMainGroup').html("<img src=\"images/rarity/DETERMINATION.png\" title=\"Old Determination Player\" class=\"groupIcon\"/>"); }
        for (var key in handsSize) { $('#user' + key + ' .handSize').html(handsSize[key]); }
        for (var key in decksSize) { $('#user' + key + ' .deckSize').html(decksSize[key]); }
        for (var key in golds) { $('#user' + key + ' .golds').html(golds[key]); }
        var yourArtifacts = JSON.parse(data.yourArtifacts); for (var i = 0; i < yourArtifacts.length; i++) {
            var customValue = yourArtifacts[i].custom; var disabledClass = yourArtifacts[i].disabled ? 'artifact-disabled' : ''; var customDisplay = ''; if (customValue > 0) { customDisplay = '<span class="artifact-custom">' + customValue + '</span>'; }
            $('#yourArtifacts').append('<span class="artifact-group"><img class="artifact-img ' + disabledClass + '" name="' + yourArtifacts[i].name + '" image="' + yourArtifacts[i].image + '" legendary="' + yourArtifacts[i].legendary + '" artifactId="' + yourArtifacts[i].id + '" src="images/artifacts/' + yourArtifacts[i].image + '.png"/> ' + customDisplay + '</span>');
        }
        var enemyArtifacts = JSON.parse(data.enemyArtifacts); for (var i = 0; i < enemyArtifacts.length; i++) {
            var customValue = enemyArtifacts[i].custom; var disabledClass = enemyArtifacts[i].disabled ? 'artifact-disabled' : ''; var customDisplay = ''; if (customValue > 0) { customDisplay = '<span class="artifact-custom">' + customValue + '</span>'; }
            $('#enemyArtifacts').append('<span class="artifact-group"><img class="artifact-img ' + disabledClass + '" name="' + enemyArtifacts[i].name + '" image="' + enemyArtifacts[i].image + '" legendary="' + enemyArtifacts[i].legendary + '" artifactId="' + enemyArtifacts[i].id + '" src="images/artifacts/' + enemyArtifacts[i].image + '.png"/> ' + customDisplay + '</span>');
        }
        if (hand !== null) { for (var i = 0; i < hand.length; i++) { var gameCard = hand[i]; appendCard(gameCard, $('#handCards')); $('#handCards .card').removeClass('col-sm-1').addClass('col-sm-1'); makeDraggable(); } }
        for (var i = 0; i < board.length; i++) {
            if (board[i] !== null) {
                var gameCard = board[i]; if (i <= 3) { appendCard(gameCard, $('[x="' + i + '"][y="' + 0 + '"]')); } else { var nb = i - 4; appendCard(gameCard, $('[x="' + nb + '"][y="' + 1 + '"]')); }
                makeClickable(); makeHoverable();
            }
        }
        if (data.isMulliganDone) {
            updatePlayableCards(data.playableCards, data.playableTriggers, data.availableAttackTargets); if (userTurn === userId) { enableDraggable(); $('#endTurnBtn').prop("disabled", false); } else { disableDraggable(); }
            startTimer(); var turnTime = 600 - data.turnTime * 10; time = turnTime; if (data.waitingCardRange !== undefined) {
                waitingTarget = true; var waitingCardRange = JSON.parse(data.waitingCardRange); if (!spectate) { $('body').addClass('cursorTarget'); }
                $('#handCards #' + waitingCardRange.id).hide(); disableDraggable(); $('.monster').removeClass('canPlay'); makeHoverable(); makeClickable(); showSelectCards(waitingCardRange.selectCards);
            }
        }
        updateDustpile(data.dustpile); var battleLogs = JSON.parse(data.battleLogs); for (var i = 0; i < battleLogs.length; i++) { appendBattleLog(battleLogs[i]); }
        playSound('gameStart');
    } else if (data.action === "getEmote") { var idUser = data.idUser; var emoteImage = data.emoteImage; showEmote(idUser === userId, emoteImage); }
}
function sendPlayMonster(idMonster, x) { socketGame.send(JSON.stringify({ action: "playMonster", id: idMonster, x: x })); }
function sendPlaySpell(idSpell) { socketGame.send(JSON.stringify({ action: "playSpell", id: idSpell })); }
function endTurn() { socketGame.send(JSON.stringify({ action: "endTurn" })); }
function attack(idMonster, idTarget) { socketGame.send(JSON.stringify({ action: "attack", idMonster: idMonster, idTarget: idTarget })); }
function sendEffectTarget(idTarget) { socketGame.send(JSON.stringify({ action: "effectTarget", idTarget: idTarget })); }
function sendCancelWaitingTarget() { socketGame.send(JSON.stringify({ action: "cancelWaitingTarget" })); }
function sendMulligan() { socketGame.send(JSON.stringify({ action: "mulligan", ids: mulliganCards })); }
function sendEmote(idEmote) {
    if (!youDoingEmote) {
        if (gameEmotesDialog !== null) { gameEmotesDialog.close(); }
        socketGame.send(JSON.stringify({ action: "emote", id: idEmote }));
    }
}
function sendUpdateTimer() { timerRequestDate = new Date(); socketGame.send(JSON.stringify({ action: "updateTimer" })); }
function onCloseGame() { if (!finish) { BootstrapDialog.show({ title: $.i18n('game-disconnected-title'), type: BootstrapDialog.TYPE_DANGER, closable: false, message: $.i18n('game-disconnected'), buttons: [{ label: $.i18n('dialog-refresh'), cssClass: 'btn-primary', action: function () { location.reload(); } }] }); } }
function init() {
    $('body').on("contextmenu", function () { return false; }); $('#endTurnBtn').prop("disabled", true); if (!spectate) {
        $(document).mousedown(function (e) {
            if (e.button === 2 && userTurn === userId && selectCardDialog === null) {
                if (monsterAttackId > -1 && !waitingTarget) {
                    monsterAttackId = -1; $('.monster').removeClass('target').css('opacity', 1); $('#enemyHp').removeClass('target'); $('body').removeClass('cursorTarget cursorAttack'); if ($canPlayCards !== null) { $canPlayCards.addClass('canPlay'); }
                    enableDraggable();
                }
                if (waitingTarget) { sendCancelWaitingTarget(); }
            }
        }); $('#enemyHp').click(function () {
            if (userId === userTurn) {
                if (monsterAttackId > -1 && !waitingTarget && $(this).hasClass('target')) { var playerTargetId = -opponentId; attack(monsterAttackId, playerTargetId.toString()); monsterAttackId = -1; $('#enemyHp').css('opacity', 1); $('.monster').css('opacity', 1); $('body').removeClass('cursorTarget cursorAttack'); enableDraggable(); }
                if ($(this).hasClass('target') && waitingTarget) { var enemyTargetId = -opponentId; sendEffectTarget(enemyTargetId.toString()); }
            }
        }); $('#yourHp').click(function () { if (userId === userTurn) { if ($(this).hasClass('target') && waitingTarget) { var allyTargetId = -userId; sendEffectTarget(allyTargetId.toString()); } } }); $("#yourHp").hover(function () { if ($(this).hasClass('target')) { $(this).css('opacity', 0.5); } }, function () { $(this).css('opacity', 1); }); $("#enemyHp").hover(function () { if ($(this).hasClass('target')) { $(this).css('opacity', 0.5); } }, function () { $(this).css('opacity', 1); });
    }
    if (localStorage.getItem("gameMusicDisabled") === null) { $('#btn-volume').html('<span class="glyphicon glyphicon-volume-up"></span>'); } else { $('#btn-volume').html('<span class="glyphicon glyphicon-volume-off"></span>'); }
    if (tutorial) { var message = $.i18n('tutorial-build-first-deck'); $('.returnLink').attr('href', 'Decks').html(message); }
    $(document).mouseup(function () { canClick = true; });
}
function openSocket() { if (socketGame === null) { socketGame = new WebSocket(url); socketGame.onopen = onOpenGame; socketGame.onmessage = onMessageGame; socketGame.onclose = onCloseGame; } }
function makeDraggable() { if (!spectate) { $('.card .ui-draggable').draggable('destroy'); if (userId === userTurn) { $("#handCards .canPlay").draggable({ start: function () { removeCardHover(); cardHoverEnabled = false; updateDroppables($(this)); }, stop: function () { cardHoverEnabled = true; }, revert: function (event, ui) { $(this).data("uiDraggable").originalPosition = { top: 0, left: 0 }; return !event; } }); enableDraggable(); } } }
function disableDraggable() { $("#handCards .card").draggable({ disabled: true }); }
function enableDraggable() { if (!spectate) { $("#handCards .canPlay").draggable({ disabled: false }); } }
function makeClickable() {
    if (!spectate) {
        $(".temp").click(function () { if (canClick) { canClick = false; if (userId === userTurn) { if (monsterAttackId === -1 && waitingTarget) { sendCancelWaitingTarget(); enableDraggable(); } } } }); $('#yourSide .monster').click(function () {
            if (canClick) {
                canClick = false; if ($(this).hasClass('canPlay') || $(this).hasClass('target')) {
                    if (userId === userTurn) {
                        if (monsterAttackId === -1 && !waitingTarget) {
                            monsterAttackId = $(this).attr('id'); $('body').addClass('cursorAttack'); $(this).css('opacity', 0.5); $canPlayCards = $('.canPlay'); $('.canPlay').removeClass('canPlay'); $(this).addClass('canPlay'); var targetIds = availableAttackTargets[monsterAttackId]; for (var i = 0; i < targetIds.length; i++) { var targetId = targetIds[i]; if (targetId > 0) { $('#' + targetId).addClass('target'); } else { $('#enemyHp').addClass('target'); } }
                            disableDraggable();
                        } else if (monsterAttackId > 0 && !waitingTarget) {
                            monsterAttackId = -1; $('.monster').removeClass('target').css('opacity', 1); $('#enemyHp').removeClass('target'); $('body').removeClass('cursorTarget cursorAttack'); if ($canPlayCards !== null) { $canPlayCards.addClass('canPlay'); }
                            enableDraggable();
                        }
                        if (waitingTarget) { sendEffectTarget($(this).attr('id')); }
                    }
                }
            }
        }); $('#enemySide .monster').click(function () {
            if (userId === userTurn) {
                if (monsterAttackId > -1 && !waitingTarget && $(this).hasClass('target')) { attack(monsterAttackId, $(this).attr('id')); monsterAttackId = -1; $('.monster').css('opacity', 1); $('body').removeClass('cursorTarget cursorAttack'); enableDraggable(); }
                if ($(this).hasClass('target') && waitingTarget) { sendEffectTarget($(this).attr('id')); }
            }
        }); $("#enemySide .monster").hover(function () { if (monsterAttackId > -1 && $(this).hasClass('target')) { $(this).css('opacity', 0.5); } }, function () { if (monsterAttackId > -1 && !waitingTarget) { $(this).css('opacity', 1); } });
    }
}
function makeHoverable() { if (!spectate) { $("#board .monster").hover(function () { if ($(this).hasClass('target') || $(this).hasClass('temp')) { $(this).css('opacity', 0.5); } }, function () { if (waitingTarget) { $(this).css('opacity', 1); } }); } }
function startTimer() {
    sendUpdateTimer(); time = 600; $('.timer').html('1:00'); if (userId === userTurn) { $('.timer').removeClass('enemy').addClass('ally'); } else { $('.timer').removeClass('ally').addClass('enemy'); }
    timer = setInterval(function () {
        lockTime--; if (!doingAnimation) {
            time--; if (time >= 0 || lockTime >= 0) {
                var timeText; var finalTime = Math.trunc(time / 10); var minutesLeft = Math.trunc(finalTime / 60); var secondsLeft = finalTime - (minutesLeft * 60); if (secondsLeft >= 10) { timeText = minutesLeft + ':' + secondsLeft; } else { timeText = minutesLeft + ':0' + secondsLeft; }
                var color = 'white'; if (finalTime <= 10) { color = 'red'; } else if (finalTime <= 20) { color = 'orange'; }
                var finalTimeText = '<span class="' + color + '">' + timeText + '</span>'; if (lockTime >= 0) { var lockedSeconds = Math.trunc(lockTime / 10); finalTimeText = '<span class="glyphicon glyphicon-lock"></span> ' + lockedSeconds; }
                $('.timer').html(finalTimeText);
            }
        }
    }, 100);
}
function stopTimer() { clearInterval(timer); }
function toggleMusic() { if (musicEnabled) { $('#btn-volume').html('<span class="glyphicon glyphicon-volume-off"></span>'); localStorage.setItem("gameMusicDisabled", true); musicEnabled = false; music.pause(); } else { $('#btn-volume').html('<span class="glyphicon glyphicon-volume-up"></span>'); localStorage.removeItem("gameMusicDisabled"); musicEnabled = true; playBackgroundMusic(numBackground); } }
function toggleSound() { if (soundEnabled) { $('#btn-volume-sound').html('<span class="glyphicon glyphicon-volume-off"></span>'); localStorage.setItem("gameSoundsDisabled", true); soundEnabled = false; } else { $('#btn-volume-sound').html('<span class="glyphicon glyphicon-volume-up"></span>'); localStorage.removeItem("gameSoundsDisabled"); soundEnabled = true; } }
$(document).keyup(function (e) { if (e.keyCode === 27) { askSurrender(); } }); function askSurrender() { if (!spectate && !tutorial) { if (turn >= 5) { BootstrapDialog.show({ title: $.i18n('game-surrender'), message: $.i18n('game-surrender-action'), buttons: [{ label: $.i18n('game-surrender'), cssClass: 'btn-danger', action: function (dialog) { socketGame.send(JSON.stringify({ action: "surrender" })); dialog.close(); } }, { label: $.i18n('dialog-cancel'), cssClass: 'btn-primary', action: function (dialog) { dialog.close(); } }] }); } else { BootstrapDialog.show({ title: $.i18n('game-surrender'), message: $.i18n('game-surrender-early', 5), buttons: [{ label: $.i18n('dialog-ok'), cssClass: 'btn-primary', action: function (dialog) { dialog.close(); } }] }); } } }
function randomInt(min, max) { return Math.floor(Math.random() * (max - min + 1) + min); }
window.onbeforeunload = function () { socketGame.onclose = function () { }; socketGame.close(); }; Array.prototype.contains = function (obj) {
    var i = this.length; while (i--) { if (this[i] === obj) { return true; } }
    return false;
}; Array.prototype.remove = function () {
    var what, a = arguments, L = a.length, ax; while (L && this.length) { what = a[--L]; while ((ax = this.indexOf(what)) !== -1) { this.splice(ax, 1); } }
    return this;
}; function getDivisionFirstPart(string) { if (string === "LEGEND") { return "LEGEND"; } else { return string.substr(0, string.indexOf('_')); } }
function getMinEloDivision(division) { var elo = getEloDivision(division); return elo; }
function getNextEloDivision(division) { var elo = getEloDivision(division); return elo + 25; }
function getEloDivision(division) {
    var size = divisions.length; var elo = 2200; for (var i = 0; i < size; i++) { var div = divisions[i]; if (division === div) { return 2200 - (25 * (size - 1 - i)); } }
    return elo;
}
function updateSoul(idPlayer, soul) {
    var text = ''; if (soul.hasOwnProperty('lives')) { if (soul.lives > 0) { text += '<span class="red">' + soul.lives + '</span>'; } }
    $('#user' + idPlayer + ' .custom-vars').html(text);
}
function openSettings() {
    var buttonVolume = '<button id="btn-volume" class="btn btn-sm btn-primary" onclick="toggleMusic();"><span class="glyphicon glyphicon-volume-up"></span></button>'; if (!musicEnabled) { buttonVolume = '<button id="btn-volume" class="btn btn-sm btn-primary" onclick="toggleMusic();"><span class="glyphicon glyphicon-volume-off"></span></button>'; }
    var buttonSound = '<button id="btn-volume-sound" class="btn btn-sm btn-primary" onclick="toggleSound();"><span class="glyphicon glyphicon-volume-up"></span></button>'; if (!soundEnabled) { buttonSound = '<button id="btn-volume-sound" class="btn btn-sm btn-primary" onclick="toggleSound();"><span class="glyphicon glyphicon-volume-off"></span></button>'; }
    var buttonSurrender = '<button class="btn btn-sm btn-danger" onclick="askSurrender();"><span class="glyphicon glyphicon-flag"></span></button>'; var buttonCopy = '<button class="btn btn-sm btn-success" onclick="copyLink();"><span class="glyphicon glyphicon-link"></span></button>'; var spectateLink = '<input type="text" id="gameLink" class="form-control" value="https://undercards.net/Spectate?gameId=' + gameId + '&playerId=' + userId + '" readonly/>'; var settingsText = $.i18n('game-settings'); var musicText = $.i18n('game-settings-music'); var soundText = $.i18n('game-settings-sounds'); var surrenderText = $.i18n('game-surrender'); var spectateLinkText = $.i18n('game-settings-spectate-link'); if (!spectate) {
        if (!tutorial) {
            settingsDialog = BootstrapDialog.show({
                title: '<span class="glyphicon glyphicon-cog"></span> ' + settingsText, message: buttonVolume + ' ' + musicText + '<br/><br/>'
                    + buttonSound + ' ' + soundText + '<br/><br/>'
                    + buttonSurrender + ' ' + surrenderText + '<br/><br/>'
                    + buttonCopy + ' ' + spectateLinkText + '<br/><br/>'
                    + spectateLink, buttons: [{ label: $.i18n('dialog-close'), cssClass: 'btn-primary', action: function (dialog) { dialog.close(); } }]
            });
        } else {
            BootstrapDialog.show({
                title: '<span class="glyphicon glyphicon-cog"></span> ' + settingsText, message: buttonVolume + ' ' + musicText + '<br/><br/>'
                    + buttonSound + ' ' + soundText + '<br/><br/>', buttons: [{ label: $.i18n('dialog-close'), cssClass: 'btn-primary', action: function (dialog) { dialog.close(); } }]
            });
        }
    } else {
        BootstrapDialog.show({
            title: '<span class="glyphicon glyphicon-cog"></span> ' + settingsText, message: buttonVolume + ' ' + musicText + '<br/><br/>'
                + buttonSound + ' ' + soundText + '<br/><br/>'
                + buttonCopy + ' ' + spectateLinkText + '<br/><br/>'
                + spectateLink, buttons: [{ label: $.i18n('dialog-close'), cssClass: 'btn-primary', action: function (dialog) { dialog.close(); } }]
        });
    }
}
function getLastPart(url) { var parts = url.split("/"); return (url.lastIndexOf('/') !== url.length - 1 ? parts[parts.length - 1] : parts[parts.length - 2]); }
function copyLink() { $('#gameLink').select(); document.execCommand("copy"); }
function messageTuto() {
    var message = ""; switch (countTuto) { case 0: message = $.i18n("tutorial-1") + '<br/><br/>' + $.i18n("tutorial-2") + '<br/>' + $.i18n("tutorial-3") + ' : <br/><br/>' + $.i18n("tutorial-4") + '<br/><br/>' + $.i18n("tutorial-5") + '<br/><br/>' + $.i18n("tutorial-6") + ' : <ul><li><img src="images/board/cards.png"/> ' + $.i18n("tutorial-7") + '</li><li><img src="images/board/hand.png"/> ' + $.i18n("tutorial-8") + '</li><li><img src="images/board/gold.png"/> ' + $.i18n("tutorial-9") + '</li></ul>'; break; case 1: message = $.i18n("tutorial-10") + ' : <ul><li><span class="blue">2</span> : ' + $.i18n("tutorial-11") + '</li><li><span class="red">2</span> : ' + $.i18n("tutorial-12") + '</li><li><span class="green">3</span> : ' + $.i18n("tutorial-13") + '</li></ul>'; break; case 2: message = $.i18n("tutorial-14"); $('#endTurnBtn').hide(); break; case 3: $('#endTurnBtn').show(); message = $.i18n('tutorial-15', '<span class="glyphicon glyphicon-retweet green"></span>'); break; case 4: message = $.i18n("tutorial-16") + ' : <br/><br/>' + $.i18n("tutorial-17"); break; case 5: message = $.i18n("tutorial-18") + ' : <br/><br/> ' + $.i18n("tutorial-19") + ' : <ul><li>' + $.i18n("tutorial-20") + '</li><li>' + $.i18n("tutorial-21") + '</li></ul><br/>' + $.i18n("tutorial-22") + '<br/><br/>' + $.i18n("tutorial-23", 2) + '<br/><br/>' + $.i18n("tutorial-24"); break; case 6: message = $.i18n("tutorial-25") + ' : <ul><li>' + $.i18n("{{KW:MAGIC}}") + '</li><li>' + $.i18n("{{KW:DUST}}") + '</li><li>' + $.i18n("{{KW:TAUNT}}") + '</li><li>' + $.i18n("{{KW:CHARGE}}") + '</li><li>' + $.i18n("{{KW:HASTE}}") + '</li><li>' + $.i18n("{{KW:DISARMED}}") + '</li><li>' + $.i18n("{{KW:TURBO}}") + '</li><li>' + $.i18n("{{KW:ARMOR}}") + '</li></ul><br/><p>' + $.i18n("tutorial-26") + '</p>'; break; }
    countTuto++; BootstrapDialog.show({
        title: $.i18n('tutorial-title'), closable: false, message: message, buttons: [{
            label: $.i18n('dialog-ok'), cssClass: 'btn-primary', action: function (dialog) {
                dialog.close(); if (countTuto < 3) { messageTuto(); }
                if (countTuto === 5) { messageTuto(); }
            }
        }]
    });
}
function checkTuto(data) {
    if (tutorial) {
        switch (data.action) {
            case "connect": $('.timer').remove(); messageTuto(); break; case "getMonsterPlayed": if (countTuto === 3) { messageTuto(); }
                if (countTuto === 6) { messageTuto(); }
                break; case "getTurnStart": userTurn = data.idPlayer; if (userTurn === userId) { if (countTuto === 4) { messageTuto(); } }
                break;
        }
    }
}
function playSound(soundName) { if (soundEnabled) { var soundPath = '/sounds/' + soundName + '.wav'; audio = new Audio(soundPath); audio.volume = 0.2; audio.play(); } }
function playJingle(cardName) { if (musicEnabled) { var soundPath = '/musics/cards/' + cardName.split(' ').join('_') + '.ogg'; music.pause(); jingle.pause(); jingle.removeEventListener('ended', jingleEnd); jingle = new Audio(soundPath); jingle.volume = 0.2; jingle.addEventListener('ended', jingleEnd, false); jingle.play(); } }
function playBackgroundMusic(musicName) { if (musicEnabled) { var musicPath = '/musics/themes/' + musicName + '.ogg'; music = new Audio(musicPath); music.volume = 0.1; music.addEventListener('ended', function () { this.currentTime = 0; this.play(); }, false); music.play(); } }
function playMusic(musicName) { if (musicEnabled) { var musicPath = '/musics/' + musicName + '.ogg'; music = new Audio(musicPath); music.volume = 0.2; music.addEventListener('ended', function () { this.currentTime = 0; this.play(); }, false); music.play(); } }
function showEmote(isYou, image) { if (gameEmotesEnabled) { if (isYou && !youDoingEmote) { youDoingEmote = true; $('#yourBubble').show(); $('#yourEmote').attr('src', 'images/emotes/' + image + '.png').show(); setTimeout(function () { $('#yourBubble').fadeOut(500); $('#yourEmote').fadeOut(500); }, 2000); setTimeout(function () { $('#yourEmote').removeAttr('src'); youDoingEmote = false; }, 2500); } else if (!isYou && !enemyDoingEmote && !enemyMute) { enemyDoingEmote = true; $('#enemyBubble').show(); $('#enemyEmote').attr('src', 'images/emotes/' + image + '.png').show(); setTimeout(function () { $('#enemyBubble').fadeOut(500); $('#enemyEmote').fadeOut(500); }, 2000); setTimeout(function () { $('#enemyEmote').removeAttr('src'); enemyDoingEmote = false; }, 2500); } } }
function showGameEmotes() {
    if (!spectate) {
        var popupContent = '<div class="container" style="width: 500px;">'; for (var i = 0; i < gameEmotes.length; i++) { var emote = gameEmotes[i]; var chatEmote = '<div style="margin-bottom: 15px;" class="col-sm-2"><img class="pointer" style="height: 48px;" src="images/emotes/' + emote.image + '.png" onclick="sendEmote(\'' + emote.id + '\');" /></div>'; popupContent += chatEmote; }
        popupContent += '</div>'; gameEmotesDialog = BootstrapDialog.show({ title: 'Emotes', message: popupContent, buttons: [{ label: 'Cancel', cssClass: 'btn-primary', action: function (dialog) { dialog.close(); } }] });
    }
}
function toggleMute() { if (!spectate) { enemyMute = !enemyMute; if (enemyMute) { $('#enemyMute').show(); } else { $('#enemyMute').hide(); } } }
function checkLimitedPack(level) {
    if (level === 3 || level === 10 || level === 25) {
        var title = ''; var image = ''; var text = ''; var style = ''; if (level === 25) { title = $.i18n('reward-final-pack'); image = 'determinationPack'; text = $.i18n('shop-limited-pack-advanced'); style = 'shop DETERMINATION'; } else if (level === 10) { title = $.i18n('reward-super-pack'); image = 'legendaryPack'; text = $.i18n('shop-limited-pack-intermediate'); style = 'shop LEGENDARY'; } else if (level === 3) { title = $.i18n('reward-super-pack'); image = 'legendaryPack'; text = $.i18n('shop-limited-pack-beginner'); style = 'shop LEGENDARY'; }
        BootstrapDialog.show({ title: $.i18n('shop-limited-packs'), size: BootstrapDialog.SIZE_WIDE, closable: false, message: '<p style="font-size: 36px;">' + title + '</p><br/><div style="text-align: center;"><img class="' + style + '" src="images/' + image + '.png" /></div><br/><br/><div><p>' + text + '</p></div><br/><br/>', buttons: [{ label: $.i18n('dialog-check'), cssClass: 'btn-success', action: function () { location.href = "Shop#limited-title"; } }, { label: $.i18n('dialog-decline'), cssClass: 'btn-danger', action: function (dialog) { dialog.close(); } }] });
    }
}
function showSelectCards(selectCards) {
    if (selectCardDialog === null) {
        if (spectate) { spectateclass = 'spectate'; }
        selectCardDialog = BootstrapDialog.show({ title: $.i18n('game-select-card'), closable: spectate, size: BootstrapDialog.SIZE_WIDE, message: '<div id="select-cards" class="container cardsPreview"></div>', buttons: [{ label: '', cssClass: 'invisible', action: function (dialog) { } }], onshown: function (dialog) { for (var i = 0; i < selectCards.length; i++) { var card = selectCards[i]; var appendedCard = appendCard(card, $('#select-cards')); appendedCard.addClass('col-md-2'); appendedCard.click(function (e) { if (e.button === 0) { var idCard = $(this).attr('id'); sendEffectTarget(idCard); } }); } }, onhide: function () { selectCardDialog = null; } });
    }
}
function openDustpile(isYou) {
    isYourDustpile = isYou; var customDustpile = getCustomDustpile(isYou); if (customDustpile.length > 0 && dustpileDialog === null) {
        var text = '<div id="dustpile" class="container cardsPreview no-hover">'; for (var i = 0; i < customDustpile.length; i++) { var $dustpileCard = appendCard(customDustpile[i], null); $dustpileCard.addClass('col-md-2'); text += $dustpileCard.prop('outerHTML'); }
        text += '</div>'; dustpileDialog = BootstrapDialog.show({ title: $.i18n('game-dustpile') + ' (<span id="dustpile-size">' + customDustpile.length + '</span>)', closable: true, size: BootstrapDialog.SIZE_WIDE, message: text, buttons: [{ label: $.i18n('dialog-ok'), cssClass: 'btn-primary', action: function (dialog) { dustpileDialog = null; dialog.close(); } }], onhide: function () { dustpileDialog = null; } });
    }
}
function displayAvailableTargets(targetIds) { for (var i = 0; i < targetIds.length; i++) { var targetId = targetIds[i]; if (targetId > 0) { $('#' + targetId).addClass('target'); } else { if (-targetId === userId) { $('#yourHp').addClass('target'); } else if (-targetId === opponentId) { $('#enemyHp').addClass('target'); } } } }
function updateDroppables($card) {
    $('.ui-droppable').droppable('destroy'); if ($card.hasClass('canPlay')) {
        if ($card.hasClass('monster')) {
            $('.droppableMonster:not(:has(.monster))').droppable({
                drop: function (event, ui) {
                    if ($(ui.draggable).hasClass('monster')) {
                        var target = $(event.target); if ($(this).find('.card').length === 0) { sendPlayMonster(ui.draggable.attr('id'), target.attr('x')); }
                        $card.draggable('option', 'revert', true);
                    }
                }, hoverClass: 'dropping', accept: '.monster'
            });
        }
        if ($card.hasClass('spell')) {
            $(".droppableSpell").droppable({
                drop: function (event, ui) {
                    if ($(ui.draggable).hasClass('spell')) { sendPlaySpell(ui.draggable.attr('id')); }
                    $card.draggable('option', 'revert', true);
                }, hoverClass: 'dropping', accept: '.spell'
            });
        }
    }
}
function updatePlayableCards(playableCardsParam, playableTriggersParam, availableAttackTargetsParam) {
    var playableCards = JSON.parse(playableCardsParam); var playableTriggers = JSON.parse(playableTriggersParam); availableAttackTargets = JSON.parse(availableAttackTargetsParam); $('.card').removeClass('canPlay').removeClass('trigger-helper'); for (var i = 0; i < playableCards.length; i++) { var playableCardId = playableCards[i]; var $playableCard = $('#' + playableCardId); $playableCard.addClass('canPlay'); if (playableTriggers.indexOf(playableCardId) > -1) { $playableCard.addClass('trigger-helper'); } }
    $canPlayCards = $('.canPlay'); makeDraggable();
}
function checkSpecialProfileSkin(profileSkin) { var profileSkinBackgrounds = ['Vaporwave', 'Sans Bar', 'Holy War', 'Spider Party', 'Halloween2020', 'Memories of the Snow', 'Smartopia Arrived']; var profileSkinMusics = ['Vaporwave', 'Spider Party', 'Memories of the Snow', 'Smartopia Arrived']; if (profileSkinBackgrounds.indexOf(profileSkin.name) > -1) { var backgroundImage = '/images/backgrounds/' + profileSkin.image + '.png'; $('body').css('background', '#000 url(' + backgroundImage + ') no-repeat'); $('body').css('background-size', 'cover'); if (profileSkinMusics.indexOf(profileSkin.name) > -1) { numBackground = profileSkin.image; } } }
function updateDustpile(dustpileData) {
    dustpile = JSON.parse(dustpileData); var customDustpile = getCustomDustpile(isYourDustpile); var allyDustpileCount = getCustomDustpile(true).length; var enemyDustpileCount = getCustomDustpile(false).length; $('#user' + userId).find('.btn-dustpile').prop('disabled', allyDustpileCount === 0); $('#user' + opponentId).find('.btn-dustpile').prop('disabled', enemyDustpileCount === 0); if (dustpileDialog !== null) {
        $('#dustpile-size').text(customDustpile.length); var text = '<div id="dustpile" class="container cardsPreview no-hover">'; for (var i = 0; i < customDustpile.length; i++) { var $dustpileCard = appendCard(customDustpile[i], null); $dustpileCard.addClass('col-md-2'); text += $dustpileCard.prop('outerHTML'); }
        text += '</div>'; $('#dustpile').replaceWith(text);
    }
}
function getCustomDustpile(isYou) {
    var customDustpile = []; for (var i = 0; i < dustpile.length; i++) { var deadMonster = dustpile[i]; if ((isYou && deadMonster.ownerId === userId) || (!isYou && deadMonster.ownerId === opponentId)) { customDustpile.push(deadMonster); } }
    return customDustpile;
}