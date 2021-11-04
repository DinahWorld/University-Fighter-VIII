let cnv = document.getElementById('myCanvas');
let ctx = cnv.getContext('2d');
ctx.imageSmoothingEnabled= false;

let Pos1 = [300, 300];
let Pos2 = [500, 300];

let size = [30, 60];
/*let img = new Image();
let anim_id = -1;
img.src = "metalslug_mummy37x45.png";*/
window.addEventListener('keydown', keydown_fun, false);
function keydown_fun(e) {
  switch(e.code) {
    /*case "ArrowDown":
    case "ArrowUp":*/
    case "ArrowLeft":
        Pos1[0] -=2;
        break;
    case "ArrowRight":
        Pos1[0] += 2;
      //misa_character.next_step(50, 50, 16*32-150, 16*32-150, e.code);
      break;
  }
}

function update() {

    ctx.clearRect(0, 0, cnv.width, cnv.height);

    ctx.strokeStyle = "green";
    ctx.fillStyle = "red";
    ctx.strokeRect(Pos1[0], Pos1[1], size[0], size[1]);
    
    ctx.strokeRect(Pos2[0], Pos2[1], -size[0], size[1]);
    
    if(Pos1[0] + size[0] > Pos2[0] - size[0] && Pos1[0] < Pos2[0]) {
        ctx.fillRect(Pos1[0], Pos1[1], size[0], size[1]);
        ctx.fillRect(Pos2[0], Pos2[1], -size[0], size[1]);
    }
    /*if(Pos1[0] + size[0] > Pos2[0] - size[0]) {
        ctx.fillRect(Pos1[0], Pos1[1], size[0], size[1]);
        ctx.fillRect(Pos2[0], Pos2[1], -size[0], size[1]);

    }
    else {
        ctx.strokeRect(Pos1[0], Pos1[1], size[0], size[1]);
        ctx.strokeRect(Pos2[0], Pos2[1], -size[0], size[1]);
    }*/
}

setInterval(update, 100);