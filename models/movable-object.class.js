/**
 * Represents a base class for all movable objects in the game.
 * This class provides common properties and methods for movement, animation, and collision detection.
 */
class MovableObject extends DrawableObject {
	/**
	 * The speed at which the object moves.
	 * @type {number}
	 */
	speed = 0.2;

	/**
	 * Indicates whether the object is moving in the opposite direction.
	 * @type {boolean}
	 */
	otherDirection = false;

	/**
	 * The vertical speed of the object used for jumping or falling.
	 * @type {number}
	 */
	speedY = 0;

	/**
	 * The acceleration due to gravity affecting the object's vertical speed.
	 * @type {number}
	 */
	acceleration = 2;

	/**
	 * Timestamp of the last time the object was hit.
	 * @type {number}
	 */
	lastHit = 0;

	// Sound effects for the object
	reJump_sound = new Audio('audio/rejump.mp3');
	hurt_sound = new Audio('audio/hurt.mp3');
	death_sound = new Audio('audio/death.mp3');

	energy = 1000;
	offset = {
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
	};

	/**
	 * Reduces the energy of the object when hit and plays the corresponding sound effects.
	 */
	hit() {
		const timeSinceLastHit = new Date().getTime() - this.lastHit;
		const timeThreshold = 1;

		if (timeSinceLastHit >= timeThreshold) {
			this.energy -= 1;
			if (this.energy < 0) {
				this.energy = 0;
				this.playDeathSound();
			} else {
				this.lastHit = new Date().getTime();
				this.playHurtSound();
			}
		}
	}

	/**
	 * Plays the hurt sound effect if the object is hurt.
	 */
	playHurtSound() {
		if (!world.muted && this.isHurtByCharacterCollision() && this.hurt_sound.paused) {
			this.hurt_sound.play();
		}
	}

	/**
	 * Determines if the object is currently hurt by a collision.
	 * @returns {boolean} True if the object is a Character and is hurt, false otherwise.
	 */
	isHurtByCharacterCollision() {
		return this instanceof Character && this.isHurt();
	}

	/**
	 * Plays the death sound effect for the object.
	 */
	playDeathSound() {
		if (!world.muted) {
			this.death_sound.play();
		}
	}

	/**
	 * Moves the object backwards as a result of a collision.
	 */
	hitsBack() {
		this.x -= 1;
		if (this.world.character.y >= 160) {
			this.speedY = 20;
		}
	}

	/**
	 * Handles the object's jump by setting its vertical speed.
	 */
	headJump() {
		if (world.muted == false) {
			this.reJump_sound.play();
			this.reJump_sound.volume = 0.2;
		}
		this.speedY = 10;
	}

	/**
	 * Determines if the object is currently hurt based on the last hit time.
	 * @returns {boolean} True if the object is hurt, false otherwise.
	 */
	isHurt() {
		let timepassed = new Date().getTime() - this.lastHit;
		timepassed = timepassed / 1000;
		return timepassed < 1;
	}

	/**
	 * Determines if the object is dead based on its energy level.
	 * @returns {boolean} True if the object is dead, false otherwise.
	 */
	isDead() {
		return this.energy <= 0;
	}

	/**
	 * Applies gravity to the object, affecting its vertical speed and position.
	 */
	applyGravaity() {
		this.applyGravaityInterval = setInterval(() => {
			if (this.isAboveGround() || this.speedY > 0) {
				this.y -= this.speedY;
				this.speedY -= this.acceleration;
			}
		}, 1000 / 25);
		allIntervals.push(this.applyGravaityInterval);
	}

	/**
 	* Applies gravity in the opposite direction to the object, affecting its vertical speed and position.
 	* This can be used for game mechanics where objects move upwards or are affected by inverse gravity.
 	*/
	applyGravaityOtherDirection() {
		this.applyGravaityOtherDirectionInterval = setInterval(() => {
			if (this.isAboveGround() || this.speedY < 0) {
				this.y += this.speedY;
				this.speedY += this.acceleration;
			}
		}, 1000 / 25);
		allIntervals.push(this.applyGravaityOtherDirectionInterval);
	}

	/**
	 * Checks if the object is above the ground.
	 * @returns {boolean} True if the object is above the ground, false otherwise.
	 */
	isAboveGround() {
		if (this instanceof ThrowableObjects) {
			return true;
		} else {
			return this.y < 170;
		}
	}

	/**
	 * Determines if the object is colliding with another movable object.
	 * @param {MovableObject} mo - The other movable object to check for collision.
	 * @returns {boolean} True if the objects are colliding, false otherwise.
	 */
	isColliding(mo) {
		return (
			this.x + this.width - this.offset.right > mo.x + mo.offset.left &&
			this.y + this.height - this.offset.bottom > mo.y + mo.offset.top &&
			this.x + this.offset.left < mo.x + mo.width - mo.offset.right &&
			this.y + this.offset.top < mo.y + mo.height - mo.offset.bottom
		); // B => T
	}

	/**
	 * Moves the object to the right by increasing its x position based on its speed.
	 */
	moveRight() {
		this.x += this.speed;
		this.otherDirection = false;
	}

	/**
	 * Moves the object to the left by decreasing its x position based on its speed.
	 */
	moveLeft() {
		this.x -= this.speed;
	}

	/**
	 * Cycles through a set of images to create an animation effect.
	 * @param {string[]} images - An array of image paths for the animation frames.
	 */
	playAnimation(images) {
		let i = this.currentImage % images.length;
		let path = images[i];
		this.img = this.imageCache[path];
		this.currentImage++;
	}

	/**
 	* Initiates a jump by setting the object's vertical speed to a positive value, causing it to move upwards.
 	*/
	jump() {
		this.speedY = 35;
	}
}
