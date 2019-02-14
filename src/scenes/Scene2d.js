
import * as PIXI from 'pixi.js';

export default class Scene2d {
	constructor () {
		this.screenWidth = 100;
		this.screenHeight = 100;

		this.resolution = 2;

		this.stage = new PIXI.Container();
		this.renderer = new PIXI.autoDetectRenderer(
			this.screenWidth,
			this.screenHeight,
			{antialias: true, transparent: true, preserveDrawingBuffer: true }
		);
	}

	onWindowResize(_width, _height) {
		this.screenWidth = _width;
		this.screenHeight = _height;

		let preResolution = this.renderer.resolution;
		this.renderer.view.style.width = this.screenWidth + 'px';
		this.renderer.view.style.height = this.screenHeight + 'px';

		this.renderer.resolution = 1;
		this.renderer.resize(this.screenWidth, this.screenHeight);
		this.renderer.resolution = preResolution;
	}

	render() {
		this.renderer.resolution = window.devicePixelRatio * this.resolution;
		this.renderer.render(this.stage);
	}

	init(_content) {
		_content.appendChild(this.renderer.view);
	}

	add(_content) {
		this.stage.addChild(_content);
	}
}