const mongoose = require('mongoose');
const { Schema } = mongoose;
const Coordinate = require('./schemas/Coordinate');
const House = require('./schemas/House');
const Layer = require('./schemas/Layer');

const PlacesSchema = new Schema({
    name: String,
    description: String,
    step: String,
    site: String,
    camera: String,
    photo: String,
    address: String,
    coordinates: Coordinate,
    houses: [House],
    layers: [Layer],
    location: String,
    logo: String,
    image: String
})

let places = mongoose.model('places', PlacesSchema);

module.exports = places;