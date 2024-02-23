/**
 * Represents a coin in the game that can be collected by the player.
 * @extends MovableObject
 */
class Coin extends MovableObject {
    
    /**
     * The width of the coin.
     * @type {number}
     */
    width = 100;

    /**
     * The height of the coin.
     * @type {number}
     */
    height = 100;

    /**
     * The hitbox offset for collision detection.
     * @type {Object}
     */
    offset = {
        top: 35,
        bottom: 35,
        left: 35,
        right: 35,
    };

    /**
     * Array of images for the coin animation.
     * @type {string[]}
     */
    COIN_IMAGE = [
        "img/8_coin/coin_1.png",
        "img/8_coin/coin_2.png"
    ];

    /**
     * Creates a new Coin instance with a random position.
     */
    constructor() {
        super().loadImage(this.COIN_IMAGE[0]);
        this.loadImages(this.COIN_IMAGE);
        this.y = 160 + Math.random() * 100;
        this.x = 500 + Math.random() * 3 * Math.random() * 600;
    }
}
