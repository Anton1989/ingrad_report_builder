import mongoose, { Schema } from 'mongoose';
import Coordinate from './schemas/Coordinate';

const BuildSchema = new Schema({
    name: String,
    status: String,
    style: { type: Schema.Types.ObjectId, ref: 'styles' },
    ugol: String,
    camera: String,
    lat: String, 
    lng: String,
    type: String,
    coordinates: [Coordinate],
    placeId: Schema.Types.ObjectId
});

let builds = mongoose.model('builds', BuildSchema);

export default builds;