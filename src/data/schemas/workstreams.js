import * as plugins from './plugins';
import { Schema } from 'mongoose';

const WorkstreamSchema = new Schema({
	disabled : {
		default : false,
		index : true,
		required : true,
		type : Boolean
	},
	isCapexEligible : {
		default : true,
		required : true,
		type : Boolean
	},
	name : {
		index : {
			unique : true
		},
		required : true,
		type : String
	},
	workstreamId : {
		index : {
			unique : true
		},
		required : true,
		type : String
	}
}, {
	_id : false,
	useNestedStrict : true,
	versionKey : false
})

plugins.timestamps(WorkstreamSchema);
plugins.toObject(WorkstreamSchema);

export default WorkstreamSchema;