import accountSchema from './schemas/accounts';
import countdown from 'countdown';
import mongoose from 'mongoose';

/* eslint babel/new-cap : 0 */
const
	Account = mongoose.model('Account', accountSchema),
	DEFAULT_OBJECT_FILTER = {
		filter : ['_id']
	},
	DEFAULT_PROJECTION = {
		__v : 0,
		_id : 0
	},
	DEFAULT_SEARCH_OPTIONS = {
		lean : true
	};

export default async (app, request, self = {}) => {
	app.log.trace('data.accounts: initializing data access mapper for accounts');

	self.create = async (data) => {
		let
			account = new Account(data),
			startTime = new Date();

		request.log.trace('data.accounts.create: creating account %s', account.accountId);

		await account.save();

		request.log.debug(
			'data.accounts.create: created account %s in %s',
			account.accountId,
			countdown(startTime, new Date(), countdown.MILLISECONDS));

		return account.toObject(DEFAULT_OBJECT_FILTER);
	};

	self.delete = async (options) => {
		let
			account,
			startTime = new Date();

		// ensure we fields to delete by
		if (!Object.keys(options).length) {
			throw new Error('data.accounts.delete: accountId or name is required');
		}

		request.log.trace(
			'data.accounts.delete: deleting account %s',
			options.accountId || options.name);

		account = await Account.findOneAndDelete(options);

		request.log.debug(
			'data.accounts.delete: deleted account %s in %s',
			options.accountId || options.name,
			countdown(startTime, new Date(), countdown.MILLISECONDS));

		return account.toObject(DEFAULT_OBJECT_FILTER);
	};

	self.retrieve = async (options) => {
		let
			account,
			startTime = new Date();

		// ensure we fields to retrieve by
		if (!Object.keys(options).length) {
			throw new Error('data.accounts.retrieve: accountId or name is required');
		}

		request.log.trace(
			'data.accounts.retrieve: finding account %s',
			options.accountId || options.name);

		account = await Account.findOne(options, DEFAULT_PROJECTION, DEFAULT_SEARCH_OPTIONS);

		request.log.debug(
			'data.accounts.retrieve: %s account %s in %s',
			account ? 'found' : 'unable to find',
			options.accountId || options.name,
			countdown(startTime, new Date(), countdown.MILLISECONDS));

		return account;
	};

	self.search = async (options) => {
		let
			result,
			startTime = new Date();

		request.log.trace(
			'data.accounts.search: searching for accounts');

		result = await Account
			.find({}, DEFAULT_PROJECTION, DEFAULT_SEARCH_OPTIONS)
			.field(options)
			.filter(options)
			.order(options)
			.page(options);

		request.log.debug(
			'data.accounts.update: found %d accounts in %s',
			result.total,
			countdown(startTime, new Date(), countdown.MILLISECONDS));

		return result;
	};

	self.update = async (options, data) => {
		let
			account,
			startTime = new Date();

		// ensure we fields to update by
		if (!Object.keys(options).length) {
			throw new Error('data.accounts.update: accountId or name is required');
		}

		request.log.trace(
			'data.accounts.update: updating account %s',
			options.accountId || options.name);

		account = await Account.findOneAndUpdate(
			options,
			data,
			{
				new : true,
				rawRresult : true
			});

		request.log.debug(
			'data.accounts.update: updated account %s in %s',
			options.accountId || options.name,
			countdown(startTime, new Date(), countdown.MILLISECONDS));

		return account.toObject(DEFAULT_OBJECT_FILTER);
	};

	return self;
};