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
		$('#file1').click();
	});

	$('#btnBringToFront').click(function () {
		if(canvasEl.selected)
			canvasEl.selected.bringToFront();
	});

	$('#btnSendToBack').click(function () {
		if(canvasEl.selected)
			canvasEl.selected.sendToBack();
	});

	$('#btnAddShadow').click(function(){
		if(canvasEl.selected)
		{
			canvasEl.selected.shadowBlur=15;
			canvasEl.selected.shadowColor='#000';
			canvasEl.repaint();
		}
	});

	$('#clrBack').change(function(){
		if(canvasEl.selected){
			canvasEl.selected.fill = this.value;
			canvasEl.repaint();
		}
	});

	$('#file1').change(function(e){
		for (var i = this.files.length - 1; i >= 0; i--) {
			var file = this.files[i];

			var img = new Image;
			img.src = URL.createObjectURL(file);
			img.onload = function() {
				var w= this.width;
				var h=this.height;
				if(w>300){ 
					r=w/300;
					w=w/r;
					h=h/r;
				}
			    var m = new Picture(200,200,w,h,this);
				canvasEl.insertElement(m);
			}
		};
	});

	$(el).mouseup(function (evt) {
		var x = evt.offsetX || evt.layerX || (evt.clientX - el.offsetLeft);
        var y = evt.offsetY || evt.layerY || (evt.clientY - el.offsetTop);
		canvasEl.hit(x,y,3,evt.ctrlKey,evt.shiftKey,evt.altKey,evt.metaKey);
	}).mousedown(function (evt) {
		var x = evt.offsetX || evt.layerX || (evt.clientX - el.offsetLeft);
        var y = evt.offsetY || evt.layerY || (evt.clientY - el.offsetTop);
		canvasEl.hit(x,y,1,evt.ctrlKey,evt.shiftKey,evt.altKey,evt.metaKey);
	}).mousemove(function (evt) {
		var x = evt.offsetX || evt.layerX || (evt.clientX - el.offsetLeft);
        var y = evt.offsetY || evt.layerY || (evt.clientY - el.offsetTop);
		canvasEl.hit(x,y,2,evt.ctrlKey,evt.shiftKey,evt.altKey,evt.metaKey);
	}).dblclick(function (evt) {
		if(canvasEl.selected){
			canvasEl.selected.bringToFront();
		}
	});
	
});