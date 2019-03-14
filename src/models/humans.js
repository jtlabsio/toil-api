import boom from 'boom';

export default function (app, data, self = {}) {
	self.search = async (options) => {
		if (!options) {
			throw boom.notAcceptable('options are required for search');
		}

		return await data.humans.search(options);
	};

	return self;
}