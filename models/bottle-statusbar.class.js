class BottleBar extends DrawableObject {

	setBottlebarInterval;
	
	IMAGES_BOTTLEBAR = [
		'img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/0.png',
		'img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/20.png',
		'img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/40.png',
		'img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/60.png',
		'img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/80.png',
		'img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/100.png',
	];

	constructor() {
		super().loadImage(this.IMAGES_BOTTLEBAR[0]);
		this.loadImages(this.IMAGES_BOTTLEBAR);
		this.x = 20;
		this.y = 100;
		this.width = 200;
		this.height = 60;
		this.setBottlebar();
	}

	setBottlebar() {
		this.setBottlebarInterval = setInterval(() => {
			if (world.collectedBottles.length > 1) {
				super.setBar(world.collectedBottles.length, this.IMAGES_BOTTLEBAR);
			} else if (world.collectedBottles.length === 1) {
				super.setBar(1, [this.IMAGES_BOTTLEBAR[1]]);
			} else {
				super.setBar(1, [this.IMAGES_BOTTLEBAR[0]]);
			}
		}, 100);
		allIntervals.push(this.setBottlebarInterval);
	}
	

	updateBottleBarStatus() {
		if (world && world.collectedBottles) {
			super.setBar(world.collectedBottles.length, this.IMAGES_BOTTLEBAR);
		}
	}

	clearBottleBarInterval() {
		if (this.setBottlebarInterval) {
			clearInterval(this.setBottlebarInterval);
		}
	}
}
