(function(scope) {

	let backgroundColor = Math.random()*360;

	class Camera {
		constructor(canvas, ctx, x, y) {
			this.canvas = canvas;
			this.ctx = ctx;
			this.x = x;
			this.y = y;

			this.zoom = this.minZoom = 1.3;
			this.maxZoom = 1.8;
		}

		setupContext() {
			var translateX = this.canvas.width / 2 - this.x * this.zoom;
			var translateY = this.canvas.height / 2 - this.y * this.zoom;

			// Reset transform matrix
			this.ctx.setTransform(1,0,0,1,0,0);
			this.ctx.fillStyle = 'hsl('+backgroundColor+',50%,10%)';
			this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

			this.ctx.translate(translateX, translateY);
			this.ctx.scale(this.zoom, this.zoom);

			if(debug) {
				this.drawDebug();
			}
		}

		update(model) {
			backgroundColor += 0.08;
			backgroundColor = backgroundColor > 360 ? 0 : backgroundColor;

			var targetZoom = (model.camera.maxZoom + (model.camera.minZoom - model.camera.maxZoom) * Math.min(model.userTadpole.momentum, model.userTadpole.maxMomentum) / model.userTadpole.maxMomentum);
			model.camera.zoom += (targetZoom - model.camera.zoom) / 60;

			var delta = {
				x: (model.userTadpole.x - model.camera.x) / 30,
				y: (model.userTadpole.y - model.camera.y) / 30
			};

			if(Math.abs(delta.x) + Math.abs(delta.y) > 0.1) {
				model.camera.x += delta.x;
				model.camera.y += delta.y;

				for(var i = 0, len = model.waterParticles.length; i < len; i++) {
					var wp = model.waterParticles[i];
					wp.x -= (wp.z - 1) * delta.x;
					wp.y -= (wp.z - 1) * delta.y;
				}
			}
		}

		getBounds() {
			return [
				{x: this.x - this.canvas.width / 2 / this.zoom, y: this.y - this.canvas.height / 2 / this.zoom},
				{x: this.x + this.canvas.width / 2 / this.zoom, y: this.y + this.canvas.height / 2 / this.zoom}
			];
		}

		getOuterBounds() {
			return [
				{x: this.x - this.canvas.width / 2 / this.minZoom, y: this.y - this.canvas.height / 2 / this.minZoom},
				{x: this.x + this.canvas.width / 2 / this.minZoom, y: this.y + this.canvas.height / 2 / this.minZoom}
			];
		}

		getInnerBounds() {
			return [
				{x: this.x - this.canvas.width / 2 / this.maxZoom, y: this.y - this.canvas.height / 2 / this.maxZoom},
				{x: this.x + this.canvas.width / 2 / this.maxZoom, y: this.y + this.canvas.height / 2 / this.maxZoom}
			];
		}

		startUILayer() {
			this.ctx.setTransform(1,0,0,1,0,0);
		}

		debugBounds(bounds, text) {
			this.ctx.strokeStyle   = '#fff';
			this.ctx.beginPath();
			this.ctx.moveTo(bounds[0].x, bounds[0].y);
			this.ctx.lineTo(bounds[0].x, bounds[1].y);
			this.ctx.lineTo(bounds[1].x, bounds[1].y);
			this.ctx.lineTo(bounds[1].x, bounds[0].y);
			this.ctx.closePath();
			this.ctx.stroke();
			this.ctx.fillText(text, bounds[0].x + 10, bounds[0].y + 10);
		}

		drawDebug() {
			this.debugBounds(this.getInnerBounds(), 'Maximum zoom camera bounds');
			this.debugBounds(this.getOuterBounds(), 'Minimum zoom camera bounds');
			this.debugBounds(this.getBounds(), 'Current zoom camera bounds');
		}
	}

	if (window.module && window.module.exports) {
		window.module.exports = Camera;
	} else {
		scope.Camera = Camera;
	}
})(this);