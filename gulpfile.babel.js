import { dest, series, src, watch } from 'gulp';
import babel from 'gulp-babel';
import del from 'gulp-clean';
import eslint from 'gulp-eslint';
import sourcemaps from 'gulp-sourcemaps';
import { spawn } from 'child_process';

let
	bunyan,
	node;

function build () {
	return src('src/**/*.js')
		.pipe(sourcemaps.init())
		.pipe(babel())
		.pipe(sourcemaps.write('.'))
		.pipe(dest('dist'));
}

function clean () {
	return src(['dist', 'reports'], { allowEmpty : true, read : false })
		.pipe(del());
}

function lint () {
	return src(['gulpfile.babel.js', 'src/**/*.js', 'test/**/*.js'])
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(eslint.failAfterError());
}

function start (done) {
	/* eslint no-magic-numbers:0 */
	bunyan = spawn(
		'./node_modules/.bin/bunyan',
		['-o', 'short'],
		{ stdio : ['pipe', 1, 2] }); // preserves color of bunyan log output
	node = spawn('node', ['dist']);

	node.stdout.pipe(bunyan.stdin);
	node.stderr.pipe(bunyan.stdin);

	return done();
}

function stop (done) {
	if (node) {
		node.stdout.unpipe(bunyan.stdin);
		node.kill();
	}

	if (bunyan) {
		bunyan.kill();
	}

	return done();
}

exports.default = series(
	clean,
	build,
	start,
	() => watch(['src/**/*.js', 'settings/*.json'], series(stop, build, start)));

exports.lint = lint;