import * as plugins from './plugins';
import { Schema } from 'mongoose';

const TimesheetSchema = new Schema({
	disabled : {
		default : false,
		index : true,
		required : true,
		type : Boolean
	},
	hours : [{
		duration : {
			required : true,
			type : Number
		},
		periodOffset : {
			required : true,
			type : Number
		},
		task : {
			id : {
				index : true,
				required : true,
				type : String
			},
			isCapexEligible : {
				default : false,
				required : true,
				type : Boolean
			},
			name : {
				required : true,
				type : String
			}
		},
		workstream : {
			name : {
				required : true,
				type : String
			},
			workstreamId : {
				index : true,
				required : true,
				type : String
			}
		}
	}],
	human : {
		id : {
			index : true,
			required : true,
			type : String
		},
		username : {
			index : true,
			required : true,
			type : String
		}
	},
	period : {
		duration : {
			required : true,
			type : Number
		},
		periodStart : {
			index : true,
			required : true,
			type : Date
		}
	},
	submitted : {
		required : false,
		type : Date
	},
	timesheetId : {
		index : {
			unique : true
		},
		required : true,
		type : String
	}
}, {
	useNestedStrict : true
})

plugins.timestamps(TimesheetSchema);
plugins.toObject(TimesheetSchema);

export default TimesheetSchema;