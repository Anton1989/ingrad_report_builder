import { Router } from 'express';
import Response from '../models/responseDto';
import Projects from '../models/Projects';
//import Floors from '../models/Floors';
//import Sections from '../models/Sections';

export default class ProjectsController {

    constructor(netConfig) {
        console.log('Start init projects controller');
        this._resp = new Response();
        this._netConfig = netConfig;

        this._router = Router();
        if (this._router) {
            this._router.get('/', this.all.bind(this));
            this._router.get('/:id', this.getById.bind(this));

            this._router.put('/:id', this.update.bind(this));
            this._router.post('/', this.add.bind(this));
        }
        console.log('End init projects controller');
    }

    getRouter() {
        return this._router;
    }

    async all(req, res) {
        try {
            const projects = await Projects.find({}).populate([{
                path: 'floors',
                populate: {
                    path: 'sections'
                },
                options: { sort: { number: -1 } }
            }, {
                path: 'sections'
            }]).exec();
            return this._resp.formattedSuccessResponse(res, projects, 200);
        } catch (error) {
            return this._resp.formattedErrorResponse(res, req, error.message, 500);
        }

    }

    getById(req, res) {
        return this._resp.formattedSuccessResponse(res, {}, 200);
    }

    update(req, res) {
        return this._resp.formattedSuccessResponse(res, {}, 200);
    }

    add(req, res) {
        return this._resp.formattedSuccessResponse(res, {}, 200);
    }
}