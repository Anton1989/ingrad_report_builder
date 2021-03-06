import mongoose, { Schema } from 'mongoose';

const SectionSchema = new Schema({
    name: String,
    undeground: Number,
    floors: Number,
    techFloors: Number,
    machFloors: Number,
    areaCoefficient: Number,
    floors: [{ type: Schema.Types.ObjectId, ref: 'floors' }]
})

let sections = mongoose.model('sections', SectionSchema);

export default sections;