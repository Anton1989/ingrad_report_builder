import mongoose, { Schema } from 'mongoose';
import Coordinate from './schemas/Coordinate';

const PlacesSchema = new Schema({
    name: String,
    description: String,
    step: String,
    site: String,
    camera: String,
    photo: String,
    address: String,
    coordinates: Coordinate,
    location: String,
    logo: String,
    image: String
})

let places = mongoose.model('places', PlacesSchema);

export default places;