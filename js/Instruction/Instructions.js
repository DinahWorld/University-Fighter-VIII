import {
	select,
	inSelect,
	inGame,
	selectID,
	selected,
	randomValue
} from '../Menu/CharacterSelect.js';
import {ctx, players, timerg} from '../Game.js';
import {makePause,soundSelect} from '../Visual/Sound.js';
import {characterSelect} from '../Visual/LoadSprite.js';
import {transitionMap} from '../Menu/Map.js';
import {clearIntervalTimer} from '../Timer/TimerDef.js';
export {
	clearPlayerInterval,
	resetInstructions,
	gameFightInstructions,
	gameInstructionMenu,
	selectInter,
	setTrueSelectTimer,
};

let selectTimer = false;
let enterGameTimer = false;
let selectInter = null;

///variables utiliser pour les instructions
let playerInterval = null;
let launchIntervals = true;
let timerInterval = null;

///Gere l'état du jeu avant combat
function gameInstructionMenu() {
	//Comme si on appuyait sur entrer pour rentrer dans le menu selection
	if (enterGameTimer == false) {
		soundSelect('menu',false);
		enterGameTimer = true;
		setTimeout(inGame, 2000);
	}

	if (select == true) {
		if (selectTimer == true) {
			selectTimer = false;
			selectInter = setInterval(inSelect, 1000);
		}
		makePause('menu');
		ctx.drawImage(characterSelect[selectID], 0, 0);
	}

	if (selected == true) {
		if (transitionMap() == false) {
			return true;
		}
	}
	return false;
}
///lance les instervals quand il faut du combat
function gameFightInstructions() {
	///si on peut commencer la partie alors les interval son lancer(le combats)
	if (launchIntervals == false) return;
	
	launchIntervals = false;
	playerInterval = setInterval(function () {
		instruDo(players);
	}, 500);
	timerInterval = setInterval(function() {timerg.decreseTime(1)}, 1000);
}

///instruDo est appeler par le setInteveral pour chaque joueur avec l'instruction à réaliser
function instruDo(players) {
	// On recupere les instructions
	let move1 = getInstru(players, players[0]);
	let move2 = getInstru(players, players[1]);
	instruExecute(players[0], move1);
	instruExecute(players[1], move2);

}

///execute l'instruction que est donner
function instruExecute(player, movement) {
	switch (movement) {
		case 'walk-left':
			player.walkLeft();
			break;
		case 'walk-right':
			player.walkRight();
			break;
		case 'run-left':
			player.runLeft();
			break;
		case 'run-right':
			player.runRight();
			break;
		case 'down':
			player.down();
			break;
		case 'punch':
			player.punch();
			break;
		case 'jump':
			player.jump();
			break;
		case 'hadoken':
			player.hadoken();
			break;
		case 'kick':
			player.kick();
			break;
		case 'block':
			player.block();
			break;
	}
}

function setTrueSelectTimer() {
	return (selectTimer = true);
}

///clear les interval des joueurs
function clearPlayerInterval() {
	clearInterval(playerInterval);
	clearIntervalTimer(timerInterval);
}

///reset des instruction et du timer
function resetInstructions() {
	selectTimer = true;
	selectInter = null;
	playerInterval = null;
	launchIntervals = true;
	timerg.resetTime();
}

///détermine l'état du combat et renvoie une instruction approprié (un bot)
function getInstru(players, recevingPlayer) {
	let choiceValue = randomValue(6,0);
	if(recevingPlayer.direction == true) {
		if(players[0].spaceBTWplayers(players[1]) > players[0].sizeW) {
			if(choiceValue < 2) {
				return "walk-right";
			}
			else if(choiceValue == 2) {
				return "jump";
			}
			else if(choiceValue == 3) {
				return "run-right";
			}
			else if(choiceValue == 4) {
				return "hadoken";
			}
			else {
				return "walk-left";
			}
		}
		else {
			if(choiceValue < 2) {
				return "punch";
			}
			else if(choiceValue == 2) {
				return "kick";
			}
			else if(choiceValue == 3) {
				return "block";
			}
			else {
				return "run-left";
			}
		}
	}
	else {
		if(players[0].spaceBTWplayers(players[1]) > players[0].sizeW) {
			if(choiceValue < 2) {
				return "walk-left";
			}
			else if(choiceValue == 2) {
				return "jump";
			}
			else if(choiceValue == 3) {
				return "run-left";
			}
			else if(choiceValue == 4) {
				return "hadoken";
			}
			else {
				return "walk-right";
			}
		}
		else {
			if(choiceValue < 2) {
				return "punch";
			}
			else if(choiceValue == 2) {
				return "kick";
			}
			else if(choiceValue == 3) {
				return "block";
			}
			else {
				return "run-right";
			}
		}
	}
}
