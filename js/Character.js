import Animation from './Animation.js';

export default class Character extends Animation {
	constructor(posXX, posYY, ctx, sens) {
		super(ctx, posXX, posYY, sens);
		this.hp = 10000;
		this.attacking = false;
		this.jumping = false;
	}

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
		super.animeChara('Jump');
	}
	down() {
		super.animeChara('Down');
	}
}
