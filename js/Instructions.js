import {select,inSelect,inGame,selectID,selectedCharacter,selected } from './CharacterSelect.js'
import {ctx,players} from './Game.js'
import {sound} from './Sound.js'
import {characterSelect} from './LoadSprite.js'
import { transitionMap } from './Map.js'
export {clearPlayerInterval,resetInstructions,gameFightInstructions,instruList,selectInter,selectTimer,gameInstructionMenu,setTrueSelectTimer};

let listP1 = [];
let listP2 = [];

let instruID1 = 0;
let instruID2 = 0;

let selectTimer = false;
let enterGameTimer = false;
let selectInter = null;

///variable utiliser pour les liste d'instructions
let playerInterval = null;
let launchIntervals = true;


function gameInstructionMenu(){
	//Comme si on appuyait sur entrer pour rentrer dans le menu selection 	
	if(enterGameTimer == false) {
		sound[3].play();
		enterGameTimer = true;
		setTimeout(inGame, 1000);
	}

	if (select == true) {
		if(selectTimer == true) {
			selectTimer = false;
			selectInter = setInterval(inSelect, 1000);
		}
		sound[3].pause();
		ctx.drawImage(characterSelect[selectID], 0, 0);
	}

	if(selected == true){
		if(transitionMap() == false){
			return true;
		}
	}
	return false;
		
}
function gameFightInstructions(){
	///si on peut commencer la partie alors les interval son lancer(le combats)
	if(launchIntervals == true) {
		launchIntervals = false;
		playerInterval = setInterval(function() {instruList(players)}, 500);
	}
}
///instru list est appeler par le setInteveral pour chaque joueur avec leur liste a faire
function instruList(players) {
	// On recupere la liste d'instruction
	getLists();
	instruExecute(players[0], listP1[instruID1]);
	instruExecute(players[1], listP2[instruID2]);
	
	if(instruID1 != listP1.length-1) {
		instruID1+=1;
	}
	else{
		instruID1 = 0;
	}
	
	if(instruID2 != listP2.length-1) {
		instruID2+=1;
	}
	else{
		instruID2 = 0;
	}
	
}

///donne une liste d'instruction selon les joueurs
function getLists() {
	for(let i = 0; i < 2; i++) {
		switch(selectedCharacter[i]) {
			///ryu ken et akuma on un move set très similaire donc cela n'est pas important si la liste est la meme
			case "ryu":
			case "ken":
			case "akuma":
				if(i == 0) {
					listP1 = ["walk-right", "run-right", "punch", "kick", "run-left", "jump",
					 "walk-right", "walk-right", "block", "run-left","run-left" , "hadoken", "hadoken",
					  "run-right", "punch", "punch", "punch", "kick", "hadoken", "walk-left"];
				}
				else {
					listP2 = ["walk-left", "walk-left", "block", "run-right", "hadoken", "run-left",
					 "run-left", "punch", "punch", "punch", "run-right", "jump", "block", "run-left", "run-left",
					  "kick", "kick", "punch", "punch", "punch", "hadoken", "run-right"];
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

///execute l'instruction que est donner on doit faire cela car sinon le programme lis la liste d'un coup
function instruExecute(player, movement) {
	switch (movement) {
		case "walk-left":
			player.walkLeft();
			break;
		case "walk-right":
			player.walkRight();
			break;
		case "run-left":
			player.runLeft();
			break;
		case "run-right":
			player.runRight();
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

function setTrueSelectTimer(){
	return selectTimer = true;
}

function clearPlayerInterval(){
	clearInterval(playerInterval);
}

function resetInstructions(){
	listP1 = [];
	listP2 = [];
	instruID1 = 0;
	instruID2 = 0;
	selectTimer = true;
	selectInter = null;
	playerInterval = null;
	launchIntervals = true;
}