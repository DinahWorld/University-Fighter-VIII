/*
*			BUG !
* 		Virer les reset pour lorsqu'on saut on 
		puise se déplacer sur l'axe X
		Opti possible quand on choisie 2 fois le meme perso on fait deux list d'animation différente alors que une est suffisante
		
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

let transition_done = false;
let black_screen = false;

let opacity = 0;
let opacity_value = 0.05;

let select = true;
let selectID = 0;
let selectList = ["ryu", "ken", "akuma", "chunli"];
let selected = [];
let selectedSprites = [];

let spritesPL = ['./assets/atlas/ken.json', './assets/atlas/akuma.json'];


let loadFile = function (filePath, done) {
    let xhr = new XMLHttpRequest();//new XMLHTTPRequest();
    xhr.onload = function () { return done(this.responseText) }
    xhr.open("GET", filePath, true);
    xhr.send();
}
let json_datas = [];
let player_1 = new Character('Dinath', 0, 0, ctx, 1);
let player_2 = new Character('Fayçal', -cnv.width, 0, ctx, 2);
/*for(let i = 0; i < spritesPL.length; i++) {
	loadFile(spritesPL[i], function (responseText) {
		json_datas[i] = JSON.parse(responseText);
		onload_atlas3(i);
	})
}*/

//utiliser pour load les sprites des perso choisies
function loadEverything() {
	for(let i = 0; i < selectedSprites.length; i++) {
		loadFile(selectedSprites[i], function (responseText) {
			json_datas[i] = JSON.parse(responseText);
			onload_atlas3(i);
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

audio.play();

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
	//(player_1.posXX);
	//(player_2.posXX);
	//Le go c'est juste car quand le programme se lance il execute le update avant meme
	//que player_1 reçoit les sprites du coup on a des error dans la console
	if (go == true) {
		mapSelect();
	}
	if (transition_done == true) {
		game();
	}
}


function game(){
	if (hp_1 != player_1.hp) hp_1 -= 2;
	if (hp_2 != player_2.hp) hp_2 -= 2;

	ctx.fillStyle = 'red';
	ctx.fillRect(20, 20, hp_1, 50);

	player_1.jumpingMove();
	player_2.jumpingMove();

	
	player_1.drawing(player_2);	
	player_2.ctx.save();
	player_2.ctx.scale(-1, 1);

	ctx.fillStyle = 'red';
	ctx.fillRect(-cnv.width + 20, 20, hp_2, 50);

	player_2.drawing(player_1);
	
	player_2.ctx.restore();
	ctx.closePath();

}


function onload_atlas3(n) {
	let player;
	if(n == 0) {player = player_1;}
	else{player = player_2;}

	//if(this.status == 200) {
		let spritesheet = new Image();
		spritesheet.src = './assets/atlas/' + json_datas[n]['meta']['image'];

		spritesheet.onload = function () {
			let canvas1 = document.createElement('canvas');
			canvas1.width = json_datas[n]['meta']['size']['w'];
			canvas1.height = json_datas[n]['meta']['size']['h'];
			let context1 = canvas1.getContext('2d');
			context1.drawImage(spritesheet, 0, 0, canvas1.width, canvas1.height);

			/*for (let i = 0; i < 13; i++) {
				players[0].sprites[i] = new SpriteAtlas(context1, json_infos);
				players[1].sprites[i] = new SpriteAtlas(context1, json_infos);
			}*/

			for(let i = 0; i < 13; i++) {
				player.sprites[i] = new SpriteAtlas(context1, json_datas[n]);
			}
			

			player.sprites[0].add_anime('normal', 1, 10, '');
			player.sprites[1].add_anime('punch-1', 1, 4, 'Punch');
			player.sprites[2].add_anime('walk-left', 1, 11, 'WalkLeft');
			player.sprites[3].add_anime('walk-right', 1, 11, 'WalkRight');
			player.sprites[4].add_anime('jump', 1, 21, 'Jump');
			player.sprites[5].add_anime('down', 1, 6, 'Down');
			player.sprites[6].add_anime('punch-2', 1, 8, 'Punch2');
			player.sprites[7].add_anime('punch-3', 1, 9, 'Punch3');
			player.sprites[8].add_anime('damaged', 1, 7, 'Hit');
			player.sprites[9].add_anime('block', 1, 4, 'Block');
			player.sprites[10].add_anime('run-left', 1, 6, 'RunLeft');
			player.sprites[11].add_anime('run-right', 1, 6, 'RunRight');
			player.sprites[12].add_anime('kick', 1, 7, 'Kick');
			player.sprites[0].loop = true;
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
		}
	}
	else {
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
				player_2.walk_left();
				break;
			case 'Numpad1':
				player_2.walk_right();
				break;
			case 'Numpad5':
				player_2.jump();
				break;
			case 'Numpad2':
				player_2.down();
				break;
			case 'Numpad6':
				player_2.run_left();
				break;
			case 'Numpad4':
				player_2.run_right();
				break;

			case 'Enter':
				go = true;
				break;

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
		}
	}
}
}

let instruID = 0;
let instruction = ["walk-right", "punch", "jump"];
function instru_execute(player, movement) {
	switch (movement) {
		case "walk-right":
			player.walk_right();
			break;
		case "punch":
			player.punch();
			break;
		case "jump":
			player.jump();
			break;
	}
}
///cette methode est pas possible parce que bizzarement le programme lit tout la liste d'instruction quand il recoit la liste
//let instrucs = [player_1.walk_right(), player_1.punch(), player_1.jump()];
function instru_list(player) {
	instru_execute(player, instruction[instruID]);
	if(instruID != instruction.length-1) {instruID+=1;}
	else{instruID = 0;}
}

setInterval(update, 45);
//setInterval(instru_list, 2000);
//setInterval(function () {instru_list(player_1)}, 1000);

