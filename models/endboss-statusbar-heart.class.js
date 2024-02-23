/**
 * Represents the heart icon in the endboss status bar.
 * @extends DrawableObject
 */
class EndbossBarHeart extends DrawableObject {

    /**
     * Array of images for the endboss heart icon.
     * @type {string[]}
     */
    IMAGES_BOSSHEART = ["img/7_statusbars/3_icons/icon_health_endboss.png"];

    /**
     * Creates a new EndbossBarHeart instance.
     */
    constructor() {
        super().loadImage(this.IMAGES_BOSSHEART[0]); 
        this.x = 430;
        this.y = 5;
        this.width = 0;
        this.height = 80;
    }
}
