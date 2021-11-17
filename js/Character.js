import Animation from './Animation.js';

export default class Character extends Animation {
	constructor(name, posXX, posYY, ctx, direction) {
		super(ctx, posXX, posYY, direction);
		this.name = name;
		this.hp = 500;
		this.combo = 0;
		this.attacking = false;
		this.blocking = false;
		this.is_down = false;
		//a frappé
		this.attacked = false;
		this.jumping = false;
		this.falling = false;
		this.hit = false;
		this.jump_value = 50;
		this.animation_number = 20;
		this.move = 0;
		this.count = 0;
		this.wait = 0;
		this.changedDirection = false;
		this.go_right = true;
		this.go_left = true;
		this.inside = false;
	}

	takeDamage(amount) {
		this.hp -= amount;
		if (this.hp <= 0) this.hp = 0;
	}

	walk_left() {
		if (this.hit == false && this.go_left == true) {
			this.reset();
			this.move = -20;
			if (this.direction == true) {
				this.animation_number = 2;
				this.blocking = true;
			} else this.animation_number = 3;
			this.going_left = true;
		}
	}
	walk_right() {
		if (this.hit == false && this.go_right == true) {
			this.reset();
			this.move = +20;
			if (this.direction == true) this.animation_number = 3;
			else {
				this.animation_number = 2;
				this.blocking = true;
			}
			this.going_right = true;
		}
	}
	jump() {
		if (this.hit == false && this.jumping == false && this.falling == false) {
			this.reset();
			this.jumping = true;
			this.animation_number = 4;
		}
	}
	down() {
		if (this.hit == false && this.jumping == false && this.falling == false) {
			this.reset();
			this.animation_number = 5;
			this.is_down = true;
		}
	}
	damaged() {
		this.reset();
		if (this.is_down == false) this.animation_number = 8;
		else this.animation_number = 13;
	}

	block() {
		if (this.hit == false) {
			this.reset();
			this.animation_number = 9;
		}
	}
	run_left() {
		if (this.hit == false && this.go_left == true) {
			this.reset();
			this.move = -50;
			if (this.direction == true) this.animation_number = 10;
			else this.animation_number = 11;
		}
	}
	run_right() {
		if (this.hit == false && this.go_right == true) {
			this.reset();
			this.move = +50;
			if (this.direction == true) this.animation_number = 11;
			else this.animation_number = 10;
		}
	}
	kick() {
		if (this.hit == false && this.attacking == false && this.falling == false) {
			this.resetAnimation();
			if (this.jumping == true) this.animation_number = 17;
			else if (this.is_down == true) this.animation_number = 14;
			else this.animation_number = 12;
			this.attacking = true;
		}
	}

	punch() {
		if (this.hit == false && this.attacking == false && this.falling == false) {
			//On revient à la premiere image de l'animation du punch
			this.resetAnimation();
			this.attacking = true;

			//S'il est le personnage saute ou s'accroupit
			//on a une nouvelle animation de punch
			if (this.jumping == true) this.animation_number = 18;
			else if (this.is_down == true) this.animation_number = 15;
			else if (this.count == 0) {
				if (this.combo == 0) this.animation_number = 1;
				else if (this.combo == 1) this.animation_number = 6;
				else if (this.combo == 2) this.animation_number = 7;

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

	hadoken() {
		if (
			this.hit == false &&
			this.attacking == false &&
			this.falling == false &&
			this.jumping == false
		) {
			this.reset();
			this.animation_number = 21;
			super.addRange([
				this.posXX - 60 + this.sizeW,
				this.posYY + (this.modifiedhY + 25),
				91 * 3,
				52 * 3,
			]);
			this.attacking = true;
		}
	}

	reset() {
		this.combo = 0;
		this.animation_number = 0;
		this.move = 0;
		this.is_down = false;
		this.attacking = false;
		this.attacked = false;
		this.changedDirection = false;
		this.blocking = false;
		this.resetAnimation();
	}

	collisionCheck(player) {
		if (super.getRange() != 0) {
			if (super.collisionRange(player) == true && player.blocking == false) {
				if (player.blocking == true) {
					player.animation_number = 9;
				}
				player.takeDamage(20);
				player.damaged();
			}
		}
		if (super.collision(player) == true) {
			//S'il attaque, a attaqué et si le joueur en face ne bloque pas
			if (this.attacking == true && this.attacked == false) {
				if (player.blocking == true) {
					player.animation_number = 9;
				} else {
					player.takeDamage(10);
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
		if (this.jumping == true) {
			if (this.posYY != -this.jump_value * 9) {
				this.posYY -= this.jump_value;
			} else {
				this.jumping = false;
			}
		} else {
			this.falling = true;
			this.posYY += this.jump_value;
			if (this.posYY > 0) {
				this.falling = false;
				this.posYY = 0;
			}
		}
	}

	drawing(player) {
		if (this.hp == 0) {
			this.animation_number = 19;
			player.animation_number = 20;
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

		if (this.is_down == true) this.modifiedhY = 500;
		else this.modifiedhY = 450;

		//S'il n'est pas à l'interieur de la hitbox de son opposant
		if (this.inside == false) {
			//S'il y a une collision on dit qu'il est à l'interieur
			//et en fonction de sa direction on lui empeche un mouvement
			if (this.collisionCheck(player) == true) {
				if (this.direction == true) {
					this.move = 0;
					this.go_right = false;
					this.inside = true;
				} else {
					this.move = 0;
					this.go_left = false;
					this.inside = true;
				}
			}
			//S'il arrive a sortir de la hitbox alors on lui rend tout ses mouvement
			//et on dira qu'il n'est plus a l'intérieur
		} else {
			if (this.collisionCheck(player) == false) {
				this.inside = false;
				this.go_right = true;
				this.go_left = true;
			}
		}

		if (this.direction == true) this.posXX += this.move;
		else this.posXX -= this.move;

		//Nous renvoi true lorsque on aura joué toutes nos frames
		//Sinon, ça voudra dire qu'on est entrain de jouer une animation en boucle
		let finished = this.drawPlayerV2(this.animation_number, player);
		//S'il est true sa eut dire qu'on est dans une animation qu'on doit rejouer en boucle
		//hors cette animation est celle qui joué lorsqu'on ne fait, on considere cette
		//animation comme notre état initial
		if (finished == true) {
			this.animation_number = 0;
			this.is_down = false;
			this.move = 0;
			this.attacking = false;
			this.attacked = false;
			this.jumping = false;
			this.falling = false;
			this.blocking = false;
		}
	}

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
		} else {
		}
	}
}
