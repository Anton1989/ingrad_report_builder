import mongoose, { Schema } from 'mongoose';
import Tasks from './schemas/Tasks';

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

let projects = mongoose.model('projects', ProjectSchema);

export default projects;