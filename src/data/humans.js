import countdown from 'countdown';
import humanSchema from './schemas/humans';
import mongoose from 'mongoose';

/* eslint babel/new-cap : 0 */
const Human = mongoose.model('Human', humanSchema);

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

		return human.toObject();
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
			query = {
				humanId : options.humanId,
				username : options.username
			},
			startTime = new Date();

		// ensure we fields to retrieve by
		if (!Object.keys.length(query)) {
			throw new Error('data.humans.retrieve: humanId or username are required');
		}

		app.log.trace(
			'data.humans.retrieve: finding human %s',
			query.humanId || query.username);

		human = await Human.findOne(query);

		app.log.debug(
			'data.humans.retrieve: found human %s%s in %s',
			query.humanId || query.username,
			countdown(startTime, new Date(), countdown.MILLISECONDS));

		return human.toObject();
	};

	self.search = async (options) => {
		let
			result,
			startTime = new Date();

		app.log.trace(
			'data.humans.search: searching for humans');

		result = await Human
			.find({}, null, { lean : true })
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
			query = {
				humanId : options.humanId,
				username : options.username
			},
			startTime = new Date();

		app.log.trace(
			'data.humans.update: updating human %s',
			query.humanId || query.username);

		human = await Human.updateOne(query, data, {
			upsert : true
		});

		app.log.debug(
			'data.humans.update: updated human %s%s in %s',
			query.humanId || query.username,
			countdown(startTime, new Date(), countdown.MILLISECONDS));

		return human.toObject();
	};

	return self;
};