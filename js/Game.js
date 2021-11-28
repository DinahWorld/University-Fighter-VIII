import Character from './Character.js';

export{player_1,player_2,ctx,cnv};
import{character_select,moveInSelect,selectID,selected,loadEverything,selectedPath,resetSprite} from './LoadSprite.js';
import{sound,sound_select} from './Sound.js'
import {drawHP} from './HealthPoint.js'

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
let P1Interval = null;
let P2Interval = null;
let launchIntervals;
let InstruID1 = 0;
let InstruID2 = 0;
let listP1;
let listP2;

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
		console.log("les value qui bugs");
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
	//console.log(go);
	if (select == true) {
		if(selectTimer == true) {
			selectTimer = false;
		    selectInter = setInterval(InSelect, 1000);
		}
		sound[3].pause();
		ctx.drawImage(character_select[selectID], 0, 0);
	}
	if (go == true) {
		mapSelect();
	}
	
	if (transition_done == true) {
		game();
	}
	///si on peut commencer la partie alors les interval son lancer(le combats)
	if(launchIntervals == true) {
		launchIntervals = false;
		getLists();
		P1Interval = setInterval(function() {instru_list(player_1, listP1, InstruID1)}, 500);
		P2Interval = setInterval(function() {instru_list(player_2, listP2, InstruID2)}, 500);
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
	if(hp_1 == 0 || hp_2 == 0) {
		KO = true;
		clearInterval(P1Interval);
		clearInterval(P2Interval);
		if(returnBack == false) {
			returnBack = true;
			setTimeout(InGoBack, 2000);
		}
	}
}

///execute l'instruction que est donner on doit faire cela car sinon le programme lis la liste d'un coup
function instru_execute(player, movement) {
	switch (movement) {
		case "walk-left":
			player.walk_left();
			break;
		case "walk-right":
			player.walk_right();
			break;
		case "run-left":
			player.run_left();
			break;
		case "run-right":
			player.run_right();
			break;
		case "down":
			player.down();
			break;
		case "punch":
			player.punch();
			break;
		case "jump":
			player.jump();
			break;
		case "hadoken":
			player.hadoken();
			break;
		case "kick":
			player.kick();
			break;
		case "block":
			player.block();
			break;
		
		
	}
}

///instru list est appeler par le setInteveral pour chaque joueur avec leur liste a faire
function instru_list(player, instruPlayer, instruID) {
	instru_execute(player, instruPlayer[instruID]);
	if(instruID != instruPlayer.length-1) {instruID+=1;}
	else{instruID = 0;}
	//On fait cela car instruID ne change pas les valeurs globals
	if(player == player_1) {
		InstruID1 = instruID;
	}
	else {
		InstruID2 = instruID;
	}
}

///donne une liste d'instruction selon les joueurs
function getLists() {
	for(let i = 0; i < 2; i++) {
		switch(selected[i]) {
			///ryu ken et akuma on un move set très similaire donc cela n'est pas important si la liste est la meme
			case "ryu":
			case "ken":
			case "akuma":
				if(i == 0) {
					listP1 = ["walk-right", "run-right", "punch", "kick", "run-left", "jump",
					 "walk-right", "walk-right", "block", "run-left","run-left" , "hadoken", "hadoken",
					  "run-right", "punch", "punch", "punch", "kick", "hadoken", "walk-left"];

					/*listP1 = ["hadoken", "hadoken", "walk-right", "walk-right", "block", "punch", "kick","run-left", "block",
						"punch", "punch", "hadoken", "jump", "walk-right", "run-right", "kick", "kick", "punch"];*/
					//listP1 = ["walk-left", "walk-left", "walk-left", "walk-left"];
				}
				else {
					listP2 = ["walk-left", "walk-left", "block", "run-right", "hadoken", "run-left",
					 "run-left", "punch", "punch", "punch", "run-right", "jump", "block", "run-left", "run-left",
					  "kick", "kick", "punch", "punch", "punch", "hadoken", "run-right"];
					/*listP2 = ["walk-left", "jump", "block", "hadoken", "punch", "punch", "punch", "kick", "run-right", "punch",
						"kick", "down", "run-right", "run-right", "hadoken", "hadoken", "punch", "punch", "punch"];*/
					//listP2 = ["walk-right", "walk-right", "walk-right", "walk-right"];
				}
				break;
			case "chunli":
				if(i == 0) {
					listP1 = ["run-right", "run-right", "kick", "kick", "punch", "punch", "punch", "walk-left",
					 "down", "block", "jump", "walk-right", "walk-right", "punch", "kick", "run-left", "run-left",
					  "block", "block", "run-right", "run-right", "kick", "kick", "punch"];
				}
				else {
					listP2 = ["run-left", "run-left", "kick", "kick", "punch", "punch", "punch", "walk-right", "down",
					 "block", "jump","walk-left", "walk-left", "punch", "kick", "run-right", "run-right", "block", 
					 "block", "run-left", "run-left", "kick", "kick", "punch"];
				}
				break;
		}
	}
}

///fonction de random (a revoir)
function rdom(max, min) {
	return Math.floor(Math.random() * (max - min) + min);
}

///fonction rentrant dans le jeu
function InGame() {
	console.log("Je rentre");
	sound_select(1);
	//sound[1].play();
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
