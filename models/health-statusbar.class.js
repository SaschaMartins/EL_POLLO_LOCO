/**
 * Represents the health status bar in the game, displaying the player's current health.
 * @extends DrawableObject
 */
class HealthBar extends DrawableObject {
	/**
     * The images representing different health levels.
     * @type {string[]}
     */
	IMAGES_HEALTH = [
		"img/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png",
		"img/7_statusbars/1_statusbar/2_statusbar_health/blue/20.png",
		"img/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png",
		"img/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png",
		"img/7_statusbars/1_statusbar/2_statusbar_health/blue/80.png",
		"img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png",
	];
	
	/**
     * The sound played when the game is over.
     * @type {Audio}
     */
	gameOver = new Audio("audio/game-over.mp3");

	/**
     * The current health percentage of the health bar.
     * @type {number}
     */
	percentage = 500;

	/**
     * Creates an instance of the HealthBar class.
     */
	constructor() {
		super();
		this.loadImages(this.IMAGES_HEALTH);
		this.x = 20;
		this.y = 0;
		this.width = 200;
		this.height = 60;
		this.setPercentage(1000);
		
	}

	/**
     * Sets the health percentage of the health bar and updates the displayed image accordingly.
     * @param {number} percentage - The new health percentage to set.
     */
	setPercentage(percentage) {
		this.percentage = percentage; 
		let path = this.IMAGES_HEALTH[this.resolveImageIndex()];
		this.img = this.imageCache[path];
	}

	/**
     * Resolves the index of the image to display based on the current health percentage.
     * @returns {number} The index of the image that corresponds to the current health level.
     */
	resolveImageIndex() {
		if (this.percentage == 1000) {
			return 5;
		} else if (this.percentage > 800) {
			return 4;
		} else if (this.percentage > 600) {
			return 3;
		} else if (this.percentage > 400) {
			return 2;
		} else if (this.percentage > 200) {
			return 1;
		} else {
			return 0;
		}
	}
}
