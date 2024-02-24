/**
 * Represents the endboss character in the game.
 * @extends MovableObject
 */
class Endboss extends MovableObject {

	y = 60;
	width = 400;
	height = 400;
	energy = 150;
	offset = {
		top: 70,
		bottom: 10,
		left: 60,
		right: 30,
	};

	IMAGES_ALERTA = [
		"img/4_enemie_boss_chicken/2_alert/G5.png",
		"img/4_enemie_boss_chicken/2_alert/G6.png",
		"img/4_enemie_boss_chicken/2_alert/G7.png",
		"img/4_enemie_boss_chicken/2_alert/G8.png",
		"img/4_enemie_boss_chicken/2_alert/G9.png",
		"img/4_enemie_boss_chicken/2_alert/G10.png",
		"img/4_enemie_boss_chicken/2_alert/G11.png",
		"img/4_enemie_boss_chicken/2_alert/G12.png",
	];
	IMAGES_WALKING = [
		"img/4_enemie_boss_chicken/1_walk/G1.png",
		"img/4_enemie_boss_chicken/1_walk/G2.png",
		"img/4_enemie_boss_chicken/1_walk/G3.png",
		"img/4_enemie_boss_chicken/1_walk/G4.png",
	];

	IMAGES_ATTACK = [
		"img/4_enemie_boss_chicken/3_attack/G13.png",
		"img/4_enemie_boss_chicken/3_attack/G14.png",
		"img/4_enemie_boss_chicken/3_attack/G15.png",
		"img/4_enemie_boss_chicken/3_attack/G16.png",
		"img/4_enemie_boss_chicken/3_attack/G17.png",
		"img/4_enemie_boss_chicken/3_attack/G18.png",
		"img/4_enemie_boss_chicken/3_attack/G19.png",
		"img/4_enemie_boss_chicken/3_attack/G20.png",
	];

	IMAGES_HURT = [
		"img/4_enemie_boss_chicken/4_hurt/G21.png",
		"img/4_enemie_boss_chicken/4_hurt/G22.png",
		"img/4_enemie_boss_chicken/4_hurt/G23.png",
	];

	ENDBOSS_DEAD = [
		"img/4_enemie_boss_chicken/5_dead/G24.png",
		"img/4_enemie_boss_chicken/5_dead/G25.png",
		"img/4_enemie_boss_chicken/5_dead/G26.png",
	];
	speed = 1.5;
	alertaPlayed = false;
	isAttacking = false;
	endbossAnimateInterval = null;
	hit_sound = new Audio('audio/hitmarker.mp3');
	hitSoundTimeout = null;
	hitmarkerImage = new Image();
	showHitmarker = false;
	hitmarkerTimeout = null;
	hitmarkerWidth = 50;
	hitmarkerHeight = 50;
	/**
	 * Creates an instance of the Endboss class.
	 */
	constructor() {
		super().loadImage(this.IMAGES_ALERTA[0]);
		this.loadImages(this.IMAGES_WALKING);
		this.loadImages(this.IMAGES_ALERTA);
		this.loadImages(this.IMAGES_ATTACK);
		this.loadImages(this.IMAGES_HURT);
		this.loadImages(this.ENDBOSS_DEAD);
		this.hitmarkerImage.src = 'img/11_hitmarker/hitmarker.png';
		this.x = 2300;
		this.animate();
	}

	/**
	 * Controls the animation state of the endboss, changing its behavior based on its current state.
	 */
	animate() {
		this.endbossAnimateInterval = setInterval(() => {
			if (this.energy <= 0) {
				this.speed = 0;
				this.playAnimation(this.ENDBOSS_DEAD);
			} else if (this.isAttacking) {
				this.playAnimation(this.IMAGES_ATTACK);
			} else if (!this.alertaPlayed) {
				this.playAnimation(this.IMAGES_ALERTA);
				if (this.currentImage % this.IMAGES_ALERTA.length === 0) {
					this.alertaPlayed = true;
					this.movement();
				}
			} else if (this.checkDistancePepeEndboss() || this.checkIfEndbossMoved()) {
				this.playAnimation(this.IMAGES_WALKING);
				this.endbossBarSize();
			}
		}, 300);
		allIntervals.push(this.endbossAnimateInterval);
	}

