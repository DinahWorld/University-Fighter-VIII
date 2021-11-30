import Player from './Player/Player.js';
import {drawHP} from './Player/HealthPoint.js';
import {
	resetInstructions,
	gameFightInstructions,
	gameInstructionMenu,
} from './Instruction/Instructions.js';
import {resetTransition} from './Menu/Map.js';
import {resetCharacterSelect} from './Menu/CharacterSelect.js';
import {imageNumber} from './Timer/TimerDef.js';
import Timer from './Timer/TimerClass.js';
import {checkWin,resetKO} from './Ko/Ko.js'
import { makePause ,restartSound} from './Visual/Sound.js';

export {ctx, cnv, players,gradient,gradientSet,timerg,inGoBack};


let cnv = document.getElementById('myCanvas');
let ctx = cnv.getContext('2d');
let gradient = null;

ctx.imageSmoothingEnabled = false;
// Variable qui nous indiquera si on est sur le menu
let onMenu = true;
// Nos joueurs
let player1 = new Player(0, 0, ctx, true);
let player2 = new Player(-cnv.width, 0, ctx, false);
let players = [player1, player2];
// Notre timer
let timerg = new Timer(99, ctx, imageNumber, (cnv.width/2)-62);

// Fonction Principale
function update() {
	ctx.beginPath();
	ctx.clearRect(0, 0, cnv.width, cnv.height);
	//On verifie si l'instruction donné par la fonction
	//nous ramene dans le combat
	onMenu = gameInstructionMenu();
	if (onMenu == true) {
		game();
		gameFightInstructions();
	}
	ctx.closePath();
}

///execute le combat
function game() {
	ctx.beginPath();
	//On verifie s'il y a un changement de direction sur l'un des deux perso
	player1.changeDirection(player2);
	player2.changeDirection(player1);

	//On dessinne nos personnages 
	drawCharacter(player1, player2);
	drawCharacter(player2, player1);
	//On dessine la barre d'hp
	drawHP(players);

	//On dessine le timer
	timerg.displayTime();
	//On vérifie s'il l'un des deux personnage est mort
	checkWin();
	ctx.closePath();

}

///dessine les personnages sur le canvas
function drawCharacter(player, ennemy) {
	player.jumpingMove();
	//Si le joueur est à gauche on le dessine normalement sinon
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


///fonction de retour au debut du jeu
function inGoBack() {
	makePause('soundtrack');
	restartSound('soundtrack')
	onMenu = true;
	resetCharacterSelect();
	player1.resetCharacter(0, 0);
	player2.resetCharacter(-cnv.width, 0);
	resetTransition();
	resetInstructions();
	resetKO();
	timerg.resetTime();
}
setInterval(update, 45);

// Fonction qui nous servira à faire le dégradé de couleur de la barre 
// d'hp
function gradientSet(posX,width){
	gradient = ctx.createLinearGradient(posX, 0, width, 0);

}