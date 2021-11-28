export default class SpriteAtlas {
	constructor(ctx, json) {
		this.ctx = ctx;
		this.json = json;
		this.event_code = 0;
		this.animestep = 1;
		this.to_draw = 1;
		this.animeseq = [];
		this.loop = false;
		this.stop = false;
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
	add_anime(prefix, first_id, last_id) {
		for (let i = first_id; i < last_id + 1; i += 1) {
			let filename = prefix;
			if (i < 10) {
				filename += '.00' + i;
			} else if (i < 100) {
				filename += '.0' + i;
			} else {
				filename += '.' + i;
			}
			let x = this.json['frames'][filename]['frame']['x'];
			let y = this.json['frames'][filename]['frame']['y'];
			let w = this.json['frames'][filename]['frame']['w'];
			let h = this.json['frames'][filename]['frame']['h'];
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
