import {ctx, cnv} from './Game.js';
export {drawHP};
///dessine les hp des joueurs

function reduceBarHp(player) {
	if (player.hpBar != player.hp) player.hpBar -= 5;
}
function drawHP(player) {
	reduceBarHp(player[0]);
	reduceBarHp(player[1]);

	ctx.fillStyle = 'rgba(169,169,169, 0.5)';
	ctx.fillRect(50, 20, player[0].hpBar, 50);

	ctx.fillStyle = 'red';
	ctx.fillRect(50, 20, player[0].hpBar, 50);

	ctx.save();
	ctx.scale(-1, 1);
	ctx.fillStyle = 'rgba(169,169,169, 0.5)';
	ctx.fillRect(-cnv.width + 20, 20, player[1].hpBar, 50);

	ctx.fillStyle = 'red';
	ctx.fillRect(-cnv.width + 20, 20, player[1].hpBar, 50);
	ctx.restore();
}
