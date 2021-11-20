import Character from './Character.js';
import SpriteAtlas from './SpriteAtlas.js';

let cnv = document.getElementById('myCanvas');
let ctx = cnv.getContext('2d');
let cnv_player_1 = document.getElementById('myCanvas');
let ctx_player_1 = cnv_player_1.getContext('2d');
ctx_player_1.width = cnv.width;
ctx_player_1.height = cnv.height;

ctx.imageSmoothingEnabled = false;
let xobj = new XMLHttpRequest();
let number_of_player = 2;
let go = false;
let hp_1 = 300;
let hp_2 = 300;
let action = true;
let transition_done = false;
let black_screen = false;

let opacity = 0;
let opacity_value = 0.05;
let enterGame = false;

//select pour si on est rentré dans la selection
let select = false;
//id dans la selection
let selectID = 0;
//liste de tout les perso
let selectList = ['chunli', 'akuma', 'ken', 'ryu'];
//selected sont les perso choisie
let selected = [];
//le chemin des sprites des perso choisie
let selectedSprites = [];
let sound = new Array(4);
for (let i = 0; i < 4; i++) {
	sound[i] = new Audio();
}
sound[0].src = './assets/sound/character_select/select.wav';
sound[1].src = './assets/sound/character_select/enter.wav';
sound[2].src = './assets/sound/character_select/go.wav';
sound[3].src = './assets/sound/menu_start/menu.mp3';

let character_select = new Array(4);
for (let i = 0; i < 4; i++) {
	character_select[i] = new Image();
}
character_select[0].src = './assets/character_select/Chunli_2.png';
character_select[1].src = './assets/character_select/akuma_2.png';
character_select[2].src = './assets/character_select/Ken_2.png';
character_select[3].src = './assets/character_select/Ryu_2.png';

let lenSpr = [];
let winLoop = [];

let player_1 = new Character('Dinath', 0, 0, ctx, true);
let player_2 = new Character('Fayçal', cnv.width, 0, ctx, false);
let players = [player_1, player_2];

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
//audio.play();

//Comme ça il ne charge qu'une fois la map et non plusieurs fois en boucle
function mapSelect() {
	ctx.fillStyle = 'rgba(0, 0, 0,' + opacity + ')';
	ctx.fillRect(0, 0, cnv.width, cnv.height);
	opacity += opacity_value;

	if (opacity < 0) {
		go = false;
	}
	if (opacity > 0.99) {
		console.log("les value qui bugs");
		black_screen = true;
		transition_done = true;
		opacity_value = -opacity_value;
	}

	if (black_screen == true) {
		cnv.style.backgroundImage = 'url(assets/background/bg_7_2.gif)';
		black_screen = false;
	}
}

sound[3].play();
function update() {
	ctx.beginPath();
	ctx.clearRect(0, 0, cnv.width, cnv.height);

	//Le go c'est juste car quand le programme se lance il execute le update avant meme
	//que player_1 reçoit les sprites du coup on a des error dans la console
	//console.log(go);
	if (select == true) {
		sound[3].pause();
		ctx.drawImage(character_select[selectID], 0, 0);
	}
	if (go == true) {
		mapSelect();
	}
	
	if (transition_done == true) {
		game();
	}
}

function game() {
	drawHP();
	player_1.changeDirection(player_2);
	player_2.changeDirection(player_1);

	drawCharacter(player_1, player_2);
	drawCharacter(player_2, player_1);

	ctx.closePath();
}

