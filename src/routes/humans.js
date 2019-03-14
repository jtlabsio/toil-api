import Boom from 'boom';
import Router from 'koa-router';

export default async (app, models, status, self = {}) => {
	let router = new Router();

	app.log.trace('routes.humans: registering routes for /v1/humans');

	router.delete('/v1/humans/:humanId', async () => {
		throw Boom.notImplemented('Delete human not yet implemented');
	});

	router.get('/v1/humans', async (ctx) => {
		ctx.body = await models.humans.search(ctx.request.queryOptions);
		ctx.status = 200;
	});

	router.get('/v1/humans/:humanId', async () => {
		throw Boom.notImplemented('Retrieve human not yet implemented');
	});

	router.post('/v1/humans', async (ctx) => {
		ctx.body = await models.humans.create(ctx.request.body);
		ctx.status = 201;
	});

	router.put('/v1/humans', async () => {
		throw Boom.notImplemented('Upsert humans not yet implemented');
	});

	router.put('/v1/humans/:humanId', async () => {
		throw Boom.notImplemented('Update human not yet implemented');
	});

	app.use(router.routes());

	return self;
};
