import Animation from './Animation.js';

export default class Character extends Animation {
	constructor(posXX, posYY, ctx, sens) {
		super(ctx, posXX, posYY, sens);
		this.hp = 10000;
		this.attacking = false;
		this.jumping = false;
		this.falling = false;
		this.jump_value = 50;

	}

	//besoin d'un pseudo setter sinon l'objet adversaire ne comptabilise pas les dommages
	//avec amout on pourra changer le nombre de dégat selon l'attack
	takeDamage(amount) {
		this.hp -= amount;
	}

	//collision(player) {
    //        ///si on est le joueur a gauche alors on fait la valeur absolue du joueur a droite
    //        ///car il est sur une échelle négative
//
	//		let playerX = Math.abs(player.hitboxX) - player.sizeW;
	//		///si ma position + la width de ma hitbox est supérieur ou égale (on peut enlever le égale peut etre) à la position du joueur opposé moins la width de hitbox alors il y a contact
    //        /// && sert a vérifier si on est passer derriere le joueur adversaire 
    //        if (
    //            this.hitboxX + this.sizeW > playerX &&
    //            this.hitboxX <= playerX
    //        ) {
    //          ///contact donc on renvoit true
	//		  console.log("sa se touche")
//
	//		} else {
    //            ///sinon false
    //        }
    //    }
        
    
	//punch(posOPX, posOPY, attackOP, HPOP) {
	punch(OP) {
		this.attacking = true;
		super.animeChara('Punch');
		
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

	punchingMove(player){
		if(this.attacking == true){
			if(super.collision(player) == true){
				console.log("sa tape")
				player.takeDamage(1000);
				this.attacking = false;
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
