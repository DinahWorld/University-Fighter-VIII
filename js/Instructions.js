export {instru_list,getLists};
import {selected} from './LoadSprite.js'
let listP1;
let listP2;

let instruID1 = 0;
let instruID2 = 0;


///execute l'instruction que est donner on doit faire cela car sinon le programme lis la liste d'un coup
function instru_execute(player, movement) {
	switch (movement) {
		case "walk-left":
			player.walk_left();
			break;
		case "walk-right":
			player.walk_right();
			break;
		case "run-left":
			player.run_left();
			break;
		case "run-right":
			player.run_right();
			break;
		case "down":
			player.down();
			break;
		case "punch":
			player.punch();
			break;
		case "jump":
			player.jump();
			break;
		case "hadoken":
			player.hadoken();
			break;
		case "kick":
			player.kick();
			break;
		case "block":
			player.block();
			break;
	}
}

///instru list est appeler par le setInteveral pour chaque joueur avec leur liste a faire
function instru_list(player) {
	if(player.direction == true){
		instru_execute(player, listP1[instruID1]);
		
		if(instruID1 != listP1.length-1) {
			instruID1+=1;
		}
		else{
			instruID1 = 0;
		}
	}else{
		instru_execute(player, listP2[instruID2]);
		
		if(instruID2 != listP2.length-1) {
			instruID2+=1;
		}
		else{
			instruID2 = 0;
		}
	}
}

///donne une liste d'instruction selon les joueurs
function getLists() {
	for(let i = 0; i < 2; i++) {
		switch(selected[i]) {
			///ryu ken et akuma on un move set très similaire donc cela n'est pas important si la liste est la meme
			case "ryu":
			case "ken":
			case "akuma":
				if(i == 0) {
					listP1 = ["walk-right", "run-right", "punch", "kick", "run-left", "jump",
					 "walk-right", "walk-right", "block", "run-left","run-left" , "hadoken", "hadoken",
					  "run-right", "punch", "punch", "punch", "kick", "hadoken", "walk-left"];
				}
				else {
					listP2 = ["walk-left", "walk-left", "block", "run-right", "hadoken", "run-left",
					 "run-left", "punch", "punch", "punch", "run-right", "jump", "block", "run-left", "run-left",
					  "kick", "kick", "punch", "punch", "punch", "hadoken", "run-right"];
				}
				break;
			case "chunli":
				if(i == 0) {
					listP1 = ["run-right", "run-right", "kick", "kick", "punch", "punch", "punch", "walk-left",
					 "down", "block", "jump", "walk-right", "walk-right", "punch", "kick", "run-left", "run-left",
					  "block", "block", "run-right", "run-right", "kick", "kick", "punch"];
				}
				else {
					listP2 = ["run-left", "run-left", "kick", "kick", "punch", "punch", "punch", "walk-right", "down",
					 "block", "jump","walk-left", "walk-left", "punch", "kick", "run-right", "run-right", "block", 
					 "block", "run-left", "run-left", "kick", "kick", "punch"];
				}
				break;
		}
	}
}


