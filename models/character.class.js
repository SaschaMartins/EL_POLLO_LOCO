class Character extends MovableObject {

    height = 250;
    width = 120;
    y = 170;
    speed = 5;
    offset = {
        top: 110,
        bottom: 10,
        left: 30,
        right: 30,
    };

    
    IMAGES_WALKING = [
        './img/2_character_pepe/2_walk/W-21.png',
        './img/2_character_pepe/2_walk/W-22.png',
        './img/2_character_pepe/2_walk/W-23.png',
        './img/2_character_pepe/2_walk/W-24.png',
        './img/2_character_pepe/2_walk/W-25.png',
        './img/2_character_pepe/2_walk/W-26.png',
    ];
    IMAGES_JUMPING = [
        'img/2_character_pepe/3_jump/J-31.png',
        'img/2_character_pepe/3_jump/J-32.png',
        'img/2_character_pepe/3_jump/J-33.png',
        'img/2_character_pepe/3_jump/J-34.png',
        'img/2_character_pepe/3_jump/J-35.png',
        'img/2_character_pepe/3_jump/J-36.png',
        'img/2_character_pepe/3_jump/J-37.png',
        'img/2_character_pepe/3_jump/J-38.png',
        'img/2_character_pepe/3_jump/J-39.png',
    ];
    IMAGES_DEAD = [
        'img/2_character_pepe/5_dead/D-51.png',
        'img/2_character_pepe/5_dead/D-52.png',
        'img/2_character_pepe/5_dead/D-53.png',
        'img/2_character_pepe/5_dead/D-54.png',
        'img/2_character_pepe/5_dead/D-55.png',
        'img/2_character_pepe/5_dead/D-56.png',
        'img/2_character_pepe/5_dead/D-57.png',
    ];
    IMAGES_HURT = ['img/2_character_pepe/4_hurt/H-41.png', 'img/2_character_pepe/4_hurt/H-42.png', 'img/2_character_pepe/4_hurt/H-43.png'];
    IMAGES_IDLE = [
        'img/2_character_pepe/1_idle/long_idle/I-12.png',
        'img/2_character_pepe/1_idle/long_idle/I-13.png',
        'img/2_character_pepe/1_idle/long_idle/I-14.png',
        'img/2_character_pepe/1_idle/long_idle/I-15.png',
        'img/2_character_pepe/1_idle/long_idle/I-16.png',
        'img/2_character_pepe/1_idle/long_idle/I-17.png',
        'img/2_character_pepe/1_idle/long_idle/I-18.png',
        'img/2_character_pepe/1_idle/long_idle/I-19.png',
        'img/2_character_pepe/1_idle/long_idle/I-20.png',
    ];
    IMAGES_WAITING = [
        'img/2_character_pepe/1_idle/idle/I-1.png',
        'img/2_character_pepe/1_idle/idle/I-2.png',
        'img/2_character_pepe/1_idle/idle/I-3.png',
        'img/2_character_pepe/1_idle/idle/I-4.png',
        'img/2_character_pepe/1_idle/idle/I-5.png',
        'img/2_character_pepe/1_idle/idle/I-6.png',
        'img/2_character_pepe/1_idle/idle/I-7.png',
        'img/2_character_pepe/1_idle/idle/I-8.png',
        'img/2_character_pepe/1_idle/idle/I-9.png',
        'img/2_character_pepe/1_idle/idle/I-10.png',
    ];
    world;
    walking_sound = new Audio('audio/walking.mp3');
    jumping_sound = new Audio('audio/jump.mp3');

    constructor() {
        super().loadImage('img/2_character_pepe/1_idle/idle/I-1.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_WAITING);
        this.initializeAnimation();
        this.applyGravaity();
        this.monitorCharacterState();
        this.handleMovement();
    }

    handleMovement() {
        this.movementInterval = setInterval(() => {
            this.walking_sound.pause();
            if (this.world.keyboard.RIGHT && this.x < this.world.endboss.x) {
                this.characterRightMovement();
            }
            if (this.world.keyboard.LEFT && this.x > 0) {
                this.characterLeftMovement();
            }
            if (this.world.keyboard.SPACE && !this.isAboveGround()) {
                this.characterJumpMovement();
            }
            this.followCharacterWithCamera();
        }, 1000 / 60);
        allIntervals.push(this.movementInterval);
    }

    initializeAnimation() {
        this.animatonCharacterInterval = setInterval(() => {
            if (this.isDead()) {
                this.playAnimation(this.IMAGES_DEAD);
            } else if (this.isHurt()) {
                this.playAnimation(this.IMAGES_HURT);
            } else if (this.isAboveGround()) {
                this.playAnimation(this.IMAGES_JUMPING);
            } else if (this.isMoving()) {
                this.playAnimation(this.IMAGES_WALKING);
            } else {
                this.handleIdleAnimations();
            }
        }, 100);
        allIntervals.push(this.animatonCharacterInterval);
    }

    followCharacterWithCamera() {
        this.world.camera_x = -this.x + 100;
    }

    handleIdleAnimations() {
        this.timeSinceLastAction = new Date().getTime() - this.lastAction;
        this.playAnimation(this.timeSinceLastAction > 2000 ? this.IMAGES_IDLE : this.IMAGES_WAITING);
    }

    monitorCharacterState() {
        this.stateMonitorInterval = setInterval(() => {
            if (this.isInactive()) {
                this.lastAction = new Date().getTime();
            }
        }, 100);
        allIntervals.push(this.stateMonitorInterval);
    }

    isMoving() {
        return this.world.keyboard.RIGHT || (this.world.keyboard.LEFT && !this.isAboveGround());
    }

    jump() {
        this.speedY = 20;
    }

    characterRightMovement() {
        this.moveRight();
        this.otherDirection = false;
        this.playWalkingSound();
		this.playWalkingSound();
    }

    characterLeftMovement() {
        this.moveLeft();
        this.otherDirection = true;
        this.playWalkingSound();
    }

    characterJumpMovement() {
        this.walking_sound.pause();
        if (world.muted == false) {
            this.jumping_sound.play();
            this.jumping_sound.volume = 0.5;
        }
        this.jump();
    }

    playWalkingSound() {
        if (!world.muted) {
            this.walking_sound.play();
        } else {
            this.walking_sound.pause();
        }
    }

    keyboardRight() {
        return this.world.keyboard.RIGHT && this.x < this.world.endboss.x;
    }

    keyboardLeft() {
        return this.world.keyboard.LEFT && this.x > 0;
    }

    keyboardJump() {
        return this.world.keyboard.SPACE && !this.isAboveGround();
    }

    isInactive() {
        return (
            this.world.keyboard.RIGHT ||
            this.world.keyboard.LEFT ||
            this.world.keyboard.SPACE ||
            this.world.keyboard.ENTER ||
            this.isAboveGround() ||
            this.isHurt() ||
            this.isDead()
        );
    }
}