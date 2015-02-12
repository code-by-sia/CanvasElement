"use strict";

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var CANVAS_ELEMENT_HANDLE_SIZE = 10;
var CANVAS_ELEMENT_GRID_SIZE = 10;

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
		this._hitTest = null;
		this.selectedElement = null;
		this.deltaX = 0;
		this.deltaY = 0;
		this.hitX = 0;
		this.hitY = 0;
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
				this.hitX = x;
				this.hitY = y;
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
		this.clearSelection();
		for (var i = this.elements.length - 1; i >= 0; i--) {
			var element = this.elements[i];
			var test = element.hitTest(x, y);
			this._hitTest = test;
			if (test.ElementHitted || test.HandleHitted) {
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
		if (this.selected && this._hitTest) {
			var test = this._hitTest;
			var selected = this.selected;
			if (test.ElementHitted) {
				selected.x = x + this.deltaX;
				selected.y = y + this.deltaY;
				this.repaint();
			} else if (test.HandleHitted) {
				var dx = x - selected.x;
				var dy = y - selected.y;

				var teta = Math.atan2(dy, dx) + Math.PI / 2;
				var tetaInDegree = teta * 180 / Math.PI;
				selected.angle = tetaInDegree;

				if (!control) {
					var distanse = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
					var _length = (distanse - CANVAS_ELEMENT_HANDLE_SIZE * 1.5) * 2;
					var rative = selected.width / selected.height;
					selected.height = _length;
					if (!alt) {
						selected.width = rative * _length;
					}
				}

				this.repaint();
			}

			if (shift) {
				selected.x = Math.floor(selected.x / CANVAS_ELEMENT_GRID_SIZE) * CANVAS_ELEMENT_GRID_SIZE;
				selected.y = Math.floor(selected.y / CANVAS_ELEMENT_GRID_SIZE) * CANVAS_ELEMENT_GRID_SIZE;
				selected.angle = Math.floor(selected.angle / CANVAS_ELEMENT_GRID_SIZE) * CANVAS_ELEMENT_GRID_SIZE;
				this.repaint();
			}
		}
	};

	CanvasElement.prototype.hitEnd = function hitEnd(x, y, control, shift, alt, meta) {};

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
		this.angle = 0;
	}

	DrawableElement.prototype.setPainter = function setPainter(painter) {
		this.painter = painter;
	};

	DrawableElement.prototype.hitTest = function hitTest(x, y) {
		x -= this.x;
		y -= this.y;

		var handleSize = CANVAS_ELEMENT_HANDLE_SIZE;

		var teta = this.angle * Math.PI / 180;
		var rx = x * Math.cos(-teta) - y * Math.sin(-teta);
		var ry = x * Math.sin(-teta) + y * Math.cos(-teta);

		var hitEl = rx > -this.width / 2 && ry > -this.height / 2 && rx < this.width / 2 && ry < this.height / 2;
		var hitHl = rx > -handleSize / 2 && ry > -this.height / 2 - handleSize * 1.5 && rx < handleSize && ry < this.height / 2;

		return { ElementHitted: hitEl, HandleHitted: hitHl };
	};

	DrawableElement.prototype.paint = function paint() {
		var context = this.painter.context;
		context.setTransform(1, 0, 0, 1, 0, 0);
		context.translate(this.x, this.y);
		if (this.angle != 0) context.rotate(this.angle * Math.PI / 180);
		context.fillStyle = this.fill;
		context.strokeStyle = this.stroke;
	};

	DrawableElement.prototype.paintHandle = function paintHandle() {
		var context = this.painter.context;
		var handleSize = CANVAS_ELEMENT_HANDLE_SIZE;
		context.strokeStyle = "rgba(0,0,0,.3)";
		context.fillStyle = "rgba(0,0,0,.8)";
		var x = -this.width / 2;
		var y = -this.height / 2;
		context.strokeRect(x - handleSize / 2, y - handleSize / 2, this.width + handleSize, this.height + handleSize);
		context.fillRect(x - handleSize / 2, y - handleSize / 2, handleSize, handleSize);
		context.fillRect(x + this.width - handleSize / 2, y - handleSize / 2, handleSize, handleSize);
		context.fillRect(x - handleSize / 2, y + this.height - handleSize / 2, handleSize, handleSize);
		context.fillRect(x + this.width - handleSize / 2, y + this.height - handleSize / 2, handleSize, handleSize);

		context.fillRect(x + this.width / 2 - handleSize / 2, y - handleSize * 1.5, handleSize, handleSize);


		context.strokeStyle = "transparent";
		context.fillStyle = "transparent";
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
		if (this.fill) context.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
		if (this.stroke) context.strokeRect(-this.width / 2, -this.height / 2, this.width, this.height);
	};

	return Rectangle;
})(DrawableElement);

var Picture = (function (DrawableElement) {
	function Picture(x, y, w, h, image) {
		_classCallCheck(this, Picture);

		DrawableElement.call(this, x, y, w, h, "", "");
		this.image = image;
	}

	_inherits(Picture, DrawableElement);

	Picture.prototype.paint = function paint() {
		DrawableElement.prototype.paint.call(this);
		var context = this.painter.context;
		if (this.image) context.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);
	};

	return Picture;
})(DrawableElement);