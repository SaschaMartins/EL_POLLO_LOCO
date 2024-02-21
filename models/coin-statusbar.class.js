class CoinBar extends DrawableObject {
	
	IMAGES_COIN_BAR = [
		"img/7_statusbars/1_statusbar/1_statusbar_coin/orange/0.png",
		"img/7_statusbars/1_statusbar/1_statusbar_coin/orange/20.png",
		"img/7_statusbars/1_statusbar/1_statusbar_coin/orange/40.png",
		"img/7_statusbars/1_statusbar/1_statusbar_coin/orange/60.png",
		"img/7_statusbars/1_statusbar/1_statusbar_coin/orange/80.png",
		"img/7_statusbars/1_statusbar/1_statusbar_coin/orange/100.png",
	];

	constructor() {
		super().loadImage(this.IMAGES_COIN_BAR[0]);
		this.x = 20;
		this.y = 50;
		this.width = 200;
		this.height = 60;
		this.setCoinbar();
	}

	
	setCoinbar() {
		this.setCoinbarInterval = setInterval(() => {
			super.setBar(world.collectedCoins.length, this.IMAGES_COIN_BAR);
		}, 100);
		allIntervals.push(this.setCoinbarInterval);
	}
}
