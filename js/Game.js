let cnv = document.getElementById('myCanvas');

let ctx = cnv.getContext('2d');
ctx.imageSmoothingEnabled = false;
let sprites = [];
let sprites_2 = [];

let xobj = new XMLHttpRequest();
let new_sp = new Array(6);
let new_sp_2 = new Array(6);
let posX = 0;
let posY = 0;
let reachPosX = 0;
let number_of_player = 2;

xobj.onload = onload_atlas;
xobj.overrideMimeType('application/json');
xobj.open('GET', './assets/atlas/ken.json', true);
xobj.send();

class SpriteAtlas {
	constructor(ctx, json) {
		this.ctx = ctx;
		this.json = json;
		this.event_code = 0;
		this.animestep = 1;
		this.to_draw = 0;
		this.to_goX = 0;
		this.to_goY = 0;
		this.animeseq = [];
	}
	next_step() {
		if (this.to_draw == 0) {
			this.animestep += 1;
			if (this.animestep >= this.animeseq.length) {
				this.animestep = 0;
			}
			this.to_draw = 1;
		}
	}
	add_anime(prefix, first_id, last_id, event_code) {
		this.event_code = event_code;
		for (let i = first_id; i < last_id + 1; i += 1) {
			let filename = prefix;
			if (i < 10) {
				filename += '.00' + i;
			} else if (i < 100) {
				filename += '.0' + i;
			} else {
				filename += '.' + i;
			}
			let x = this.json['frames'][filename]['frame']['x'];
			let y = this.json['frames'][filename]['frame']['y'];
			let w = this.json['frames'][filename]['frame']['w'];
			let h = this.json['frames'][filename]['frame']['h'];
			let canvasImageData1 = this.ctx.getImageData(x, y, w, h);
			let canvas2 = document.createElement('canvas');
			canvas2.width = w;
			canvas2.height = h;
			let context2 = canvas2.getContext('2d');
			context2.putImageData(canvasImageData1, 0, 0);
			this.animeseq.push(canvas2);
		}
	}
}

/* Une idée */
//class Animation extends Character{
//
//}

class Character {
	constructor(posXX, posYY, ctx) {
		this.hp = 10000;
		this.attacking = false;
		this.sprites = [];
		this.posXX = posXX;
		this.posYY = posYY;
		this.zoom = 4;
		this.ctx = ctx;
	}

	init() {
		for (let i = 0; i < this.sprites.length; i++) {
			this.sprites[i].to_draw = 0;
		}
	}

	animeChara(event_code) {
		this.init();
		for (let i = 0; i < this.sprites.length; i += 1) {
			if (this.sprites[i].event_code == event_code) {
				this.sprites[i].next_step();
			}
		}
	}

	punch() {
		this.animeChara('Punch');
	}
	walk_right() {
		this.animeChara('WalkRight');
	}
	walk_left() {
		this.animeChara('WalkLeft');
	}
	jump() {
		this.animeChara('Jump');
	}
	down() {
		this.animeChara('Down');
	}

	draw(index) {
		ctx.beginPath();

		let step_i = this.sprites[index].animestep;
		let cnv_i = this.sprites[index].animeseq[step_i];
		//- 30 sur la taille pour la hitbox
		this.ctx.strokeRect(
			60 + this.posXX,
			this.posYY + 180,
			(cnv_i.width - 15) * this.zoom,
			(cnv_i.height - 55) * this.zoom
		);
		this.ctx.stroke();
		this.posXX += this.sprites[index].to_goX;
		this.ctx.drawImage(
			cnv_i,
			this.posXX,
			this.posYY,
			cnv_i.width * this.zoom,
			cnv_i.height * this.zoom
		);
		this.sprites[index].to_draw = 0;
		ctx.closePath();
	}

	drawPlayer() {
		if (this.sprites[0].to_draw == 1) {
			this.draw(0);
			this.sprites[0].next_step();
		} else {
			for (let i = 1; i < this.sprites.length; i += 1) {
				if (this.sprites[i].to_draw == 1) {
					let number_of_sprite = this.sprites[i].animeseq.length;
					let step_i = this.sprites[i].animestep;

					this.draw(i);

					//Tant que animation ne sera pas égale au nombre de sprite
					//On va jouer toutes les sprites du tableau
					if (step_i == number_of_sprite - 1) {
						this.sprites[0].to_draw = 1;
					} else {
						this.sprites[i].next_step();
					}
				}
			}
		}
	}
}

let player_1 = new Character(50, 0, ctx);
let player_2 = new Character(500, 0, ctx);

function onload_atlas() {
	console.log(this.status);

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
				players[i].sprites[2].to_goX = -10;
				players[i].sprites[3].to_goX = +10;
				players[i].sprites[4].to_goY = -20;
			}
		};
	}
}
window.addEventListener('keydown', keydown_fun, false);

function keydown_fun(e) {
	switch (e.code) {
		case 'KeyD':
			player_1.punch();
			player_2.punch();
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
	}
}

function update() {
	ctx.beginPath();
	ctx.clearRect(0, 0, cnv.width, cnv.height);
	player_1.drawPlayer();
	player_2.drawPlayer();
	ctx.closePath();
}
setInterval(update, 40);
