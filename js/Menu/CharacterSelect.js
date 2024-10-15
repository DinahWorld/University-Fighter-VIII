import { loadEverything } from '../Visual/LoadSprite.js';
import { soundSelect } from '../Visual/Sound.js';
import {
	selectInter,
	setTrueSelectTimer,
} from '../Instruction/Instructions.js';
export {
	resetCharacterSelect,
	select,
	inSelect,
	inGame,
	selectID,
	selectedCharacter,
	randomValue,
	selected,
	selectList,
	lenSpr,
	selectedSprites,
	winLoop,
};

// Variable pour indiquer si nous sommes dans la sélection
let select = false;
// Liste de tous les personnages
let selectList = ['chunli', 'akuma', 'ken', 'ryu'];
// ID de la sélection actuelle
let selectID = 0;
// Liste des personnages choisis
let selectedCharacter = [];
// Sprites des personnages sélectionnés
let selectedSprites = [];
// Indique si les personnages ont été choisis
let selected = false;

// Variables pour la gestion des sprites et animations
let lenSpr = [];
let winLoop = [];

// Variables pour stocker les choix des joueurs
let p1Choice = null;
let p2Choice = null;

/// Gestion des entrées utilisateur pour la sélection des personnages
document.addEventListener('keydown', function(event) {
	if (selectedCharacter.length < 2) {
		switch (event.key) {
			case 'ArrowRight':
				selectID = (selectID + 1) % selectList.length;
				soundSelect('select', true);
				break;
			case 'ArrowLeft':
				selectID = (selectID - 1 + selectList.length) % selectList.length;
				soundSelect('select', true);
				break;
			case 'Enter':
				if (selectedCharacter.length === 0) {
					p1Choice = selectID;
				} else {
					p2Choice = selectID;
				}
				moveInSelect(selectID);
				break;
		}
	}
});

/// Fonction exécutant la partie sélection du jeu
function inSelect() {
	if (selectedCharacter.length == 0 && p1Choice !== null) {
		moveInSelect(p1Choice);
	} else if (selectedCharacter.length == 1 && p2Choice !== null) {
		moveInSelect(p2Choice);
	} else if (selectedCharacter.length == 2) {
		select = false;
		selected = true;
		selectedPath();
		loadEverything();
		soundSelect('go', true);
		clearInterval(selectInter);
	}
}

/// Fonction pour entrer dans le jeu
function inGame() {
	soundSelect('enter', true);
	select = true;
	setTrueSelectTimer();
}

/// Déplacement dans la sélection selon le choix
function moveInSelect(choice) {
	if (selectID === choice) {
		selectedCharacter.push(selectList[selectID]);
		soundSelect('enter', true);
	} else {
		selectID = choice;
		soundSelect('select', true);
	}
}

// Utilisé pour assigner les chemins des sprites en fonction des personnages sélectionnés
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
					10, 4, 11, 11, 21, 9, 8, 9, 9, 9, 6, 6, 7, 8, 5, 5, 18, 5, 8, 25, 8,
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
					10, 5, 18, 16, 20, 9, 8, 9, 9, 9, 6, 6, 11, 8, 5, 5, 18, 5, 9, 20, 8,
					22,
				]);
				winLoop.push(false);
				break;
		}
	}
}

/// Fonction de random (à revoir si besoin)
function randomValue(max) {
	return Math.floor(Math.random() * max);
}

/// Fonction de réinitialisation pour le retour à la sélection
function resetCharacterSelect() {
	lenSpr = [];
	winLoop = [];
	selectedCharacter = [];
	selected = false;
	selectedSprites = [];
	p1Choice = null;
	p2Choice = null;
	select = true;
}