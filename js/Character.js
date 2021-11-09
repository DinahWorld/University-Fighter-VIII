import Animation from './Animation.js';

export default class Character extends Animation {
	constructor(posXX, posYY, ctx, sens) {
		super(ctx, posXX+100, posYY, sens);
		this.hp = 500;
		this.attacking = false;
		this.jumping = false;
		this.falling = false;
		this.jump_value = 100;
		//this.range_attack = [];
	}

	//besoin d'un pseudo setter sinon l'objet adversaire ne comptabilise pas les dommages
	//avec amout on pourra changer le nombre de dégat selon l'attack
	takeDamage(amount) {
		this.hp -= amount;
		if(this.hp <= 0)
			this.hp = 0;
	}

	hadouken() {
		super.animeChara('Punch');
		super.addrange([this.posXX - 60 +this.sizeW, this.posYY + 270, 60, 40]);
	}

        
    
	//punch(posOPX, posOPY, attackOP, HPOP) {
	punch(OP) {
		//if(this.attacking == false){
			this.attacking = true;
			super.animeChara('Punch')	
		//}
		//if (super.collisionCheck(posOPX, posOPY, 120) == true) {
		//if(super.collisionCheck(OP.posXX, OP.posYY, 120) == true) {
		//	console.log('ca tape par ici');
		//	if(OP.attacking == true) {
		//		//on vérifie qui à la priorité
		//		//pas sur que la prio soit nécessaire pour avoir le meme timing c'est difficile
		//		//mais toujours mieux de l'avoir
		//	}
		//	else {
		//		OP.takeDamage(1000);
		//		//l'adversaire prends des dégats
		//	}
		//}
	}
	walk_right() {
		this.attacking = false;
		super.animeChara('WalkRight');
	}
	walk_left() {
		this.attacking = false;
		super.animeChara('WalkLeft');
	}
	jump() {
		this.attacking = false;		
		if(this.jumping == false && this.falling == false){
			
				super.animeChara('Jump');
				this.jumping = true;
			
		}
	}
	down() {
		this.attacking = false;
		super.animeChara('Down');
	}
	block(){
		this.attacking = false;
		super.animeChara('Block')
	}
	damaged(){
		this.attacking = false;
		super.animeChara('Hit')
	}
	punch2(){
		//if(this.attacking == false){
			this.attacking = true;
			super.animeChara('Punch2')	
		//}
	}
	punch3(){
		//if(this.attacking == false){
			this.attacking = true;
			super.animeChara('Punch3')	
		//}
	}
	kick(){
		//if(this.attacking == false){
			this.attacking = true;
			super.animeChara('Kick')	
		//}
	}
	run_left(){
		this.attacking = false;
		super.animeChara('RunLeft')
	}
	run_right(){
		this.attacking = false;
		super.animeChara('RunRight')
	}
	punchingMove(player){
		if(this.attacking == true){
			if(super.collision(player) == true){
				console.log("sa tape")
				player.takeDamage(10);
				player.damaged();
				this.attacking = false;
			}
		}
		if(super.getrange() != 0) {
			//console.log(super.collisionRange(player));
			if(super.collisionRange(player) == true) {
				console.log("je ne rate jamais ma cible");
				player.takeDamage(20);
				player.damaged();
			} 
		}
	}

	//quand on a sauté on doit revenir au sol petit à petit
	jumpingMove(){
		if(this.jumping == true){
			if(this.posYY != -(this.jump_value) * 9){
				this.posYY -= this.jump_value;
			}else{
				this.jumping = false;
			}
		}
		else{
			this.falling = true;
			this.posYY += this.jump_value;
			if(this.posYY > 0) {
				this.falling = false;
				this.posYY = 0;
			}
		}
	}
}
