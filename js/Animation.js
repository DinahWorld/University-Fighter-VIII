export default class Animation {
	constructor(ctx, posXX, posYY, sens) {
		this.sprites = [];
		this.zoom = 3;
		this.sens = sens;
		this.ctx = ctx;
		this.posXX = posXX;
		this.posYY = posYY;
		this.posHYY = posYY;

		this.hitboxX = this.posXX + 20;
		this.hitboxY = this.posYY + 170;
		this.sizeW = 0;
		this.sizeH = 0;
	}

	resetAnimation() {
		for (let i = 0; i < this.sprites.length; i++) {
			//On revient à la premiere image de l'animation
			this.sprites[i].animestep = 1;
		}
	}

	collision(player) {
		///si on est le joueur a gauche alors on fait la valeur absolue du joueur a droite
		///car il est sur une échelle négative

		if (this.sens == 1) {
			let playerX = Math.abs(player.hitboxX);
			///si ma position + la width de ma hitbox est supérieur ou égale (on peut enlever le égale peut etre) à la position du joueur opposé moins la width de hitbox alors il y a contact
			/// && sert a vérifier si on est passer derriere le joueur adversaire
			if (
				this.hitboxX + this.sizeW > playerX - player.sizeW &&
				this.hitboxX <= playerX
			) {
				///contact donc on renvoit true
				//console.log("sa se touche")
				return true;
			} else {
				return false;
			}
		} else {
			let playerX = Math.abs(this.hitboxX);
			if (
				playerX - this.sizeW < player.hitboxX + player.sizeW &&
				playerX >= player.hitboxX
			) {
				///contact donc on renvoit true
				//console.log("sa se touche")

				return true;
			} else {
				return false;
			}
		}
	}

	drawV2(index) {
		this.ctx.beginPath();

		let step_i = this.sprites[index].animestep;
		let cnv_i = this.sprites[index].animeseq[step_i];

		//this.jumpFallDown();
		this.sizeW = (cnv_i.width - 160) * this.zoom;

		//Notre hitbox
		this.ctx.strokeRect(
			this.posXX - 60,
			this.posYY + 240,
			this.sizeW,
			(cnv_i.height - 120) * this.zoom
		);
		this.ctx.stroke();

		//On dessine notre sprite
		this.ctx.drawImage(
			cnv_i,
			this.posXX - 500,
			this.posYY,
			cnv_i.width * this.zoom,
			cnv_i.height * this.zoom
		);
		this.ctx.restore();
		//Une fois dessiné on dit au programme qu'on a finit de dessiner cette image
		this.sprites[index].to_draw = 0;
		this.ctx.closePath();
	}

	//Au lieu que le programme cherche quelle animation est activé
	//je lui demande direct d'animer telle image
	//On aurait alors une complexité en O(1)

	drawPlayerV2(i, move) {
		this.drawV2(i);
		//On récupere la valeur du nombre d'images de l'animation
		let number_of_sprite = this.sprites[i].animeseq.length;

		//La variable step_i va pouvoir récuperer à quel image
		//de l'animation on est
		let step_i = this.sprites[i].animestep;

		this.posXX += move;
		this.hitboxX = this.posXX - 60;

		if (this.sprites[i].loop == false) {
			if (step_i != number_of_sprite - 1) {
				this.sprites[i].next_step();
			} else {
				this.sprites[i].animestep = 1;
				return true;
			}
		} else {
			this.sprites[i].next_step();
			return false;
		}
	}
}
