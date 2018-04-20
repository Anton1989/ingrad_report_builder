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
            this._router.get('/kpi', this.allKpi.bind(this));
        }
        console.log('End init styles controller');
    }

    getRouter() {
        return this._router;
    }

    async all(req, res) {
        try {
            const places = await Styles.find({}).exec();
            return this._resp.formattedSuccessResponse(res, places, 200);
        } catch (error) {
            return this._resp.formattedErrorResponse(res, req, error.message, 500);
        }
    }

    async allKpi(req, res) {
        try {
            const styles = await KpiStyles.find({}).exec();
            return this._resp.formattedSuccessResponse(res, styles, 200);
        } catch (error) {
            return this._resp.formattedErrorResponse(res, req, error.message, 500);
        }
    }
}