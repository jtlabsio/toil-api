import Router from 'koa-router';

const DEFAULT_SUCCESS_STATUS = 200;

export default async (app, models, status, self = {}) => {
	let router = new Router();

	app.log.trace('routes.humans: registering routes for /v1/humans');

	router.delete('/v1/humans/:key', async (ctx) => {
		ctx.body = await models.humans.delete(ctx.params.key);
		ctx.status = DEFAULT_SUCCESS_STATUS;
	});

	router.get('/v1/humans', async (ctx) => {
		ctx.body = await models.humans.search(ctx.request.queryOptions);
		ctx.status = DEFAULT_SUCCESS_STATUS;
	});

	router.get('/v1/humans/:key', async (ctx) => {
		ctx.body = await models.humans.lookup(ctx.params.key);
		ctx.status = DEFAULT_SUCCESS_STATUS;
	});

	router.post('/v1/humans', async (ctx) => {
		ctx.body = await models.humans.create(ctx.request.body);
		ctx.status = DEFAULT_SUCCESS_STATUS;
	});

	router.put('/v1/humans', async (ctx) => {
		ctx.body = await models.humans.upsert(ctx.request.body);
		ctx.status = DEFAULT_SUCCESS_STATUS;
	});

	router.put('/v1/humans/:key', async (ctx) => {
		ctx.body = await models.humans.update(ctx.params.key, ctx.request.body);
		ctx.status = DEFAULT_SUCCESS_STATUS;
	});

	app.use(router.routes());

	return self;
};
