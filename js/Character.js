import Animation from './Animation.js';

export default class Character extends Animation {
	constructor(name, posXX, posYY, ctx, sens) {
		super(ctx, posXX + 100, posYY, sens);
		this.name = name;
		this.hp = 500;
		this.combo = 0;
		this.attacking = false;
		//a frappé
		this.attacked = false;
		this.jumping = false;
		this.falling = false;
		this.hit = false;
		this.jump_value = 50;
		this.animation_number = 0;
		this.move = 0;
		this.count = 0;
		this.wait = 0;
	}
	
	
	drawing(player) {
		if (this.wait == 0) {
			this.hit = false;
		} else {
			this.wait--;
		}
		if (this.count != 0) {
			this.count--;
		}
		//Nous renvoi true lorsque on aura joué toutes nos frames
		//Sinon, ça voudra dire qu'on est entrain de jouer une animation en boucle
		let finished = this.drawPlayerV2(player,this.animation_number, this.move);
		if (finished == true) {
			this.animation_number = 0;
			this.move = 0;
			this.attacking = false;
			this.attacked = false;
			this.jumping = false;
			this.falling = false;
		}
	}
		
	takeDamage(amount) {
		this.hp -= amount;
		if (this.hp <= 0) this.hp = 0;
	}
	walk_left() {
		if (this.hit == false) {
			this.reset();
			this.animation_number = 2;
			this.move = -20;
		}
	}
	walk_right() {
		if (this.hit == false) {
			this.reset();
			this.animation_number = 3;
			this.move = +20;
		}
	}
	jump() {
		if (this.hit == false) {
			if (this.jumping == false && this.falling == false) {
				this.jumping = true;
				this.animation_number = 4;
			}
		}
	}
	down() {
		if (this.hit == false) {
			this.reset();
			this.animation_number = 5;
		}
	}
	damaged() {
		this.reset();
		this.animation_number = 8;
	}

	block() {
		if (this.hit == false) {
			this.reset();
			this.animation_number = 9;
		}
	}
	run_left() {
		if (this.hit == false) {
			this.reset();
			this.animation_number = 10;
			this.move = -50;
		}
	}
	run_right() {
		if (this.hit == false) {
			this.reset();
			this.animation_number = 11;
			this.move = +50;
		}
	}
	kick() {
		if (this.hit == false) {
			if (this.attacking == false) {
				this.reset();
				this.animation_number = 12;
				this.attacking = true;
			}
		}
	}

	punch() {
		if (this.hit == false) {
			if (this.attacking == false && this.count == 0) {
				this.resetAnimation();

				if (this.combo == 0) this.animation_number = 1;
				else if (this.combo == 1) this.animation_number = 6;
				else if (this.combo == 2) this.animation_number = 7;

				this.combo += 1;
				this.attacking = true;

				//pause
				if (this.combo >= 3) {
					this.combo = 0;
					this.count = 15;
				}
			}
		}
	}

	reset() {
		this.combo = 0;
		this.animation_number = 0;
		this.move = 0;
		this.attacking = false;
		this.attacked = false;
		this.jumping = false;
		this.falling = false;
		this.resetAnimation();
	}

	collisionCheck(player) {
		if (super.collision(player) == true) {
			if (this.attacking == true && this.attacked == false) {
				player.takeDamage(10);
				player.damaged();
				this.attacked = true;
				player.hit = true;
				player.wait = 8;
			}else{
				return true;

			}
		}
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
}
