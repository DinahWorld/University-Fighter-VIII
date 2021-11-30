import { cnv, ctx, players, timerg, inGoBack } from '../Game.js';
import { clearPlayerInterval } from '../Instruction/Instructions.js';
import { allKoImg } from '../Visual/LoadSprite.js';
import { soundSelect } from '../Visual/Sound.js';
export { checkWin, resetKO };

let returnBack = false;
let anim_id = 0;

///vérifie si le match est terminer et si oui stop la partie, clear les setInterval et retour au debut
function checkWin() {
	if (players[0].hp == 0 || players[1].hp == 0 || timerg.getTime() == 0) {
		clearPlayerInterval();
		soundSelect('ko', false);
		ctx.drawImage(
			allKoImg[anim_id],
			160,
			50,
			allKoImg[anim_id].width * 4,
			allKoImg[anim_id].height * 4
		);
		if (returnBack == false) {
			if (anim_id == allKoImg.length - 1) {
				returnBack = true;
				setTimeout(inGoBack, 2000);
			} else {
				anim_id++;
			}
		}
	}
}

function resetKO() {
	anim_id = 0;
	returnBack = false;
}
