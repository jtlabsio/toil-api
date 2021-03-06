import boom from 'boom';
import countdown from 'countdown';
import mongoose from 'mongoose';
import { v4 } from 'uuid';

const
	RE_KEY_EMAIL = /^email:/i,
	RE_KEY_HUMAN_ID = /^[^:]*$|^humanid:/i;

export default function (app, request, data, self = {}) {
	app.log.trace('models.humans: initializing business layer for humans');

	self.create = async (human, index = 0) => {
		if (!human) {
			throw boom.badRequest(`index (${ index }): data is required to create a human`);
		}

		// handle scenarios when data is provided as an Array
		if (Array.isArray(human)) {
			let result = [];

			// create each human provided in order...
			/* eslint no-await-in-loop : 0 */
			for (let element of human) {
				element = await self.create(element, result.length);
				result.push(element);
			}

			return result;
		}

		if (!human.email) {
			throw boom.badRequest(`index (${ index }): email address is required to create a human`);
		}

		request.log.trace(
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
				throw boom.badRequest(ex.message, ex);
			}

			throw ex;
		}

		request.log.debug(
			'models.humans.create: completed create human (index: %d) with email %s in %s',
			index,
			human.email,
			countdown(startTime, new Date(), countdown.MILLISECONDS));

		return human;
	};

	self.lookup = async (key) => {
		if (!key) {
			throw boom.badRequest('email address or humanId is required to lookup a human');
		}

		request.log.trace(
			'models.humans.lookup: beginning to lookup a human with key %s',
			key);

		let
			human,
			options = {},
			startTime = new Date();

		if (RE_KEY_EMAIL.test(key)) {
			options.email = key.replace(RE_KEY_EMAIL, '');
		}

		if (RE_KEY_HUMAN_ID.test(key)) {
			options.humanId = key.replace(RE_KEY_HUMAN_ID, '') || key;
		}

		try {
			human = await data.humans.retrieve(options);
		} catch (ex) {
			if (ex instanceof mongoose.mongo.MongoError) {
				throw boom.badRequest(ex.message, ex);
			}

			throw ex;
		}

		if (!human) {
			throw boom.notFound(`human "${key}" not found`);
		}

		request.log.debug(
			'models.humans.lookup: completed lookup human %s in %s',
			options.humanId || options.email,
			countdown(startTime, new Date(), countdown.MILLISECONDS));

		return human;
	};

	self.search = async (options) => {
		if (!options) {
			throw boom.badRequest('options are required for search');
		}

		request.log.trace(
			'models.humans.search: beginning search for humans',
			options);

		let
			result,
			startTime = new Date();

		result = await data.humans.search(options);

		request.log.debug(
			'models.humans.search: completed search in %s',
			countdown(startTime, new Date(), countdown.MILLISECONDS));

		return result;
	};

	self.update = async (key, human) => {
		if (!human) {
			throw boom.badRequest('data is required to update a human');
		}

		if (!key) {
			throw boom.badRequest('email address or humanId is required to update a human');
		}

		request.log.trace(
			'models.humans.update: beginning to update a human with key %s',
			typeof key === 'string' ? key : (key.humanId || key.email));

		let
			options = typeof key === 'string' ? {} : key,
			startTime = new Date();

		if (typeof key === 'string') {
			if (RE_KEY_EMAIL.test(key)) {
				options.email = key.replace(RE_KEY_EMAIL, '');
			}

			if (RE_KEY_HUMAN_ID.test(key)) {
				options.humanId = key.replace(RE_KEY_HUMAN_ID, '') || key;
			}
		}

		try {
			human = await data.humans.update(options, human);
		} catch (ex) {
			if (ex instanceof mongoose.mongo.MongoError) {
				throw boom.badRequest(ex.message, ex);
			}

			throw ex;
		}

		request.log.debug(
			'models.humans.update: completed update human %s in %s',
			options.humanId || options.email,
			countdown(startTime, new Date(), countdown.MILLISECONDS));

		return human;
	};

	self.upsert = async (human, index = 0) => {
		if (!human) {
			throw boom.badRequest(`index (${ index }): data is required to create a human`);
		}

		// handle scenarios when data is provided as an Array
		if (Array.isArray(human)) {
			let result = [];

			// create each human provided in order...
			/* eslint no-await-in-loop : 0 */
			for (let element of human) {
				element = await self.upsert(element, result.length);
				result.push(element);
			}

			return result;
		}

		if (!human.email && !human.humanId) {
			throw boom.badRequest(
				`index (${ index }): email address or humanId is required to create or update a human`);
		}

		request.log.trace(
			'models.humans.upsert: beginning to create or update a human (index: %d) %s',
			index,
			human.email || human.humanId);

		let
			options = {},
			searchHuman,
			startTime = new Date();

		if (human.humanId) {
			options.humanId = human.humanId;
		} else {
			options.email = human.email;
		}

		try {
			searchHuman = await data.humans.retrieve(options);
		} catch (ex) {
			if (ex instanceof mongoose.mongo.MongoError) {
				throw boom.badRequest(ex.message, ex);
			}

			throw ex;
		}

		// check for insert path
		if (!searchHuman) {
			await self.create(human);
		} else {
			human = await self.update(options, human);
		}

		request.log.debug(
			'models.humans.upsert: completed create or update human (index: %d) %s in %s',
			index,
			options.humanId || options.email,
			countdown(startTime, new Date(), countdown.MILLISECONDS));

		return human;
	};

	return self;
}