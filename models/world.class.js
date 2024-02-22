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
	ctx;
	canvas;
	keyboard;
	collisionTimepassed;
	lastCollision;
	camera_x = 0;
	muted = false;
	level = level1;
	

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

    playSound(soundFile) {
        if (this.sounds[soundFile]) {
            this.sounds[soundFile].play();
        } else {
            console.error('Sound ' + soundFile + ' wurde nicht vollständig geladen.');
        }
    }


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

	collectObjects() {
		this.collectObjectsInterval = setInterval(() => {
			this.checkCollectCoin();
			this.checkCollectBottle();
			this.checkCollisionThrowObject();
			this.checkCollisions();
		}, 1000 / 50);
		allIntervals.push(this.collectObjectsInterval);
	}

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

	checkCollectBottle() {
		this.level.bottles.forEach((bottle, indexBottles) => {
			if (this.character.isColliding(bottle)) {
				this.collectedBottles.push(bottle);
				this.level.bottles.splice(indexBottles, 1);
			}
		});
	}

	setWorld() {
		this.character.world = this;
	}

	run() {
		this.runInterval = setInterval(() => {
			this.checkThrowObjects();
			this.isMuted();
			this.backgroundMusic();
			this.checkGameEnd();
		}, 150);
		allIntervals.push(this.runInterval);
	}

	backgroundMusic() {
		if (this.muted == false && this.background_sound.paused) {
			this.background_sound.play();
			this.background_sound.volume = 0.03;
		} else if (this.muted == true && !this.background_sound.paused) {
			this.background_sound.pause();
		}
	}
	

	checkThrowObjects() {
		if (this.pressEnterAndArrayLength()) {
			this.throwBottle();
		}
	}

	throwBottle() {
		let bottle = new ThrowableObjects(this.character.x + 10, this.character.y + 100);
		this.throwableObjects.push(bottle);
	}

	pressEnterAndArrayLength() {
		return this.keyboard.ENTER && this.collectedBottles.length > 0;
	}

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

	brockenBottleSplice() {
		this.brokenBottleSound();
		setTimeout(() => {
			this.throwableObjects.shift();
		}, 500);
	}

	bottleHitsEnemy(enemy, indexBottle) {
		return this.throwableObjects[indexBottle].isColliding(enemy);
	}

	bottleHitsGround(indexBottle) {
		return this.throwableObjects[indexBottle].y > 330 && this.throwableObjects[indexBottle].y < 370;
	}

	setCollidingTime() {
		this.lastCollision = new Date().getTime();
	}

	checkFirstCollision() {
		let collisionTimepassed = new Date().getTime() - this.lastCollision;
		return collisionTimepassed < 1000;
	}

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

	collideEnemy(enemy, indexEnemy) {
		return this.character.isColliding(enemy) && enemy.energy > 0;
	}

	aboutGroundCollideEnemies(enemy, indexEnemy) {
		return (
			this.character.isAboveGround() &&
			this.character.isColliding(enemy) &&
			this.isNotEndboss(enemy, indexEnemy) &&
			this.level.enemies[indexEnemy].energy > 1 &&
			this.character.y < 200
		);
	}

	isNotEndboss(enemy) {
		if (enemy == this.level.enemies[6]) {
			return false;
		} else {
			return true;
		}
	}

	killingHeadJump(indexEnemy) {
		if (this.level.enemies[indexEnemy].energy > 1) {
			this.character.headJump();
		}
	}

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

	addObjectsToMap(objects) {
		objects.forEach((obj) => {
			this.addToMap(obj);
		});
	}

	addToMap(movableObject) {
		if (movableObject.otherDirection) {
			this.flipImage(movableObject);
		}
		movableObject.draw(this.ctx);

		if (movableObject.otherDirection) {
			this.flipImageBack(movableObject);
		}
	}

	flipImage(movableObject) {
		this.ctx.save();
		this.ctx.translate(movableObject.width, 0);
		this.ctx.scale(-1, 1);
		movableObject.x = movableObject.x * -1;
	}

	flipImageBack(movableObject) {
		movableObject.x = movableObject.x * -1;
		this.ctx.restore();
	}

	clearRect() {
		let context = canvas.getContext('2d');
		context.clearRect(0, 0, canvas.width, canvas.height);
	}

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

	resetGame() {
		this.throwableObjects = [];
		this.collectedBottles = [];
		this.collectedCoins = [];
	}
}
