const mongoose = require('mongoose');
const { Schema } = mongoose;
const Coordinate = require('./Coordinate');

module.exports = new Schema({
    name: String,
    status: String,
    style: { type: Schema.Types.ObjectId, ref: 'styles' },
    camera: String,
    type: String,
    coordinates: [Coordinate]
});