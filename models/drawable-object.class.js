class DrawableObject {
	
	img;
	imageCache = {};
	currentImage = 0;
	height = 200;
	width = 100;
	x = 120;
	y = 230;

	loadImage(path) {
		this.img = new Image();
		this.img.src = path;
	}

	draw(ctx) {
		ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
	}

	loadImages(array) {
		array.forEach((path) => {
			let img = new Image();
			img.src = path;
			img.style = 'transform: scaleX(-1)';
			this.imageCache[path] = img;
		});
	}

	setBar(array, imageBar) {
		const index = Math.min(Math.floor(array / 2), imageBar.length - 1);
		this.loadImage(imageBar[index]);
	}
}

