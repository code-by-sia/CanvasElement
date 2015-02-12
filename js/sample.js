function random(start,end){
	return Math.floor(Math.random() * (end - start)) + start;
}

function randomColor () {
	return "#"+((1<<24)*Math.random()|0).toString(16);
}

$(document).ready(function(){
	var el = document.getElementById('canvas1');
	window.canvasEl= new CanvasElement(el);

	$('#btnTest').click(function(){
		var rect = new Rectangle(random(0,400),random(0,300),random(100,150),random(100,200),randomColor(),randomColor());
		rect.angle = random(0,360);
		canvasEl.insertElement(rect);
	});

	$('#btnRepaint').click(function () {
		canvasEl.repaint();
	});

	$('#btnSampleImg').click(function(){
		var img = $('<img src="img/sample.jpg" />');
		img.load(function(){
			var m = new Picture(250,200,400,300,this);
			canvasEl.insertElement(m);
		});
	});

	$(el).mouseup(function (evt) {
		var x = evt.offsetX || evt.layerX || (evt.clientX - el.offsetLeft);
        var y = evt.offsetY || evt.layerY || (evt.clientY - el.offsetTop);
		canvasEl.hit(x,y,3,evt.controlKey,evt.shiftKey,evt.altKey,evt.metaKey);
	}).mousedown(function (evt) {
		var x = evt.offsetX || evt.layerX || (evt.clientX - el.offsetLeft);
        var y = evt.offsetY || evt.layerY || (evt.clientY - el.offsetTop);
		canvasEl.hit(x,y,1,evt.controlKey,evt.shiftKey,evt.altKey,evt.metaKey);
	}).mousemove(function (evt) {
		var x = evt.offsetX || evt.layerX || (evt.clientX - el.offsetLeft);
        var y = evt.offsetY || evt.layerY || (evt.clientY - el.offsetTop);
		canvasEl.hit(x,y,2,evt.controlKey,evt.shiftKey,evt.altKey,evt.metaKey);
	}).dblclick(function (evt) {
		if(canvasEl.selected){
			canvasEl.selected.bringToFront();
		}
	});
	
});