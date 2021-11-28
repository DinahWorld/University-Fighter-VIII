import {loadEverything} from './LoadSprite.js';
import {soundSelect} from './Sound.js';
import {selectInter, setTrueSelectTimer} from './Instructions.js';
export {
	select,
	selectID,
	selected,
	selectedCharacter,
	lenSpr,
	selectedSprites,
	winLoop,
	inGame,
	inSelect,
	resetCharacterSelect,
};

//select pour si on est rentré dans la selection
let select = false;

//liste de tout les perso
let selectList = ['chunli', 'akuma', 'ken', 'ryu'];

//id dans la selection
let selectID = 0;
//selected sont les perso choisie
let selectedCharacter = [];
//le chemin des sprites des perso choisie
let selectedSprites = [];
//si on a choisi nos sprites
let selected = false;

let lenSpr = [];
let winLoop = [];

let p1Choice = randomValue(4, 0);
let p2Choice = randomValue(4, 0);

///fonction executant la partie selection du jeu
function inSelect() {
	if (selectedCharacter.length == 0) {
		moveInSelect(p1Choice);
	} else if (selectedCharacter.length == 1) {
		moveInSelect(p2Choice);
	} else {
		select = false;
		selected = true;
		selectedPath();
		loadEverything();
		soundSelect(2);
		clearInterval(selectInter);
	}
}

///fonction rentrant dans le jeu
function inGame() {
	soundSelect(1);
	select = true;
	setTrueSelectTimer();
}

///deplacement dans la selection selon le choix
function moveInSelect(choice) {
	if (selectID == choice) {
		selectedCharacter.push(selectList[selectID]);
		soundSelect(1);
	} else if (choice >= selectID) {
		selectID += 1;
		soundSelect(0);
	} else {
		selectID -= 1;
		soundSelect(0);
	}
}

//utiliser pour donner les bon chemin selon les perso
function selectedPath() {
	for (let i = 0; i < selectedCharacter.length; i++) {
		switch (selectedCharacter[i]) {
			case 'ryu':
				selectedSprites.push('./assets/atlas/ryu.json');
				lenSpr.push([
					10, 4, 11, 11, 21, 9, 8, 9, 9, 9, 6, 6, 7, 4, 5, 5, 18, 5, 8, 25, 8,
					11,
				]);
				winLoop.push(false);
				break;
			case 'ken':
				selectedSprites.push('./assets/atlas/ken.json');
				lenSpr.push([
					10, 4, 11, 11, 23, 9, 8, 9, 9, 9, 6, 6, 7, 8, 5, 5, 18, 5, 8, 25, 8,
					11,
				]);
				winLoop.push(false);
				break;
			case 'akuma':
				selectedSprites.push('./assets/atlas/akuma.json');
				lenSpr.push([
					11, 4, 11, 11, 21, 9, 8, 9, 9, 9, 6, 6, 7, 4, 5, 5, 18, 5, 8, 24, 8,
					12,
				]);
				winLoop.push(true);
				break;
			case 'chunli':
				selectedSprites.push('./assets/atlas/chunli.json');
				lenSpr.push([
					10, 5, 18, 16, 23, 9, 8, 9, 9, 9, 6, 6, 11, 8, 5, 5, 18, 5, 9, 20, 8,
					22,
				]);
				winLoop.push(false);
				break;
		}
	}
}
///fonction de random (a revoir)
function randomValue(max) {
	return Math.floor(Math.random() * max);
}

function resetCharacterSelect() {
	lenSpr = [];
	winLoop = [];
	selectedCharacter = [];
	selected = false;
	selectedSprites = [];
	p1Choice = randomValue(4, 0);
	p2Choice = randomValue(4, 0);
	select = true;
}
