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
let audio = new Audio('./assets/music/battle_music.mp3');
let go = false;
let hp_1 = 500;
let hp_2 = 500;
let action = true;
let transition_done = false;
let black_screen = false;

let opacity = 0;
let opacity_value = 0.05;
let enterGame = false;


let select = false;
let madeSelect = false;
let selectID = 0;
let selectList = ["ryu", "ken", "akuma", "chunli"];
let selected = [];
let selectedSprites = [];

/*xobj.onload = onload_atlas;
xobj.overrideMimeType('application/json');
xobj.open('GET', './assets/atlas/ken.json', true);
xobj.send();*/

let player_1 = new Character('Dinath', 0, 0, ctx, true);
let player_2 = new Character('Fayçal', cnv.width, 0, ctx, false);
let players = [player_1, player_2];

let loadFile = function (filePath, done) {
    let xhr = new XMLHttpRequest();//new XMLHTTPRequest();
    xhr.onload = function () { return done(this.responseText) }
    xhr.open("GET", filePath, true);
    xhr.send();
}
let json_datas = [];

function loadEverything() {
	for(let i = 0; i < selectedSprites.length; i++) {
		loadFile(selectedSprites[i], function (responseText) {
			json_datas[i] = JSON.parse(responseText);
			onload_atlas(i);
		})
	}
}

//utiliser pour donner les bon chemin selon les perso
function selectedPath() {
	for(let i = 0; i < selected.length; i++) {
		switch (selected[i]) {
			case "ryu":
				selectedSprites.push('./assets/atlas/ryu.json');
				break;
			case "ken":
				selectedSprites.push('./assets/atlas/ken.json');
				break;
			case "akuma":
				selectedSprites.push('./assets/atlas/akuma.json');
				break;
			case "chunli":
				selectedSprites.push('./assets/atlas/chunli.json');
				break;
		}
	}
}
//audio.play();

function transition () {
	ctx.fillStyle = 'rgba(0, 0, 0,' + opacity + ')';
	ctx.fillRect(0, 0, cnv.width, cnv.height);

	opacity += opacity_value;

	if (opacity < 0) {
		console.log("je veux voire");
		go = false;
	}
	if (opacity > 0.99) {
		black_screen = true;
		transition_done = true;
		opacity_value = -opacity_value;
	}
}

function transitionUP() {
	if (opacity > 0.99) {
		black_screen = true;
		transition_done = true;
		opacity_value = -opacity_value;
	}
}
//Comme ça il ne charge qu'une fois la map et non plusieurs fois en boucle
function mapSelect() {
	ctx.fillStyle = 'rgba(0, 0, 0,' + opacity + ')';
	ctx.fillRect(0, 0, cnv.width, cnv.height);

	opacity += opacity_value;

	if (opacity < 0) {
		go = false;
	}
	if (opacity > 0.99) {
		black_screen = true;
		transition_done = true;
		opacity_value = -opacity_value;
	}

	if (black_screen == true) {
		cnv.style.backgroundImage = 'url(assets/background/bg_7_2.gif)';
		black_screen = false;
	}
}

function update() {
	ctx.beginPath();
	ctx.clearRect(0, 0, cnv.width, cnv.height);
	//Le go c'est juste car quand le programme se lance il execute le update avant meme
	//que player_1 reçoit les sprites du coup on a des error dans la console
	if (go == true) {
		mapSelect();
	}

	if (transition_done == true) {
		game();
	}
}

function game() {
	drawHP();
	//Pourquoi j'en met 2 jsp
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
function drawHP(){
	if (hp_1 != player_1.hp) hp_1 -= 2;
	if (hp_2 != player_2.hp) hp_2 -= 2;

	ctx.fillStyle = 'red';
	ctx.fillRect(50, 20, hp_1, 50);

	ctx.save();
	ctx.scale(-1, 1);
	ctx.fillStyle = 'red';
	ctx.fillRect(-cnv.width + 20, 20, hp_2, 50);
	ctx.restore();


}
function onload_atlas(n) {
	let player;
	if(n == 0) {player = player_1;}
	else{player = player_2;}
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

			/*for (let i = 0; i < 22; i++) {
				players[0].sprites[i] = new SpriteAtlas(context1, json_infos);
				players[1].sprites[i] = new SpriteAtlas(context1, json_infos);
			}*/
			for(let i = 0; i < 22; i++) {
				player.sprites[i] = new SpriteAtlas(context1, json_datas[n]);
			}

			//TODO : Les perso n'ont pas le meme nombre de sprite
			//for (let i = 0; i < number_of_player; i++) {
				player.sprites[0].add_anime('normal', 1, 10);
				player.sprites[1].add_anime('punch-1', 1, 4);
				player.sprites[2].add_anime('walk-left', 1, 11);
				player.sprites[3].add_anime('walk-right', 1, 11);
				player.sprites[4].add_anime('jump', 1, 21);
				player.sprites[5].add_anime('down', 1, 9);
				player.sprites[6].add_anime('punch-2', 1, 8);
				player.sprites[7].add_anime('punch-3', 1, 9);
				player.sprites[8].add_anime('damaged', 1, 7);
				player.sprites[9].add_anime('block', 1, 4);
				player.sprites[10].add_anime('run-left', 1, 6);
				player.sprites[11].add_anime('run-right', 1, 6);
				player.sprites[12].add_anime('kick', 1, 7);
				player.sprites[13].add_anime('down-damage', 1, 8);
				player.sprites[14].add_anime('down-kick', 1, 5);
				player.sprites[15].add_anime('down-punch', 1, 5);
				player.sprites[16].add_anime('hadoken', 1, 17);
				player.sprites[17].add_anime('jump-kick', 1, 5);
				player.sprites[18].add_anime('jump-punch', 1, 8);
				player.sprites[19].add_anime('ko', 1, 25);
				player.sprites[20].add_anime('pose', 1, 8);
				player.sprites[21].add_anime('super-attack', 1, 11);
				player.sprites[0].loop = true;
				player.sprites[19].stop = true;				
			//}
		};
	//}
}



