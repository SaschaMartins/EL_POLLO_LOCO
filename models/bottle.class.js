class Bottle extends MovableObject {
	
	width = 70;
	height = 70;
	offset = {
		top: 10,
		bottom: 10,
		left: 20,
		right: 20,
	};

	BOTTLE_IMAGE = ["img/6_salsa_bottle/2_salsa_bottle_on_ground.png"];

	constructor() {
		super().loadImage(this.BOTTLE_IMAGE[0]);
        this.x = 100 + Math.random() * 4 * 650;
        this.y = 360;
    
	}
}
