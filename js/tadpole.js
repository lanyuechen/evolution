(function(scope) {

	class Tadpole {
		constructor() {
			this.x = Math.random() * 300 - 150;
			this.y = Math.random() * 300 - 150;
			this.size = 4;

			this.hover = false;

			this.momentum = 0;
			this.maxMomentum = 3;
			this.angle = Math.PI * 2;

			this.targetX = 0;
			this.targetY = 0;
			this.targetMomentum = 0;

			this.messages = [];

			this.changed = 0;
			this.timeSinceLastServerUpdate = 0;
			this.tail = new TadpoleTail(this);
		}

		update(mouse) {
			this.timeSinceLastServerUpdate++;

			this.x += Math.cos(this.angle) * this.momentum;
			this.y += Math.sin(this.angle) * this.momentum;

			if(this.targetX != 0 || this.targetY != 0) {
				this.x += (this.targetX - this.x) / 20;
				this.y += (this.targetY - this.y) / 20;
			}

			// Update messages
			for (var i = this.messages.length - 1; i >= 0; i--) {
				var msg = this.messages[i];
				msg.update();

				if(msg.age == msg.maxAge) {
					this.messages.splice(i,1);
				}
			}

			// Update tadpole hover/mouse state
			if(Math.sqrt(Math.pow(this.x - mouse.worldx,2) + Math.pow(this.y - mouse.worldy,2)) < this.size+2) {
				this.hover = true;
				mouse.tadpole = this;
			}
			else {
				if(mouse.tadpole && mouse.tadpole.id == this.id) {
					//mouse.tadpole = null;
				}
				this.hover = false;
			}

			this.tail.update();
		}

		userUpdate(angleTargetX, angleTargetY) {
			const prevState = {
				angle: this.angle,
				momentum: this.momentum
			};

			// Angle to targetx and targety (mouse position)
			var anglediff = ((Math.atan2(angleTargetY - this.y, angleTargetX - this.x)) - this.angle);
			while(anglediff < -Math.PI) {
				anglediff += Math.PI * 2;
			}
			while(anglediff > Math.PI) {
				anglediff -= Math.PI * 2;
			}

			this.angle += anglediff / 5;

			// Momentum to targetmomentum
			if(this.targetMomentum != this.momentum) {
				this.momentum += (this.targetMomentum - this.momentum) / 20;
			}

			if(this.momentum < 0) {
				this.momentum = 0;
			}

			this.changed += Math.abs((prevState.angle - this.angle)*3) + this.momentum;

			if(this.changed > 1) {
				this.timeSinceLastServerUpdate = 0;
			}
		}

		onclick(e) {
			console.log('--- click ---', e)
		}

		draw(ctx) {
			var opacity = Math.max(Math.min(20 / Math.max(this.timeSinceLastServerUpdate-300,1),1),.2).toFixed(3);

			ctx.shadowOffsetX = 0;
			ctx.shadowOffsetY = 0;
			ctx.shadowBlur    = 6;
			ctx.shadowColor   = 'rgba(255, 255, 255, '+opacity*0.7+')';

			// Draw circle
			ctx.beginPath();
			ctx.arc(this.x, this.y, this.size, this.angle + Math.PI * 2.7, this.angle + Math.PI * 1.3, true);

			this.tail.draw(ctx);

			ctx.closePath();
			ctx.fill();

			ctx.shadowBlur = 0;
			ctx.shadowColor   = '';

		}
	}

	if (window.module && window.module.exports) {
		window.module.exports = Tadpole;
	} else {
		scope.Tadpole = Tadpole;
	}
})(this);