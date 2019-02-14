
import Scene2d from './scenes/Scene2d.js';
import GameBox from './GameBox.js';
import * as PIXI from 'pixi.js';

export default class App {
	constructor () {
		this.content = document.createElement('div');

		this.screenWidth = window.innerWidth;
		this.screenHeight = window.innerHeight;

		this.content2d = this.getContainer();
		this.content2d.style.zIndex = 0;

		this.content.appendChild(this.content2d);

		this.scene2d = new Scene2d();
		this.gameBox = new GameBox();

		this.scene2d.add(this.gameBox.content);
		

		this.ticker = new PIXI.ticker.Ticker();
		this.ticker.minFPS = 50;
		this.ticker.add(this.render, this);

		
		this.init();
	}

	getContainer() {
		let div = document.createElement('div');
		div.style.position = 'fixed';
		div.style.top = '0px';
		div.style.left = '0px';
		return div;
	}

	render() {
		this.scene2d.render();
	}

	init() {
		this.scene2d.init(this.content2d);
		document.body.appendChild(this.content);
		this.ticker.start();
	}

	onWindowResize(_width, _height) {
		this.screenWidth = _width;
		this.screenHeight = _height;
		this.scene2d.onWindowResize(_width, _height);
	}
}