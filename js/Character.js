export default class Character {
	constructor(posXX, posYY, ctx, sens) {
		this.hp = 10000;
		this.attacking = false;
		this.jumping = false;
		this.sprites = [];
		this.posXX = posXX;
		this.posYY = posYY;
		this.zoom = 4;
		this.ctx = ctx;
		this.sens = sens;
		this.lastX = posXX;
		this.lastY = posYY;
	}

	init() {
		//On initialise nos animations
		for (let i = 0; i < this.sprites.length; i++) {
			this.sprites[i].to_draw = 0;
			//On revient à la premiere image de l'animation
			this.sprites[i].animestep = 1;
		}
	}

	animeChara(event_code) {
		this.init();
		for (let i = 0; i < this.sprites.length; i += 1) {
			if (this.sprites[i].event_code == event_code) {
				this.sprites[i].next_step();
				/*if(event_code == 'Jump' && i != this.sprites.length-1) {
					this.posYY -= 20;
				}
				if(event_code == 'Jump' && i == this.sprites.length-1 && this.posYY != lastY) {
					i-=1;
					this.posYY += 20;
				}*/
			}
		}
	}

	punch(posOPX, posOPY, attackOP) {
		this.attacking = true;
		this.animeChara('Punch');
		if (this.collisionCheck(posOPX, posOPY, 120) == true) {
			console.log('ca tape par ici');
		}
		this.attacking = false;
	}
	walk_right() {
		this.animeChara('WalkRight');
	}
	walk_left() {
		this.animeChara('WalkLeft');
	}
	jump() {
		this.jumping = true;
		this.animeChara('Jump');
		//this.posYY -= 100;
		this.jumping = false;
	}
	down() {
		this.animeChara('Down');
	}

	collisionCheck(posOPX, posOPY, w) {
		//let w = 80;
		if (this.sens == 1) {
			posOPX = Math.abs(posOPX);

			if (
				this.posXX + w * this.zoom >= posOPX - w * this.zoom &&
				this.posXX <= posOPX
			) {
				return true;
			} else {
				return false;
			}
		} else {
			let n = Math.abs(this.posXX);

			if (n - w * this.zoom <= posOPX + w * this.zoom && n >= posOPX) {
				return true;
			} else {
				return false;
			}
		}
	}

	backLastCord() {
		this.posXX = this.lastX;
	}

	draw(index, posOPX, posOPY) {
		this.ctx.beginPath();

		let step_i = this.sprites[index].animestep;
		let cnv_i = this.sprites[index].animeseq[step_i];

		//Notre hitbox
		this.ctx.strokeRect(
			this.posXX,
			this.posYY + 180,
			(cnv_i.width - 15) * this.zoom,
			(cnv_i.height - 55) * this.zoom
		);
		this.ctx.stroke();

		//Changement de position
		//check des collision
		if (this.collisionCheck(posOPX, posOPY, 80) == true) {
			//si il y a collision alors il faut revenir à une position précédente car sinon on ne peut plus se déplacer
			this.backLastCord();
		} else {
			//sauvegarde de la pos précédente
			this.lastX = this.posXX;
			this.posXX += this.sprites[index].to_goX;
		}

		//On dessine notre sprite
		this.ctx.drawImage(
			cnv_i,
			this.posXX - 80,
			this.posYY,
			cnv_i.width * this.zoom,
			cnv_i.height * this.zoom
		);
		this.ctx.restore();
		//Une fois dessiné on dit au programme qu'on a finit de dessiner cette image
		this.sprites[index].to_draw = 0;
		this.ctx.closePath();
	}

	drawPlayer(posOPX, posOPY) {
		//Si this.sprites[0].to_draw == 1
		//Alors sa veut dire le joueur ne fait aucune action
		//donc on joue l'animation du perso
		if (this.sprites[0].to_draw == 1) {
			this.draw(0, posOPX, posOPY);

			//On passe à l'image suivante de l'animation
			this.sprites[0].next_step();

			//Sinon sa voudra dire que le joueur fait une action
		} else {
			//On regarde quelle action le joueur a utilisé
			for (let i = 1; i < this.sprites.length; i += 1) {
				if (this.sprites[i].to_draw == 1) {
					//On dessine l'image de l'animation
					this.draw(i, posOPX, posOPY);

					//On récupere la valeur du nombre d'images de l'animation
					let number_of_sprite = this.sprites[i].animeseq.length;

					//La variable step_i va pouvoir récuperer à quel image
					//de l'animation on est
					let step_i = this.sprites[i].animestep;

					//Tant qu'on est pas à la derniere image de l'animation
					//on continuera à passer à l'image suivante
					if (step_i != number_of_sprite - 1) {
						this.sprites[i].next_step();
					} else {
						//On dit au programme de dessiner maintenant
						//l'animation normal du personnage
						this.sprites[0].to_draw = 1;
					}
				}
			}
		}
	}
}
