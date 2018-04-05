import { Schema } from 'mongoose';

export default new Schema({
    name: String,
    kv1: String,
    kv2: String,
    kv3: String,
    year: String,
    actual: String,
    weight: String,
    rate: String,
    info: String
});