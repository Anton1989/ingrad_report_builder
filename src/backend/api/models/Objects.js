import mongoose, { Schema } from 'mongoose';

const ObjectsSchema = new Schema({
    name: String,
    fullName: String,
    code: String,
    parent: String,
    projectId: String
})

let objects = mongoose.model('objects', ObjectsSchema);

export default objects;