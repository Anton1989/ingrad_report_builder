const mongoose = require('mongoose');
const { Schema } = mongoose;

const FloorSchema = new Schema({
    number: String,
    type: String
})

let floors = mongoose.model('floors', FloorSchema);

module.exports = floors;
