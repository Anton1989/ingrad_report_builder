import mongoose, { Schema } from 'mongoose';

const StylesSchema = new Schema({
    name: String,
    width: Number,
    strokColor: String,
    color: String,
    fillOpacity: Number,
    strokeOpacity: Number,
    lineStyle: String
})

let styles = mongoose.model('styles', StylesSchema);

export default styles;