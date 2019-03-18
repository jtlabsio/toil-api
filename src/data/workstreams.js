import countdown from 'countdown';
import mongoose from 'mongoose';
import workstreamSchema from './schemas/workstreams';

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
	Workstream = mongoose.model('Workstream', workstreamSchema);

export default async (app, request, self = {}) => {
	app.log.trace('data.workstreams: initializing data access mapper for workstreams');

	self.create = async (data) => {
		let
			startTime = new Date(),
			workstream = new Workstream(data);

		request.log.trace(
			'data.workstreams.create: creating workstream %s',
			workstream.workstreamId);

		await workstream.save();

		request.log.debug(
			'data.workstreams.create: created workstream %s in %s',
			workstream.workstreamId,
			countdown(startTime, new Date(), countdown.MILLISECONDS));

		return workstream.toObject(DEFAULT_OBJECT_FILTER);
	};

	self.delete = async (options) => {
		let
			startTime = new Date(),
			workstream;

		// ensure we fields to delete by
		if (!Object.keys(options).length) {
			throw new Error('data.workstreams.delete: workstreamId or name is required');
		}

		request.log.trace(
			'data.workstreams.delete: deleting workstream %s',
			options.workstreamId || options.name);

		workstream = await Workstream.findOneAndDelete(options);

		request.log.debug(
			'data.workstreams.delete: deleted workstream %s in %s',
			options.workstreamId || options.name,
			countdown(startTime, new Date(), countdown.MILLISECONDS));

		return workstream.toObject(DEFAULT_OBJECT_FILTER);
	};

	self.retrieve = async (options) => {
		let
			startTime = new Date(),
			workstream;

		// ensure we fields to retrieve by
		if (!Object.keys(options).length) {
			throw new Error('data.workstreams.retrieve: workstreamId or name is required');
		}

		request.log.trace(
			'data.workstreams.retrieve: finding workstream %s',
			options.workstreamId || options.name);

		workstream = await Workstream.findOne(options, DEFAULT_PROJECTION, DEFAULT_SEARCH_OPTIONS);

		request.log.debug(
			'data.workstreams.retrieve: %s workstream %s in %s',
			workstream ? 'found' : 'unable to find',
			options.workstreamId || options.name,
			countdown(startTime, new Date(), countdown.MILLISECONDS));

		return workstream;
	};

	self.search = async (options) => {
		let
			result,
			startTime = new Date();

		request.log.trace(
			'data.workstreams.search: searching for workstreams');

		result = await Workstream
			.find({}, DEFAULT_PROJECTION, DEFAULT_SEARCH_OPTIONS)
			.field(options)
			.filter(options)
			.order(options)
			.page(options);

		request.log.debug(
			'data.workstreams.update: found %d workstreams in %s',
			result.total,
			countdown(startTime, new Date(), countdown.MILLISECONDS));

		return result;
	};

	self.update = async (options, data) => {
		let
			startTime = new Date(),
			workstream;

		// ensure we fields to update by
		if (!Object.keys(options).length) {
			throw new Error('data.workstreams.update: workstreamId or name is required');
		}

		request.log.trace(
			'data.workstreams.update: updating workstream %s',
			options.workstreamId || options.name);

		workstream = await Workstream.findOneAndUpdate(
			options,
			data,
			{
				new : true,
				rawRresult : true
			});

		request.log.debug(
			'data.workstreams.update: updated workstream %s in %s',
			options.workstreamId || options.name,
			countdown(startTime, new Date(), countdown.MILLISECONDS));

		return workstream.toObject(DEFAULT_OBJECT_FILTER);
	};

	return self;
};