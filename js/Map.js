import {ctx,cnv} from './Game.js'
export {transitionMap,resetTransition};

let opacity = 0;
let opacityValue = 0.05;
let transitionDone = false;



/// Fonction qui va crée une transition entre le menu et le jeu
function transitionMap() {
    if(transitionDone == false){
        ctx.fillStyle = 'rgba(0, 0, 0,' + opacity + ')';
        ctx.fillRect(0, 0, cnv.width, cnv.height);
        opacity += opacityValue;
    
        if (opacity > 0.99) {
            opacityValue = - opacityValue;
            transitionDone = true;
            cnv.style.backgroundImage = 'url(assets/background/bg_7_2.gif)';
            return false;
        }
        return true;
    }

    return false;
}

function resetTransition(){
    opacity = 0;
    opacityValue = 0.05;
    transitionDone = false;
}