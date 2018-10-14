const mongoose = require('mongoose');
const { Schema } = mongoose;
const Coordinate = require('./Coordinate');

module.exports = new Schema({
    name: String,
    image: String,
    opcity: Number,
    coordinates: [Coordinate]
});