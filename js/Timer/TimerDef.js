export { imageNumber, clearIntervalTimer };

///On charge les images pour le timer
let imageNumber = [];
let imgTimer = new Image();
imgTimer.src = './assets/count/count_number.png';
imgTimer.onload = function () {
	let canvas1 = document.createElement('canvas');
	canvas1.width = 62 * 10;
	canvas1.height = 80;
	let context1 = canvas1.getContext('2d');
	context1.drawImage(imgTimer, 0, 0, 62 * 10, 80);
	for (let i = 0; i < 11; i++) {
		let canvasImageData1 = context1.getImageData(i * 62, 0, 62, 80);
		let canvas2 = document.createElement('canvas');
		canvas2.width = 62;
		canvas2.height = 80;
		let context2 = canvas2.getContext('2d');
		context2.putImageData(canvasImageData1, 0, 0);
		imageNumber.push(canvas2);
	}
};

///Clear le timer
function clearIntervalTimer(t) {
	clearInterval(t);
}
