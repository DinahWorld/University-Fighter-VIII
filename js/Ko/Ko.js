import{cnv,ctx,players,timerg,inGoBack} from '../Game.js';
import{clearPlayerInterval} from '../Instruction/Instructions.js';
import {allKoImg} from '../Visual/LoadSprite.js';
import { soundSelect } from '../Visual/Sound.js';
export {checkWin,setReturnBackFalse};

let returnBack = false;
let anim_id = 0;

///vérifie si le match est terminer et si oui stop la partie, clear les setInterval et retour au debut
function checkWin() {
	if (players[0].hp == 0 || players[1].hp == 0 || timerg.getTime() == 0) {
		clearPlayerInterval();
		soundSelect('ko',false);
		if (returnBack == false) {
			ctx.drawImage(allKoImg[anim_id],350,50,allKoImg[anim_id].width *3,allKoImg[anim_id].height * 3 );			
			if(anim_id == allKoImg.length - 1){
				returnBack = true;
				setTimeout(inGoBack,2000);
			}
			else {
				anim_id++;
			}
			
		}
		
	}
}

function setReturnBackFalse(){
	returnBack = false;
}

