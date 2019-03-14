import Boom from 'boom';
import Router from 'koa-router';

export default async (app, models, status, self = {}) => {
	let router = new Router();

	app.log.trace('routes.accounts: registering routes for /v1/accounts');

	router.delete('/v1/humans/:humanId', async () => {
		throw Boom.notImplemented('Delete human not yet implemented');
	});

	router.get('/v1/humans', async () => {
		throw Boom.notImplemented('Retrieve humans not yet implemented');
	});

	router.get('/v1/humans/:humanId', async () => {
		throw Boom.notImplemented('Retrieve human not yet implemented');
	});

	router.post('/v1/humans', async () => {
		throw Boom.notImplemented('Create human not yet implemented');
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
