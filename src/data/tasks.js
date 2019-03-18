import countdown from 'countdown';
import mongoose from 'mongoose';
import taskSchema from './schemas/tasks';

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
	Task = mongoose.model('Task', taskSchema);

export default async (app, request, self = {}) => {
	app.log.trace('data.tasks: initializing data access mapper for tasks');

	self.create = async (data) => {
		let
			startTime = new Date(),
			task = new Task(data);

		request.log.trace('data.tasks.create: creating task %s', task.taskId);

		await task.save();

		request.log.debug(
			'data.tasks.create: created task %s in %s',
			task.taskId,
			countdown(startTime, new Date(), countdown.MILLISECONDS));

		return task.toObject(DEFAULT_OBJECT_FILTER);
	};

	self.delete = async (options) => {
		let
			startTime = new Date(),
			task;

		// ensure we fields to delete by
		if (!Object.keys(options).length) {
			throw new Error('data.tasks.delete: taskId or name is required');
		}

		request.log.trace(
			'data.tasks.delete: deleting task %s',
			options.taskId || options.name);

		task = await Task.findOneAndDelete(options);

		request.log.debug(
			'data.tasks.delete: deleted task %s in %s',
			options.taskId || options.name,
			countdown(startTime, new Date(), countdown.MILLISECONDS));

		return task.toObject(DEFAULT_OBJECT_FILTER);
	};

	self.retrieve = async (options) => {
		let
			startTime = new Date(),
			task;

		// ensure we fields to retrieve by
		if (!Object.keys(options).length) {
			throw new Error('data.tasks.retrieve: taskId or name is required');
		}

		request.log.trace(
			'data.tasks.retrieve: finding task %s',
			options.taskId || options.name);

		task = await Task.findOne(options, DEFAULT_PROJECTION, DEFAULT_SEARCH_OPTIONS);

		request.log.debug(
			'data.tasks.retrieve: %s task %s in %s',
			task ? 'found' : 'unable to find',
			options.taskId || options.name,
			countdown(startTime, new Date(), countdown.MILLISECONDS));

		return task;
	};

	self.search = async (options) => {
		let
			result,
			startTime = new Date();

		request.log.trace(
			'data.tasks.search: searching for tasks');

		result = await Task
			.find({}, DEFAULT_PROJECTION, DEFAULT_SEARCH_OPTIONS)
			.field(options)
			.filter(options)
			.order(options)
			.page(options);

		request.log.debug(
			'data.tasks.update: found %d tasks in %s',
			result.total,
			countdown(startTime, new Date(), countdown.MILLISECONDS));

		return result;
	};

	self.update = async (options, data) => {
		let
			startTime = new Date(),
			task;

		// ensure we fields to update by
		if (!Object.keys(options).length) {
			throw new Error('data.tasks.update: taskId or name is required');
		}

		request.log.trace(
			'data.tasks.update: updating task %s',
			options.taskId || options.name);

		task = await Task.findOneAndUpdate(
			options,
			data,
			{
				new : true,
				rawRresult : true
			});

		request.log.debug(
			'data.tasks.update: updated task %s in %s',
			options.taskId || options.name,
			countdown(startTime, new Date(), countdown.MILLISECONDS));

		return task.toObject(DEFAULT_OBJECT_FILTER);
	};

	return self;
};