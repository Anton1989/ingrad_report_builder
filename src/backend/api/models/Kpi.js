const mongoose = require('mongoose');
const { Schema } = mongoose;
const KpiPlans = require('./schemas/KpiPlans');
const KpiEvents = require('./schemas/KpiEvents');

const KpiSchema = new Schema({
    name: String,
    nameStyle: Schema.Types.ObjectId,
    title: String,
    titleStyle: Schema.Types.ObjectId,
    planes: [KpiPlans],
    events: [KpiEvents],
    created_at: { type: Date, default: Date.now }
})

let kpi = mongoose.model('kpi', KpiSchema);

module.exports = kpi;