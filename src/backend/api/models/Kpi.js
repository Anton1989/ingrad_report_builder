import mongoose, { Schema } from 'mongoose';
import KpiPlans from './schemas/KpiPlans';
import KpiEvents from './schemas/KpiEvents';

const KpiSchema = new Schema({
    name: String,
    title: String,
    role: String,
    planes: [KpiPlans],
    events: [KpiEvents],
    created_at: { type: Date, default: Date.now }
})

let kpi = mongoose.model('kpi', KpiSchema);

export default kpi;