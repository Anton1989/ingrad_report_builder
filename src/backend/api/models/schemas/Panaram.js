import { Schema } from 'mongoose';
import Coordinate from './Coordinate';

export default new Schema({
    src: String,
    coordinates: Coordinate
});