const mongoose = require('mongoose');
const { Schema } = mongoose;
const Tasks = require('./schemas/Tasks');

const ProjectSchema = new Schema({
    guid: String,
    name: String,
    sortId: Number,
    location: String,
    tasks: [Tasks],
    tasksAmount: Number,
    projectIntegrationId: String,
    published: Date
})

// let projects = mongoose.model('projects', ProjectSchema);

module.exports = ProjectSchema;