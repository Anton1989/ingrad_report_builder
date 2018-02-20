import { Router } from 'express';
import Response from '../models/responseDto';
import Styles from '../models/Styles';

export default class StylesController {

    constructor(netConfig) {
        console.log('Start init styles controller');
        this._resp = new Response();
        this._netConfig = netConfig;

        this._router = Router();
        if (this._router) {
            this._router.get('/', this.all.bind(this));

            this._router.put('/:id', this.update.bind(this));
            this._router.post('/', this.add.bind(this));
            this._router.delete('/:id', this.delete.bind(this));
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