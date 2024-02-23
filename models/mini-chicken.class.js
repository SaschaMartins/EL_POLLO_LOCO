/**
 * Represents a smaller, weaker variant of a chicken enemy in the game.
 * Inherits from MovableObject to utilize common movement and animation functionality.
 */
class miniChicken extends MovableObject {
	y = 365;
	width = 50;
	height = 50;
	energy = 2;

	/**
     * A flag indicating whether the mini chicken has played its death sound.
     * @type {boolean}
     */
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

	/**
     * Constructs a miniChicken object and initializes its properties.
     * @param {number} [xPosition=300] - The initial x position of the mini chicken. Defaults to 300 with a random offset.
     */
	constructor(xPosition) {
		super().loadImage(this.CHICKEN_SMALL_WALKING[0]);
		this.loadImages(this.CHICKEN_SMALL_WALKING);
		this.loadImages(this.CHICKEN_SMALL_DEAD);
		this.x = xPosition || 300 + Math.random() * 1000;
		this.speed = 0.7 + Math.random() * 0.5;
		this.animate();
		this.minichickenMovement();
	}

	/**
     * Initiates the mini chicken's leftward movement and handles its death sound.
     */
	minichickenMovement() {
		this.minichickenMovementInterval = setInterval(() => {
			if (!this.isDead()) {
				this.moveLeft();
			} else this.playDeathSound();
		}, 1000 / 60);
		allIntervals.push(this.minichickenMovementInterval);
	}


	/**
     * Plays the mini chicken's death sound once upon death.
     */
	playDeathSound() {
		if (this.isChickenDeath == false) {
			if (world.muted == false) {
				world.kill_chicken_sound.play();
				world.kill_chicken_sound.volume = 0.2;
			}
			this.isChickenDeath = true;
		}
	}

	/**
     * Sets up the animation interval for the mini chicken, cycling through walking or death frames.
     */
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
