import Animation from './Animation.js';

export default class Character extends Animation {
	constructor(posXX, posYY, ctx, sens) {
		super(ctx, posXX, posYY, sens);
		this.hp = 10000;
		this.attacking = false;
		this.jumping = false;
	}

	punch(posOPX, posOPY, attackOP) {
		this.attacking = true;
		super.animeChara('Punch');

		if (super.collisionCheck(posOPX, posOPY, 120) == true) {
			console.log('ca tape par ici');
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
		this.jumping = true;
		super.animeChara('Jump');
		//this.posYY -= 100;
		this.jumping = false;
	}
	down() {
		super.animeChara('Down');
	}
}
