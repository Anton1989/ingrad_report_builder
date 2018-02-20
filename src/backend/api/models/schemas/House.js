import { Schema } from 'mongoose';
import Coordinate from './Coordinate';

export default new Schema({
    name: String,
    status: String,
    style: { type: Schema.Types.ObjectId, ref: 'styles' },
    camera: String,
    type: String,
    coordinates: [Coordinate]
});