/**
 * Represents a drawable object in the game. This is a base class for any object that can be drawn on the canvas.
 */
class DrawableObject {
    
    /**
     * The image object that will be drawn on the canvas.
     * @type {HTMLImageElement}
     */
    img;

    /**
     * A cache of loaded images to avoid reloading.
     * @type {Object.<string, HTMLImageElement>}
     */
    imageCache = {};

    /**
     * The current image index when animating.
     * @type {number}
     */
    currentImage = 0;

    /**
     * The height of the object.
     * @type {number}
     */
    height = 200;

    /**
     * The width of the object.
     * @type {number}
     */
    width = 100;

    /**
     * The x-axis position of the object.
     * @type {number}
     */
    x = 120;

    /**
     * The y-axis position of the object.
     * @type {number}
     */
    y = 230;

    /**
     * Loads an image from a given path and sets it to the img property.
     * @param {string} path - The path to the image resource.
     */
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    /**
     * Draws the object on the canvas context.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     */
    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    /**
     * Loads multiple images and stores them in the image cache.
     * @param {string[]} array - An array of image paths to load.
     */
    loadImages(array) {
        array.forEach((path) => {
            let img = new Image();
            img.src = path;
            img.style = 'transform: scaleX(-1)';
            this.imageCache[path] = img;
        });
    }

    /**
     * Sets the image for a status bar based on the current value.
     * @param {number[]} array - An array representing the current value.
     * @param {string[]} imageBar - An array of image paths for the status bar.
     */
    setBar(array, imageBar) {
        const index = Math.min(Math.floor(array / 2), imageBar.length - 1);
        this.loadImage(imageBar[index]);
    }
}