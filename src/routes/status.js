import countdown from 'countdown';
import Router from 'koa-router';

export default (app, models, self = {}) => {
	let
		routeInit = new Date(),
		router = new Router();

	app.log.trace('routes.status: registering routes for /v1/status');

	router.get('/v1/status', async (ctx) => {
		ctx.body = {
			headers : ctx.headers,
			memory : process.memoryUsage(),
			uptime : countdown(routeInit, new Date()).toString()
		};
	});

	app.use(router.routes());

	return self;
};
