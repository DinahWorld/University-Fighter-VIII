export { sound, soundSelect, makePause, restartSound };

let sound = new Array(13);
let soundName = [
	'select',
	'enter',
	'go',
	'menu',
	'annonce',
	'attack',
	'kick',
	'hadoken',
	'hurt',
	'ko',
	'soundtrack',
];

for (let i = 0; i < 11; i++) {
	sound[i] = new Audio();
	sound[soundName[i]] = sound[i];
}

sound[0].src = './assets/sound/character_select/select.wav';
sound[1].src = './assets/sound/character_select/enter.wav';
sound[2].src = './assets/sound/character_select/go.wav';
sound[3].src = './assets/sound/menu_start/menu.mp3';
sound[4].src = './assets/sound/battle/annonce.wav';
sound[5].src = './assets/sound/battle/hit.wav';
sound[6].src = './assets/sound/battle/kick.wav';
sound[7].src = './assets/sound/battle/hadoken.wav';
sound[8].src = './assets/sound/battle/hurt.wav';
sound[9].src = './assets/sound/battle/ko.mp3';
sound[10].src = './assets/sound/battle/soundtrack.mp3';

///joue le sont selectionner
function soundSelect(i, reset) {
	if (sound[i].paused) sound[i].play();
	else if (reset == true) sound[i].currentTime = 0;
}

///met en pause le son
function makePause(i) {
	sound[i].pause();
}

///reset les sons au début
function restartSound(i) {
	sound[i].currentTime = 0;
}
