import boom from 'boom';
import cors from 'kcors';
import countdown from 'countdown';
import parser from 'koa-bodyparser';
import qs from 'qs';
import { v4 } from 'uuid';

const
	BASE_TEN = 10,
	DEFAULT_OPTIONS_COUNT = 100,
	DEFAULT_OPTIONS_START = 0,
	DEFAULT_STATUS_CODE_LOG_LEVEL = 499,
	DEFAULT_UNCAUGHT_ERROR_STATUS_CODE = 500;

export default (app, models, self = {}) => {
	// middleware for request logging
	app.use(async (ctx, next) => {
		let
			correlationId = ctx.get('X-Correlation-Id') || ctx.get('x-correlation-id') || v4(),
			duration,
			log,
			requestPrefix = `${ctx.method} ${ctx.path}`,
			requestStart = new Date();

		// assign an ID to the request and create a child logger
		log = app.log.child({ correlationId });
		models.setRequestLog(log);

		// await routing
		app.log.trace(requestPrefix);

		/* eslint callback-return:0 */
		await next();
		duration = countdown(requestStart, new Date(), countdown.MILLISECONDS);

		// set response header and log...
		ctx.set('X-Correlation-Id', correlationId);
		ctx.set('X-Response-Time', duration.toString());
		log.debug(
			'%s %s- duration %s',
			requestPrefix,
			ctx.clientId ? `(clientId: ${ctx.clientId}) ` : '',
			duration.toString());
	});

	// middleware for parsing mongoose-middleware options
	app.use(async (ctx, next) => {
		if (ctx.request.query) {
			let parsedQueryString = qs.parse(ctx.request.query);

			ctx.request.queryOptions = {
				count : parseInt(parsedQueryString.count, BASE_TEN) || DEFAULT_OPTIONS_COUNT,
				filters : parsedQueryString.filters || {},
				sort : parsedQueryString.sort,
				start : parseInt(parsedQueryString.start, BASE_TEN) || DEFAULT_OPTIONS_START
			};
		}

		return await next();
	});

	// middleware for server errors
	app.use(async (ctx, next) => {
		let err;

		try {
			/* eslint callback-return:0 */
			await next();
		} catch (ex) {
			err = ex.isBoom ? ex : boom.boomify(
				ex,
				{
					statusCode : ex.statusCode || DEFAULT_UNCAUGHT_ERROR_STATUS_CODE
				});

			// assign the stack appropriately
			err.stack = ex.stack;
		}

		// properly output error details
		if (err) {
			// set response body and status code
			ctx.body = err.output.payload;
			ctx.status = err.output.statusCode;

			// log if necessary
			if (err.output.statusCode > DEFAULT_STATUS_CODE_LOG_LEVEL) {
				app.log.error(
					'%s %s - exception occurred: %s %s',
					ctx.method,
					ctx.url,
					err.output.statusCode,
					err.output.payload.message || err.output.payload.error);
				app.log.error(err.stack);
			} else {
				app.log.warn(
					'%s %s: HTTP %s - %s',
					ctx.method,
					ctx.url,
					err.output.statusCode,
					err.output.payload.message || err.output.payload.error);
			}

			// set headers on the response...
			Object.keys(err.output.headers).forEach((name) => {
				return ctx.set(name, err.output.headers[name]);
			});
		}
	});

	// middleware for CORS
	app.use(cors({
		origin : '*'
	}));

	// middleware for body parsing
	app.use(parser({
		jsonLimit : app.settings.server.bodyLimit
	}));

	return self;
};
