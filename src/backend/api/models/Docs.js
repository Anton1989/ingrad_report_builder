import mongoose, { Schema } from 'mongoose';

const DocsSchema = new Schema({
    name: String,
    type: String,
    project: String,
    object: String,
    recieved_at: { type: Date, default: Date.now },
    comment: String,
    loaded_at: { type: Date, default: Date.now },
    assigned: String
})

let docs = mongoose.model('docs', DocsSchema);

export default docs;