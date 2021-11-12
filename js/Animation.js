export default class Animation {
	constructor(ctx, posXX, posYY, direction) {
		this.sprites = [];
		this.zoom = 3;
		this.direction = direction;
		this.ctx = ctx;
		if (direction == true) this.posXX = posXX;
		else this.posXX = -posXX;

		this.posYY = posYY;
		this.posHYY = posYY;

		this.hitboxX = 0;
		this.hitboxY = 0;
		this.sizeW = 0;
		this.sizeH = 0;

		this.modifiedhY = 240;
		this.modifiedhsizeW = 170;

		this.rangehitboxX = this.hitboxX;
		this.rangehitboxY = this.hitboxY;
		this.range_attack = [];
	}

	addRange(l) {
		this.range_attack.push(l);
	}
	getRange() {
		return this.range_attack.length;
	}

	resetAnimation() {
		for (let i = 0; i < this.sprites.length; i++) {
			//On revient à la premiere image de l'animation
			this.sprites[i].animestep = 1;
		}
	}
	collisionRange(player) {
		if (this.direction == true) {
			for (let i = 0; i < this.range_attack.length; i++) {
				if (this.range_attack[i][0] + this.range_attack[i][2] > 1920) {
					this.range_attack.splice(i, 1);
					continue;
				}

				let playerX = Math.abs(player.hitboxX);
				let playerY = Math.abs(player.hitboxY);

				///si ma position + la width de ma hitbox est supérieur ou égale (on peut enlever le égale peut etre) à la position du joueur opposé moins la width de hitbox alors il y a contact
				/// && sert a vérifier si on est passer derriere le joueur adversaire
				///playerY ne change pas
				//console.log(playerY);
				if (
					this.range_attack[i][0] + this.range_attack[i][2] >
						playerX - player.sizeW &&
					this.range_attack[i][0] < playerX &&
					this.range_attack[i][1] + this.range_attack[i][3] > playerY &&
					this.range_attack[i][1] < playerY + player.sizeH
				) {
					///contact donc on renvoit true
					this.range_attack.splice(i, 1);
					return true;
				} else {
					return false;
				}
			}
		} else {
			for (let i = 0; i < this.range_attack.length; i++) {
				if (this.range_attack[i][0] > 0) {
					this.range_attack.splice(i, 1);
					continue;
				}
				let attackX = Math.abs(this.range_attack[i][0]);
				let attackY = Math.abs(this.range_attack[i][1]);

				/*if(attackX  < 0) {
					this.range_attack.splice(i, 1);
					continue;
				}*/
				if (
					attackX - this.range_attack[i][2] < player.hitboxX + player.sizeW &&
					attackX > player.hitboxX /*this.range_attack[i][0]*/ &&
					attackY + this.range_attack[i][3] > player.hitboxY &&
					attackY < player.hitboxY + player.sizeH
				) {
					///contact donc on renvoit true
					//console.log("sa se touche")
					this.range_attack.splice(i, 1);
					return true;
				} else {
					return false;
				}
			}
		}
	}
	collision(player) {
		///si on est le joueur a gauche alors on fait la valeur absolue du joueur a droite
		///car il est sur une échelle négative

		if (this.direction == true) {
			let playerX = Math.abs(player.hitboxX);
			let playerY = Math.abs(player.hitboxY);

			///si ma position + la width de ma hitbox est supérieur ou égale (on peut enlever le égale peut etre) à la position du joueur opposé moins la width de hitbox alors il y a contact
			/// && sert a vérifier si on est passer derriere le joueur adversaire
			if (
				this.hitboxX + this.sizeW > playerX - player.sizeW &&
				this.hitboxX < playerX &&
				this.hitboxY + this.sizeH > playerY &&
				this.hitboxY < playerY + player.sizeH
			) {
				///contact donc on renvoit true
				//console.log("sa se touche")
				return true;
			} else {
				return false;
			}
		} else {
			let playerX = Math.abs(this.hitboxX);
			let playerY = Math.abs(this.hitboxY);

			if (
				playerX - this.sizeW < player.hitboxX + player.sizeW &&
				playerX > player.hitboxX &&
				playerY - this.sizeH < player.hitboxY &&
				playerY < player.hitboxY + player.sizeH
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
		this.current_width = cnv_i.width;
		this.hitboxX = this.posXX - 60;
		this.hitboxY = this.posYY + this.modifiedhY;
		this.sizeW = (cnv_i.width - this.modifiedhsizeW) * this.zoom;
		this.sizeH = (cnv_i.height - 120) * this.zoom;

		//Notre hitbox
		this.ctx.strokeRect(this.hitboxX, this.hitboxY, this.sizeW, this.sizeH);
		//On regarde les collisions
		
		this.ctx.fillStyle = 'blue';
		if (this.range_attack.length >= 1) {
			for (let i = 0; i < this.range_attack.length; i++) {
				this.ctx.fillRect(
					this.range_attack[i][0],
					this.range_attack[i][1],
					this.range_attack[i][2],
					this.range_attack[i][3]
					//(cnv_i.width - 80) * this.zoom,
					//(cnv_i.height - 40) * this.zoom
				);
				this.range_attack[i][0] += 30;
			}
		}

		this.ctx.stroke();

		//if (this.collisionCheck(player) == true) {
		//	this.posXX -= this.move;
		//}

		//On dessine notre sprite
		this.ctx.drawImage(
			cnv_i,
			this.posXX - 500,
			this.posYY,
			cnv_i.width * this.zoom,
			cnv_i.height * this.zoom
		);

		//Une fois dessiné on dit au programme qu'on a finit de dessiner cette image
		this.sprites[index].to_draw = 0;
		this.ctx.closePath();
	}

	//Au lieu que le programme cherche quelle animation est activé
	//je lui demande direct d'animer telle image
	//On aurait alors une complexité en O(1)

	drawPlayerV2(i) {
		this.drawV2(i);
		//On récupere la valeur du nombre d'images de l'animation
		let number_of_sprite = this.sprites[i].animeseq.length;

		//La variable step_i va pouvoir récuperer à quel image
		//de l'animation on est
		let step_i = this.sprites[i].animestep;

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
