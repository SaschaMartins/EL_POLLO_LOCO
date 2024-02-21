class Cloud extends MovableObject {
	
	y = 0;
	height = 480;
	width = 1440;
	
	constructor() {
		super().loadImage("img/5_background/layers/4_clouds/full.png");
		this.x = 10 + Math.random() * 2000; 
		this.initializeAnimation();
	}
	
	initializeAnimation() {
		this.cloudAnimateInterval = setInterval(() => {
				this.moveLeft();
		}, 1000/60);
	allIntervals.push(this.cloudAnimateInterval);
	}
}
