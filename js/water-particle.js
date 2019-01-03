(function(scope) {
	class WaterParticle {
		constructor() {
			this.x = 0;
			this.y = 0;
			this.z = Math.random() + 0.3;
			this.size = 1.2;
			this.opacity = Math.random() * 0.8 + 0.1;
		}

		update(bounds) {
			if(this.x == 0 || this.y == 0) {
				this.x = Math.random() * (bounds[1].x - bounds[0].x) + bounds[0].x;
				this.y = Math.random() * (bounds[1].y - bounds[0].y) + bounds[0].y;
			}

			// Wrap around screen
			this.x = this.x < bounds[0].x ? bounds[1].x : this.x;
			this.y = this.y < bounds[0].y ? bounds[1].y : this.y;
			this.x = this.x > bounds[1].x ? bounds[0].x : this.x;
			this.y = this.y > bounds[1].y ? bounds[0].y : this.y;
		}

		draw(ctx) {
			// Draw circle
			ctx.fillStyle = 'rgba(226,219,226,'+this.opacity+')';
			//ctx.fillStyle = '#fff';
			ctx.beginPath();
			ctx.arc(this.x, this.y, this.z * this.size, 0, Math.PI*2, true);
			ctx.closePath();
			ctx.fill();
		}
	}

	if (window.module && window.module.exports) {
		window.module.exports = WaterParticle;
	} else {
		scope.WaterParticle = WaterParticle;
	}
})(this);