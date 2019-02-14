import App from './App.js';

let app = null;

function init () {
	app = new App();
	onWindowResize();
}

function onWindowResize () {
	let w = document.documentElement.clientWidth;
	let h = document.documentElement.clientHeight;
	if (app !== null) app.onWindowResize(w, h);
}

window.onload = init;
window.onresize = onWindowResize;