const mongoose = require('mongoose');
const { Schema } = mongoose;

module.exports = new Schema({
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