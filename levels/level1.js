let level1;

/**
 * Initializes the first level by creating enemies, clouds, background objects, coins, and bottles.
 */
function initLevel() {
	level1 = new Level(
		createEnemies(),
		createClouds(),
		createBackgrounds(),
		createCoins(),
		createBottles(),
	);
}

/**
 * Creates an array of enemy objects for the level.
 * @returns {Enemy[]} An array of enemy objects.
 */
function createEnemies() {
    let enemies = [
        new Chicken(), new Chicken(), new Chicken(), 
        new miniChicken(), new miniChicken(), new miniChicken(), 
        new Endboss()
    ];

    let endbossPositionX = 2000;
    let additionalEnemies = [
		new Chicken(endbossPositionX - 10),
		new Chicken(endbossPositionX - 30),
        new Chicken(endbossPositionX - 200),
        new miniChicken(endbossPositionX - 180),
		new miniChicken(endbossPositionX - 50),
		new miniChicken(endbossPositionX - 0),   
  
    ];

    return enemies.concat(additionalEnemies);
}

/**
 * Creates an array of background objects for the level.
 * @returns {BackgroundObject[]} An array of background objects.
 */
function createBackgrounds() {
	return [
		new BackgroundObject("img/5_background/layers/air.png", -719),
		new BackgroundObject("img/5_background/layers/3_third_layer/2.png", -719),
		new BackgroundObject("img/5_background/layers/2_second_layer/2.png", -719),
		new BackgroundObject("img/5_background/layers/1_first_layer/2.png", -719),
		new BackgroundObject("img/5_background/layers/air.png", 0),
		new BackgroundObject("img/5_background/layers/3_third_layer/1.png", 0),
		new BackgroundObject("img/5_background/layers/2_second_layer/1.png", 0),
		new BackgroundObject("img/5_background/layers/1_first_layer/1.png", 0),
		new BackgroundObject("img/5_background/layers/air.png", 719),
		new BackgroundObject("img/5_background/layers/3_third_layer/2.png", 719),
		new BackgroundObject("img/5_background/layers/2_second_layer/2.png", 719),
		new BackgroundObject("img/5_background/layers/1_first_layer/2.png", 719),
		new BackgroundObject("img/5_background/layers/air.png", 1438),
		new BackgroundObject("img/5_background/layers/3_third_layer/1.png", 1438),
		new BackgroundObject("img/5_background/layers/2_second_layer/1.png", 1438),
		new BackgroundObject("img/5_background/layers/1_first_layer/1.png", 1438),

		new BackgroundObject("img/5_background/layers/air.png", 2157),
		new BackgroundObject("img/5_background/layers/3_third_layer/2.png", 2157),
		new BackgroundObject("img/5_background/layers/2_second_layer/2.png", 2157),
		new BackgroundObject("img/5_background/layers/1_first_layer/2.png", 2157),
	];
}

/**
 * Creates an array of cloud objects for the level.
 * @returns {Cloud[]} An array of cloud objects.
 */	
function createClouds() {
	return [new Cloud(), new Cloud()];
}

/**
 * Creates an array of coin objects for the level.
 * @returns {Coin[]} An array of coin objects.
 */
function createCoins() {
	return [new Coin(), new Coin(), new Coin(), new Coin(), new Coin(), new Coin(), new Coin(), new Coin(), new Coin(), new Coin()];
}

/**
 * Creates an array of bottle objects for the level.
 * @returns {Bottle[]} An array of bottle objects.
 */
function createBottles() {
	return [
		new Bottle(),
		new Bottle(),
		new Bottle(),
		new Bottle(),
		new Bottle(),
		new Bottle(),
		new Bottle(),
		new Bottle(),
		new Bottle(),
		new Bottle(),
		new Bottle(),
		new Bottle(),
		new Bottle(),
		new Bottle(),
		new Bottle(),
		new Bottle(),
	];
}
