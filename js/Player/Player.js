import { soundSelect } from '../Visual/Sound.js';
import Animation from './Animation.js';

///Constructeur de la classe
export default class Player extends Animation {
	constructor(posXX, posYY, ctx, direction) {
		super(ctx, posXX, posYY, direction);
		this.hp = 500;
		this.combo = 0;
		this.attacking = false;
		this.blocking = false;
		this.isDown = false;
		//a frappé
		this.attacked = false;
		this.jumping = false;
		this.falling = false;
		this.hit = false;
		this.velocity = 50;
		this.acceleration = 3;
		this.animationNumber = 20;
		this.move = 0;
		this.count = 0;
		this.wait = 0;
		this.changedDirection = false;
		this.goRight = true;
		this.goLeft = true;
		this.inside = false;
	}

	drawing(player) {
		if (this.hp == 0) {
			this.animationNumber = 19;
			player.animationNumber = 20;
		}
		//Lorsque le personnage se fait frappé, la variable wait
		//est sur 8 et donc le personnage ne peut plus frapper ou se déplacer,
		//lorsque wait sera a 0 alors on considere que
		//le personnage est apte à se battre
		if (this.wait == 0) this.hit = false;
		else this.wait--;

		if (this.count != 0) this.count--;

		//On modifie la taille de notre hitbox
		if (this.attacking == true) this.modifiedhsizeW = 135;
		else this.modifiedhsizeW = 170;

		if (this.isDown == true) this.modifiedhY = 500;
		else this.modifiedhY = 450;

		//S'il n'est pas à l'interieur de la hitbox de son opposant
		if (this.inside == false) {
			//S'il y a une collision on dit qu'il est à l'interieur
			//et en fonction de sa direction on lui empeche un mouvement
			if (this.collisionCheck(player) == true) {
				if (this.direction == true) {
					this.move = 0;
					this.goRight = false;
					this.inside = true;
				} else {
					this.move = 0;
					this.goLeft = false;
					this.inside = true;
				}
			}
			//S'il arrive a sortir de la hitbox alors on lui rend tout ses mouvement
			//et on dira qu'il n'est plus a l'intérieur
		} else {
			if (this.collisionCheck(player) == false) {
				this.inside = false;
				this.goRight = true;
				this.goLeft = true;
			}
		}
		///vérifie que le joueur n'essaye pas de bouger en dehors de l'écran
		if (
			Math.abs(this.posXX) + this.move >= 0 &&
			Math.abs(this.posXX) + this.move <= 1500
		) {
			if (this.direction == true) this.posXX += this.move;
			else this.posXX -= this.move;
		}

		//Nous renvoi true lorsque on aura joué toutes nos frames
		//Sinon, ça voudra dire qu'on est entrain de jouer une animation en boucle
		let finished = this.drawPlayer(this.animationNumber, player);
		//S'il est true sa eut dire qu'on est dans une animation qu'on doit rejouer en boucle
		//hors cette animation est celle qui joué lorsqu'on ne fait, on considere cette
		//animation comme notre état initial
		if (finished == true) {
			//Si le personnage saute on reste dans l'animation de saut
			if (this.falling == true || this.jumping == true)
				this.animationNumber = 4;
			else this.animationNumber = 0;
			this.isDown = false;
			this.move = 0;
			this.attacking = false;
			this.attacked = false;
			this.blocking = false;
		}
	}

	///reduit la vie par le montant jusqu'a 0
	takeDamage(amount) {
		this.hp -= amount;
		if (this.hp <= 0) this.hp = 0;
	}

	///Espace entre les deux joueurs
	spaceBTWplayers(player) {
		if (this.direction == true) {
			///On utilise l'absolue vu que un joueurs est dans l'axe négatif
			let ab = Math.abs(player.posXX) - player.sizeW;
			return ab - (this.posXX + this.sizeW / 2);
		} else {
			let ab = Math.abs(this.posXX) - this.sizeW;
			return ab - (player.posXX + this.sizeW / 2);
		}
	}

	///reset des animations et valeur de combat
	reset() {
		this.combo = 0;
		this.move = 0;
		this.isDown = false;
		this.attacking = false;
		this.attacked = false;
		this.changedDirection = false;
		this.blocking = false;
		this.resetAnimation();
	}

	///Verification de collision
	collisionCheck(player) {
		if (super.getRange() != 0) {
			if (super.collisionRange(player) == true && player.blocking == false) {
				if (player.blocking == true) {
					player.block();
				}
				player.takeDamage(50);
				player.damaged();
				this.attacked = true;
				player.hit = true;
				player.wait = 8;
			}
		}
		if (super.collision(player) == true) {
			//S'il attaque, a attaqué et si le joueur en face ne bloque pas
			if (this.attacking == true && this.attacked == false) {
				if (player.blocking == true) {
					player.block();
				} else {
					player.takeDamage(20);
					player.damaged();
					this.attacked = true;
					player.hit = true;
					player.wait = 8;
				}
			} else {
				//Sa voudra dire qu'on est juste en contact avec l'adversaire
				return true;
			}
		} else return false;
	}

	//quand on a sauté on doit revenir au sol petit à petit
	jumpingMove() {
		if (this.jumping == true && this.falling == false) {
			//La position en Y du personnage augmente en fonction
			//de la vitesse qui baisse au fur et à mesure que la position
			//Y change
			this.posYY -= this.velocity;
			this.velocity -= this.acceleration;
			if (this.velocity <= 0) {
				this.falling = true;
				this.jumping = false;
			}
			//Meme principe lorsqu'il tombe
		} else if (this.jumping == false && this.falling == true) {
			this.posYY += this.velocity;
			this.velocity += this.acceleration;
			//On change l'animation du personnage à la position Y = -30
			if(this.posYY  == -30){
				this.sprites[4].animestep = 1;
				this.animationNumber = 0;
			
			}
			// Une fois a
			if (this.posYY >= 0) {
				this.posYY = 0;
				this.falling = false;
				this.jumping = false;
				this.velocity = 50;
				// On reset l'animation de saut
				}
		}
	}

