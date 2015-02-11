"use strict";

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var CanvasElement = (function () {
	function CanvasElement(el) {
		_classCallCheck(this, CanvasElement);

		this.canvas = el;
		this.context = el.getContext("2d");
		this.width = el.width;
		this.height = el.height;
		this.backgroundColor = "white";
		this.backgroundImage = null;
	}

	CanvasElement.prototype.repaint = function repaint() {
		var context = this.context;
		context.clearRect(0, 0, this.width, this.height);
		if (this.backgroundColor) {
			context.fillStyle = this.backgroundColor;
			context.fillRect(0, 0, this.width, this.height);
		}
		if (this.backgroundImage) {
			context.drawImage(this.backgroundImage, 0, 0, this.width, this.height);
		}
	};

	return CanvasElement;
})();