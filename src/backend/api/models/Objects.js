const mongoose = require('mongoose');
const { Schema } = mongoose;

const ObjectsSchema = new Schema({
    name: String,
    fullName: String,
    code: String,
    parent: String,
    projectId: String
})

let objects = mongoose.model('objects', ObjectsSchema);

module.exports = objects;