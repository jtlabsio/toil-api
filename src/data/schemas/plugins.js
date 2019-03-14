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
		versionKey : false
	});
}
