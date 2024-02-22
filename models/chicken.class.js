class Chicken extends MovableObject {
	
	y = 340;
	width = 80;
	height = 80;
	isChickenDeath = false;
	energy = 2;
	offset = {
		top: 5,
		bottom: 5,
		left: 25,
		right: 25,
	};

	CHICKEN_WALKING = [
		"img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
		"img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
		"img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
	];

	CHICKEN_DEAD = ["img/3_enemies_chicken/chicken_normal/2_dead/dead.png", "img/3_enemies_chicken/chicken_normal/2_dead/dead.png"];
	

	
	constructor(xPosition) {
		super().loadImage(this.CHICKEN_WALKING[0]);
		this.loadImages(this.CHICKEN_WALKING);
		this.loadImages(this.CHICKEN_DEAD);
		this.x = xPosition || 600 + Math.random() * 800; 
		this.speed = 0.7 + Math.random() * 0.5;
		this.initializeAnimation();
		this.chickenMovement();
	}

	
	chickenMovement() {
		this.chickenMovementInterval = setInterval(() => {
			if (!this.isDead()) {
				this.moveLeft();
			} else this.playDeathSound();
		}, 1000 / 60);
		allIntervals.push(this.chickenMovementInterval);
	}

	
	playDeathSound() {
		if (this.isChickenDeath == false) {
			if (world.muted == false) {
				world.kill_chicken_sound.play();
				world.kill_chicken_sound.volume = 0.2;
			}
			this.isChickenDeath = true;
		}
	}

	
	initializeAnimation() {
		this.chickenAnimateInterval = setInterval(() => {
			if (this.isDead()) {
				this.playAnimation(this.CHICKEN_DEAD);
			} else {
				this.playAnimation(this.CHICKEN_WALKING);
			}
		}, 100);
			allIntervals.push(this.chickenAnimateInterval);
	}
}
