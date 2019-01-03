(function(scope) {
	const jointSpacing = 1.4;
	let animationRate = 0;

	class TadpoleTail {
		constructor(tadpole) {
			this.tadpole = tadpole;
			this.joints = [];
			for(var i = 0; i < 15; i++) {
				this.joints.push({
					x: 0,
					y: 0,
					angle: Math.PI * 2
				})
			}
		}

		update() {
			animationRate += (0.2 + this.tadpole.momentum / 10);

			for(var i = 0, len = this.joints.length; i < len; i++) {
				var tailJoint = this.joints[i];
				var parentJoint = this.joints[i-1] || this.tadpole;
				var anglediff = (parentJoint.angle - tailJoint.angle);

				while(anglediff < -Math.PI) {
					anglediff += Math.PI * 2;
				}
				while(anglediff > Math.PI) {
					anglediff -= Math.PI * 2;
				}

				tailJoint.angle += anglediff * (jointSpacing * 3 + (Math.min(this.tadpole.momentum / 2, Math.PI * 1.8))) / 8;
				tailJoint.angle += Math.cos(animationRate - (i / 3)) * ((this.tadpole.momentum + .3) / 40);

				if(i == 0) {
					tailJoint.x = parentJoint.x + Math.cos(tailJoint.angle + Math.PI) * 5;
					tailJoint.y = parentJoint.y + Math.sin(tailJoint.angle + Math.PI) * 5;
				} else {
					tailJoint.x = parentJoint.x + Math.cos(tailJoint.angle + Math.PI) * jointSpacing;
					tailJoint.y = parentJoint.y + Math.sin(tailJoint.angle + Math.PI) * jointSpacing;
				}
			}
		}

		draw(context) {
			var path = [[],[]];

			for(var i = 0, len = this.joints.length; i < len; i++) {
				var tailJoint = this.joints[i];

				var falloff = (this.joints.length - i) / this.joints.length;
				var jointSize =  (this.tadpole.size - 1.8) * falloff;

				var x1 = tailJoint.x + Math.cos(tailJoint.angle + Math.PI * 1.5) * jointSize;
				var y1 = tailJoint.y + Math.sin(tailJoint.angle + Math.PI * 1.5) * jointSize;

				var x2 = tailJoint.x + Math.cos(tailJoint.angle + Math.PI / 2) * jointSize;
				var y2 = tailJoint.y + Math.sin(tailJoint.angle + Math.PI / 2) * jointSize;

				path[0].push({x: x1, y: y1});
				path[1].push({x: x2, y: y2});
			}

			for(var i = 0; i < path[0].length; i++) {
				context.lineTo(path[0][i].x, path[0][i].y);
			}
			path[1].reverse();
			for(var i = 0; i < path[1].length; i++) {
				context.lineTo(path[1][i].x, path[1][i].y);
			}
		}
	}

	if (window.module && window.module.exports) {
		window.module.exports = TadpoleTail;
	} else {
		scope.TadpoleTail = TadpoleTail;
	}
})(this);