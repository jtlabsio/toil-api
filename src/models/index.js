import humans from './humans';

export default async (app, data, self = {}) => {
	if (!app) {
		throw new Error('application context is required for models');
	}

	if (!app) {
		throw new Error('the data layer is required for models');
	}

	app.log.info('models: initializing model layer');

	let request = {
		log : app.log
	};

	self.humans = humans(app, request, data);

	self.setRequestLog = (log) => {
		request.log = log;
		data.setRequestLog(log);
	};

	return self;
};