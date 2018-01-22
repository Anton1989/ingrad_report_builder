import mongoose, { Schema } from 'mongoose';

const PlacesSchema = new Schema({
    name: String,
    description: String,
    site: String,
    camera: String,
    address: String
})

let places = mongoose.model('places', PlacesSchema);

export default places;