	///Vérifie la direction des joueurs
	changeDirection(player) {
		//Pour qu'il ne change pas de direction en boucle
		if (this.changedDirection == false) {
			player.changedDirection = true;
			if (this.direction == true) {
				this.compareDirection(this, player);
			} else {
				this.compareDirection(player, this);
			}
		}
	}

	///Juge dans quel sens les joueurs doivent etre
	compareDirection(player_1, player_2) {
		//SI les coordonnées du joueur1 sont plus grand que celle du joueur2
		//alors on inverse les sens
		if (player_1.posXX >= Math.abs(player_2.posXX)) {
			player_1.direction = false;
			player_2.direction = true;
			player_2.posXX = Math.abs(player_2.posXX);
			player_1.posXX = -player_1.posXX;
			player_2.changedDirection = true;
			player_1.changedDirection = true;
		}
	}

	///reset le joueur
	resetCharacter(posXX, posYY) {
		super.reset(posXX, posYY);
		this.hp = 500;
		this.combo = 0;
		this.attacking = false;
		this.blocking = false;
		this.isDown = false;
		//a frappé
		this.attacked = false;
		this.hit = false;
		this.animationNumber = 20;
		this.move = 0;
		this.count = 0;
		this.wait = 0;
		this.changedDirection = false;
		this.goRight = true;
		this.goLeft = true;
		this.inside = false;
	}
	///déplacement vers la gauche
	walkLeft() {
		if (this.hit == false && this.goLeft == true) {
			this.reset();
			this.move = -20;
			if (this.falling == true || this.jumping == true) return;

			if (this.direction == true) {
				this.animationNumber = 2;
				this.blocking = true;
			} else this.animationNumber = 3;
			this.going_left = true;
		}
	}
	///déplacement vers la droite
	walkRight() {
		if (this.hit == false && this.goRight == true) {
			this.reset();
			this.move = +20;
			if (this.falling == true || this.jumping == true) return;
			if (this.direction == true) this.animationNumber = 3;
			else {
				this.animationNumber = 2;
				this.blocking = true;
			}
			this.going_right = true;
		}
	}

	///saut du joueur
	jump() {
		if (this.hit == false && this.jumping == false && this.falling == false) {
			this.reset();
			this.jumping = true;
			this.animationNumber = 4;
		}
	}

	///accroupissement du joueur
	down() {
		if (this.hit == false && this.jumping == false && this.falling == false) {
			this.reset();
			this.animationNumber = 5;
			this.isDown = true;
		}
	}
	///animation quand on prends des dégats
	damaged() {
		soundSelect('hurt', true);
		this.reset();
		if (this.isDown == false) this.animationNumber = 8;
		else this.animationNumber = 13;
	}

	///animation du blocage d'attaque
	block() {
		if (this.hit == false && this.jumping == false && this.falling == false) {
			this.reset();
			this.blocking = true;
			this.animationNumber = 9;
		}
	}
	///Cours vers la gauche
	runLeft() {
		if (this.hit == false && this.goLeft == true) {
			this.reset();
			this.move = -50;
			if (this.direction == true) this.animationNumber = 10;
			else this.animationNumber = 11;
		}
	}
	///Cours vers la droite
	runRight() {
		if (this.hit == false && this.goRight == true) {
			this.reset();
			this.move = +50;
			if (this.direction == true) this.animationNumber = 11;
			else this.animationNumber = 10;
		}
	}
	///Attaque coup de pied
	kick() {
		if (this.hit == false && this.attacking == false && this.falling == false) {
			soundSelect('kick', true);
			this.resetAnimation();

			if (this.jumping == true) this.animationNumber = 17;
			else if (this.isDown == true) this.animationNumber = 14;
			else this.animationNumber = 12;
			this.attacking = true;
		}
	}
	///Attaque coup de poing avec combo
	punch() {
		if (this.hit == false && this.attacking == false && this.falling == false) {
			soundSelect('attack', true);
			//On revient à la premiere image de l'animation du punch
			this.resetAnimation();
			this.attacking = true;

			//S'il est le personnage saute ou s'accroupit
			//on a une nouvelle animation de punch
			if (this.jumping == true) this.animationNumber = 18;
			else if (this.isDown == true) this.animationNumber = 15;
			else if (this.count == 0) {
				if (this.combo == 0) this.animationNumber = 1;
				else if (this.combo == 1) this.animationNumber = 6;
				else if (this.combo == 2) this.animationNumber = 7;

				this.combo += 1;

				//lorsque le joueur aura effectué ces 3 attaques à la suite
				//on remet notre compteur de combo à 0
				//et on initialise notre compteur qui fait qu'il ne pourra plus attaquer
				if (this.combo >= 3) {
					this.combo = 0;
					this.count = 15;
				}
				//Il n'y a pas eu d'attaque
			} else this.attacking = false;
		}
	}

	///attaque distance hadoken
	hadoken() {
		if (
			this.hit == false &&
			this.attacking == false &&
			this.falling == false &&
			this.jumping == false &&
			this.attacked == false
		) {
			soundSelect('hadoken', true);
			this.reset();
			this.animationNumber = 21;
			super.addRange([
				this.posXX - 200 + this.sizeW,
				this.posYY + (this.modifiedhY + 25),
				91 * 3,
				52 * 3,
			]);
			this.attacking = true;
		}
	}
}
