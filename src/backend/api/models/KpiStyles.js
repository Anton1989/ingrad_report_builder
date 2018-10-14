const mongoose = require('mongoose');
const { Schema } = mongoose;

const StylesSchema = new Schema({
    name: String,
    textColor: String,
    cellColor: String,
    textStyle: String
})

let styles = mongoose.model('kpiStyles', StylesSchema);

module.exports = styles;