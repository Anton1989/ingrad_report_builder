import { Router } from 'express';
import Response from '../models/responseDto';
import Styles from '../models/Styles';
import KpiStyles from '../models/KpiStyles';

export default class StylesController {

    constructor(netConfig) {
        console.log('Start init styles controller');
        this._resp = new Response();
        this._netConfig = netConfig;

        this._router = Router();
        if (this._router) {
            this._router.get('/map', this.all.bind(this));
            this._router.put('/map/:id', this.update.bind(this));
            this._router.post('/map/', this.add.bind(this));
            this._router.delete('/map/:id', this.delete.bind(this));

            this._router.get('/kpi', this.allKpi.bind(this));
            this._router.put('/kpi/:id', this.update.bind(this));
            this._router.post('/kpi/', this.addKpi.bind(this));
            this._router.delete('/kpi/:id', this.delete.bind(this));
        }
        console.log('End init styles controller');
    }

    getRouter() {
        return this._router;
    }

    async allKpi(req, res) {
        try {
            const styles = await KpiStyles.find({}).exec();
            return this._resp.formattedSuccessResponse(res, styles, 200);
        } catch (error) {
            return this._resp.formattedErrorResponse(res, req, error.message, 500);
        }
    }

    async addKpi(req, res) {
        let data = req.body.styles;
        
        try {
            let resp = [];
            for (let i=0; i<data.length; i++) {
                if (data[i]._id) {
                    let id = data[i]._id;
                    delete data[i]._id;
                    console.log(data[i])
                    resp.push(await KpiStyles.findByIdAndUpdate(id, { $set: data[i] }, { new: true }));
                } else {
                    let style = new KpiStyles(data[i]);
                    resp.push(await style.save());
                }
            }
            return this._resp.formattedSuccessResponse(res, resp, 200);
        } catch (error) {
            console.error(error);
            return res.status(500).send(error);
        }
    }

    async all(req, res) {
        try {
            const places = await Styles.find({}).exec();
            return this._resp.formattedSuccessResponse(res, places, 200);
        } catch (error) {
            return this._resp.formattedErrorResponse(res, req, error.message, 500);
        }

    }

    async update(req, res) {
        return this._resp.formattedSuccessResponse(res, {}, 200);
    }

    async add(req, res) {
        let data = req.body.styles;
        
        try {
            let resp = [];
            for (let i=0; i<data.length; i++) {
                if (data[i]._id) {
                    let id = data[i]._id;
                    delete data[i]._id;
                    console.log(data[i])
                    resp.push(await Styles.findByIdAndUpdate(id, { $set: data[i] }, { new: true }));
                } else {
                    let style = new Styles(data[i]);
                    resp.push(await style.save());
                }
            }
            return this._resp.formattedSuccessResponse(res, resp, 200);
        } catch (error) {
            console.error(error);
            return res.status(500).send(error);
        }
    }

    delete(req, res) {
        return this._resp.formattedSuccessResponse(res, {}, 200);
    }
}