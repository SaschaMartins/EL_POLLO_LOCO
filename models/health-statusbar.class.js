class HealthBar extends DrawableObject {

	IMAGES_HEALTH = [
		"img/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png",
		"img/7_statusbars/1_statusbar/2_statusbar_health/blue/20.png",
		"img/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png",
		"img/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png",
		"img/7_statusbars/1_statusbar/2_statusbar_health/blue/80.png",
		"img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png",
	];
	
	gameOver = new Audio("audio/game-over.mp3");
	percentage = 500;

	
	constructor() {
		super();
		this.loadImages(this.IMAGES_HEALTH);
		this.x = 20;
		this.y = 0;
		this.width = 200;
		this.height = 60;
		this.setPercentage(1000);
		
	}

	setPercentage(percentage) {
		this.percentage = percentage; 
		let path = this.IMAGES_HEALTH[this.resolveImageIndex()];
		this.img = this.imageCache[path];
	}

	resolveImageIndex() {
		if (this.percentage == 1000) {
			return 5;
		} else if (this.percentage > 800) {
			return 4;
		} else if (this.percentage > 600) {
			return 3;
		} else if (this.percentage > 400) {
			return 2;
		} else if (this.percentage > 200) {
			return 1;
		} else {
			return 0;
		}
	}
}
