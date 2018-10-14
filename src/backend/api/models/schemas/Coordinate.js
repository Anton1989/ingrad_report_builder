const mongoose = require('mongoose');
const { Schema } = mongoose;

module.exports = new Schema({
    lat: Number,
    lng: Number
});