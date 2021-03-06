import * as plugins from './plugins';
import { Schema } from 'mongoose';

const TaskSchema = new Schema({
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
	},
	taskId : {
		index : {
			unique : true
		},
		required : true,
		type : String
	}
}, {
	useNestedStrict : true
})

plugins.timestamps(TaskSchema);
plugins.toObject(TaskSchema);

export default TaskSchema;