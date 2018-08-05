import mongoose, { Schema } from 'mongoose';

const DocsSchema = new Schema({
    name: String,
    project_id: String,
    step_id: String,
    comment: String,
    agent: String,
    how: String,
    status: String,
    point: String,
    type: String,
    version: Number,
    tuTypes: [String],
    number: Number,
    file: String,
    dateDoc: { type: Date, default: Date.now },
    loaded_at: { type: Date, default: Date.now }
})

let docs = mongoose.model('docs', DocsSchema);

export default docs;