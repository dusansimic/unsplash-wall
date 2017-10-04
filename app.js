#!/usr/bin/env node
const fs = require('fs');
const wallpaper = require('wallpaper');
const download = require('download');
const ora = require('ora');
const {UnsplashPhoto} = require('unsplash-source-js');
const program = require('commander');

const photo = new UnsplashPhoto();

// Cli setup
program
	.version('0.0.0')
	.option('-c, --category [category]', 'Select wallpaper category')
	.option('-C, --collection [collection id]', 'Select wallpaper collection')
	.option('-r, --resolution [resolution]', 'Select wallpaper resolution')
	.option('-u, --user [user]', 'Select specific user')
	.option('-l, --liked', 'Select from users likes')
	.option('-R, --randomize', 'Select randomization interval')
	.parse(process.argv);

// Local functions

// Deep compare of two objects
const objectCompare = (obj1, obj2) => {
	if (JSON.stringify(obj1) === JSON.stringify(obj2)) {
		return true;
	}
	return false;
};

// Function for getting photo resolution
const clearResolutionString = res => {
	res = res.split(' ').join('');
	res = res.split('x');
	if (objectCompare(res, ['fhd'])) {
		res = [1920, 1080];
	} else if (objectCompare(res, ['4k'])) {
		res = [3840, 2160];
	}

	return JSON.parse(JSON.stringify(res));
};

// Generate url

if (program.resolution) {
	const resolution = clearResolutionString(program.resolution);
	photo.size(resolution[0], resolution[1]);
}

if (program.category) {
	photo.fromCategory(program.category);
} else if (program.user) {
	photo.fromUser(program.user);
	if (program.liked) {
		photo.fromLikes();
	}
} else if (program.collection) {
	photo.formCollection(program.collection);
}

if (program.randomize) {
	photo.randomize(program.randomize);
}

const url = photo.fetch();

const downloadSpinner = ora('Downloading wallpaper').start();
download(url).then(data => {
	const err = fs.writeFileSync('/tmp/wallpaper.jpg', data);
	if (err) {
		downloadSpinner.fail('Wallpaper was not downloaded');
		return;
	}
	downloadSpinner.succeed('Wallpaper downloaded');

	const wallpaperSpinner = ora('Setting wallpaper').start();
	wallpaper.set('/tmp/wallpaper.jpg').then(() => {
		wallpaperSpinner.succeed('Wallpaper set');
	}).catch(() => {
		wallpaperSpinner.fail('Wallpaper was not set');
	});
}).catch(() => {
	downloadSpinner.fail('Wallpaper was not downloaded');
});
