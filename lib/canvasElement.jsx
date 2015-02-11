class CanvasElement{
	constructor(el){
		this.canvas = el;
		this.context= el.getContext('2d');
		this.width = el.width;
		this.height= el.height;
		this.backgroundColor = 'white';
		this.backgroundImage = null;
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

	}
}