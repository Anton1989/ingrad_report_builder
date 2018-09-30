import mongoose, { Schema } from 'mongoose';
import Coordinate from './schemas/Coordinate';

const LayerSchema = new Schema({
    name: String,
    image: String,
    opcity: Number,
    coordinates: [Coordinate],
    placeId: Schema.Types.ObjectId
});

let layers = mongoose.model('layers', LayerSchema);

export default layers;