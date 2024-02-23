/**
 * Class representing the game world, including all characters, objects, and the game state.
 */
class World {
	character = new Character();
	endboss = new Endboss();
	healthBar = new HealthBar();
	bottleBar = new BottleBar();
	endbossBar = new EndbossBar();
	endbossBarHeart = new EndbossBarHeart();
	coinBar = new CoinBar();
	background_sound = new Audio('audio/music.mp3');
	coin_sound = new Audio('audio/coin.mp3');
	broken_bottle_sound = new Audio('audio/broken-bottle.mp3');
	kill_chicken_sound = new Audio('audio/chicken.mp3');
	throwableObjects = [];
	collectedBottles = [];
	brockenBottle = [];
	collectedCoins = [];

	/**
	 * The canvas rendering context.
	 * @type {CanvasRenderingContext2D}
	 */
	ctx;

	/**
	 * The canvas element.
	 * @type {HTMLCanvasElement}
	 */
	canvas;

	/**
	 * The keyboard input handler.
	 * @type {Keyboard}
	 */
	keyboard;

	collisionTimepassed;
	lastCollision;
	camera_x = 0;
	muted = false;
	level = level1;

	/**
	 * Create a new World instance.
	 * @param {HTMLCanvasElement} canvas - The canvas element to draw the game on.
	 * @param {Keyboard} keyboard - The keyboard input handler.
	 */
	constructor(canvas, keyboard) {
		this.ctx = canvas.getContext('2d');
		this.canvas = canvas;
		this.keyboard = keyboard;
		this.draw();
		this.setWorld();
		this.run();
		this.collectObjects();
		this.loadSounds();
	}

	/**
	 * Loads all necessary sounds for the game.
	 */
	loadSounds() {
		let soundsToLoad = [
			'audio/music.mp3',
			'audio/coin.mp3',
			'audio/broken-bottle.mp3',
			'audio/chicken.mp3'
		];

		this.sounds = {};

		soundsToLoad.forEach(soundFile => {
			let sound = new Audio(soundFile);
			sound.oncanplaythrough = () => {
				this.sounds[soundFile] = sound;
			};
		});
	}

	/**
	 * Plays a specified sound file.
	 * @param {string} soundFile - The file path of the sound to play.
	 */
	playSound(soundFile) {
		if (this.sounds[soundFile]) {
			this.sounds[soundFile].play();
		} else {
			console.error('Sound ' + soundFile + ' wurde nicht vollständig geladen.');
		}
	}

	/**
	 * Checks and toggles the mute state based on keyboard input.
	 */
	isMuted() {
		this.isMutedIntervall = setInterval(() => {
			if (keyboard.MUTE == false) {
				this.muted = false;
			} else if (keyboard.MUTE == true) {
				this.muted = true;
			}
		}, 1000 / 60);
		allIntervals.push(this.isMutedIntervall);
	}

	/**
	 * Checks for object collection such as coins and bottles.
	 */
	collectObjects() {
		this.collectObjectsInterval = setInterval(() => {
			this.checkCollectCoin();
			this.checkCollectBottle();
			this.checkCollisionThrowObject();
			this.checkCollisions();
		}, 1000 / 50);
		allIntervals.push(this.collectObjectsInterval);
	}

	/**
	 * Checks if the character has collected a coin.
	 */
	checkCollectCoin() {
		this.level.coins.forEach((coin, indexCoins) => {
			if (this.character.isColliding(coin)) {
				if (this.muted == false) {
					this.coin_sound.play();
					this.coin_sound.volume = 0.2;
				}
				this.collectedCoins.push(coin);
				this.level.coins.splice(indexCoins, 1);
			}
		});
	}

	/**
	 * Checks if the character has collected a bottle.
	 */
	checkCollectBottle() {
		this.level.bottles.forEach((bottle, indexBottles) => {
			if (this.character.isColliding(bottle)) {
				this.collectedBottles.push(bottle);
				this.level.bottles.splice(indexBottles, 1);
			}
		});
	}

	/**
	 * Sets the world reference for the character.
	 */
	setWorld() {
		this.character.world = this;
	}

	/**
	 * Runs the main game loop with necessary checks.
	 */
	run() {
		this.runInterval = setInterval(() => {
			this.checkThrowObjects();
			this.isMuted();
			this.backgroundMusic();
			this.checkGameEnd();
		}, 150);
		allIntervals.push(this.runInterval);
	}

