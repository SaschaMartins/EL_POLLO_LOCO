class miniChicken extends MovableObject {
	y = 365;
	width = 50;
	height = 50;
	energy = 2;
	isChickenDeath = false;
	offset = {
		top: 5,
		bottom: 5,
		left: 20,
		right: 20,
	};

	CHICKEN_SMALL_WALKING = [
		"img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
		"img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
		"img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
	];

	CHICKEN_SMALL_DEAD = ["img/3_enemies_chicken/chicken_small/2_dead/dead.png"];


	constructor() {
		super().loadImage(this.CHICKEN_SMALL_WALKING[0]);
		this.loadImages(this.CHICKEN_SMALL_WALKING);
		this.loadImages(this.CHICKEN_SMALL_DEAD);
		this.x = 300 + Math.random() * 1000;
		this.speed = 0.7 + Math.random() * 0.5;
		this.animate();
		this.minichickenMovement();
	}


	minichickenMovement() {
		this.minichickenMovementInterval = setInterval(() => {
			if (!this.isDead()) {
				this.moveLeft();
			} else this.playDeathSound();
		}, 1000 / 60);
		allIntervals.push(this.minichickenMovementInterval);
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


	animate() {
		this.minichickenAnimate = setInterval(() => {
			if (this.isDead()) {
				this.playAnimation(this.CHICKEN_SMALL_DEAD);
			} else {
				this.playAnimation(this.CHICKEN_SMALL_WALKING);
			}
		}, 100);
		allIntervals.push(this.minichickenAnimate);
	}
}