	/**
	 * Handles the endboss taking damage and triggers the attack animation.
	 */
	hit() {
		super.hit();
		this.handleHitEffects();
	}

	/**
	 * Handles the effects of the endboss being hit, such as playing sounds and showing hit markers.
	 */
	handleHitEffects() {
		if (this.energy > 0 && !this.isDead()) {
			this.isAttacking = true;

			this.playHitSound();
			this.showRandomHitmarker();

			setTimeout(() => {
				this.isAttacking = false;
			}, this.IMAGES_ATTACK.length * 300); // Zeit basierend auf der Anzahl der Angriffsbilder
		}
	}

	/**
	 * Plays the hit sound effect with a cooldown to prevent spamming.
	 */
	playHitSound() {
		if (!this.hitSoundTimeout) {
			this.hit_sound.play();
			this.hitSoundTimeout = setTimeout(() => {
				this.hitSoundTimeout = null;
			}, 1000);
		}
	}

	/**
 	* Displays a hit marker at a random position within the hitbox of the endboss.
 	* The hit marker is shown for a brief period before disappearing.
 	*/
	showRandomHitmarker() {
		if (!this.showHitmarker) {
			this.showHitmarker = true;
			const paddingWidth = this.width * 0.3;
			const paddingHeight = this.height * 0.3;
			this.hitmarkerX = this.x + this.offset.left + paddingWidth / 2 + Math.random() * (this.width - this.offset.left - this.offset.right - paddingWidth);
			this.hitmarkerY = this.y + this.offset.top + paddingHeight / 2 + Math.random() * (this.height - this.offset.top - this.offset.bottom - paddingHeight);
			clearTimeout(this.hitmarkerTimeout);
			this.hitmarkerTimeout = setTimeout(() => {
				this.showHitmarker = false;
			}, 500);
		}
	}

	/**
 	* Draws the endboss and the hit marker on the canvas.
 	* @param {CanvasRenderingContext2D} ctx - The 2D rendering context of the canvas on which to draw.
 	*/
	draw(ctx) {
		super.draw(ctx);
		if (this.showHitmarker) {
			ctx.drawImage(this.hitmarkerImage, this.hitmarkerX, this.hitmarkerY, this.hitmarkerWidth, this.hitmarkerHeight);
		}
	}

	/**
	 * Cleans up intervals and any other resources when the endboss is destroyed.
	 */
	destroy() {
		if (this.endbossAnimateInterval) {
			clearInterval(this.endbossAnimateInterval);
			const index = allIntervals.indexOf(this.endbossAnimateInterval);
			if (index > -1) {
				allIntervals.splice(index, 1);
			}
		}
	}

	/**
	 * Updates the size of the endboss's health bar based on its current health.
	 */
	endbossBarSize() {
		world.endbossBar.width = 250;
		world.endbossBarHeart.width = 80;
	}

	/**
	 * Checks if the character is too close to the endboss.
	 * @returns {boolean} True if the character is within a certain distance of the endboss, false otherwise.
	 */
	distanceTooClose() {
		world.endboss.x - world.character.x <= 150;
	}

	/**
	 * Sets up the movement behavior of the endboss, allowing it to move left under certain conditions.
	 */
	movement() {
		this.endbossMovementInverval = setInterval(() => {
			if (this.checkDistancePepeEndboss() || (this.checkIfEndbossMoved() && this.energy > 0)) {
				this.moveLeft();
			}
		}, 1000 / 60);
		allIntervals.push(this.endbossMovementInverval);
	}

	/**
	 * Checks if the character has reached a certain distance from the endboss.
	 * @returns {boolean} True if the character is beyond the specified distance, false otherwise.
	 */
	checkDistancePepeEndboss() {
		return world.character.x > 1950;
	}

	/**
	 * Checks if the endboss has moved from its original position or if its health is below a certain threshold.
	 * @returns {boolean} True if the endboss has moved or is low on health, false otherwise.
	 */
	checkIfEndbossMoved() {
		return world.endboss.x < 2300 || this.energy < 149;
	}
}