//Permet de ne pas rester appuyer sur une touche
window.addEventListener('keydown', keydown_fun, false);
window.addEventListener('keyup', keyup_fun, false);

function keyup_fun() {
	action = true;
}

function keydown_fun(e) {

	if(select == true) {
		///Si on est dans la sélection de personnage;
		switch(e.code) {
			///Avec 4 perso avoir une selection en une ligne c'est parfaitement suffisant
			case 'KeyA':
				///On bouge l'id dans la liste de perso
				if(selectID != 0){selectID -= 1;}
				break;
			case 'KeyD':
				if(selectID != selectList.length-1){selectID += 1;}
				break;
			case 'Enter':
				///quand on a choisi le perso il est push dans notre liste de choisie
				selected.push(selectList[selectID]);
				break;
		}
		console.log(selectID);
		if(selected.length == 2) {
			select = false;
			selectedPath();
			loadEverything();
			madeSelect = true;
			go = true;
		}
	}

	if(enterGame == false) {
		switch (e.code) {
			case 'Enter':
				enterGame = true;
				select = true;
				break;
		}
	}

	if (action == true) {
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
		}
	}
}

setInterval(update, 35);


function eachPersoLoad(player, perso) {
	switch(perso) {
		case "ryu":
			player.sprites[0].add_anime('normal', 1, 10);
			player.sprites[1].add_anime('punch-1', 1, 4);
			player.sprites[2].add_anime('walk-left', 1, 11);
			player.sprites[3].add_anime('walk-right', 1, 11);
			player.sprites[4].add_anime('jump', 1, 21);
			player.sprites[5].add_anime('down', 1, 9);
			player.sprites[6].add_anime('punch-2', 1, 8);
			player.sprites[7].add_anime('punch-3', 1, 9);
			player.sprites[8].add_anime('damaged', 1, 7);
			player.sprites[9].add_anime('block', 1, 4);
			player.sprites[10].add_anime('run-left', 1, 6);
			player.sprites[11].add_anime('run-right', 1, 6);
			player.sprites[12].add_anime('kick', 1, 7);
			player.sprites[13].add_anime('down-damage', 1, 4);
			player.sprites[14].add_anime('down-kick', 1, 5);
			player.sprites[15].add_anime('down-punch', 1, 5);
			player.sprites[16].add_anime('hadoken', 1, 18);
			player.sprites[17].add_anime('jump-kick', 1, 5);
			player.sprites[18].add_anime('jump-punch', 1, 8);
			player.sprites[19].add_anime('ko', 1, 25);
			player.sprites[20].add_anime('pose', 1, 8);
			player.sprites[21].add_anime('super-attack', 1, 11);
			player.sprites[0].loop = true;
			player.sprites[19].stop = true;	
			break;
		case "ken":
			player.sprites[0].add_anime('normal', 1, 10);
			player.sprites[1].add_anime('punch-1', 1, 4);
			player.sprites[2].add_anime('walk-left', 1, 11);
			player.sprites[3].add_anime('walk-right', 1, 11);
			player.sprites[4].add_anime('jump', 1, 23);
			player.sprites[5].add_anime('down', 1, 9);
			player.sprites[6].add_anime('punch-2', 1, 8);
			player.sprites[7].add_anime('punch-3', 1, 9);
			player.sprites[8].add_anime('damaged', 1, 7);
			player.sprites[9].add_anime('block', 1, 4);
			player.sprites[10].add_anime('run-left', 1, 6);
			player.sprites[11].add_anime('run-right', 1, 6);
			player.sprites[12].add_anime('kick', 1, 7);
			player.sprites[13].add_anime('down-damage', 1, 4);
			player.sprites[14].add_anime('down-kick', 1, 5);
			player.sprites[15].add_anime('down-punch', 1, 5);
			player.sprites[16].add_anime('hadoken', 1, 18);
			player.sprites[17].add_anime('jump-kick', 1, 5);
			player.sprites[18].add_anime('jump-punch', 1, 8);
			player.sprites[19].add_anime('ko', 1, 25);
			player.sprites[20].add_anime('pose', 1, 8);
			player.sprites[21].add_anime('super-attack', 1, 11);
			player.sprites[0].loop = true;
			player.sprites[19].stop = true;	
			break;
		case "akuma":
			break;
		case "chunli":
			break;
	}
}