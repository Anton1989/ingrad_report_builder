import mongoose, { Schema } from 'mongoose';

const FloorSchema = new Schema({
    number: String,
    type: String
})

let floors = mongoose.model('floors', FloorSchema);

export default floors;
