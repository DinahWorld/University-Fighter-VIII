let cnv = document.getElementById('myCanvas');
let ctx = cnv.getContext('2d');
ctx.imageSmoothingEnabled = false;
let all_sprites_event = [];

let xobj = new XMLHttpRequest();
let new_sp = new Array(4);
let posX = 0;
let posY = 0;
let reachPosX = 0;
let rightAnimation = 0;
xobj.onload = onload_atlas;
xobj.overrideMimeType("application/json");
xobj.open("GET", "./assets/atlas/ken.json", true);
xobj.send();

class SpriteAtlas {
    constructor(ctx, json) {
        this.ctx = ctx;
        this.json = json;
        this.event_code = 0;
        this.animestep = 1;
        this.to_draw = 1;
        this.to_goX = 0;
        this.to_goY = 0;
        this.animeseq = [];
    }
    next_step() {
        if (this.to_draw == 0) {
            this.animestep += 1;
            if (this.animestep >= this.animeseq.length) {
                this.animestep = 0;
            }
            this.to_draw = 1;
        }
    }
    add_anime(prefix, first_id, last_id, event_code) {
        this.event_code = event_code;
        for (let i = first_id; i < last_id + 1; i += 1) {
            let filename = prefix;
            if (i < 10) {
                filename += ".00" + i;
            } else if (i < 100) {
                filename += ".0" + i;
            } else {
                filename += "." + i;
            }
            let x = this.json["frames"][filename]["frame"]["x"];
            let y = this.json["frames"][filename]["frame"]["y"];
            let w = this.json["frames"][filename]["frame"]["w"];
            let h = this.json["frames"][filename]["frame"]["h"];
            let canvasImageData1 = this.ctx.getImageData(x, y, w, h);
            let canvas2 = document.createElement('canvas');
            canvas2.width = w;
            canvas2.height = h;
            let context2 = canvas2.getContext('2d');
            context2.putImageData(canvasImageData1, 0, 0);
            this.animeseq.push(canvas2);
        }
    }
}
function init(){
    
    
}
function onload_atlas() {
    if (this.status == 200) {
        let json_infos = JSON.parse(this.responseText);
        let spritesheet = new Image();
        spritesheet.src = "./assets/atlas/" + json_infos["meta"]["image"];


        spritesheet.onload = function () {
            let canvas1 = document.createElement('canvas');
            canvas1.width = json_infos["meta"]["size"]["w"];
            canvas1.height = json_infos["meta"]["size"]["h"];
            let context1 = canvas1.getContext('2d');
            context1.drawImage(spritesheet, 0, 0, canvas1.width, canvas1.height);
            for(let i = 0;i < 6;i++){
                new_sp[i] = new SpriteAtlas(context1, json_infos);
            }
            new_sp[0].add_anime("ken-pose", 1, 10, "");
            new_sp[1].add_anime("ken-punch", 1,5, "KeyD");
            new_sp[2].add_anime("ken-walk-left", 1,11, "ArrowLeft");
            new_sp[3].add_anime("ken-walk-right", 1,11, "ArrowRight");
            new_sp[4].add_anime("ken-jump", 1,12, "ArrowUp");
            new_sp[5].add_anime("ken-down", 1,6, "ArrowDown");
//            new_sp[1].add_anime("ken-walk-right", 1,11, "ArrowRight");
//            new_sp[2].add_anime("ken-walk-left", 1, 11, "ArrowLeft");
            //new_sp[3].add_anime("dinah-front-walk", 0, 3, "ArrowDown");
            all_sprites_event.push(new_sp[0]);
            all_sprites_event.push(new_sp[1]);
            all_sprites_event.push(new_sp[2]);
            all_sprites_event.push(new_sp[3]);
            all_sprites_event.push(new_sp[4]);
            all_sprites_event.push(new_sp[5]);
            //all_sprites_event.push(new_sp[2]);
            //all_sprites_event.push(new_sp[3]);
            all_sprites_event[1].to_goX = 0;
            all_sprites_event[2].to_goX = - 2;
            all_sprites_event[3].to_goX = + 2;
            all_sprites_event[4].to_goY = - 10;

        }
    }
}
window.addEventListener('keydown', keydown_fun, false);

