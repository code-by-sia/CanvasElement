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
		this._hitting = 0;
		this.selectedElement = null;
		this.deltaX = 0;
		this.deltaY = 0;
	}

	CanvasElement.prototype.insertElement = function insertElement(elemet) {
		elemet.setPainter(this);
		this.elements.push(elemet);
		this.repaint();
	};

	CanvasElement.prototype.removeElement = function removeElement(element) {
		var index = this.elements.indexOf(element);
		if (index > -1) this.elements.splice(index, 1);
		this.repaint();
	};

	CanvasElement.prototype.EachElement = function EachElement(callback) {
		if (!callback) return;
		for (var i = 0; i < this.elements.length; i++) {
			callback(this.elements[i]);
		};
	};

	CanvasElement.prototype.clearSelection = function clearSelection() {
		this.EachElement(function (element) {
			element.selected = false;
		});
		this.selected = null;
	};

	CanvasElement.prototype.repaint = function repaint() {
		var context = this.context;



		if (this.backgroundColor) {
			context.fillStyle = this.backgroundColor;
			context.fillRect(0, 0, this.width, this.height);
		}
		if (this.backgroundImage) {
			context.drawImage(this.backgroundImage, 0, 0, this.width, this.height);
		}

		context.clearRect(0, 0, this.width, this.height);
		context.save();
		context.setTransform(1, 0, 0, 1, 0, 0);
		context.clearRect(0, 0, this.width, this.height);
		context.restore();

		this.EachElement(function (element) {
			element.paint();
			if (element.selected) element.paintHandle();
		});

	};

	CanvasElement.prototype.hit = function hit(x, y, state, control, shift, alt, meta) {
		switch (state) {
			case 1:
				//mouse down
				this.hitStart(x, y, control, shift, alt, meta);
				this._hitting = true;
				break;
			case 2:
				//mouse move
				if (!this._hitting) return;
				this.hitting(x, y, control, shift, alt, meta);
				break;
			case 3:
				//mouse up
				this._hitting = false;
				this.hitEnd(x, y, control, shift, alt, meta);
				break;
		}
	};

	CanvasElement.prototype.hitStart = function hitStart(x, y, control, shift, alt, meta) {
		console.log("hit start");
		this.clearSelection();
		for (var i = this.elements.length - 1; i >= 0; i--) {
			var element = this.elements[i];
			if (element.hitTest(x, y)) {
				element.selected = true;
				this.selected = element;
				this.deltaX = element.x - x;
				this.deltaY = element.y - y;
				break;
			}
		}
		this.repaint();
	};

	CanvasElement.prototype.hitting = function hitting(x, y, control, shift, alt, meta) {
		console.log("hit continues..");
		if (this.selected) {
			this.selected.x = x + this.deltaX;
			this.selected.y = y + this.deltaY;
			this.repaint();
		}
	};

	CanvasElement.prototype.hitEnd = function hitEnd(x, y, control, shift, alt, meta) {
		console.log("hit done");
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
		this.selected = false;
	}

	DrawableElement.prototype.setPainter = function setPainter(painter) {
		this.painter = painter;
	};

	DrawableElement.prototype.hitTest = function hitTest(x, y) {
		x -= this.x;
		y -= this.y;

		return x > 0 && y > 0 && x < this.width && y < this.height;
	};

	DrawableElement.prototype.paint = function paint() {
		var context = this.painter.context;
		context.setTransform(1, 0, 0, 1, 0, 0);
		context.translate(this.x, this.y);

		context.fillStyle = this.fill;
		context.strokeStyle = this.stroke;
	};

	DrawableElement.prototype.paintHandle = function paintHandle() {
		var context = this.painter.context;
		context.strokeStyle = "rgba(255,0,0,.5)";
		context.fillStyle = "rgba(255,0,0,.7)";
		context.strokeRect(-5, -5, this.width + 10, this.height + 10);
		context.fillRect(-5, -5, 10, 10);
		context.fillRect(this.width - 5, -5, 10, 10);
		context.fillRect(-5, this.height - 5, 10, 10);
		context.fillRect(this.width - 5, this.height - 5, 10, 10);
		context.strokeStyle = "";
		context.fillStyle = "";
	};

	DrawableElement.prototype.sendToBack = function sendToBack() {
		var elements = this.painter.elements;
		for (var i = 0; i < elements.length; i++) {
			var prevelement = elements[i];
			i++;if (i >= elements.length) break;
			var element = elements[i];

			if (element == this) {
				elements[i] = prevelement;
				elements[i - 1] = element;
				this.painter.repaint();
				break;
			}
		};
	};

	DrawableElement.prototype.bringToFront = function bringToFront() {
		var elements = this.painter.elements;
		for (var i = elements.length - 1; i >= 0;) {
			var prevelement = elements[i];
			i--;if (i < 0) break;
			var element = elements[i];

			if (element == this) {
				elements[i] = prevelement;
				elements[i + 1] = element;
				this.painter.repaint();
				break;
			}
		};
	};

	DrawableElement.prototype.remove = function remove() {
		this.painter.removeElement(this);
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