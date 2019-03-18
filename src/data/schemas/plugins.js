export function timestamps (schema) {
	schema.add({
		created : {
			default : Date.now(),
			type : Date
		},
		modified : {
			default : Date.now(),
			type : Date
		}
	});
}

export function toObject (schema) {
	schema.set('toObject', {
		flattenMaps : true,
		minimize : true,
		transform : (document, result, options) => {
			if (options && options.filter) {
				// ensure the filtered values are specified as an Array
				options.filter = Array.isArray(options.filter) ?
					options.filter :
					[options.filter];

				options.filter.forEach((field) => delete result[field]);
			}
		},
		versionKey : false
	});
}
