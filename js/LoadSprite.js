import {player_1,player_2} from './Game.js';
import SpriteAtlas from './SpriteAtlas.js';
import {sound_select} from './Sound.js';
export {character_select,selectID,selected,moveInSelect,loadEverything,selectedPath,resetSprite};

let character_select = new Array(4);
for (let i = 0; i < 4; i++) {
	character_select[i] = new Image();
}
character_select[0].src = './assets/character_select/Chunli_2.png';
character_select[1].src = './assets/character_select/akuma_2.png';
character_select[2].src = './assets/character_select/Ken_2.png';
character_select[3].src = './assets/character_select/Ryu_2.png';


//id dans la selection
let selectID = 0;
//liste de tout les perso
let selectList = ['chunli', 'akuma', 'ken', 'ryu'];
//selected sont les perso choisie
let selected = [];
//le chemin des sprites des perso choisie
let selectedSprites = [];


let lenSpr = [];
let winLoop = [];

///permet de load plusieurs json
let loadFile = function (filePath, done) {
	let xhr = new XMLHttpRequest(); //new XMLHTTPRequest();
	xhr.onload = function () {
		return done(this.responseText);
	};
	xhr.open('GET', filePath, true);
	xhr.send();
};
let json_datas = [];

//permet de load tout les sprites des joueurs
function loadEverything() {
	for (let i = 0; i < selectedSprites.length; i++) {
		loadFile(selectedSprites[i], function (responseText) {
			json_datas[i] = JSON.parse(responseText);
			onload_atlas(i);
		});
	}
}

//utiliser pour donner les bon chemin selon les perso
function selectedPath() {
	for (let i = 0; i < selected.length; i++) {
		switch (selected[i]) {
			case 'ryu':
				selectedSprites.push('./assets/atlas/ryu.json');
				lenSpr.push([10, 4, 11, 11, 21, 9, 8, 9, 9, 9, 6, 6, 7, 4, 5, 5, 18, 5, 8, 25, 8, 11]);
				winLoop.push(false);
				break;
			case 'ken':
				selectedSprites.push('./assets/atlas/ken.json');
				lenSpr.push([10, 4, 11, 11, 23, 9, 8, 9, 9, 9, 6, 6, 7, 8, 5, 5, 18, 5, 8, 25, 8, 11]);
				winLoop.push(false);
				break;
			case 'akuma':
				selectedSprites.push('./assets/atlas/akuma.json');
				lenSpr.push([11, 4, 11, 11, 21, 9, 8, 9, 9, 9, 6, 6, 7, 4, 5, 5, 18, 5, 8, 24, 8, 12]);
				winLoop.push(true);
				break;
			case 'chunli':
				selectedSprites.push('./assets/atlas/chunli.json');
				lenSpr.push([10, 5, 18, 16, 23, 9, 8, 9, 9, 9, 6, 6, 11, 8, 5, 5, 18, 5, 9, 20, 8, 22]);
				winLoop.push(false);
				break;
		}
	}
}

//onload atlas modif pour prendre un perso et son json et le load (amélioration possible quand le meme perso est pris)
function onload_atlas(n) {
	let player;
	if (n == 0) {
		player = player_1;
	} else {
		player = player_2;
	}
	//console.log(this.status);

	//if (this.status == 200) {
	//let json_infos = JSON.parse(this.responseText);
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
		//fait buger car true pour akuma
		//meilleur faire en sorte qu'il font pas l'anim de win au début
		player.sprites[20].loop = winLoop[n];
		player.sprites[20].stop = true;
	};
	//}
}

///deplacement dans la selection selon le choix
function moveInSelect(choice) {
	if(selectID == choice) {
		selected.push(selectList[selectID]);
		sound_select(1);
	}
	else if(choice >= selectID) {
		//if (selectID != selectList.length - 1) selectID += 1;
		selectID += 1;
		sound_select(0);
	}
	else {
		selectID -= 1;
		sound_select(0);
	}
}

function resetSprite(){
    selected = [];
	selectedSprites = [];
	lenSpr = [];
}