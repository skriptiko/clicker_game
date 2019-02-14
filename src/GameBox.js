
import * as PIXI from 'pixi.js';

export default class GameBox {
	constructor () {

		this.content = new PIXI.Container();

		this.width = 400;
		this.btnHeight = 35;
		this.offset = 20;
		this.defaultInterval = 300;
		this.isGameStart = false;
		this.itemIndex = -1; // number
		this.delay = 500;

		this.intervale = null;

		this.btn = new Button(() => {
			this.gameField.start();
		});
		this.btn.height = this.btnHeight;
		this.btn.text = 'Start';
		this.content.addChild(this.btn);

		this.input = new Input((_value) => {
			this.gameField.delay = _value;
		});
		this.input.height = this.btnHeight - 4;
		this.input.value = this.delay;

		this.counter = new Counter();
		this.content.addChild(this.counter);

		this.gameField = new GameField((_win, _loose) => {
			this.counter.setValue(_win, _loose);
			if (_win === 5 || _loose === 5) {
				this.gameField.end();
				this.modalField.text = (_win === 5) ? 'You win!' : 'You lose!';
				this.modalField.activ = true;
			}
		});
		this.gameField.delay = this.delay;
		this.content.addChild(this.gameField);

		this.modalField = new ModalField(() => {
			this.gameField.start();
			this.modalField.activ = false;
		});
		this.modalField.width = this.width;
		this.modalField.height = this.width;
		this.content.addChild(this.modalField);

		this.draw();
	}

	draw() {
		let xi = this.width - this.counter.width;
		let xe = (xi - this.offset * 2) / 2;

		this.input.x = xe + this.offset;
		this.input.width = xe;

		this.btn.width = xe;

		this.counter.x = xi;

		this.modalField.y = this.btn.height + this.offset;

		this.gameField.y = this.btn.height + this.offset;
		this.gameField.wh = this.width;
	}
}

class ModalField extends PIXI.Container {
	constructor (_callback) {
		super();

		this.callback = _callback || null;

		this._width = 100;
		this._height = 100;
		this._activ = false;
		this._text = '';

		this.visible = this._activ;

		this.offset = 10;

		this.graphics = new PIXI.Graphics();
		this.addChild(this.graphics);

		this.title = new PIXI.Text(this._text);
		this.addChild(this.title);

		this.btn = new Button(() => {
			if (this.callback !== null) {
				this.callback();
			}
		});
		this.btn.text = 'Try again?';
		this.btn.width = 100;
		this.btn.height = 30;
		this.addChild(this.btn);

	}

	draw(value) {
		this.graphics.clear();
		this.graphics.beginFill(0xBDBDBD, 0.7);
		this.graphics.drawRect(0, 0, this._width, this._height);
		let hc = (this.title.height + this.offset + this.btn.height);
		this.title.x = (this._width - this.title.width) / 2;
		this.title.y = (this.height - hc) / 2;
		this.btn.x = (this._width - this.btn.width) / 2;
		this.btn.y = this.title.y + this.title.height + this.offset;
	}

	set text(value) {
		this._text = value;
		this.title.text = this._text;
		this.draw();
	}

	set activ(value) {
		this._activ = value;
		this.visible = this._activ;
	}

	set width(value) {
		this._width = value;
		this.draw();
	}
	get width() {
		return this._width;
	}

	set height(value) {
		this._height = value;
		this.draw();
	}
	get height() {
		return this._height;
	}
}

class GameField extends PIXI.Container {
	constructor (_callback) {
		super();

		this.callback = _callback || null;

		this.graphics = new PIXI.Graphics();
		this.addChild(this.graphics);

		this._wh = 100;
		this._delay = 100;

		this.itemIndex = -1;

		this.sideСells = 10; // количество ячеек в ряду
		this.cells = Math.pow(this.sideСells, 2); // общее количество ячеек
		this.cellWH = this._wh / this.sideСells; // размеры одной ячейки

		this.fieldState = new Array(this.cells);

		this.graphics.interactive = true;
		this.graphics.on('mousedown', (e) => {
			this.graphics.toLocal(e.data.global, null, this.point);
		})

		this.intervale = null;

		this.point = new PIXI.Point;

		this.color_blue = 0x0000ff;
		this.color_yellow = 0xffff00;
		this.color_red = 0xff0000;
		this.color_green = 0x00ff00;

		this.draw();
	}

	start() {
		if (this.intervale !== null) return;

		this.fieldState.fill(0);
		this.draw();

		this.itemIndex = null;
		this.intervale = setInterval(() => {

			this.checkCellState(this.itemIndex);
			this.itemIndex = this.getRandom();

			if (this.itemIndex === null) {
				this.end();
				this.checkCellState(this.itemIndex);
				// return;
			} else {
				this.fieldState[this.itemIndex] = 1;
			}

			this.draw();
			if (this.callback !== null) {
				this.callback(this.checkByState(2), this.checkByState(3));
			}
			
		}, this._delay);
	}

