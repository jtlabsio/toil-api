import * as plugins from './plugins';
import { Schema } from 'mongoose';

const HumanSchema = new Schema({
	accounts : [{
		accountId : {
			index : true,
			required : true,
			type : String
		},
		claims : {
			required : false,
			type : String
		}
	}],
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
	email : {
		default : false,
		index : {
			unique : true
		},
		required : true,
		type : String
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
	}
}, {
	useNestedStrict : true
})

plugins.timestamps(HumanSchema);
plugins.toObject(HumanSchema);

export default HumanSchema;