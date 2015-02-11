class CanvasElement{
	constructor(el){
		this.canvas = el;
		this.context= el.getContext('2d');
		this.width = el.width;
		this.height= el.height;
		this.backgroundColor = 'white';
		this.backgroundImage = null;
		this.elements = [];
	}

	insertElement(elemet){
		elemet.setPainter(this);
		this.elements.push(elemet);
		this.repaint();
	}

	repaint(){
		let context=this.context;
		context.clearRect(0,0,this.width,this.height);
		if(this.backgroundColor){
			context.fillStyle = this.backgroundColor;
			context.fillRect(0,0,this.width,this.height);
		}
		if (this.backgroundImage) {
			context.drawImage(this.backgroundImage,0,0,this.width,this.height);
		}
		for (let i = 0; i < this.elements.length; i++) {
			let element = this.elements[i];
			element.paint();
		};
	}


}

class DrawableElement {
	constructor(x,y,w,h,fill='',stroke=''){
		this.x=x;
		this.y=y;
		this.width=w;
		this.height=h;
		this.fill=fill;
		this.stroke=stroke;
	}

	setPainter(painter){
		this.painter = painter;
	}

	paint(){
		let context = this.painter.context;
		context.setTransform(1, 0, 0, 1, 0, 0);
		context.translate(this.x, this.y);
		context.fillStyle= this.fill;
		context.strokeStyle= this.stroke;
	}
}

class Rectangle extends DrawableElement {
	constructor(x,y,w,h,fill,stroke){
		super(x,y,w,h,fill,stroke);
	}

	paint(){
		super.paint();
		let context = this.painter.context;
		if(this.fill)
			context.fillRect(0,0,this.width,this.height);
		if(this.stroke)
			context.strokeRect(0,0,this.width,this.height);
	}
}