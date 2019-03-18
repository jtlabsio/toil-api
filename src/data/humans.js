import countdown from 'countdown';
import humanSchema from './schemas/humans';
import mongoose from 'mongoose';

/* eslint babel/new-cap : 0 */
const
	DEFAULT_OBJECT_FILTER = {
		filter : ['_id']
	},
	DEFAULT_PROJECTION = {
		_id : 0,
		__v : 0
	},
	DEFAULT_SEARCH_OPTIONS = {
		lean : true
	},
	Human = mongoose.model('Human', humanSchema);

export default async (app, self = {}) => {
	app.log.trace('data.humans: initializing data mapper for humans');

	self.create = async (data) => {
		let
			human = new Human(data),
			startTime = new Date();

		app.log.trace('data.humans.create: creating human %s', human.humanId);

		await human.save();

		app.log.debug(
			'data.humans.create: created human %s in %s',
			human.humanId,
			countdown(startTime, new Date(), countdown.MILLISECONDS));

		return human.toObject(DEFAULT_OBJECT_FILTER);
	};

	self.delete = async (humanId) => {
		let
			result,
			startTime = new Date();

		app.log.trace('data.humans.delete: deleting human %s', humanId);

		result = await Human.deleteOne({ humanId });

		app.log.debug(
			'data.humans.delete: deleted human %s in %s',
			humanId,
			countdown(startTime, new Date(), countdown.MILLISECONDS));

		return result;
	};

	self.retrieve = async (options) => {
		let
			human,
			startTime = new Date();

		// ensure we fields to retrieve by
		if (!Object.keys(options).length) {
			throw new Error('data.humans.retrieve: humanId or email is required');
		}

		app.log.trace(
			'data.humans.retrieve: finding human %s',
			options.humanId || options.email);

		human = await Human.findOne(options, DEFAULT_PROJECTION, DEFAULT_SEARCH_OPTIONS);

		app.log.debug(
			'data.humans.retrieve: found human %s in %s',
			options.humanId || options.email,
			countdown(startTime, new Date(), countdown.MILLISECONDS));

		return human;
	};

	self.search = async (options) => {
		let
			result,
			startTime = new Date();

		app.log.trace(
			'data.humans.search: searching for humans');

		result = await Human
			.find({}, DEFAULT_PROJECTION, DEFAULT_SEARCH_OPTIONS)
			.field(options)
			.filter(options)
			.order(options)
			.page(options);

		app.log.debug(
			'data.humans.update: found %d humans in %s',
			result.total,
			countdown(startTime, new Date(), countdown.MILLISECONDS));

		return result;
	};

	self.update = async (options, data) => {
		let
			human,
			startTime = new Date();

		// ensure we fields to retrieve by
		if (!Object.keys(options).length) {
			throw new Error('data.humans.update: humanId or email is required');
		}

		app.log.trace(
			'data.humans.update: updating human %s',
			options.humanId || options.email);

		human = await Human.findOneAndUpdate(
			options,
			data,
			{
				new : true,
				rawRresult : true
			});

		app.log.debug(
			'data.humans.update: updated human %s in %s',
			options.humanId || options.email,
			countdown(startTime, new Date(), countdown.MILLISECONDS));

		return human.toObject(DEFAULT_OBJECT_FILTER);
	};

	return self;
};