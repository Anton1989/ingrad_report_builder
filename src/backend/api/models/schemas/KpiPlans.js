import { Schema } from 'mongoose';

export default new Schema({
    name: String,
    nameStyle: Schema.Types.ObjectId,
    kv1: String,
    kv1Style: Schema.Types.ObjectId,
    kv2: String,
    kv2Style: Schema.Types.ObjectId,
    kv3: String,
    kv3Style: Schema.Types.ObjectId,
    year: String,
    yearStyle: Schema.Types.ObjectId,
    actual: String,
    actualStyle: Schema.Types.ObjectId,
    weight: String,
    weightStyle: Schema.Types.ObjectId,
    rate: String,
    rateStyle: Schema.Types.ObjectId,
    info: String,
    infoStyle: Schema.Types.ObjectId
});