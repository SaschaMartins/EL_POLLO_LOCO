let canvas;
let world;
let keyboard = new Keyboard();
let game_over_sound = new Audio('audio/game-over.mp3');
let game_winner_sound = new Audio('audio/you-win.mp3');
let gameFinish = false;
let allIntervals = [];


function startGame() {
	document.getElementById('canvas').classList.remove('d-none');
	document.getElementById('muteButton').classList.remove('d-none');
	document.getElementById('buttonsLeft').classList.remove('d-none');
	document.getElementById('buttonsRight').classList.remove('d-none');
	document.getElementById('startScreen').classList.add('d-none');
	initLevel();
	init();
}

function openHowToPlay() {
	document.getElementById('mainHTP').classList.remove('d-none');
}

function closeHowToPlay() {
	document.getElementById('mainHTP').classList.add('d-none');
}

function init() {
	canvas = document.getElementById('canvas');
	world = new World(canvas, keyboard);
}

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

function stopIngameSounds() {
	keyboard.MUTE = true;
	world.character.walking_sound.pause();
	world.background_sound.pause();
}

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


function muteGame() {
	document.getElementById('endMuteButton').classList.remove('d-none');
	document.getElementById('muteButton').classList.add('d-none');
	keyboard.MUTE = true;
}


function endMuteGame() {
	document.getElementById('muteButton').classList.remove('d-none');
	document.getElementById('endMuteButton').classList.add('d-none');
	keyboard.MUTE = false;
}


function simulateKeyPressed(keyCode, type) {
	let e = document.createEvent('HTMLEvents');
	e.initEvent(type, true, false);
	e.keyCode = keyCode;
	document.dispatchEvent(e);

	const isPressed = type === 'keydown';

	updateKeyState(e.keyCode, isPressed);
}

function updateKeyState(keyCode, isPressed) {
	switch (keyCode) {
		case 39: // Rechte Pfeiltaste
		case 68: // D
			keyboard.RIGHT = isPressed;
			break;
		case 37: // Linke Pfeiltaste
		case 65: // A
			keyboard.LEFT = isPressed;
			break;
		case 32: // Leertaste
			keyboard.SPACE = isPressed;
			break;
		case 13: // Eingabetaste
			keyboard.ENTER = isPressed;
			break;
	}
}

window.addEventListener('keydown', (e) => {
	updateKeyState(e.keyCode, true);
});

window.addEventListener('keyup', (e) => {
	updateKeyState(e.keyCode, false);
});
