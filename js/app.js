(function(scope) {
	const mouse = { x: 0, y: 0, worldx: 0, worldy: 0, tadpole:null };
	const keyNav = { x: 0, y: 0 };
	const model = {
		tadpoles: {},
		userTadpole: null,
		camera: null
	};
	const keys = {
		esc: 27,
		enter: 13,
		space: 32,
		up: 38,
		down: 40,
		left:37,
		right:39
	};

	class App {
		constructor(canvas) {
			this.canvas = canvas;
			this.ctx = canvas.getContext('2d');
			this.resize();

			model.userTadpole = new Tadpole();
			model.userTadpole.id = -1;
			model.tadpoles[model.userTadpole.id] = model.userTadpole;

			model.waterParticles = [];
			for(var i = 0; i < 150; i++) {
				model.waterParticles.push(new WaterParticle());
			}

			model.camera = new Camera(canvas, this.ctx, model.userTadpole.x, model.userTadpole.y);

			model.arrows = {};
		}

		getMouseWorldPosition() {
			return {
				x: (mouse.x + (model.camera.x * model.camera.zoom - this.canvas.width / 2)) / model.camera.zoom,
				y: (mouse.y + (model.camera.y * model.camera.zoom  - this.canvas.height / 2)) / model.camera.zoom
			}
		}

		update() {
			// Update usertadpole
			if(keyNav.x != 0 || keyNav.y != 0) {
				model.userTadpole.userUpdate(model.userTadpole.x + keyNav.x,model.userTadpole.y + keyNav.y);
			}
			else {
				var mvp = this.getMouseWorldPosition();
				mouse.worldx = mvp.x;
				mouse.worldy = mvp.y;
				model.userTadpole.userUpdate(mouse.worldx, mouse.worldy);
			}

			model.camera.update(model);

			// Update tadpoles
			for(let id in model.tadpoles) {
				model.tadpoles[id].update(mouse);
			}

			// Update waterParticles
			for(let i in model.waterParticles) {
				model.waterParticles[i].update(model.camera.getOuterBounds(), model.camera.zoom);
			}

			// Update arrows
			for(let i in model.arrows) {
				var arrow = model.arrows[i];
				arrow.update();
			}
		}

		draw() {
			model.camera.setupContext();

			// Draw waterParticles
			for(let i in model.waterParticles) {
				model.waterParticles[i].draw(this.ctx);
			}

			// Draw tadpoles
			for(let id in model.tadpoles) {
				model.tadpoles[id].draw(this.ctx);
			}

			// Start UI layer (reset transform matrix)
			model.camera.startUILayer();

			// Draw arrows
			for(let i in model.arrows) {
				model.arrows[i].draw(this.ctx, this.canvas);
			}
		}

		mousedown(e) {
			mouse.clicking = true;

			if(mouse.tadpole && mouse.tadpole.hover && mouse.tadpole.onclick(e)) {
				return;
			}
			if(model.userTadpole && e.which == 1) {
				model.userTadpole.momentum = model.userTadpole.targetMomentum = model.userTadpole.maxMomentum;
			}
		}

		mouseup(e) {
			if(model.userTadpole && e.which == 1) {
				model.userTadpole.targetMomentum = 0;
			}
		}

		mousemove(e) {
			mouse.x = e.clientX;
			mouse.y = e.clientY;
		}

		keydown(e) {
			if(e.keyCode == keys.up) {
				keyNav.y = -1;
				model.userTadpole.momentum = model.userTadpole.targetMomentum = model.userTadpole.maxMomentum;
				e.preventDefault();
			}
			else if(e.keyCode == keys.down) {
				keyNav.y = 1;
				model.userTadpole.momentum = model.userTadpole.targetMomentum = model.userTadpole.maxMomentum;
				e.preventDefault();
			}
			else if(e.keyCode == keys.left) {
				keyNav.x = -1;
				model.userTadpole.momentum = model.userTadpole.targetMomentum = model.userTadpole.maxMomentum;
				e.preventDefault();
			}
			else if(e.keyCode == keys.right) {
				keyNav.x = 1;
				model.userTadpole.momentum = model.userTadpole.targetMomentum = model.userTadpole.maxMomentum;
				e.preventDefault();
			}
		}

		keyup(e) {
			if(e.keyCode == keys.up || e.keyCode == keys.down) {
				keyNav.y = 0;
				if(keyNav.x == 0 && keyNav.y == 0) {
					model.userTadpole.targetMomentum = 0;
				}
				e.preventDefault();
			}
			else if(e.keyCode == keys.left || e.keyCode == keys.right) {
				keyNav.x = 0;
				if(keyNav.x == 0 && keyNav.y == 0) {
					model.userTadpole.targetMomentum = 0;
				}
				e.preventDefault();
			}
		}

		touchstart(e) {
			e.preventDefault();
			mouse.clicking = true;

			if(model.userTadpole) {
				model.userTadpole.momentum = model.userTadpole.targetMomentum = model.userTadpole.maxMomentum;
			}

			var touch = e.changedTouches.item(0);
			if (touch) {
				mouse.x = touch.clientX;
				mouse.y = touch.clientY;
			}
		}


		touchend(e) {
			if(model.userTadpole) {
				model.userTadpole.targetMomentum = 0;
			}
		}

		touchmove(e) {
			e.preventDefault();

			var touch = e.changedTouches.item(0);
			if (touch) {
				mouse.x = touch.clientX;
				mouse.y = touch.clientY;
			}
		}

		resize() {
			this.canvas.width = window.innerWidth;
			this.canvas.height = window.innerHeight;
		}
	}

	if (window.module && window.module.exports) {
		window.module.exports = App;
	} else {
		scope.App = App;
	}
})(this);