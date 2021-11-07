import Animation from './Animation.js';

export default class Character extends Animation {
	constructor(posXX, posYY, ctx, sens) {
		super(ctx, posXX, posYY, sens);
		this.hp = 10000;
		this.attacking = false;
	}

	//besoin d'un pseudo setter sinon l'objet adversaire ne comptabilise pas les dommages
	//avec amout on pourra changer le nombre de dégat selon l'attack
	takeDamage(amount) {
		this.hp -= amount;
	}

	//punch(posOPX, posOPY, attackOP, HPOP) {
	punch(OP) {
		this.attacking = true;
		super.animeChara('Punch');

		//if (super.collisionCheck(posOPX, posOPY, 120) == true) {
		if(super.collisionCheck(OP.posXX, OP.posYY, 120) == true) {
			console.log('ca tape par ici');
			if(OP.attacking == true) {
				//on vérifie qui à la priorité
				//pas sur que la prio soit nécessaire pour avoir le meme timing c'est difficile
				//mais toujours mieux de l'avoir
			}
			else {
				OP.takeDamage(1000);
				//l'adversaire prends des dégats
			}
		}
		this.attacking = false;
	}
	walk_right() {
		super.animeChara('WalkRight');
	}
	walk_left() {
		super.animeChara('WalkLeft');
	}
	jump() {		
		super.jumping = true;
		super.animeChara('Jump');
	}
	down() {
		super.animeChara('Down');
	}
}
