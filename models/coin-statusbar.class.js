/**
 * Represents the coin status bar in the game, showing the number of collected coins.
 * @extends DrawableObject
 */
class CoinBar extends DrawableObject {
    
    /**
     * Array of images for the coin status bar at different coin counts.
     * @type {string[]}
     */
    IMAGES_COIN_BAR = [
        "img/7_statusbars/1_statusbar/1_statusbar_coin/orange/0.png",
        "img/7_statusbars/1_statusbar/1_statusbar_coin/orange/20.png",
        "img/7_statusbars/1_statusbar/1_statusbar_coin/orange/40.png",
        "img/7_statusbars/1_statusbar/1_statusbar_coin/orange/60.png",
        "img/7_statusbars/1_statusbar/1_statusbar_coin/orange/80.png",
        "img/7_statusbars/1_statusbar/1_statusbar_coin/orange/100.png",
    ];

    /**
     * Creates a new CoinBar instance.
     */
    constructor() {
        super().loadImage(this.IMAGES_COIN_BAR[0]);
        this.x = 20;
        this.y = 50;
        this.width = 200;
        this.height = 60;
        this.setCoinbar();
    }

    /**
     * Sets the coin status bar based on the number of collected coins.
     */
    setCoinbar() {
        this.setCoinbarInterval = setInterval(() => {
            super.setBar(world.collectedCoins.length, this.IMAGES_COIN_BAR);
        }, 100);
        allIntervals.push(this.setCoinbarInterval);
    }
}
