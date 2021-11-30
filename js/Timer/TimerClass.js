///Timer class pour créée un timer
export default class Timer {
	constructor(time, ctx, images, posTX1) {
		this.time = time;
		this.Otime = time;
		this.ctx = ctx;
		this.images = images;
		this.posTX1 = posTX1;
	}

	///reset au premier temps donné
	resetTime() {
		this.time = this.Otime;
	}

	///renvoie le temps actuelle
	getTime() {
		return this.time;
	}

	///diminue le temps du montant bloquant à 0
	decreseTime(amount) {
		if (this.time - amount > 0) {
			this.time -= amount;
		} else {
			this.time = 0;
		}
	}

	///Dessine le temps
	displayTime() {
		let strTime = this.time.toString(10);
		let posTX;
		let posTY = 50;
		for (let i = 0; i < strTime.length; i++) {
			if (i == 0) {
				posTX = this.posTX1;
			} else {
				posTX = this.posTX1 + 62;
			}

			switch (strTime[i]) {
				case '0':
					this.ctx.drawImage(this.images[0], posTX, posTY);
					break;
				case '1':
					this.ctx.drawImage(this.images[1], posTX, posTY);
					break;
				case '2':
					this.ctx.drawImage(this.images[2], posTX, posTY);
					break;
				case '3':
					this.ctx.drawImage(this.images[3], posTX, posTY);
					break;
				case '4':
					this.ctx.drawImage(this.images[4], posTX, posTY);
					break;
				case '5':
					this.ctx.drawImage(this.images[5], posTX, posTY);
					break;
				case '6':
					this.ctx.drawImage(this.images[6], posTX, posTY);
					break;
				case '7':
					this.ctx.drawImage(this.images[7], posTX, posTY);
					break;
				case '8':
					this.ctx.drawImage(this.images[8], posTX, posTY);
					break;
				case '9':
					this.ctx.drawImage(this.images[9], posTX, posTY);
					break;
			}
		}
	}
}
