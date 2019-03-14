import Boom from 'boom';
import Router from 'koa-router';

export default async (app, models, status, self = {}) => {
	let router = new Router();

	router.delete('/v1/timesheets/:timesheetId', async () => {
		throw Boom.notImplemented('Delete timesheet not yet implemented');
	});

	router.get('/v1/timesheets', async () => {
		throw Boom.notImplemented('Retrieve timesheets not yet implemented');
	});

	router.get('/v1/timesheets/:timesheetId', async () => {
		throw Boom.notImplemented('Retrieve timesheet not yet implemented');
	});

	router.post('/v1/timesheets', async () => {
		throw Boom.notImplemented('Create timesheet not yet implemented');
	});

	router.put('/v1/timesheets', async () => {
		throw Boom.notImplemented('Upsert timesheets not yet implemented');
	});

	router.put('/v1/timesheets/:timesheetId', async () => {
		throw Boom.notImplemented('Update timesheet not yet implemented');
	});

	app.use(router.routes());

	return self;
};
