var debug = false;
var app;

initApp();

function initApp() {
	if (app) {
		return;
	}
	app = new App(document.getElementById('canvas'));

	window.addEventListener('resize', app.resize, false);

	document.addEventListener('mousemove', 		app.mousemove, false);
	document.addEventListener('mousedown', 		app.mousedown, false);
	document.addEventListener('mouseup',			app.mouseup, false);
	
	document.addEventListener('touchstart',   app.touchstart, false);
	document.addEventListener('touchend',     app.touchend, false);
	document.addEventListener('touchcancel',  app.touchend, false);
	document.addEventListener('touchmove',    app.touchmove, false);	

	document.addEventListener('keydown',    app.keydown, false);
	document.addEventListener('keyup',    app.keyup, false);
	
	run();
};

function run() {
	requestAnimationFrame(run);
	app.update();
	app.draw();
}