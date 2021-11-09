export default class Animation {
	constructor(ctx, posXX, posYY, sens) {
		this.sprites = [];
		this.zoom = 3;
		this.ctx = ctx;
		this.sens = sens;
		this.posXX = posXX;
		this.posYY = posYY;
        this.posHYY = posYY

		this.hitboxX = this.posXX + 20;
		this.hitboxY = this.posYY + 170;
		this.sizeW = 0;
		this.sizeH = 0; 
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
				
				//if(event_code == 'Jump' && i != this.sprites.length-1) {
				//	this.posYY -= 300;
				//}
			}
		}
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

	prioCheck() {

	}
	
	collision(player) {
		///si on est le joueur a gauche alors on fait la valeur absolue du joueur a droite
		///car il est sur une échelle négative
		
		if(this.sens == 1){

			let playerX = Math.abs(player.hitboxX);
			///si ma position + la width de ma hitbox est supérieur ou égale (on peut enlever le égale peut etre) à la position du joueur opposé moins la width de hitbox alors il y a contact
			/// && sert a vérifier si on est passer derriere le joueur adversaire 
			if (
				this.hitboxX + this.sizeW > playerX - player.sizeW&&
				this.hitboxX <= playerX
			) {
			///contact donc on renvoit true
			//console.log("sa se touche")
				return true;
			} else {
				return false;
			}
		}
		else{
			let playerX = Math.abs(this.hitboxX);
			if (
				playerX - this.sizeW < player.hitboxX + player.sizeW&&
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


	draw(index,player) {
		this.ctx.beginPath();

		let step_i = this.sprites[index].animestep;
		let cnv_i = this.sprites[index].animeseq[step_i];

		//this.jumpFallDown();

		//Notre hitbox
		this.ctx.strokeRect(
			this.posXX - 60,
			this.posYY + 240,
			(cnv_i.width - 160) * this.zoom,
			(cnv_i.height - 120) * this.zoom
		);
		this.ctx.stroke();
		this.sizeW = (cnv_i.width  - 160) * this.zoom;

		//Changement de position
		//check des collision
		this.posXX += this.sprites[index].to_goX;
		this.hitboxX = this.posXX - 60;
		if(this.collision(player) == true){
			this.posXX -= this.sprites[index].to_goX;
		}

		//if (this.collisionCheck(posOPX, posOPY, 82) != false) {
        //    this.posXX -= this.sprites[index].to_goX;
		//}

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

	drawPlayer(player) {
		//Si this.sprites[0].to_draw == 1
		//Alors sa veut dire le joueur ne fait aucune action
		//donc on joue l'animation du perso
		if (this.sprites[0].to_draw == 1) {
			this.draw(0,player);

			//On passe à l'image suivante de l'animation
			this.sprites[0].next_step();

			//Sinon sa voudra dire que le joueur fait une action
		} else {
			//On regarde quelle action le joueur a utilisé
			for (let i = 1; i < this.sprites.length; i += 1) {
				if (this.sprites[i].to_draw == 1) {
					//On dessine l'image de l'animation
					this.draw(i,player);

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
