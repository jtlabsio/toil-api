import Boom from 'boom';
import humans from './humans';
import middleware from './middleware';
import Router from 'koa-router';
import status from './status';
import version from './version';

const HTTP_STATUS = {
	Accepted : 202,
	Created : 201,
	NoContent : 204,
	NotFound : 404,
	Ok : 200
};

export default async (app, models, self = {}) => {
	let options = new Router();

	if (!app) {
		throw new Error('application context is required for routes');
	}

	if (!models) {
		throw new Error('business model layer is required for routes');
	}

	app.log.info('routes: initializing routing layer');

	// register middleware
	middleware(app);

	// register API routes
	self.humans = humans(app, models, HTTP_STATUS);
	self.status = status(app, models);
	self.version = version(app, models);

	// 404s
	app.use(async (ctx) => {
		throw Boom.notFound(`${ctx.method} ${ctx.url} - does not exist`);
  });

	// hook up error handlers
	app.use(options.allowedMethods({
		methodNotAllowed : () => Boom.methodNotAllowed(),
		notImplemented : () => Boom.notImplemented(),
		throw : true
	}));

	return self;
};
