/**
 * Represents a background object in the game world.
 * @extends MovableObject
 */
class BackgroundObject extends MovableObject {
    
    /**
     * The width of the background object.
     * @type {number}
     */
    width = 720;

    /**
     * The height of the background object.
     * @type {number}
     */
    height = 480;

    /**
     * Creates a new background object with a specified image and position.
     * @param {string} imagePath - The path to the image file for the background object.
     * @param {number} x - The horizontal position of the background object in the game world.
     */
    constructor(imagePath, x) {
        super().loadImage(imagePath);
        this.x = x;
        this.y = 480 - this.height;
    }
}