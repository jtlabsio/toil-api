import Boom from 'boom';
import Router from 'koa-router';

export default async (app, models, status, self = {}) => {
	let router = new Router();

	router.delete('/v1/workstreams/:workstreamId', async () => {
		throw Boom.notImplemented('Delete workstream not yet implemented');
	});

	router.get('/v1/workstreams', async () => {
		throw Boom.notImplemented('Retrieve workstreams not yet implemented');
	});

	router.get('/v1/workstreams/:workstreamId', async () => {
		throw Boom.notImplemented('Retrieve workstream not yet implemented');
	});

	router.post('/v1/workstreams', async () => {
		throw Boom.notImplemented('Create workstream not yet implemented');
	});

	router.put('/v1/workstreams', async () => {
		throw Boom.notImplemented('Upsert workstreams not yet implemented');
	});

	router.put('/v1/workstreams/:workstreamId', async () => {
		throw Boom.notImplemented('Update workstream not yet implemented');
	});

	app.use(router.routes());

	return self;
};