	end() {
		clearInterval(this.intervale);
		this.intervale = null;
		this.fieldState[this.itemIndex] = 0;
		this.draw();
	}

	getRandom() {
		let zeroInd = [];
		this.fieldState.forEach((item, index) => {
			if (item === 0) zeroInd.push(index);
		});
		if (zeroInd.length !== 0) return zeroInd[Math.floor(Math.random() * zeroInd.length)];
		return null;
	}

	checkCellState(_itemIndex) {
		if (_itemIndex === null) return;
		let iCol = Math.ceil((this.point.x / (this.sideСells * this.cellWH)) * 10) - 1;
		let iRow = Math.ceil((this.point.y / (this.sideСells * this.cellWH)) * 10) - 1;
		let iDown = (iRow * this.sideСells) + iCol;
		this.fieldState[this.itemIndex] = (iDown === this.itemIndex) ? 2 : 3;
	}


	checkByState(_value) {
		let res = this.fieldState.filter((item) => {
			return item === _value;
		});
		return res.length;
	}

	draw() {
		// debugger
		let stepCol = 0;
		let stepRow = 0;

		this.graphics.clear();
		this.graphics.lineStyle(1, 0x000000);

		for (let i = 0; i < this.fieldState.length; i++) {
			let fillColor = this.color_blue;

			if (this.fieldState[i] === 1) fillColor = this.color_yellow;
			if (this.fieldState[i] === 2) fillColor = this.color_green;
			if (this.fieldState[i] === 3) fillColor = this.color_red;
			this.graphics.beginFill(fillColor);
			this.graphics.drawRect(stepCol * this.cellWH, stepRow * this.cellWH, this.cellWH, this.cellWH);

			stepCol++;
			if (stepCol >= this.sideСells) {
				stepCol = 0;
				stepRow++;
			}
		}
	}

	set wh(value) {
		this._wh = value;
		this.cellWH = this._wh / this.sideСells;
		this.draw();
	}

	set delay(value) {
		this._delay = value;
	}
}

class Button extends PIXI.Container {
	constructor (_callback) {
		super();

		this.callback = _callback || null;

		this._width = 10;
		this._height = 10;
		this._text = '';

		this.graphics = new PIXI.Graphics();
		this.addChild(this.graphics);

		this.graphics.interactive = true;
		this.graphics.buttonMode = true;
		this.graphics.on('mousedown', () => {
			if (this.callback !== null) this.callback();
		});

		this.title = new PIXI.Text(this._text);
		this.title.style.fontSize = 16;
		this.addChild(this.title);

		this.draw();
	}

	draw() {
		this.graphics.clear();
		this.graphics.lineStyle(1, 0x000000);
		this.graphics.beginFill(0xBDBDBD);
		this.graphics.drawRect(0, 0, this._width, this._height);
		this.title.x = (this._width - this.title.width) / 2;
		this.title.y = (this._height - this.title.height) / 2;
	}

	set text(value) {
		this._text = value;
		this.title.text = value;
		this.draw();
	}

	set width(value) {
		this._width = value;
		this.draw();
	}
	get width() {
		return this._width;
	}

	set height(value) {
		this._height = value;
		this.draw();
	}
	get height() {
		return this._height;
	}
}

class Counter extends PIXI.Container {
	constructor () {
		super();

		this.title = new PIXI.Text('Player: 00 / Computer: 00');
		this.title.style.fontSize = 12;
		this.addChild(this.title);

	}

	checkValue(_num) {
		let num = _num + '';
		if (num < 10) {
			num = '0' + num;
		}
		return num
	}

	setValue(_player, _computer) {
		this.title.text = `Player: ${this.checkValue(_player)} / Computer: ${this.checkValue(_computer)}`;
	}


	get width() {
		return this.title.width;
	}

	get height() {
		return this.title.height;
	}
}

class Input {
	constructor (_callback) {

		this.callback = _callback || null;

		this._x = 0;
		this._y = 0;

		this._value = 100;

		this.input = document.createElement('input');
		this.input.style.position = 'fixed';
		this.input.style.top = this._x + 'px';
		this.input.style.left = this._y + 'px';
		this.input.style.zIndex = 9;
		this.input.value = this.defaultValue;
		this.input.oninput = () => {
			if (this.callback !== null) this.callback(this.input.value);
		}
		document.body.appendChild(this.input);
	}

	set value(_value) {
		this.input.value = _value;
	}

	set width(value) {
		this._width = value;
		this.input.style.width = this._width + 'px';
	}

	set height(value) {
		this._height = value;
		this.input.style.height = this._height + 'px';
	}

	set x(value) {
		this._x = value;
		this.input.style.left = this._x + 'px';
	}
	get x() {
		return this._x;
	}

	set y(value) {
		this._y = value;
		this.input.style.top = this._y + 'px';
	}
	get y() {
		return this._y;
	}
}

