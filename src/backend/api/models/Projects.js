import mongoose, { Schema } from 'mongoose';

const ProjectSchema = new Schema({
    comercialName: String,
    agreementNo: String,
    counterparty: String,
    city: String,
    to: String,
    toType: String,
    subject: String,
    buildingArea: Number,
    generalArea: Number,
    startCMP: Date,
    endCMP: Date,
    numberOfBk: Number,
    piles: Boolean,
    floors: [{ type: Schema.Types.ObjectId, ref: 'floors' }],
    sections: [{ type: Schema.Types.ObjectId, ref: 'sections' }]
})

let projects = mongoose.model('projects', ProjectSchema);

export default projects;