function keydown_fun(e) {
    switch (e.code) {
        case "KeyD":
            for (let i = 0; i < all_sprites_event.length; i += 1) {
                if (all_sprites_event[i].event_code == "KeyD") {
                    all_sprites_event[i].next_step();
                }
            }
            all_sprites_event[0].to_draw = 0;
            all_sprites_event[2].to_draw = 0;
            all_sprites_event[3].to_draw = 0;
            all_sprites_event[4].to_draw = 0;
            all_sprites_event[5].to_draw = 0;
            rightAnimation = 0;
            break;

        case "ArrowLeft":
            for (let i = 0; i < all_sprites_event.length; i += 1) {
                if (all_sprites_event[i].event_code == "ArrowLeft") {
                    all_sprites_event[i].next_step();
                }
            }
            all_sprites_event[0].to_draw = 0;
            all_sprites_event[1].to_draw = 0;
            all_sprites_event[3].to_draw = 0;
            all_sprites_event[4].to_draw = 0;
            all_sprites_event[5].to_draw = 0;
            rightAnimation = 0;
            break;
        
        case "ArrowRight":
            for (let i = 0; i < all_sprites_event.length; i += 1) {
                if (all_sprites_event[i].event_code == "ArrowRight") {
                    all_sprites_event[i].next_step();
                }
            }
            all_sprites_event[0].to_draw = 0;
            all_sprites_event[1].to_draw = 0;
            all_sprites_event[2].to_draw = 0;
            all_sprites_event[4].to_draw = 0;
            all_sprites_event[5].to_draw = 0;

            rightAnimation = 0;
            break;

    case "ArrowUp":
            for (let i = 0; i < all_sprites_event.length; i += 1) {
                if (all_sprites_event[i].event_code == "ArrowUp") {
                    all_sprites_event[i].next_step();
                }
            }
            all_sprites_event[0].to_draw = 0;
            all_sprites_event[1].to_draw = 0;
            all_sprites_event[2].to_draw = 0;
            all_sprites_event[3].to_draw = 0;
            all_sprites_event[5].to_draw = 0;

            rightAnimation = 0;
            break;
    
    case "ArrowDown":
            for (let i = 0; i < all_sprites_event.length; i += 1) {
                if (all_sprites_event[i].event_code == "ArrowDown") {
                    all_sprites_event[i].next_step();
                }
            }
            all_sprites_event[0].to_draw = 0;
            all_sprites_event[1].to_draw = 0;
            all_sprites_event[2].to_draw = 0;
            all_sprites_event[3].to_draw = 0;
            all_sprites_event[4].to_draw = 0;
            rightAnimation = 0;
            break;
//
        //case "ArrowDown":
        //    for (let i = 0; i < all_sprites_event.length; i += 1) {
        //        if (all_sprites_event[i].event_code == "ArrowDown") {
        //            all_sprites_event[i].next_step();
        //        }
        //    }
        //    posY +=10;
        //    break;
//
        //case "ArrowUp":
        //    for (let i = 0; i < all_sprites_event.length; i += 1) {
        //        if (all_sprites_event[i].event_code == "ArrowUp") {
        //            all_sprites_event[i].next_step();
        //        }
        //    }
        //    posY -=10;
        //    
        //    break;

    }
}

function kenPose(){
    let zoom = 2;

    let step_i = all_sprites_event[0].animestep;
    let cnv_i = all_sprites_event[0].animeseq[step_i];
    ctx.clearRect(0, 0, 640,860);
    ctx.beginPath();
    ctx.strokeFill = "#FF0000";
    //- 30 sur la taille pour la hitbox
    ctx.strokeRect( 90+ posX, 230 + posY, (cnv_i.width - 152) * zoom, (cnv_i.height - 100) * zoom);
    ctx.stroke();
    ctx.closePath();
    ctx.drawImage(cnv_i,-40 + posX, 150 + posY, cnv_i.width * zoom, cnv_i.height * zoom);
    all_sprites_event[0].to_draw = 0;
    all_sprites_event[0].next_step();

}

// TODO :
//
// OPTIMISEZ CE MERDIER
// FAIRE EN SORTE QUE LA HITBOX AIT LES MEME COORDONNER QUE LE PERSO
function update() {
    let zoom = 2;
    for (let i = 0; i < all_sprites_event.length; i += 1) {
        if (all_sprites_event[0].to_draw == 1) {
            kenPose();
        }
        else if (all_sprites_event[i].to_draw == 1){

            let number_of_sprite = all_sprites_event[i].animeseq.length;
            if(rightAnimation == number_of_sprite - 1){
                all_sprites_event[i].to_draw = 0;
                all_sprites_event[0].to_draw = 1;
                break;
            }
            let step_i = all_sprites_event[i].animestep;
            let cnv_i = all_sprites_event[i].animeseq[step_i];
            ctx.clearRect(0, 0, 640,860);
            ctx.beginPath();
            ctx.strokeFill = "#FF0000";
            //- 30 sur la taille pour la hitbox
            ctx.strokeRect( 35+ posX, 230 + posY, (cnv_i.width - 73) * zoom, (cnv_i.height - 80) * zoom);
            ctx.stroke();
            ctx.closePath();
            posX  += all_sprites_event[i].to_goX;
            //posY  += all_sprites_event[i].to_goY;
            ctx.drawImage(cnv_i,-40+ posX,150 + posY, cnv_i.width * zoom, cnv_i.height * zoom);
            all_sprites_event[i].to_draw = 0;
            if(rightAnimation < number_of_sprite){
                all_sprites_event[i].next_step();
            }
            rightAnimation++;
        }
        //all_sprites_event[0].to_draw = 1;
    
    }
}
setInterval(update, 60);