import mongoose, { Schema } from 'mongoose';

const StylesSchema = new Schema({
    name: String,
    textColor: String,
    cellColor: String,
    textStyle: String
})

let styles = mongoose.model('kpiStyles', StylesSchema);

export default styles;