import { Schema } from 'mongoose';
import Coordinate from './Coordinate';

export default new Schema({
    name: String,
    status: String,
    width: Number,
    strokColor: String,
    color: String,
    camera: String,
    type: String,
    coordinates: [Coordinate]
});