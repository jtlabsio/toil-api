import * as plugins from './plugins';
import { Schema } from 'mongoose';

const HumanSchema = new Schema({
	attributes : [{
		key : {
			required : false,
			type : String
		},
		value : {
			required : false,
			type : String
		}
	}],
	disabled : {
		default : false,
		index : true,
		required : true,
		type : Boolean
	},
	fullname : {
		required : false,
		type : String
	},
	humanId : {
		index : {
			unique : true
		},
		required : true,
		type : String
	},
	username : {
		index : {
			unique : true
		},
		required : true,
		type : String
	}
}, {
	_id : false,
	useNestedStrict : true,
	versionKey : true
})

plugins.timestamps(HumanSchema);
plugins.toObject(HumanSchema);

export default HumanSchema;