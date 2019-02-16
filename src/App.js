
export default class App {
	constructor () {

		this.gameFiel = document.getElementsByClassName("game-field")[0];
		this.input = document.getElementsByClassName("delay")[0];
		this.btn = document.getElementsByClassName("start")[0];
		this.playerPoints = document.getElementsByClassName("player-points")[0];
		this.computerPoints = document.getElementsByClassName("computer-points")[0];
		this.modal = document.getElementsByClassName("modal")[0];
		this.modalBtn = document.getElementsByClassName("modal-btn")[0];
		this.modalBtnClose = document.getElementsByClassName("modal-label")[0];
		this.modalText = document.getElementsByClassName("modal-text")[0];

		this.intervale = null;

		this.delay = 1500; // задержка итерации setInterval
		this.maxPointsToWin = 10; // очки до победы
		this.maxInputValue = 5000; // максимальное значение для инпута
		this.cellsInRow = 10; // клеток в ряду
		this.activCellIndex = -1; // индекс активной клетки
		this.cells = Math.pow(this.cellsInRow, 2); // общие количество клеток
		this.computerPointsCount = 0;
		this.playerPointsCount = 0;

		this.bufferArrayCells = [];
		this.arrayCells = [];

		this.input.value = this.delay;

		for (var i = 0; i < this.cells; i++) {
			this.bufferArrayCells.push(this.createCell());
		}

		this.btn.addEventListener('mousedown', () => {
			this.start();
		});

		this.modalBtn.addEventListener('mousedown', () => {
			this.start();
		});

		this.modalBtnClose.addEventListener('mousedown', () => {
			this.modal.style.display = 'none';
		});

		this.input.oninput = () => {
			if (this.input.value > this.maxInputValue) {
				this.input.value = this.maxInputValue;
			}
			if (this.input.value <= 0) {
				this.input.value = 0;
			}
			this.delay = this.input.value;
		}
	}

	onCellDown() {
		if (this.arrayCells[this.activCellIndex].isWinner === true) return;
		this.arrayCells[this.activCellIndex].className = 'cell player';
		this.arrayCells[this.activCellIndex].isWinner = true;
		this.playerPointsCount++;
		this.playerPoints.textContent = this.playerPointsCount;
	}

	start() {
		if (this.intervale !== null) return;
		this.clear();
		this.intervale = setInterval(() => {
			if (this.activCellIndex !== -1) {
				this.arrayCells[this.activCellIndex].removeEventListener('mousedown', this);
				if (this.arrayCells[this.activCellIndex].isWinner !== true) {
					this.arrayCells[this.activCellIndex].className = 'cell computer';
					this.computerPointsCount++;
					this.computerPoints.textContent = this.computerPointsCount;
				}
				this.arrayCells.splice(this.activCellIndex, 1);
			}
			if (this.playerPointsCount >= this.maxPointsToWin || this.computerPointsCount >= this.maxPointsToWin) {
				this.modalText.textContent = (this.playerPointsCount === this.maxPointsToWin) ? 'Player win!' : 'Computer win!'
				this.stop();
				return;
			}
			this.activCellIndex = Math.floor(Math.random() * this.arrayCells.length)
			this.arrayCells[this.activCellIndex].className = 'cell activ';
			this.arrayCells[this.activCellIndex].addEventListener('mousedown', this);
		}, this.delay);
	}

	stop() {
		this.modal.style.display = 'block';
		this.activCellIndex = -1;
		clearInterval(this.intervale);
		this.intervale = null;
	}

	clear() {
		this.modal.style.display = 'none';
		this.computerPointsCount = 0;
		this.playerPointsCount = 0;
		this.computerPoints.textContent = this.computerPointsCount;
		this.playerPoints.textContent = this.playerPointsCount;
		this.arrayCells.length = 0;
		this.bufferArrayCells.forEach((item, index) => {
			item.className = 'cell';
			item.isWinner = false;
			this.arrayCells[index] = item;
		});
	}

	handleEvent(e) {
		if (e && e.type === 'mousedown') {
			this.onCellDown()
		}
	}

	createCell() {
		let div = document.createElement('div');
		div.className = 'cell';
		div.isWinner = false;
		div.handleEvent = this.handleEvent;
		this.gameFiel.appendChild(div);
		return div;
	}
}