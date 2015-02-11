class CanvasElement{
	constructor(el){
		this.canvas = el;
		this.context= el.getContext('2d');
		this.width = el.width;
		this.height= el.height;
		this.backgroundColor = 'white';
		this.backgroundImage = null;
		this.elements = [];
		this._hitting=0;
		this.selectedElement = null;
		this.deltaX=0;
		this.deltaY=0;
	}

	insertElement(elemet){
		elemet.setPainter(this);
		this.elements.push(elemet);
		this.repaint();
	}

	removeElement(element){
		let index = this.elements.indexOf(element);
        if (index > -1) this.elements.splice(index, 1);
        this.repaint();
	}

	EachElement(callback){
		if(!callback)return;
		for (let i = 0; i < this.elements.length; i++) {
			callback(this.elements[i]);
		};
	}

	clearSelection(){
		this.EachElement(function (element) {
			element.selected=false;
		});
		this.selected=null;
	}

	repaint(){
		let context=this.context;

		

		if(this.backgroundColor){
			context.fillStyle = this.backgroundColor;
			context.fillRect(0,0,this.width,this.height);
		}
		if (this.backgroundImage) {
			context.drawImage(this.backgroundImage,0,0,this.width,this.height);
		}

		context.clearRect(0, 0, this.width, this.height);
		context.save();
		context.setTransform(1, 0, 0, 1, 0, 0);
		context.clearRect(0, 0, this.width, this.height);
		context.restore();
		
		this.EachElement(function (element) {
			element.paint();
			if(element.selected)
				element.paintHandle();
		});
		
		
	}

	hit(x,y,state,control,shift,alt,meta){
		switch(state){
			case 1: //mouse down
				this.hitStart(x,y,control,shift,alt,meta);
				this._hitting=true;
				break;
			case 2://mouse move
				if(!this._hitting)return;
				this.hitting(x,y,control,shift,alt,meta);
				break;
			case 3://mouse up
				this._hitting=false;
				this.hitEnd(x,y,control,shift,alt,meta);
				break;
		}
	}

	hitStart(x,y,control,shift,alt,meta){
		console.log('hit start');
		this.clearSelection();
		for (let i = this.elements.length-1; i >=0; i--) {
			let element=this.elements[i];
			if(element.hitTest(x,y)){
				element.selected=true;
				this.selected=element;
				this.deltaX=element.x - x;
				this.deltaY=element.y - y;
				break;
			}
		}
		this.repaint();
	}

	hitting(x,y,control,shift,alt,meta){
		console.log('hit continues..');
		if(this.selected){
			this.selected.x = x + this.deltaX;
			this.selected.y = y + this.deltaY;
			this.repaint();
		}
	}

	hitEnd(x,y,control,shift,alt,meta){
		console.log('hit done');
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
		this.selected = false;
		this.angle = 0;
	}

	setPainter(painter){
		this.painter = painter;
	}

	hitTest(x,y){
		x-=this.x;
		y-=this.y;

		let teta = this.angle * Math.PI / 180;
        let rx = x * Math.cos(-teta) - y * Math.sin(-teta);
        let ry = x * Math.sin(-teta) + y * Math.cos(-teta);

		return (rx>0 && ry>0 && rx<this.width && ry < this.height);
	}

	paint(){
		let context = this.painter.context;
		context.setTransform(1, 0, 0, 1, 0, 0);
		context.translate(this.x, this.y);
		if(this.angle != 0)context.rotate(this.angle * Math.PI / 180);
		context.fillStyle= this.fill;
		context.strokeStyle= this.stroke;
		
	}

	paintHandle(){
		let context = this.painter.context;
		context.strokeStyle = 'rgba(255,0,0,.5)';
		context.fillStyle = 'rgba(255,0,0,.7)';
		context.strokeRect(-5,-5,this.width+10,this.height+10);
		context.fillRect(-5,-5,10,10);
		context.fillRect(this.width-5,-5,10,10);
		context.fillRect(-5,this.height-5,10,10);
		context.fillRect(this.width-5,this.height-5,10,10);
		context.strokeStyle = "";
		context.fillStyle = "";
	}


    sendToBack(){
        let elements = this.painter.elements;
        for (let i = 0; i <elements.length;i++) {
            let prevelement = elements[i]
            i++; if (i >= elements.length) break;
            let element = elements[i];
      
            if (element == this) {
                elements[i] = prevelement;
                elements[i - 1] = element;
                this.painter.repaint();
                break;
            }
        }; 
    }
    
    bringToFront(){
        let elements = this.painter.elements;
        for (let i = elements.length - 1; i >= 0;) {
            let prevelement = elements[i]
            i--; if (i < 0) break;
            let element = elements[i];
      
            if (element == this) {
                elements[i] = prevelement;
                elements[i + 1] = element;
                this.painter.repaint();
                break;
            }
        };    
    }
    
    remove(){
        this.painter.removeElement(this);
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