export default class Animation {
	///Constructeur de la classe
	constructor(ctx, posXX, posYY, direction) {
		this.sprites = [];
		this.zoom = 3;
		this.direction = direction;
		this.ctx = ctx;
		// On rajoute + 90 à la position du personnage 
		// pour qu'il soit visible dans le canvas
		this.posXX = posXX + 90;
		this.hpBar = 500;

		this.posYY = posYY;
		this.posHYY = posYY;
		//La taille de la hitbox
		this.hitboxX = 0;
		this.hitboxY = 0;
		this.sizeW = 0;
		this.sizeH = 0;

		// impacte la taille de la hitbox
		this.modifiedhY = 0;
		this.modifiedhsizeW = 0;

		//Notre attaque à distance
		this.rangehitboxX = this.hitboxX;
		this.rangehitboxY = this.hitboxY;
		this.rangeAttack = [];
	}

	///ajoute une attaque distance a gérer
	addRange(l) {
		this.rangeAttack.push(l);
	}
	///récupère combien d'attaque distance il existe
	getRange() {
		return this.rangeAttack.length;
	}

	//On revient à la premiere image du tableau/animation
	resetAnimation() {
		for (let i = 0; i < this.sprites.length; i++) {
			//On ne reset pas l'animation de jump
			if (i != 4) {
				this.sprites[i].animestep = 1;
			}
		}
	}

	///la détection de collision des attaques distance
	collisionRange(player) {
		if (this.direction == true) {
			//On vérifie si l'attaque à distance est en dehors de l'écran
			for (let i = 0; i < this.rangeAttack.length; i++) {
				if (this.rangeAttack[i][0] + this.rangeAttack[i][2] > 1600) {
					this.rangeAttack.splice(i, 1);
					continue;
				}

				// les coordonnées du joueur en face sont en valeur négative 
				let playerX = Math.abs(player.hitboxX);
				let playerY = Math.abs(player.hitboxY);

				///si ma position + la width de ma hitbox est supérieur ou égale (on peut enlever le égale peut etre) à la position du joueur opposé moins la width de hitbox alors il y a contact
				/// && sert a vérifier si on est passer derriere le joueur adversaire
				///playerY ne change pas
				//console.log(playerY);
				if (
					this.rangeAttack[i][0] + this.rangeAttack[i][2] >
						playerX - (player.sizeW/2) &&
					this.rangeAttack[i][0] < playerX &&
					this.rangeAttack[i][1] + this.rangeAttack[i][3] > playerY &&
					this.rangeAttack[i][1] < playerY + player.sizeH
				) {
						///contact donc on renvoit true
						this.rangeAttack.splice(i, 1);
						return true;
				} 
				else{
					// On vérifie si il y a une collision entre deux attaque à distance
					for(let y = 0;y < player.rangeAttack.length;y++){
						let attackX = Math.abs(player.rangeAttack[y][0]);
						let attackY = Math.abs(player.rangeAttack[y][1]);
					
						if(this.rangeAttack[i][0] + this.rangeAttack[i][2] >
							attackX - (player.rangeAttack[y][2] / 2.5) &&
							this.rangeAttack[i][0] < attackX &&
							this.rangeAttack[i][1] + this.rangeAttack[i][3] > attackY &&
							this.rangeAttack[i][1] < attackY + player.rangeAttack[y][3]
						){
							///contact donc on les enleve
							this.rangeAttack.splice(i, 1);
							player.rangeAttack.splice(y, 1);
							// Etant donné que ce n'est pas un contact entre joueur 
							// on renvoie false
							return false;
						}
					}
				}
				
			}		
				return false;			
		}
		 else {
			for (let i = 0; i < this.rangeAttack.length; i++) {
				if (this.rangeAttack[i][0] > 0) {
					this.rangeAttack.splice(i, 1);
					continue;
				}
				let attackX = Math.abs(this.rangeAttack[i][0]);
				let attackY = Math.abs(this.rangeAttack[i][1]);

				if (
					attackX - this.rangeAttack[i][2] < player.hitboxX + (player.sizeW/2) &&
					attackX > player.hitboxX &&
					attackY + this.rangeAttack[i][3] > player.hitboxY &&
					attackY < player.hitboxY + player.sizeH
				) {
					///contact donc on renvoit true
					this.rangeAttack.splice(i, 1);
					return true;
				} else {
					return false;
				}
			}
		}
	}

	///Collision d'une attaque contact
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

	///dessine le personnage
	draw(index) {
		this.ctx.beginPath();

		let step_i = this.sprites[index].animestep;
		let cnv_i = this.sprites[index].animeseq[step_i];
		//Notre hitbox
		this.hitboxX = this.posXX - 60;
		this.hitboxY = this.posYY + this.modifiedhY;
		this.sizeW = (cnv_i.width - this.modifiedhsizeW) * this.zoom;
		this.sizeH = (cnv_i.height - 140) * this.zoom;
		
		//this.ctx.strokeStyle = 'blue';
		//this.ctx.strokeRect(this.hitboxX, this.hitboxY, this.sizeW, this.sizeH);
		
		// Animation de l'attaque à distance
		if (this.rangeAttack.length >= 1) {
			let step2_i = this.sprites[16].animestep;
			let cnv2_i = this.sprites[16].animeseq[step2_i];

			for (let i = 0; i < this.rangeAttack.length; i++) {
				this.ctx.drawImage(
					cnv2_i,
					this.rangeAttack[i][0],
					this.rangeAttack[i][1],
					this.rangeAttack[i][2],
					this.rangeAttack[i][3]
				);
				this.rangeAttack[i][0] += 30;
			}
			this.sprites[16].to_draw = 0;
			this.sprites[16].next_step();
		}

		//On dessine notre sprite
		this.ctx.drawImage(
			cnv_i,
			this.posXX - 500,
			this.posYY + 180,
			cnv_i.width * this.zoom,
			cnv_i.height * this.zoom
		);

		//Une fois dessiné on dit au programme qu'on a finit de dessiner cette image
		this.sprites[index].to_draw = 0;
		this.ctx.closePath();
	}

	///dessine et gère l'animations
	drawPlayer(i) {
		this.draw(i);
		//On récupere la valeur du nombre d'images de l'animation
		let number_of_sprite = this.sprites[i].animeseq.length;

		//La variable step_i va pouvoir récuperer à quel image
		//de l'animation on est
		let step_i = this.sprites[i].animestep;

		//Si on loop est false
		//On enchaine les images normalement
		if (this.sprites[i].loop == false) {
			//Lorsque l'on aura atteint la derniere image de notre animation
			//on renvoie true pour qu'on puisse dire au programme que notre
			//animation est fini
			if (step_i != number_of_sprite - 1) this.sprites[i].next_step();
			else {
				if (this.sprites[i].stop == false) this.sprites[i].animestep = 1;
				return true;
			}
		} else {
			this.sprites[i].next_step();
			return false;
		}
	}

	//Methode pour remetre par défault nos variables
	reset(posXX, posYY) {
		this.hpBar = 500;
		this.posXX = posXX + 90;
		this.posYY = posYY;
	}
}
