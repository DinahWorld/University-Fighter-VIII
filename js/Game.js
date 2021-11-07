/*
 *
 *     TODO
 *     Changer cette musique dégeulasse
 *     Refaire le découpage des sprites (AAAAAAAAAAAAAAH)
 *     Collision
 *     Gravité pour le saut
 *     Menu
 *     Affichage de points de vie (on commence par mettre un gros score sur le dessin et je ferai le design)
 *     Les combo = Si on enchaine les coups on incrémente notre variable combo
 *
 */

import Character from './Character.js';
import SpriteAtlas from './SpriteAtlas.js';

let cnv = document.getElementById('myCanvas');
cnv.width = window.innerWidth - 10;
let ctx = cnv.getContext('2d');
ctx.imageSmoothingEnabled = false;
let xobj = new XMLHttpRequest();
let number_of_player = 2;
let audio = new Audio('./assets/music/battle_music.mp3');
let go = false;

xobj.onload = onload_atlas;
xobj.overrideMimeType('application/json');
xobj.open('GET', './assets/atlas/ken.json', true);
xobj.send();

let player_1 = new Character(0, 0, ctx, 1);
let player_2 = new Character(-cnv.width, 0, ctx, 2);
audio.play();
function update() {
	//console.log(player_1.posXX);
	//console.log(player_2.posXX);
	//Le go c'est juste car quand le programme se lance il execute le update avant meme
	//que player_1 reçoit les sprites du coup on a des error dans la console
	if (go == true) {
		//console.log(player_1.hp);
		//console.log(player_2.hp);
		ctx.beginPath();
		ctx.clearRect(0, 0, cnv.width, cnv.height);

		ctx.font = '48px serif';
		ctx.fillText(player_1.hp.toString(),50,50);
		
		ctx.font = '48px serif';
		ctx.fillText(player_2.hp.toString(),cnv.width - 150,50);
		
		player_1.jumpingMove();
		player_2.jumpingMove();

		player_1.drawPlayer(player_2);
		player_2.ctx.save();
		player_2.ctx.scale(-1, 1);
		player_2.drawPlayer(player_1);
		player_2.ctx.restore();
		ctx.closePath();

		player_1.punchingMove(player_2);
		player_2.punchingMove(player_1);
	}
}

function onload_atlas() {
	//console.log(this.status);

	if (this.status == 200) {
		let players = [player_1, player_2];

		let json_infos = JSON.parse(this.responseText);
		let spritesheet = new Image();
		spritesheet.src = './assets/atlas/' + json_infos['meta']['image'];

		spritesheet.onload = function () {
			let canvas1 = document.createElement('canvas');
			canvas1.width = json_infos['meta']['size']['w'];
			canvas1.height = json_infos['meta']['size']['h'];
			let context1 = canvas1.getContext('2d');
			context1.drawImage(spritesheet, 0, 0, canvas1.width, canvas1.height);

			for (let i = 0; i < 6; i++) {
				players[0].sprites[i] = new SpriteAtlas(context1, json_infos);
				players[1].sprites[i] = new SpriteAtlas(context1, json_infos);
			}

			for (let i = 0; i < number_of_player; i++) {
				players[i].sprites[0].add_anime('normal', 1, 10, '');
				players[i].sprites[1].add_anime('punch', 1, 5, 'Punch');
				players[i].sprites[2].add_anime('walk-left', 1, 11, 'WalkLeft');
				players[i].sprites[3].add_anime('walk-right', 1, 11, 'WalkRight');
				players[i].sprites[4].add_anime('jump', 1, 11, 'Jump');
				players[i].sprites[5].add_anime('down', 1, 6, 'Down');
				players[i].sprites[0].to_draw = 1;
				players[i].sprites[2].to_goX = -20;
				players[i].sprites[3].to_goX = +20;
				players[i].length_of_walk = players[i].sprites[3].animeseq.length;


			}
		};
	}
}

window.addEventListener('keydown', keydown_fun, false);

function keydown_fun(e) {
	switch (e.code) {
		case 'Space':
			//player_1.punch(player_2.posXX, player_2.posYY, player_2.attacking, player_2.hp);
			//player_2.punch(player_1.posXX, player_1.posYY, player_1.attacking, player_1.hp);
			player_1.punch(player_2);
			//player_2.punch(player_1);
			break;

		case 'ArrowLeft':
			player_1.walk_left();
			player_2.walk_left();
			break;

		case 'ArrowRight':
			player_1.walk_right();
			player_2.walk_right();
			break;

		case 'ArrowUp':
			player_1.jump();
			player_2.jump();
			break;

		case 'ArrowDown':
			player_1.down();
			player_2.down();
			break;

		case 'Enter':
			go = true;
			break;

		case 'KeyD':
			player_2.punch(player_1);
			break;
	}
}

setInterval(update, 40);
