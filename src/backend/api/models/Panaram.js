import mongoose, { Schema } from 'mongoose';
import Coordinate from './schemas/Coordinate';

const PanaramsSchema = new Schema({
    src: String,
    name: String,
    placeId: Schema.Types.ObjectId,
    coordinates: Coordinate
});

let panarams = mongoose.model('panarams', PanaramsSchema);

export default panarams;