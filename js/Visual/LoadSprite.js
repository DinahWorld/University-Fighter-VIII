import { players } from '../Game.js';
import SpriteAtlas from '../Visual/SpriteAtlas.js';
import { lenSpr, selectedSprites, winLoop } from '../Menu/CharacterSelect.js';
export { characterSelect, loadEverything, allKoImg };

let json_datas = [];
let characterSelect = new Array(4);
for (let i = 0; i < 4; i++) {
	characterSelect[i] = new Image();
}

characterSelect[0].src = './assets/character_select/Chunli_2.png';
characterSelect[1].src = './assets/character_select/akuma_2.png';
characterSelect[2].src = './assets/character_select/Ken_2.png';
characterSelect[3].src = './assets/character_select/Ryu_2.png';

///permet de load plusieurs json
let loadFile = function (filePath, done) {
	let xhr = new XMLHttpRequest(); //new XMLHTTPRequest();
	xhr.onload = function () {
		return done(this.responseText);
	};
	xhr.open('GET', filePath, true);
	xhr.send();
};

//permet de load tout les sprites des joueurs
function loadEverything() {
	for (let i = 0; i < selectedSprites.length; i++) {
		loadFile(selectedSprites[i], function (responseText) {
			json_datas[i] = JSON.parse(responseText);
			onload_atlas(i, players[i]);
		});
	}
}

//onload atlas modif pour prendre un perso et son json et le load (amélioration possible quand le meme perso est pris)
function onload_atlas(n, player) {
	let spritesheet = new Image();
	spritesheet.src = './assets/atlas/' + json_datas[n]['meta']['image'];

	spritesheet.onload = function () {
		let canvas1 = document.createElement('canvas');
		canvas1.width = json_datas[n]['meta']['size']['w'];
		canvas1.height = json_datas[n]['meta']['size']['h'];
		let context1 = canvas1.getContext('2d');
		context1.drawImage(spritesheet, 0, 0, canvas1.width, canvas1.height);

		for (let i = 0; i < 22; i++) {
			player.sprites[i] = new SpriteAtlas(context1, json_datas[n]);
		}

		player.sprites[0].add_anime('normal', 1, lenSpr[n][0]);
		player.sprites[1].add_anime('punch-1', 1, lenSpr[n][1]);
		player.sprites[2].add_anime('walk-left', 1, lenSpr[n][2]);
		player.sprites[3].add_anime('walk-right', 1, lenSpr[n][3]);
		player.sprites[4].add_anime('jump', 1, lenSpr[n][4]);
		player.sprites[5].add_anime('down', 1, lenSpr[n][5]);
		player.sprites[6].add_anime('punch-2', 1, lenSpr[n][6]);
		player.sprites[7].add_anime('punch-3', 1, lenSpr[n][7]);
		player.sprites[8].add_anime('damaged', 1, lenSpr[n][8]);
		player.sprites[9].add_anime('block', 1, lenSpr[n][9]);
		player.sprites[10].add_anime('run-left', 1, lenSpr[n][10]);
		player.sprites[11].add_anime('run-right', 1, lenSpr[n][11]);
		player.sprites[12].add_anime('kick', 1, lenSpr[n][12]);
		player.sprites[13].add_anime('down-damage', 1, lenSpr[n][13]);
		player.sprites[14].add_anime('down-kick', 1, lenSpr[n][14]);
		player.sprites[15].add_anime('down-punch', 1, lenSpr[n][15]);
		player.sprites[16].add_anime('hadoken', 1, lenSpr[n][16]);
		player.sprites[17].add_anime('jump-kick', 1, lenSpr[n][17]);
		player.sprites[18].add_anime('jump-punch', 1, lenSpr[n][18]);
		player.sprites[19].add_anime('ko', 1, lenSpr[n][19]);
		player.sprites[20].add_anime('pose', 1, lenSpr[n][20]);
		player.sprites[21].add_anime('super-attack', 1, lenSpr[n][21]);
		player.sprites[0].loop = true;
		player.sprites[19].stop = true;
		player.sprites[4].stop = true;
		player.sprites[20].loop = winLoop[n];
		player.sprites[20].stop = true;
	};
}

///Les images du KO
let allKoImg = [];
let imgKO = new Image();
imgKO.src = './assets/ko/ko.png';
imgKO.onload = function () {
	let canvas1 = document.createElement('canvas');
	canvas1.width = 320 * 9;
	canvas1.height = 184 * 14;
	let context1 = canvas1.getContext('2d');
	context1.drawImage(imgKO, 0, 0, 320 * 9, 184 * 14);
	for (let j = 0; j < 6; j += 1) {
		let imax = 9;
		if (j == 5) {
			imax = 8;
		}
		for (let i = 0; i < imax; i += 1) {
			let canvasImageData1 = context1.getImageData(i * 320, j * 184, 320, 180);
			let canvas2 = document.createElement('canvas');
			canvas2.width = 320;
			canvas2.height = 184;
			let context2 = canvas2.getContext('2d');
			context2.putImageData(canvasImageData1, 0, 0);
			allKoImg.push(canvas2);
		}
	}
};
