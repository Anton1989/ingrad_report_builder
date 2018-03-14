import { Schema } from 'mongoose';
import Coordinate from './Coordinate';

export default new Schema({
    name: String,
    image: String,
    opcity: Number,
    coordinates: [Coordinate]
});