function drawCharacter(player, ennemy) {
	player.jumpingMove();
	if (player.direction == false) {
		player.ctx.save();
		player.ctx.translate(0, 0);
		player.ctx.scale(-1, 1);
		player.drawing(ennemy);
		player.ctx.restore();
	} else {
		player.drawing(ennemy);
	}
}
function drawHP() {
	if (hp_1 != player_1.hp) hp_1 -= 2;
	if (hp_2 != player_2.hp) hp_2 -= 2;

	//ctx.fillStyle = 'gray';
	ctx.fillStyle = 'rgba(169,169,169, 0.5)';
	ctx.fillRect(50, 20, 300, 50);

	ctx.fillStyle = 'red';
	ctx.fillRect(50, 20, hp_1, 50);

	ctx.save();
	ctx.scale(-1, 1);
	ctx.fillStyle = 'rgba(169,169,169, 0.5)';
	ctx.fillRect(-cnv.width + 20, 20, 300, 50);

	ctx.fillStyle = 'red';
	ctx.fillRect(-cnv.width + 20, 20, hp_2, 50);
	ctx.restore();
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

function sound_select(i) {
	if (sound[i].paused) {
		sound[i].play();
	} else {
		sound[i].currentTime = 0;
	}
}

//Permet de ne pas rester appuyer sur une touche
window.addEventListener('keydown', keydown_fun, false);
window.addEventListener('keyup', keyup_fun, false);

function keyup_fun() {
	action = true;
}

function keydown_fun(e) {
	///le mode de selection sans graphique pour l'instant
	if (select == true) {
		console.log("entrer perso")
		///Si on est dans la sélection de personnage;
		switch (e.code) {
			///Avec 4 perso avoir une selection en une ligne c'est parfaitement suffisant
			case 'KeyA':
				///On bouge l'id dans la liste de perso
				if (selectID != 0) selectID -= 1;
				sound_select(0);
				break;
			case 'KeyD':
				if (selectID != selectList.length - 1) selectID += 1;
				sound_select(0);
				break;
			case 'Enter':
				///quand on a choisi le perso il est push dans notre liste de choisie
				selected.push(selectList[selectID]);
				sound_select(1);
				break;
		}
		if (selected.length == 2) {
			select = false;
			selectedPath();
			loadEverything();
			sound_select(2);
			go = true;
			console.log("selection terminer")
			//transition_done = true;
		}
	}
	//quand entre dans le jeu (pas mit de transition)
	if (enterGame == false) {
		console.log("entrer jeu");
		switch (e.code) {
			case 'Enter':
				sound_select(1);
				enterGame = true;
				select = true;
				break;
		}
	}

	if (hp_1 != 0 && hp_2 != 0) {
		action = false;
		switch (e.code) {
			case 'KeyK':
				player_2.punch();
				break;
			case 'KeyL':
				player_2.kick();
				break;
			case 'Numpad3':
				player_2.walk_right();
				break;
			case 'Numpad1':
				player_2.walk_left();
				break;
			case 'Numpad5':
				player_2.jump();
				break;
			case 'Numpad2':
				player_2.down();
				break;
			case 'Numpad6':
				player_2.run_right();
				break;
			case 'Numpad4':
				player_2.run_left();
				break;

			/*case 'Enter':
				go = true;
				break;*/

			case 'KeyS':
				player_1.down();
				break;
			case 'KeyD':
				player_1.walk_right();
				break;
			case 'KeyA':
				player_1.walk_left();
				break;
			case 'KeyW':
				player_1.jump();
				break;
			case 'KeyQ':
				player_1.run_left();
				break;
			case 'KeyE':
				player_1.run_right();
				break;
			case 'KeyV':
				player_1.punch();
				break;
			case 'KeyB':
				player_1.kick();
				break;
			case 'KeyC':
				player_1.hadoken();
				break;
		}
	}
	else {
		enterGame = false;
		select = false;
		go = false;
		transition_done = false;
		action = false;
		hp_1 = 300;
		hp_2 = 300;
		player_1 = new Character('Dinath', 0, 0, ctx, true);
		player_2 = new Character('Fayçal', cnv.width, 0, ctx, false); 
		selected = [];
		selectedSprites = [];
		lenSpr = [];
		opacity = 0;
		opacity_value = 0.05;
		//cnv.style.backgroundImage = 'url(assets/menu_start/menu.gif)';
	}
}

setInterval(update, 45);
