import Character from './Character.js';

export{player_1,player_2,ctx,cnv};
import{character_select,moveInSelect,selectID,selected,loadEverything,selectedPath,resetSprite} from './LoadSprite.js';
import{sound,sound_select} from './Sound.js'
import {drawHP} from './HealthPoint.js'
import {instru_list,getLists} from './Instructions.js'

let cnv = document.getElementById('myCanvas');
let ctx = cnv.getContext('2d');
//ctx.canvas.width = window.innerWidth;
//ctx.canvas.height = window.innerHeight;
let cnv_player_1 = document.getElementById('myCanvas');
let ctx_player_1 = cnv_player_1.getContext('2d');
ctx_player_1.width = cnv.width;
ctx_player_1.height = cnv.height;

ctx.imageSmoothingEnabled = false;
let number_of_player = 2;
let go = false;
let hp_1 = 500;
let hp_2 = 500;
let action = true;
let transition_done = false;
let black_screen = false;

let opacity = 0;
let opacity_value = 0.05;
let enterGame = false;
let enterGameTimer = false;
let returnBack = false;
let KO = false;

//select pour si on est rentré dans la selection
let select = false;

let selectTimer = false;
let selectInter = null;

let player_1 = new Character('Dinath', 0, 0, ctx, true);
let player_2 = new Character('Fayçal', cnv.width, 0, ctx, false);
let players = [player_1, player_2];
///variable utiliser pour les liste d'instructions
let PlayerInterval = null;
let launchIntervals;

///quel personnage va etre choisie
let P1Choice = rdom(3, 0);
let P2Choice = rdom(3, 0);


//Comme ça il ne charge qu'une fois la map et non plusieurs fois en boucle
function mapSelect() {
	ctx.fillStyle = 'rgba(0, 0, 0,' + opacity + ')';
	ctx.fillRect(0, 0, cnv.width, cnv.height);
	opacity += opacity_value;

	if (opacity < 0) {
		go = false;
	}
	if (opacity > 0.99) {
		black_screen = true;
		transition_done = true;
		opacity_value = -opacity_value;
		launchIntervals = true;
	}

	if (black_screen == true) {
		cnv.style.backgroundImage = 'url(assets/background/bg_7_2.gif)';
		black_screen = false;
	}
}

sound[3].play();
function update() {
	ctx.beginPath();
	ctx.clearRect(0, 0, cnv.width, cnv.height);

	//Le go c'est juste car quand le programme se lance il execute le update avant meme
	//que player_1 reçoit les sprites du coup on a des error dans la console
	if(enterGameTimer == false) {
		enterGameTimer = true;
		setTimeout(InGame, 1000);
	}

	if (select == true) {
		if(selectTimer == true) {
			selectTimer = false;
		    selectInter = setInterval(InSelect, 1000);
		}
		sound[3].pause();
		ctx.drawImage(character_select[selectID], 0, 0);
	}

	if (go == true) mapSelect();
	if (transition_done == true) game();
	
	///si on peut commencer la partie alors les interval son lancer(le combats)
	if(launchIntervals == true) {
		launchIntervals = false;
		// On recupere la liste d'instruction
		PlayerInterval = setInterval(function() {instru_list(players)}, 500);
	}
}

///execute le combat
function game() {
	drawHP(players);

	player_1.changeDirection(player_2);
	player_2.changeDirection(player_1);

	drawCharacter(player_1, player_2);
	drawCharacter(player_2, player_1);
	checkWin();
	ctx.closePath();
}

///dessine les personnages sur le canvas
function drawCharacter(player, ennemy) {
	player.jumpingMove();
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
	if(player_1.hp == 0 || player_2.hp == 0) {
		KO = true;
		clearInterval(PlayerInterval);
		if(returnBack == false) {
			returnBack = true;
			setTimeout(InGoBack, 2000);
		}
	}
}


///fonction de random (a revoir)
function rdom(max, min) {
	return Math.floor(Math.random() * (max - min) + min);
}

///fonction rentrant dans le jeu
function InGame() {
	sound_select(1);

	enterGame = true;
	select = true;
	selectTimer = true;
}


///fonction executant la partie selection du jeu
function InSelect() {
	if(selected.length == 0) {
		moveInSelect(P1Choice);
	}
	else if(selected.length == 1) {
		moveInSelect(P2Choice);
	}
	else {
		select = false;
		selectedPath();
		loadEverything();
		sound_select(2);
		go = true;
		clearInterval(selectInter);
	}
}

///fonction de retour au debut du jeu
function InGoBack() {
	enterGame = false;
	enterGameTimer = false;
	select = false;
	go = false;
	transition_done = false;
	action = false;
	hp_1 = 300;
	hp_2 = 300;
	returnBack = false;
	player_1 = new Character('Dinath', 0, 0, ctx, true);
	player_2 = new Character('Fayçal', cnv.width, 0, ctx, false); 
	resetSprite();
	opacity = 0;
	opacity_value = 0.05;
	KO = false;
	InstruID1 = 0;
	InstruID2 = 0;
	P1Choice = rdom(3, 0);
	P2Choice = rdom(3, 0);
}

setInterval(update, 45);
