class MovableObject extends DrawableObject {
	speed = 0.2;
	otherDirection = false;
	speedY = 0;
	acceleration = 2;
	lastHit = 0;
	reJump_sound = new Audio('audio/rejump.mp3');
	energy = 1000;
	offset = {
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
	};

	hit() {
		this.energy -= 1;
		if (this.energy < 0) {
			this.energy = 0;
		} else {
			this.lastHit = new Date().getTime();
		}
	}

	hitsBack() {
		this.x -= 1;
		if (this.world.character.y >= 160) {
			this.speedY = 20;
		}
	}

	headJump() {
		if (world.muted == false) {
			this.reJump_sound.play();
			this.reJump_sound.volume = 0.2;
		}
		this.speedY = 10;
	}

	isHurt() {
		let timepassed = new Date().getTime() - this.lastHit;
		timepassed = timepassed / 1000;
		return timepassed < 1;
	}

	isDead() {
		return this.energy <= 0;
	}

	applyGravaity() {
		this.applyGravaityInterval = setInterval(() => {
			if (this.isAboveGround() || this.speedY > 0) {
				this.y -= this.speedY;
				this.speedY -= this.acceleration;
			}
		}, 1000 / 25);
		allIntervals.push(this.applyGravaityInterval);
	}

	applyGravaityOtherDirection() {
		this.applyGravaityOtherDirectionInterval = setInterval(() => {
			if (this.isAboveGround() || this.speedY < 0) {
				this.y += this.speedY;
				this.speedY += this.acceleration;
			}
		}, 1000 / 25);
		allIntervals.push(this.applyGravaityOtherDirectionInterval);
	}

	isAboveGround() {
		if (this instanceof ThrowableObjects) {
			return true;
		} else {
			return this.y < 170;
		}
	}

	isColliding(mo) {
		return (
			this.x + this.width - this.offset.right > mo.x + mo.offset.left &&
			this.y + this.height - this.offset.bottom > mo.y + mo.offset.top &&
			this.x + this.offset.left < mo.x + mo.width - mo.offset.right &&
			this.y + this.offset.top < mo.y + mo.height - mo.offset.bottom
		); // B => T
	}
	

	moveRight() {
		this.x += this.speed;
		this.otherDirection = false;
	}

	moveLeft() {
		this.x -= this.speed;
	}

	playAnimation(images) {
		let i = this.currentImage % images.length;
		let path = images[i];
		this.img = this.imageCache[path];
		this.currentImage++;
	}

	jump() {
		this.speedY = 35;
	}
}
