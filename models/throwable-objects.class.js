class ThrowableObjects extends MovableObject {
	BOTTLE_ROTATION = [
		'img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
		'img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
		'img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
		'img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png',
	];
	BOTTLE_SPLASH = [
		'img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
		'img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
		'img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
		'img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
		'img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
		'img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png',
	];
	offset = {
		top: 5,
		bottom: 5,
		left: 5,
		right: 5,
	};

	constructor(x, y) {
		super().loadImage(this.BOTTLE_ROTATION[0]);
		this.loadImages(this.BOTTLE_ROTATION);
		this.loadImages(this.BOTTLE_SPLASH);
		this.x = x;
		this.y = y;
		this.height = 70;
		this.width = 70;
		this.throw();
	}

	throw() {
		if (this.hasBottlesAndLooksRight()) {
			this.throwRightAnimation();
			world.collectedBottles.splice(0, 1);
		}
		if (this.hasBottlesAndLooksLeft()) {
			this.throwLeftAnimation();
			world.collectedBottles.splice(0, 1);
		}
	}

	hasBottlesAndLooksRight() {
		return world.collectedBottles.length > 0 && !world.character.otherDirection;
	}

	hasBottlesAndLooksLeft() {
		return world.collectedBottles.length > 0 && world.character.otherDirection;
	}

	throwLeftAnimation() {
		this.throwLeftAnimationInterval1 = setInterval(() => {
			this.playAnimation(this.BOTTLE_ROTATION);
		}, 150);
		allIntervals.push(this.throwLeftAnimationInterval1);
		this.speedY = -18;
		this.applyGravaityOtherDirection();
		this.throwLeftAnimationInterval2 = setInterval(() => {
			this.x -= 5;
		}, 1000 / 60);
		allIntervals.push(this.throwLeftAnimationInterval2);
	}

	throwRightAnimation() {
		this.throwRightAnimationInterval1 = setInterval(() => {
			this.playAnimation(this.BOTTLE_ROTATION);
		}, 150);
		allIntervals.push(this.throwRightAnimationInterval1);
		this.speedY = 18;
		this.applyGravaity();
		this.throwRightAnimationInterval2 = setInterval(() => {
			this.x += 5;
		}, 1000 / 60);
		allIntervals.push(this.throwRightAnimationInterval2);
	}

	splashAnimation() {
		this.splashAnimationIntervall = setInterval(() => {
			this.playAnimation(this.BOTTLE_SPLASH);
		}, 5);
		allIntervals.push(this.splashAnimationIntervall);
	}
}
