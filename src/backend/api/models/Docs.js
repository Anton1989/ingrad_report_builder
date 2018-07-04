import mongoose, { Schema } from 'mongoose';

const DocsSchema = new Schema({
    name: String,
    project_id: String,
    step_id: String,
    comment: String,
    assigned: String,
    file: String,
    recieved_at: { type: Date, default: Date.now },
    loaded_at: { type: Date, default: Date.now }
})

let docs = mongoose.model('docs', DocsSchema);

export default docs;