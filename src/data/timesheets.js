import countdown from 'countdown';
import mongoose from 'mongoose';
import timesheetSchema from './schemas/timesheets';

/* eslint babel/new-cap : 0 */
const
	DEFAULT_OBJECT_FILTER = {
		filter : ['_id']
	},
	DEFAULT_PROJECTION = {
		__v : 0,
		_id : 0
	},
	DEFAULT_SEARCH_OPTIONS = {
		lean : true
	},
	Timesheet = mongoose.model('Timesheet', timesheetSchema);

export default async (app, request, self = {}) => {
	app.log.trace('data.timesheets: initializing data access mapper for timesheets');

	self.create = async (data) => {
		let
			startTime = new Date(),
			timesheet = new Timesheet(data);

		request.log.trace('data.timesheets.create: creating timesheet %s', timesheet.timesheetId);

		await timesheet.save();

		request.log.debug(
			'data.timesheets.create: created timesheet %s in %s',
			timesheet.timesheetId,
			countdown(startTime, new Date(), countdown.MILLISECONDS));

		return timesheet.toObject(DEFAULT_OBJECT_FILTER);
	};

	self.delete = async (options) => {
		let
			startTime = new Date(),
			timesheet;

		// ensure we fields to delete by
		if (!Object.keys(options).length) {
			throw new Error('data.timesheets.delete: timesheetId is required');
		}

		request.log.trace(
			'data.timesheets.delete: deleting timesheet %s',
			options.timesheetId);

		timesheet = await Timesheet.findOneAndDelete(options);

		request.log.debug(
			'data.timesheets.delete: deleted timesheet %s in %s',
			options.timesheetId,
			countdown(startTime, new Date(), countdown.MILLISECONDS));

		return timesheet.toObject(DEFAULT_OBJECT_FILTER);
	};

	self.retrieve = async (options) => {
		let
			startTime = new Date(),
			timesheet;

		// ensure we fields to retrieve by
		if (!Object.keys(options).length) {
			throw new Error('data.timesheets.retrieve: timesheetId is required');
		}

		request.log.trace(
			'data.timesheets.retrieve: finding timesheet %s',
			options.timesheetId);

		timesheet = await Timesheet.findOne(options, DEFAULT_PROJECTION, DEFAULT_SEARCH_OPTIONS);

		request.log.debug(
			'data.timesheets.retrieve: %s timesheet %s in %s',
			timesheet ? 'found' : 'unable to find',
			options.timesheetId,
			countdown(startTime, new Date(), countdown.MILLISECONDS));

		return timesheet;
	};

	self.search = async (options) => {
		let
			result,
			startTime = new Date();

		request.log.trace(
			'data.timesheets.search: searching for timesheets');

		result = await Timesheet
			.find({}, DEFAULT_PROJECTION, DEFAULT_SEARCH_OPTIONS)
			.field(options)
			.filter(options)
			.order(options)
			.page(options);

		request.log.debug(
			'data.timesheets.update: found %d timesheets in %s',
			result.total,
			countdown(startTime, new Date(), countdown.MILLISECONDS));

		return result;
	};

	self.update = async (options, data) => {
		let
			startTime = new Date(),
			timesheet;

		// ensure we fields to update by
		if (!Object.keys(options).length) {
			throw new Error('data.timesheets.update: timesheetId is required');
		}

		request.log.trace(
			'data.timesheets.update: updating timesheet %s',
			options.timesheetId);

		timesheet = await Timesheet.findOneAndUpdate(
			options,
			data,
			{
				new : true,
				rawRresult : true
			});

		request.log.debug(
			'data.timesheets.update: updated timesheet %s in %s',
			options.timesheetId,
			countdown(startTime, new Date(), countdown.MILLISECONDS));

		return timesheet.toObject(DEFAULT_OBJECT_FILTER);
	};

	return self;
};