import {
	select,
	inSelect,
	inGame,
	selectID,
	selected,
} from '../Menu/CharacterSelect.js';
import { ctx, players, timerg } from '../Game.js';
import { makePause, soundSelect } from '../Visual/Sound.js';
import { characterSelect } from '../Visual/LoadSprite.js';
import { transitionMap } from '../Menu/Map.js';
import { clearIntervalTimer } from '../Timer/TimerDef.js';
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

/// Variables pour les listes d'instructions
let playerInterval = null;
let launchIntervals = true;
let timerInterval = null;

/// Variables pour stocker les mouvements choisis par l'utilisateur
let player1Move = null;
let player2Move = null;

/// Gestion des mouvements utilisateurs
///Gestion des mouvements utilisateurs
document.addEventListener('keydown', function(event) {
	switch (event.key) {
		// Joueur 1 (AZERTY)
		case 'q':
			player1Move = 'walk-left';
			break;
		case 'd':
			player1Move = 'walk-right';
			break;
		case 's':
			player1Move = 'down';
			break;
		case 'z':
			player1Move = 'jump';
			break;
		case 'a':
			player1Move = 'punch';
			break;
		case 'e':
			player1Move = 'kick';
			break;
		case 'w':
			player1Move = 'hadoken';
			break;
		case 'c':
			player1Move = 'block';
			break;
		case 'Shift':
			player1Move = 'run-left';
			break;
		case 'Control':
			player1Move = 'run-right';
			break;

		// Joueur 2 (Pavé numérique)
		case 'ArrowLeft':
			player2Move = 'walk-left';
			break;
		case 'ArrowRight':
			player2Move = 'walk-right';
			break;
		case 'ArrowDown':
			player2Move = 'down';
			break;
		case 'ArrowUp':
			player2Move = 'jump';
			break;
		case '1': // Numpad1
			player2Move = 'punch';
			break;
		case '2': // Numpad2
			player2Move = 'kick';
			break;
		case '3': // Numpad3
			player2Move = 'hadoken';
			break;
		case '0': // Numpad0
			player2Move = 'block';
			break;
		case '4': // Numpad4
			player2Move = 'run-left';
			break;
		case '6': // Numpad6
			player2Move = 'run-right';
			break;
	}
});


/// Gère l'état du jeu avant combat
function gameInstructionMenu() {
	if (enterGameTimer == false) {
		soundSelect('menu', false);
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

function gameFightInstructions() {
	if (launchIntervals == false) return;

	launchIntervals = false;
	playerInterval = setInterval(function () {
		instruList(players);
	}, 50);
	timerInterval = setInterval(function () {
		timerg.decreseTime(1);
	}, 1000);
}

function instruList(players) {
	// Exécute les mouvements sélectionnés par les joueurs
	instruExecute(players[0], player1Move);
	// Pour le joueur 2, vous pouvez ajouter la logique ici si des contrôles sont définis pour lui
	instruExecute(players[1], player2Move);

	// Réinitialise les mouvements pour permettre une nouvelle entrée utilisateur
	player1Move = null;
	player2Move = null;
}

function instruExecute(player, movement) {
	if (!movement) return; // Si aucun mouvement n'est défini, ne rien faire

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

function clearPlayerInterval() {
	clearInterval(playerInterval);
	clearIntervalTimer(timerInterval);
}

function resetInstructions() {
	selectTimer = true;
	selectInter = null;
	playerInterval = null;
	launchIntervals = true;
	timerg.resetTime();
}