class EndbossBarHeart extends DrawableObject {

	IMAGES_BOSSHEART = ["img/7_statusbars/3_icons/icon_health_endboss.png"];

	constructor() {
		super().loadImage(this.IMAGES_BOSSHEART[0]); 
		this.x = 430;
		this.y = 5;
		this.width = 0;
		this.height = 80;
	}
}
