import Player from './Player.js';

export {ctx, cnv, players, timerg};
import {drawHP} from './HealthPoint.js';
import {
	clearPlayerInterval,
	resetInstructions,
	gameFightInstructions,
	gameInstructionMenu,
} from './Instructions.js';
import {resetTransition} from './Map.js';
import {resetCharacterSelect} from './CharacterSelect.js';
import {imageNumber} from './TimerDef.js';
import Timer from './TimerClass.js';

let cnv = document.getElementById('myCanvas');
let ctx = cnv.getContext('2d');

ctx.imageSmoothingEnabled = false;

let returnBack = false;
let onMenu = true;

let player1 = new Player(0, 0, ctx, true);
let player2 = new Player(cnv.width, 0, ctx, false);
let players = [player1, player2];
let timerg = new Timer(99, ctx, imageNumber, (cnv.width/2)-62);

function update() {
	ctx.beginPath();
	ctx.clearRect(0, 0, cnv.width, cnv.height);
	onMenu = gameInstructionMenu();
	if (onMenu == true) {
		game();
		gameFightInstructions();
	}
}

///execute le combat
function game() {
	drawHP(players);

	player1.changeDirection(player2);
	player2.changeDirection(player1);

	drawCharacter(player1, player2);
	drawCharacter(player2, player1);
	timerg.displayTime();
	checkWin();
	ctx.closePath();
}

///dessine les personnages sur le canvas
function drawCharacter(player, ennemy) {
	player.jumpingMove();
	//Si le joueur est à gauche on le dessinne normalement sinon
	//on inverse son image dans le sens horizontale
	if (player.direction == false) {
		player.ctx.save();
		player.ctx.translate(0, 0);
		player.ctx.scale(-1, 1);
		player.drawing(ennemy);
		player.ctx.restore();
	} else {
		player.drawing(ennemy);
	}
}

///vérifie si le match est terminer et si oui stop la partie, clear les setInterval et retour au debut
function checkWin() {
	if (player1.hp == 0 || player2.hp == 0 || timerg.getTime() == 0) {
		clearPlayerInterval();
		//clearIntervalTimer();
		if (returnBack == false) {
			returnBack = true;
			setTimeout(inGoBack, 2000);
		}
	}
}

///fonction de retour au debut du jeu
function inGoBack() {
	onMenu = true;
	resetCharacterSelect();
	player1.resetCharacter(0, 0);
	player2.resetCharacter(cnv.width, 0);
	resetTransition();
	resetInstructions();
	timerg.resetTime();
	returnBack = false;
}
setInterval(update, 45);
