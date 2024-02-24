let canvas;
let world;
let keyboard = new Keyboard();
let game_over_sound = new Audio('audio/game-over.mp3');
let game_winner_sound = new Audio('audio/you-win.mp3');
let gameFinish = false;
let allIntervals = [];

/**
 * Starts the game by initializing the level and setting up the game world.
 */
function startGame() {
	document.getElementById('canvas').classList.remove('d-none');
	document.getElementById('muteButton').classList.remove('d-none');
	document.getElementById('buttonsLeft').classList.remove('d-none');
	document.getElementById('buttonsRight').classList.remove('d-none');
	document.getElementById('startScreen').classList.add('d-none');
	initLevel();
	init();
}

/**
 * Opens the "How to Play" instructions overlay and plays a door knock sound after 1.337 seconds.
 */
function openHowToPlay() {
    document.getElementById('mainHTP').classList.remove('d-none');
    
    // Set a timeout to play the door knock sound after 1.337 seconds
    setTimeout(function() {
        let doorKnockSound = new Audio('audio/doorknock.mp3');
        doorKnockSound.play();
    }, 1337); // 1.337 Sekunden = 1337 Millisekunden
}

/**
 * Closes the "How to Play" instructions overlay.
 */
function closeHowToPlay() {
	document.getElementById('mainHTP').classList.add('d-none');
}

/**
 * Initializes the game by creating the world and the canvas context.
 */
function init() {
	canvas = document.getElementById('canvas');
	world = new World(canvas, keyboard);
}

/**
 * Displays the game winner screen and handles the audio and UI changes.
 * @param {boolean} muted - Indicates whether the sound is muted.
 */
function gameWinnerScreen(muted) {
	if (gameFinish == false) {
		world.character.walking_sound.pause();
		world.background_sound.pause();
		keyboard.MUTE = true;
		allIntervals.forEach(clearInterval);
		if (!muted) {
			game_winner_sound.play();
			game_winner_sound.volume = 0.4;
		}
		document.getElementById('muteButton').classList.add('d-none');
		document.getElementById('canvas').classList.add('d-none');
		document.getElementById('endMuteButton').classList.add('d-none');
		document.getElementById('buttonsLeft').classList.add('d-none');
		document.getElementById('buttonsRight').classList.add('d-none');
		document.getElementById('gameWinnerScreen').classList.remove('d-none');
		gameFinish = true;
	}
}

/**
 * Displays the game over screen and handles the audio and UI changes.
 * @param {boolean} muted - Indicates whether the sound is muted.
 */
function gameOverScreen(muted) {
	if (gameFinish == false) {
		stopIngameSounds();
		allIntervals.forEach(clearInterval);
		if (!muted) {
			game_over_sound.play();
			game_over_sound.volume = 0.4;
		}
		document.getElementById('muteButton').classList.add('d-none');
		document.getElementById('canvas').classList.add('d-none');
		document.getElementById('buttonsLeft').classList.add('d-none');
		document.getElementById('buttonsRight').classList.add('d-none');
		document.getElementById('endMuteButton').classList.add('d-none');
		document.getElementById('gameOverScreen').classList.remove('d-none');
		gameFinish = true;
	}
}

/**
 * Stops all in-game sounds and sets the keyboard mute state.
 */
function stopIngameSounds() {
	keyboard.MUTE = true;
	world.character.walking_sound.pause();
	world.background_sound.pause();
}

/**
 * Resets the game to the start screen and reinitializes the game state.
 */
function backToStartScreen() {
	world.resetGame();
	keyboard.MUTE = false;
	document.getElementById('canvas').classList.add('d-none');
	document.getElementById('muteButton').classList.add('d-none');
	document.getElementById('gameOverScreen').classList.add('d-none');
	document.getElementById('buttonsLeft').classList.add('d-none');
	document.getElementById('buttonsRight').classList.add('d-none');
	document.getElementById('gameWinnerScreen').classList.add('d-none');
	document.getElementById('startScreen').classList.remove('d-none');
	gameFinish = false;
}

/**
 * Mutes the game by hiding the mute button and showing the unmute button.
 */
function muteGame() {
	document.getElementById('endMuteButton').classList.remove('d-none');
	document.getElementById('muteButton').classList.add('d-none');
	keyboard.MUTE = true;
}

/**
 * Unmutes the game by hiding the unmute button and showing the mute button.
 */
function endMuteGame() {
	document.getElementById('muteButton').classList.remove('d-none');
	document.getElementById('endMuteButton').classList.add('d-none');
	keyboard.MUTE = false;
}

/**
 * Simulates a key press event for the given key code and event type.
 * @param {number} keyCode - The key code of the key to simulate.
 * @param {string} type - The type of event to simulate ('keydown' or 'keyup').
 */
function simulateKeyPressed(keyCode, type) {
	let e = document.createEvent('HTMLEvents');
	e.initEvent(type, true, false);
	e.keyCode = keyCode;
	document.dispatchEvent(e);

	const isPressed = type === 'keydown';

	updateKeyState(e.keyCode, isPressed);
}

/**
 * Updates the state of the keys in the keyboard object based on the key code and whether it is pressed.
 * @param {number} keyCode - The key code of the key to update.
 * @param {boolean} isPressed - Whether the key is pressed or not.
 */
function updateKeyState(keyCode, isPressed) {
	switch (keyCode) {
		case 39: // Right Arrowkey
		case 68: // D
			keyboard.RIGHT = isPressed;
			break;
		case 37: // Left Arrowkey
		case 65: // A
			keyboard.LEFT = isPressed;
			break;
		case 32: // Space
			keyboard.SPACE = isPressed;
			break;
		case 13: // Enter
			keyboard.ENTER = isPressed;
			break;
	}
}

// Event listeners for keydown and keyup events
window.addEventListener('keydown', (e) => {
	updateKeyState(e.keyCode, true);
});

window.addEventListener('keyup', (e) => {
	updateKeyState(e.keyCode, false);
});
