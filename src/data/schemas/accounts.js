import * as plugins from './plugins';
import { Schema } from 'mongoose';

const AccountSchema = new Schema({
	accountId : {
		index : {
			unique : true
		},
		required : true,
		type : String
	},
	disabled : {
		default : false,
		index : true,
		required : true,
		type : Boolean
	},
	name : {
		index : {
			unique : true
		},
		required : true,
		type : String
	}
}, {
	useNestedStrict : true
})

plugins.timestamps(AccountSchema);
plugins.toObject(AccountSchema);

export default AccountSchema;