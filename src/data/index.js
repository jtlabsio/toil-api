import humans from './humans';
import mongoose from 'mongoose';
import mongooseMiddleware from 'mongoose-middleware';

async function connectToDatabase (app) {
	if (mongoose.connection.readyState) {
		return Promise.resolve();
	}

	return new Promise((resolve, reject) => {
		mongoose.connect(
			app.settings.data.url,
			app.settings.data.options);

		mongoose.connection.once('error', reject);
		mongoose.connection.once('open', resolve);
	});
}

export default async (app, self = {}) => {
	if (!app) {
		throw new Error('application context is required for models');
	}

	if (!app) {
		throw new Error('the data layer is required for models');
	}

	app.log.info('models: initializing model layer');

	// connect to the configured database
	await connectToDatabase(app);

	// initialize mongoose-middleware
	mongooseMiddleware.initialize(
		{
			maxDocs : app.settings.data.middleware.maxDocs
		},
		mongoose);

	self.humans = await humans(app);

	return self;
};