import Animation from './Animation.js';

export default class Character extends Animation {
	constructor(name, posXX, posYY, ctx, sens) {
		super(ctx, posXX + 100, posYY, sens);
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
		this.animation_number = 0;
		this.move = 0;
		this.count = 0;
		this.wait = 0;
		this.current_width = 0;
		this.changedDirection = false;
	}


	
	takeDamage(amount) {
		this.hp -= amount;
		if (this.hp <= 0) this.hp = 0;
	}
	walk_left() {
		if(this.sens == 1){
			if (this.hit == false) {
			this.reset();
			this.animation_number = 2;
			this.move = -20;
			}
		}else{
			if (this.hit == false) {
				this.reset();
				this.animation_number = 3;
				this.move = -20;
			}
		}
	}
	walk_right() {
		if(this.sens == 1){
			if (this.hit == false) {
				this.reset();
				this.animation_number = 3;
				this.move = +20;
			}
		}else{
			this.reset();
			this.animation_number = 2;
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
			if (this.jumping == false && this.falling == false) {
				this.reset();
				this.animation_number = 5;
				this.is_down = true;
			}
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
		super.addRange([this.posXX - 60 + this.sizeW, this.posYY + 270, 60, 40]);
		
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
		this.is_down = 0; 
		this.attacking = false;
		this.attacked = false;
		this.changedDirection = false;
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
			} else {
				return true;

			}
		}
		if (super.getRange() != 0) {
			//console.log(super.collisionRange(player));
			if (super.collisionRange(player) == true && player.blocking == false) {
				console.log("je ne rate jamais ma cible");
				player.takeDamage(20);
				player.damaged();
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
	
	drawing(player) {
		if (this.wait == 0) {
			this.hit = false;
		} else {
			this.wait--;
		}
		if (this.count != 0) {
			this.count--;
		}

		if(this.attacking == true)
			this.modifiedhsizeW = 142;
		else
			this.modifiedhsizeW = 170;

		if(this.is_down == true)
			this.modifiedhY = 340;
		else
			this.modifiedhY = 240;



		this.collisionCheck(player);
		if(this.sens == 1){
			this.posXX += this.move;
		}else{
			this.posXX -= this.move;
		}

	
		//Nous renvoi true lorsque on aura joué toutes nos frames
		//Sinon, ça voudra dire qu'on est entrain de jouer une animation en boucle
		let finished = this.drawPlayerV2(this.animation_number);
		if (finished == true) {
			this.animation_number = 0;
			this.is_down = false;
			this.move = 0;
			this.attacking = false;
			this.attacked = false;
			this.jumping = false;
			this.falling = false;
		}
	}

	changeDirection(player){
		//Pour qu'il ne change pas de direction en boucle
		console.log(this.sens);
		if(this.changedDirection == false){
			if(this.sens == 1){
				if(this.posXX >= (Math.abs(player.posXX) - (player.sizeW / 2) )){
					this.sens = 2;
					player.sens = 1;
					player.posXX = Math.abs(player.posXX);
					this.posXX = -this.posXX;
					this.changedDirection = true;
				}			
			}else{
				if(player.posXX >= (Math.abs(this.posXX) - (this.sizeW / 2) )){
					this.sens = 1;
					player.sens = 2;
					this.posXX = Math.abs(this.posXX);
					player.posXX = -player.posXX;
					this.changedDirection = true;
				}			

			}
		}
	}
}