import { Schema } from 'mongoose';

export default new Schema({
    name: String,
    taskId: String,
    haveChildren: Boolean,
    parentId: String,
    percentComplete: Number,
    kt: String,
    statusReport: String,
    to: String,
    baselineDuration: String
});