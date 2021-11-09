/*
 *
 *     TODO
 * 		Changement de map
 * 		Changement de perso
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
let ctx = cnv.getContext('2d');
ctx.imageSmoothingEnabled = false;
let xobj = new XMLHttpRequest();
let number_of_player = 2;
let audio = new Audio('./assets/music/battle_music.mp3');
let go = false;
let hp_1 = 500;
let hp_2 = 500;
let action = true;
let game_map = true;
xobj.onload = onload_atlas;
xobj.overrideMimeType('application/json');
xobj.open('GET', './assets/atlas/akuma.json', true);
xobj.send();

let player_1 = new Character(0, 0, ctx, 1);
let player_2 = new Character(-cnv.width, 0, ctx, 2);
audio.play();

//Comme ça il ne charge qu'une fois la map et non plusieurs fois en boucle
function mapSelect(){
	if(game_map == true){
		cnv.style.backgroundImage = "url(assets/background/bg_7.gif)";
		game_map = false;
	}
}
function update() {
	
	//console.log(player_1.posXX);
	//console.log(player_2.posXX);
	//Le go c'est juste car quand le programme se lance il execute le update avant meme
	//que player_1 reçoit les sprites du coup on a des error dans la console
	if (go == true) {
		mapSelect();
		//console.log(player_1.hp);
		//console.log(player_2.hp);
		if(player_1.combo != 0){
			player_1.combo -= 1;
		}
		if(player_2.combo != 0){
			player_2.combo -= 1;
		}
		if(hp_1 != player_1.hp)
			hp_1 -= 5;
		if(hp_2 != player_2.hp)
			hp_2 -= 5;
		
		ctx.beginPath();

		ctx.clearRect(0, 0, cnv.width, cnv.height);

		ctx.fillStyle = 'red';
		ctx.fillRect(20,20,hp_1,50);

		player_1.jumpingMove();
		player_2.jumpingMove();

		player_1.drawPlayer(player_2);
		player_2.ctx.save();
		player_2.ctx.scale(-1, 1);

		ctx.fillStyle = 'red';
		ctx.fillRect(-cnv.width + 20,20,hp_2,50);
		
		player_2.drawPlayer(player_1);
		player_2.ctx.restore();
		ctx.closePath();

		player_1.punchingMove(player_2);
		player_2.punchingMove(player_1);
		if(player_1.sprites[0].to_draw == 1){
			//player_1.moving = false;
			player_1.attacking = false;
			player_1.jumping = false;
			player_1.falling = false;
		}
		if(player_2.sprites[0].to_draw == 1){
			//player_2.moving = true;
			player_2.attacking = false;
			player_2.jumping = false;
			player_2.falling = false;
		}
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

			for (let i = 0; i < 13; i++) {
				players[0].sprites[i] = new SpriteAtlas(context1, json_infos);
				players[1].sprites[i] = new SpriteAtlas(context1, json_infos);
			}

			//TODO : Les perso n'ont pas le meme nombre de sprite
			for (let i = 0; i < number_of_player; i++) {
				players[i].sprites[0].add_anime('normal', 1, 10, '');
				players[i].sprites[1].add_anime('punch-1', 1, 4, 'Punch');
				players[i].sprites[2].add_anime('walk-left', 1, 11, 'WalkLeft');
				players[i].sprites[3].add_anime('walk-right', 1, 11, 'WalkRight');
				players[i].sprites[4].add_anime('jump', 1, 21, 'Jump');
				players[i].sprites[5].add_anime('down', 1, 6, 'Down');
				players[i].sprites[6].add_anime('punch-2', 1, 8, 'Punch2');
				players[i].sprites[7].add_anime('punch-3', 1, 9, 'Punch3');
				players[i].sprites[8].add_anime('damaged', 1, 7, 'Hit');
				players[i].sprites[9].add_anime('block', 1, 4, 'Block');
				players[i].sprites[10].add_anime('run-left', 1, 6, 'RunLeft');
				players[i].sprites[11].add_anime('run-right', 1, 6, 'RunRight');
				players[i].sprites[12].add_anime('kick', 1, 7, 'Kick');
				players[i].sprites[0].to_draw = 1;
				players[i].sprites[2].to_goX = -20;
				players[i].sprites[3].to_goX = +20;
				players[i].sprites[10].to_goX = -50;
				players[i].sprites[11].to_goX = +50;


			}
		};
	}
}

//Permet de ne pas rester appuyer sur une touche
window.addEventListener('keydown', keydown_fun, false);
window.addEventListener('keyup', keyup_fun, false);

function keyup_fun(){
	action = true;
}
function keydown_fun(e) {
	if(action == true){
		action = false;
		switch (e.code) {
			case 'Space':
				if(player_1.attacking == false){
					if(player_1.combo == 0){
						player_1.combo += 5;
						player_1.punch();
					}
					else {
						player_1.combo = 0;
						player_1.punch2();
					}
				}
				console.log(player_2.combo)
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
				if(player_2.attacking == false){
					if(player_2.combo == 0){
						player_2.combo += 5;
						player_2.punch();
					}
					else {
						player_2.combo = 0;
						player_2.punch2();
					}
				}
				break;
	
			case 'KeyA':
				player_2.block();
				break;
			
			case 'KeyS':
				player_2.kick();
				break;
			
			case 'KeyQ':
				player_2.run_right();
				break;
	
			case 'KeyE':
				player_2.run_left();
				break;
			
			case 'KeyF':
				//Le probleme avec sa c'est que lorsque le joueur blesse l'autre
				//sa désactive le attacking reset donc le joueur pourra spam le coup
				if(player_2.attacking == false){
				player_2.punch3();
				}
				break;
		}
	
	}
}

setInterval(update, 45);
