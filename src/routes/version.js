import fs from 'fs';
import Router from 'koa-router';

const PACKAGE_JSON = './package.json';

export default (app, models, self = {}) => {
	let
		npmPackage,
		router = new Router();

	async function ensureNpmPackage () {
		if (npmPackage) {
			return npmPackage;
		}

		await new Promise((resolve, reject) => {
			fs.readFile(PACKAGE_JSON, 'utf8', (err, data) => {
				if (err) {
					return reject(err);
				}

				try {
					npmPackage = JSON.parse(data);
				} catch (ex) {
					return reject(ex);
				}

				return resolve(npmPackage);
			});
		});
	}

	app.log.trace('routes.version: registering routes for /v1/version');

	router.get('/v1/version', async (ctx) => {
		await ensureNpmPackage();

		ctx.body = {
			name : npmPackage.name,
			version : npmPackage.version
		};
	});

	app.use(router.routes());

	return self;
};
