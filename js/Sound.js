export {sound,soundSelect};

let sound = new Array(4);
for (let i = 0; i < 4; i++) {
	sound[i] = new Audio();
	sound[i].muted = true;
}
sound[0].src = './assets/sound/character_select/select.wav';
sound[1].src = './assets/sound/character_select/enter.wav';
sound[2].src = './assets/sound/character_select/go.wav';
sound[3].src = './assets/sound/menu_start/menu.mp3';


function soundSelect(i) {
	if (sound[i].paused) {
		sound[i].play();
	} else {
		sound[i].currentTime = 0;
	}
}

