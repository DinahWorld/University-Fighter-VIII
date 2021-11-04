export default class Character {
    constructor(pos, nbPlayer, spriteNormal, spriteWalk, spritePunch, spriteKick, spriteAtkSp) {
        this.hp = 10000;
        this.pos = pos;
        this.attacking = false;
        this.nbPlayer = nbPlayer;
        this.spriteNormal = spriteNormal;
        this.spriteWalk = spriteWalk;
        this.spritePunch = spritePunch;
        this.spriteKick = spriteKick;
        this.spriteAtkSp = spriteAtkSp;
        this.LNormal = [];
        this.LWalk = [];
        this.LPunch = [];
        this.LKick = [];
        this.LAtkSp = [];
    }
/*
sprite[0] = img
sprite[1] = [x, y]
sprite[2] = 
 */

    createList(sprite, list) {
        let canvas1 = document.createElement('canvas');
        let context1 = canvas1.getContext('2d');
        context1.drawImage(sprite[0], 0, 0, sprite[1][0], sprite[1][1]);
        for(let i = 0; i < sprite[1]; i++) {
            let canvasImageData1 = context1.getImageData
            (i * sprite[1][0], sprite[1][1], sprite[1][0], sprite[1][1]);
            let canvas2 = document.createElement('canvas');
            canvas2.width = sprite[1][0];
            canvas2.height = sprite[1][1];
            let context2 = canvas2.getContext('2d');
            context2.putImageData(canvasImageData1, 0, 0);
            list.push(canvas2);  
        }
    }

    createListNormal() {
        let canvas1 = document.createElement('canvas');
        let context1 = canvas1.getContext('2d');
        context1.drawImage(this.spriteNormal[0], 0, 0, this.spriteNormal[1][0], this.spriteNormal[1][1]);
        for(let i = 0; i < this.spriteNormal[1]; i++) {
            let canvasImageData1 = context1.getImageData
            (i * this.spriteNormal[1][0], this.spriteNormal[1][1], this.spriteNormal[1][0], this.spriteNormal[1][1]);
            let canvas2 = document.createElement('canvas');
            canvas2.width = this.spriteNormal[1][0];
            canvas2.height = this.spriteNormal[1][1];
            let context2 = canvas2.getContext('2d');
            context2.putImageData(canvasImageData1, 0, 0);
            this.LNormal.push(canvas2);  
        } 
    }

    createListWalk() {
        let canvas1 = document.createElement('canvas');
        let context1 = canvas1.getContext('2d');
        context1.drawImage(this.spriteWalk[0], 0, 0, this.spriteWalk[1][0], this.spriteWalk[1][1]);
        for(let i = 0; i < this.spriteWalk[1]; i++) {
            let canvasImageData1 = context1.getImageData
            (i * this.spriteWalk[1][0], this.spriteWalk[1][1], this.spriteWalk[1][0], this.spriteWalk[1][1]);
            let canvas2 = document.createElement('canvas');
            canvas2.width = this.spriteWalk[1][0];
            canvas2.height = this.spriteWalk[1][1];
            let context2 = canvas2.getContext('2d');
            context2.putImageData(canvasImageData1, 0, 0);
            this.LWalk.push(canvas2);  
        } 
    }

    createListPunch() {
        let canvas1 = document.createElement('canvas');
        let context1 = canvas1.getContext('2d');
        context1.drawImage(this.spritePunch[0], 0, 0, this.spritePunch[1][0], this.spritePunch[1][1]);
        for(let i = 0; i < this.spritePunch[1]; i++) {
            let canvasImageData1 = context1.getImageData
            (i * this.spritePunch[1][0], this.spritePunch[1][1], this.spritePunch[1][0], this.spritePunch[1][1]);
            let canvas2 = document.createElement('canvas');
            canvas2.width = this.spritePunch[1][0];
            canvas2.height = this.spritePunch[1][1];
            let context2 = canvas2.getContext('2d');
            context2.putImageData(canvasImageData1, 0, 0);
            this.LPunch.push(canvas2);  
        } 
    }

    createListKick() {
        let canvas1 = document.createElement('canvas');
        let context1 = canvas1.getContext('2d');
        context1.drawImage(this.spriteKick[0], 0, 0, this.spriteKick[1][0], this.spriteKick[1][1]);
        for(let i = 0; i < this.spriteKick[1]; i++) {
            let canvasImageData1 = context1.getImageData
            (i * this.spriteKick[1][0], this.spriteKick[1][1], this.spriteKick[1][0], this.spriteKick[1][1]);
            let canvas2 = document.createElement('canvas');
            canvas2.width = this.spriteKick[1][0];
            canvas2.height = this.spriteKick[1][1];
            let context2 = canvas2.getContext('2d');
            context2.putImageData(canvasImageData1, 0, 0);
            this.LKick.push(canvas2);  
        } 
    }

    createListAtkSp() {
        let canvas1 = document.createElement('canvas');
        let context1 = canvas1.getContext('2d');
        context1.drawImage(this.spriteAtkSp[0], 0, 0, this.spriteAtkSp[1][0], this.spriteAtkSp[1][1]);
        for(let i = 0; i < this.spriteAtkSp[1]; i++) {
            let canvasImageData1 = context1.getImageData
            (i * this.spriteAtkSp[1][0], this.spriteAtkSp[1][1], this.spriteAtkSp[1][0], this.spriteAtkSp[1][1]);
            let canvas2 = document.createElement('canvas');
            canvas2.width = this.spriteAtkSp[1][0];
            canvas2.height = this.spriteAtkSp[1][1];
            let context2 = canvas2.getContext('2d');
            context2.putImageData(canvasImageData1, 0, 0);
            this.LAtkSp.push(canvas2);  
        } 
    }

    animeChara(ctx, pos, animeId, l, size, sense) {
        let zoom = 2;
        if(sense == 0) {
        ctx.drawImage(l[animeId], pos[0],
            pos[1], size[0]*zoom, size[1]*zoom);
        }
        else {
            ctx.drawImage(l[animeId], pos[0],
                pos[1], -size[0]*zoom, size[1]*zoom);
        }
        animeId += 1;
        

        if(l == this.spriteWalk) {
            if(sense == 0) { pos[0] += 2; }
            else { pos[0] -= 2; }
        }
        
        if(animeId == l.length) { animeId = 0; }
    }

    connect(size, sizeOp) {

    }

    prio() {
        if(attackingOP == true) {
            if(animeId == l.length && animeIdOP < lOP.length) {

            }
            else if(animeId == l.length && animeIdOP == lOP.length) {
                //égalité
            }
            else if(animeId < l.length && animeIdOP == lOP.length) {
                this.hp -= 1000;
            }
        }
        else {
            
        }
    }

    punch() {
        this.animeChara()
        this.attacking = true;
        ctx.strokeRect(pos[0],pos[1], size[0], size[1]);
        ctx.strokeRect(pos[0],pos[1], size[0], size[1]/4);
        if(sense == 0) {
            if(pos[0]+size[0] > posOP[0]-sizeOP[0]) {
                this.prio()
            }
        }
        else {
            if(pos[0]-size[0] > posOP[0]+sizeOP[0]) {
                this.prio()
            }
        }
        if(animeId == l.length) { animeId = 0; this.attacking = false;}
    }

//if animeId reviens à zero alors on passe au prochaine élement de la liste d'instruction
}
