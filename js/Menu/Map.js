import { ctx, cnv } from '../Game.js';
import { randomValue } from './CharacterSelect.js';
import { soundSelect } from '../Visual/Sound.js';
export { transitionMap, resetTransition };

let opacity = 0;
let opacityValue = 0.05;
let transitionDone = false;
///Les backgrounds de combat
let bg = [
	'url(assets/background/bg_1.gif)',
	'url(assets/background/bg_2.gif)',
	'url(assets/background/bg_3.gif)',
	'url(assets/background/bg_4.gif)',
	'url(assets/background/bg_5.gif)',
	'url(assets/background/bg_6.gif)',
	'url(assets/background/bg_7.gif)',
	'url(assets/background/bg_8.gif)',
	'url(assets/background/bg_9.gif)',
];

/// Fonction qui va crée une transition entre le menu et le jeu
function transitionMap() {
	if (transitionDone == false) {
		soundSelect('soundtrack', false);
		ctx.fillStyle = 'rgba(0, 0, 0,' + opacity + ')';
		ctx.fillRect(0, 0, cnv.width, cnv.height);
		opacity += opacityValue;
		// Si l'écran est noir on change le background
		if (opacity > 0.99) {
			opacityValue = -opacityValue;
			transitionDone = true;
			//On choisit un arriere plan aléatoire
			cnv.style.backgroundImage = bg[randomValue(bg.length)];
			return false;
		}
		return true;
	}

	return false;
}

///remet les valeurs de la transition à l'initial
function resetTransition() {
	opacity = 0;
	opacityValue = 0.05;
	transitionDone = false;
}
