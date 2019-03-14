import bunyan from 'bunyan';
import initData from './data';
import initModels from './models';
import initRoutes from './routes';
import Koa from 'koa';
import settings from 'settings-lib';

const
	DEFAULT_APP_NAME = 'human-api',
	DEFAULT_SETTINGS_PATH = 'settings/defaults.yml';

export default (async (app) => {
	// load app settings and configuration overrides
	app.settings = await settings.initialize({
		baseConfigPath : DEFAULT_SETTINGS_PATH
	});

	// setup app logging
	app.log = bunyan.createLogger({
		level : app.settings.logging.level,
		name : DEFAULT_APP_NAME
	});

	// output settings to debug
	app.log.info(app.settings);

	// instantiate data and models
	let
		data = await initData(app),
		models = await initModels(app, data);

	// setup API routing for inbound requests
	await initRoutes(app, models);

	// start the HTTP server and listen for requests
	app.listen(app.settings.server.port, () => {
		app.log.info(
			'%s server started on port %d',
			app.settings.server.secure ? 'HTTPS' : 'HTTP',
			app.settings.server.port);
	});

	return app;
})(new Koa())
	.catch((ex) => {
		/* eslint no-console:0 */
		console.error('Unable to start application due to exception')
		console.error(ex);

		if (ex.stackTrace) {
			console.error(ex.stackTrace);
		}

		return process.exit(1);
	});
