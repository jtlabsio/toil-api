import boom from 'boom';
import countdown from 'countdown';
import mongoose from 'mongoose';
import { v4 } from 'uuid';

export default function (app, data, self = {}) {
	self.create = async (human, index = 0) => {
		if (!human) {
			throw boom.notAcceptable(`index (${ index }): data is required to create a human`);
		}

		// handle scenarios when data is provided as an Array
		if (Array.isArray(human)) {
			let result = [];

			// create each human provided in order...
			for (let element of human) {
				element = await self.create(element, result.length);
				result.push(element);
			}

			return result;
		}

		if (!human.email) {
			throw boom.notAcceptable(`index (${ index }): email address is required to create a human`);
		}

		app.log.trace(
			'models.humans.create: beginning to create a human (index: %d) with email %s',
			index,
			human.email);

		// assign a humanId
		if (!human.humanId) {
			human.humanId = v4().replace(/\-/g, '');
		}

		let startTime = new Date();

		try {
			await data.humans.create(human);
		} catch (ex) {
			if (ex instanceof mongoose.mongo.MongoError) {
				throw boom.badData(ex.message, ex);
			}

			throw ex;
		}

		app.log.debug(
			'models.humans.create: completed create human (index: %d) with email %s in %s',
			index,
			human.email,
			countdown(startTime, new Date(), countdown.MILLISECONDS));

		return human;
	};

	self.search = async (options) => {
		if (!options) {
			throw boom.notAcceptable('options are required for search');
		}

		app.log.trace(
			'models.humans.search: beginning search for humans',
			options);

		let
			result,
			startTime = new Date();

		result = await data.humans.search(options);

		app.log.debug(
			'models.humans.search: completed search in %s',
			countdown(startTime, new Date(), countdown.MILLISECONDS));

		return result;
	};

	return self;
}