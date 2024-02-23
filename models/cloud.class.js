/**
 * Represents a cloud in the game world that can move across the screen.
 * @extends MovableObject
 */
class Cloud extends MovableObject {
    
    /**
     * The y-axis position of the cloud on the canvas.
     * @type {number}
     */
    y = 0;

    /**
     * The height of the cloud image.
     * @type {number}
     */
    height = 480;

    /**
     * The width of the cloud image.
     * @type {number}
     */
    width = 1440;
    
    /**
     * Creates a new Cloud instance with a random x-axis position.
     */
    constructor() {
        super().loadImage("img/5_background/layers/4_clouds/full.png");
        this.x = 10 + Math.random() * 2000; 
        this.initializeAnimation();
    }
    
    /**
     * Initializes the cloud's animation by setting an interval to move the cloud left.
     */
    initializeAnimation() {
        this.cloudAnimateInterval = setInterval(() => {
            this.moveLeft();
        }, 1000 / 60);
        allIntervals.push(this.cloudAnimateInterval);
    }
}