	/**
	 * Plays the background music based on the mute state.
	 */
	backgroundMusic() {
		if (this.muted == false && this.background_sound.paused) {
			this.background_sound.play();
			this.background_sound.volume = 0.03;
		} else if (this.muted == true && !this.background_sound.paused) {
			this.background_sound.pause();
		}
	}

	/**
	 * Checks if the character can throw a bottle and handles the throw.
	 */
	checkThrowObjects() {
		if (this.pressEnterAndArrayLength()) {
			this.throwBottle();
		}
	}

	/**
	 * Handles the throwing of a bottle by the character.
	 */
	throwBottle() {
		let bottle = new ThrowableObjects(this.character.x + 10, this.character.y + 100);
		this.throwableObjects.push(bottle);
	}

	/**
	 * Checks if the ENTER key is pressed and if there are bottles available to throw.
	 * @returns {boolean} True if ENTER is pressed and there are bottles to throw.
	 */
	pressEnterAndArrayLength() {
		return this.keyboard.ENTER && this.collectedBottles.length > 0;
	}

	/**
	 * Checks for collisions between throwable objects and enemies or the ground.
	 */
	checkCollisionThrowObject() {
		this.throwableObjects.forEach((bottle, indexBottle) => {
			this.level.enemies.forEach((enemy, indexEnemy) => {
				if (this.bottleHitsGround(indexBottle)) {
					this.setCollidingTime();
					this.throwableObjects[indexBottle].splashAnimation();
					this.brockenBottleSplice();
				}
				if (this.bottleHitsEnemy(enemy, indexBottle)) {
					this.setCollidingTime();
					this.level.enemies[indexEnemy].hit();
					this.throwableObjects[indexBottle].splashAnimation();
					this.brockenBottleSplice();
				}
			});
		});
	}

	/**
	 * Handles the logic when a bottle breaks after hitting the ground.
	 */
	brockenBottleSplice() {
		this.brokenBottleSound();
		setTimeout(() => {
			this.throwableObjects.shift();
		}, 500);
	}

	/**
	 * Checks if a bottle hits an enemy.
	 * @param {Enemy} enemy - The enemy to check collision with.
	 * @param {number} indexBottle - The index of the bottle in the throwableObjects array.
	 * @returns {boolean} True if the bottle hits the enemy.
	 */
	bottleHitsEnemy(enemy, indexBottle) {
		return this.throwableObjects[indexBottle].isColliding(enemy);
	}

	/**
	 * Checks if a bottle hits the ground.
	 * @param {number} indexBottle - The index of the bottle in the throwableObjects array.
	 * @returns {boolean} True if the bottle hits the ground.
	 */
	bottleHitsGround(indexBottle) {
		return this.throwableObjects[indexBottle].y > 330 && this.throwableObjects[indexBottle].y < 370;
	}

	/**
	 * Sets the time of the last collision.
	 */
	setCollidingTime() {
		this.lastCollision = new Date().getTime();
	}

	/**
	 * Checks if a collision occurred within the last second.
	 * @returns {boolean} True if a collision occurred within the last second.
	 */
	checkFirstCollision() {
		let collisionTimepassed = new Date().getTime() - this.lastCollision;
		return collisionTimepassed < 1000;
	}

	/**
	 * Plays the sound of a breaking bottle if a collision has occurred.
	 */
	brokenBottleSound() {
		if (this.checkFirstCollision()) {
			if (this.muted == false) {
				this.broken_bottle_sound.play();
			}
			this.broken_bottle_sound.loop = false;
			this.broken_bottle_sound.volume = 0.5;
		} else {
			if (muted == false) {
				this.broken_bottle_sound.pause();
			}
		}
	}

	/**
	 * Checks for collisions between the character and enemies.
	 */
	checkCollisions() {
		this.checkCollisionsIntervall = setInterval(() => {
			this.level.enemies.forEach((enemy, indexEnemy) => {
				if (this.aboutGroundCollideEnemies(enemy, indexEnemy)) {
					this.killingHeadJump(indexEnemy);
					this.level.enemies[indexEnemy].energy = 0;
				} else if (this.collideEnemy(enemy, indexEnemy)) {
					this.character.hit();
					this.healthBar.setPercentage(this.character.energy);
				}
			});
		}, 50);
		allIntervals.push(this.checkCollisionsIntervall);
	}

