import mongoose, { Schema } from 'mongoose';
import KpiPlans from './schemas/KpiPlans';
import KpiEvents from './schemas/KpiEvents';

const KpiSchema = new Schema({
    name: String,
    nameStyle: Schema.Types.ObjectId,
    title: String,
    titleStyle: Schema.Types.ObjectId,
    cdesc: String,
    cdescStyle: Schema.Types.ObjectId,
    role: String,
    roleStyle: Schema.Types.ObjectId,
    planes: [KpiPlans],
    events: [KpiEvents],
    created_at: { type: Date, default: Date.now }
})

let kpi = mongoose.model('kpi', KpiSchema);

export default kpi;