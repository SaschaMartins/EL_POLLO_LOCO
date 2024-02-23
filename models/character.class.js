/**
 * Represents the main character in the game.
 * @extends MovableObject
 */
class Character extends MovableObject {

    /**
     * The height of the character.
     * @type {number}
     */
    height = 250;

    /**
     * The width of the character.
     * @type {number}
     */
    width = 120;

    /**
     * The vertical position of the character.
     * @type {number}
     */
    y = 170;

    /**
     * The movement speed of the character.
     * @type {number}
     */
    speed = 5;

    /**
     * The offset for collision detection.
     * @type {{top: number, bottom: number, left: number, right: number}}
     */
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

    /**
     * Constructs a new character and initializes its properties.
     */
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

    /**
     * Handles the character's movement logic, updating its position based on keyboard input.
     */
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

    /**
     * Initializes the character's animations based on its state.
     */
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

    /**
     * Adjusts the camera position to follow the character.
     */
    followCharacterWithCamera() {
        this.world.camera_x = -this.x + 100;
    }

    /**
     * Handles the character's idle animations.
     */
    handleIdleAnimations() {
        this.timeSinceLastAction = new Date().getTime() - this.lastAction;
        this.playAnimation(this.timeSinceLastAction > 2000 ? this.IMAGES_IDLE : this.IMAGES_WAITING);
    }

    /**
     * Monitors the character's state and updates the last action timestamp.
     */
    monitorCharacterState() {
        this.stateMonitorInterval = setInterval(() => {
            if (this.isInactive()) {
                this.lastAction = new Date().getTime();
            }
        }, 100);
        allIntervals.push(this.stateMonitorInterval);
    }

    /**
     * Determines if the character is moving.
     * @returns {boolean} True if the character is moving, false otherwise.
     */
    isMoving() {
        return this.world.keyboard.RIGHT || (this.world.keyboard.LEFT && !this.isAboveGround());
    }

    /**
     * Makes the character jump.
     */
    jump() {
        this.speedY = 20;
    }

    /**
     * Moves the character to the right and plays the walking sound.
     */
    characterRightMovement() {
        this.moveRight();
        this.otherDirection = false;
        this.playWalkingSound();
		this.playWalkingSound();
    }

    /**
     * Moves the character to the left and plays the walking sound.
     */
    characterLeftMovement() {
        this.moveLeft();
        this.otherDirection = true;
        this.playWalkingSound();
    }

     /**
     * Initiates the character's jump movement and plays the jumping sound.
     */
    characterJumpMovement() {
        this.pauseSound(this.walking_sound);
        if (!this.world.muted) {
            this.playSound(this.jumping_sound);
            this.jumping_sound.volume = 0.5;
        }
        this.jump();
    }

    /**
     * Plays the walking sound if the game is not muted; otherwise, pauses it.
     */
    playWalkingSound() {
        if (!this.world.muted) {
            this.playSound(this.walking_sound);
        } else {
            this.pauseSound(this.walking_sound);
        }
    }

    /**
     * Plays a given sound.
     * @param {HTMLAudioElement} audioElement - The audio element to play.
     */
    playSound(audioElement) {
        if (audioElement) {
            const playPromise = audioElement.play();
            if (playPromise !== undefined) {
                playPromise.then(_ => {
                }).catch(error => {
                });
            }
        }
    }

    /**
     * Pauses a given sound.
     * @param {HTMLAudioElement} audioElement - The audio element to pause.
     */
    pauseSound(audioElement) {
        if (audioElement) {
            try {
                audioElement.pause();
            } catch (error) {
            }
        }
    }

    /**
     * Checks if the right arrow key is pressed and the character is not past the end boss.
     * @returns {boolean} True if the right arrow key is pressed and the character is before the end boss.
     */
    keyboardRight() {
        return this.world.keyboard.RIGHT && this.x < this.world.endboss.x;
    }

    /**
     * Checks if the left arrow key is pressed and the character is not at the left edge of the screen.
     * @returns {boolean} True if the left arrow key is pressed and the character is not at the left edge.
     */
    keyboardLeft() {
        return this.world.keyboard.LEFT && this.x > 0;
    }

    /**
     * Checks if the space bar is pressed and the character is not already jumping.
     * @returns {boolean} True if the space bar is pressed and the character is on the ground.
     */
    keyboardJump() {
        return this.world.keyboard.SPACE && !this.isAboveGround();
    }

    /**
     * Determines if the character is inactive based on various conditions.
     * @returns {boolean} True if the character is inactive.
     */
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