	/**
	 * Checks if the character collides with an enemy.
	 * @param {Enemy} enemy - The enemy to check collision with.
	 * @param {number} indexEnemy - The index of the enemy in the enemies array.
	 * @returns {boolean} True if the character collides with the enemy.
	 */
	collideEnemy(enemy, indexEnemy) {
		return this.character.isColliding(enemy) && enemy.energy > 0;
	}

	/**
	  * Determines if the character is above ground, colliding with an enemy, and not colliding with the endboss.
	  * @param {Enemy} enemy - The enemy to check for collision.
	* @param {number} indexEnemy - The index of the enemy in the enemies array.
	  * @returns {boolean} True if the character is above ground and colliding with a non-endboss enemy.
	  */
	aboutGroundCollideEnemies(enemy, indexEnemy) {
		return (
			this.character.isAboveGround() &&
			this.character.isColliding(enemy) &&
			this.isNotEndboss(enemy, indexEnemy) &&
			this.level.enemies[indexEnemy].energy > 1 &&
			this.character.y < 200
		);
	}

	/**
	  * Determines if the specified enemy is not the endboss.
	  * @param {Enemy} enemy - The enemy to check.
	  * @returns {boolean} True if the enemy is not the endboss.
	  */
	isNotEndboss(enemy) {
		if (enemy == this.level.enemies[6]) {
			return false;
		} else {
			return true;
		}
	}

	/**
	  * Executes a head jump kill on an enemy if the enemy has more than one energy point.
	  * @param {number} indexEnemy - The index of the enemy in the enemies array.
	  */
	killingHeadJump(indexEnemy) {
		if (this.level.enemies[indexEnemy].energy > 1) {
			this.character.headJump();
		}
	}

	/**
	  * Draws all game objects to the canvas and updates the game state.
	  */
	draw() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.ctx.translate(this.camera_x, 0);
		this.addObjectsToMap(this.level.backgroundObjects);
		this.addObjectsToMap(this.level.clouds);
		this.addObjectsToMap(this.level.coins);
		this.addObjectsToMap(this.level.bottles);
		this.addObjectsToMap(this.level.enemies);
		this.addObjectsToMap(this.throwableObjects);
		this.addToMap(this.character);
		this.ctx.translate(-this.camera_x, 0);
		this.addToMap(this.healthBar);
		this.addToMap(this.endbossBar);
		this.addToMap(this.endbossBarHeart);
		this.addToMap(this.bottleBar);
		this.addToMap(this.coinBar);
		let self = this;
		requestAnimationFrame(function () {
			self.draw();
		});
	}

	/**
	  * Adds an array of objects to the game map.
	  * @param {MovableObject[]} objects - The array of objects to add to the map.
	  */
	addObjectsToMap(objects) {
		objects.forEach((obj) => {
			this.addToMap(obj);
		});
	}

	/**
	  * Adds a single movable object to the game map.
	  * @param {MovableObject} movableObject - The object to add to the map.
	  */
	addToMap(movableObject) {
		if (movableObject.otherDirection) {
			this.flipImage(movableObject);
		}
		movableObject.draw(this.ctx);

		if (movableObject.otherDirection) {
			this.flipImageBack(movableObject);
		}
	}

	/**
	  * Flips the image of a movable object horizontally.
	  * @param {MovableObject} movableObject - The object to flip.
	  */
	flipImage(movableObject) {
		this.ctx.save();
		this.ctx.translate(movableObject.width, 0);
		this.ctx.scale(-1, 1);
		movableObject.x = movableObject.x * -1;
	}

	/**
	 * Restores the image of a flipped movable object to its original orientation.
	 * @param {MovableObject} movableObject - The object to restore.
	 */
	flipImageBack(movableObject) {
		movableObject.x = movableObject.x * -1;
		this.ctx.restore();
	}

	/**
	 * Resets the game to its initial state.
	 */
	clearRect() {
		let context = canvas.getContext('2d');
		context.clearRect(0, 0, canvas.width, canvas.height);
	}

	/**
	 * Checks if the game has ended, either by defeating the endboss or by the character running out of energy.
	 */
	checkGameEnd() {
		this.checkGameEndInterval = setInterval(() => {
			if (this.level.enemies[6].energy <= 0) {
				gameWinnerScreen(this.muted);
			} else if (world.character.energy <= 0) {
				gameOverScreen(this.muted);
			}
		}, 200);
		allIntervals.push(this.checkGameEndInterval);
	}

	/**
	 * Resets the game to its initial state.
	 */
	resetGame() {
		this.throwableObjects = [];
		this.collectedBottles = [];
		this.collectedCoins = [];
	}
}
