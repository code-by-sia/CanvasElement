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
		var rect = new Rectangle(random(0,400),random(0,500),random(100,300),random(100,200),randomColor(),randomColor());
		canvasEl.insertElement(rect);
	});

	$('#btnRepaint').click(function () {
		canvasEl.repaint();
	});
	
});