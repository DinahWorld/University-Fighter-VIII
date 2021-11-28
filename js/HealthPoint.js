import {ctx, cnv,gradient, gradientSet} from './Game.js';
import {selectedCharacter,selectList} from './CharacterSelect.js';
export {drawHP};

let barHPChara = new Array(5);
let barHPCharaHit = new Array(5);
let barHP = new Image();

for(let i = 0;i < 5;i++){
	barHPChara[i] = new Image();
	barHPCharaHit[i] = new Image();
	if(i == 4) break;
	//On pourra directement faire barHPChara['chunli'] par exemple
	barHPChara[selectList[i]] = barHPChara[i];
	barHPCharaHit[selectList[i]] = barHPCharaHit[i];
}

barHPChara['chunli'].src = './assets/hp_bar/chunli.png';
barHPChara['akuma'].src = './assets/hp_bar/akuma.png';
barHPChara['ken'].src = './assets/hp_bar/ken.png';
barHPChara['ryu'].src = './assets/hp_bar/ryu.png';

barHPCharaHit['chunli'].src = './assets/hp_bar/chunli_hit.png';
barHPCharaHit['akuma'].src = './assets/hp_bar/akuma_hit.png';
barHPCharaHit['ken'].src = './assets/hp_bar/ken_hit.png';
barHPCharaHit['ryu'].src = './assets/hp_bar/ryu_hit.png';

barHP.src = './assets/hp_bar/hp_bar.png'


function reduceBarHp(player) {
	if (player.hpBar == player.hp) return false;
	
	player.hpBar -= 5;
	return true;
}
///dessine les hp des joueurs
function drawHP(player) {
	drawHPPlayer(player[0],0)
	// On inverse la barre d'hp
	ctx.save();
	ctx.scale(-1, 1);
	
	drawHPPlayer(player[1],1)
	
	ctx.restore();
}

function drawHPPlayer(player,i){
	let hit = reduceBarHp(player);
	let posxBarHp = 0;
	if(player.direction == false){
		posxBarHp = -cnv.width;
		gradientSet(-cnv.width + 50,-cnv.width + (player.hpBar + 63),false);

	}else{
		gradientSet(63,player.hpBar,false);

	}

	ctx.fillStyle = '#aaaaaa';
	ctx.fillRect(posxBarHp + 63, 115, 500, 43);

	// On dessine une barre d'hp avec un dégradé de couleur
	gradient.addColorStop(0, '#fe634a');
	gradient.addColorStop(1, '#fabe2c');
	ctx.fillStyle = gradient;
	ctx.fillRect(posxBarHp + 63, 115, player.hpBar, 43)

	// On dessine notre personnage sur la barre d'hp et la barre d'hp
	if(hit == true)
		ctx.drawImage(barHPCharaHit[selectedCharacter[i]],posxBarHp + 50,0);	
	else
		ctx.drawImage(barHPChara[selectedCharacter[i]],posxBarHp + 50,0);
	
	ctx.drawImage(barHP,posxBarHp + 50,0);

	
}