$(document).ready(function(){
	var el = document.getElementById('canvas1');
	var canvasEl= new CanvasElement(el);

	$('#btnTest').click(function(){
		
	});

	$('#btnRepaint').click(function () {
		canvasEl.repaint();
	});
	
});