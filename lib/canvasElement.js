"use strict";

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

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
		this.elements = [];
	}

	CanvasElement.prototype.insertElement = function insertElement(elemet) {
		elemet.setPainter(this);
		this.elements.push(elemet);
		this.repaint();
	};

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
		for (var i = 0; i < this.elements.length; i++) {
			var element = this.elements[i];
			element.paint();
		};
	};

	return CanvasElement;
})();

var DrawableElement = (function () {
	function DrawableElement(x, y, w, h) {
		var fill = arguments[4] === undefined ? "" : arguments[4];
		var stroke = arguments[5] === undefined ? "" : arguments[5];
		_classCallCheck(this, DrawableElement);

		this.x = x;
		this.y = y;
		this.width = w;
		this.height = h;
		this.fill = fill;
		this.stroke = stroke;
	}

	DrawableElement.prototype.setPainter = function setPainter(painter) {
		this.painter = painter;
	};

	DrawableElement.prototype.paint = function paint() {
		var context = this.painter.context;
		context.setTransform(1, 0, 0, 1, 0, 0);
		context.translate(this.x, this.y);
		context.fillStyle = this.fill;
		context.strokeStyle = this.stroke;
	};

	return DrawableElement;
})();

var Rectangle = (function (DrawableElement) {
	function Rectangle(x, y, w, h, fill, stroke) {
		_classCallCheck(this, Rectangle);

		DrawableElement.call(this, x, y, w, h, fill, stroke);
	}

	_inherits(Rectangle, DrawableElement);

	Rectangle.prototype.paint = function paint() {
		DrawableElement.prototype.paint.call(this);
		var context = this.painter.context;
		if (this.fill) context.fillRect(0, 0, this.width, this.height);
		if (this.stroke) context.strokeRect(0, 0, this.width, this.height);
	};

	return Rectangle;
})(DrawableElement);