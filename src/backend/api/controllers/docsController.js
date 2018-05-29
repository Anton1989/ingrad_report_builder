import { Router } from 'express';
import fs from 'fs';
import Response from '../models/responseDto';
import Docs from '../models/Docs';

export default class DocsController {

    constructor(netConfig) {
        console.log('Start init places controller');
        this._resp = new Response();
        this._netConfig = netConfig;

        this._router = Router();
        if (this._router) {
            this._router.get('/', this.all.bind(this));
            // this._router.get('/:id', this.getById.bind(this));

            this._router.put('/:id', this.update.bind(this));
            this._router.post('/', this.add.bind(this));
            this._router.delete('/:id', this.delete.bind(this));
        }
        console.log('End init places controller');
    }

    getRouter() {
        return this._router;
    }

    async all(req, res) {
        try {
            const docs = await Docs.find({}).exec();
            return this._resp.formattedSuccessResponse(res, docs, 200);
        } catch (error) {
            return this._resp.formattedErrorResponse(res, req, error.message, 500);
        }

    }

    async update(req, res) {
        console.log(req.body)

        try {
            const id = req.body._id;
            delete req.body._id;
            const docEntity = await Docs.findByIdAndUpdate(id, { $set: req.body }, { new: true });
            return this._resp.formattedSuccessResponse(res, docEntity, 200);
        } catch (error) {
            console.error(error);
            return this._resp.formattedErrorResponse(res, req, error.message, 500);
        }
    }

    async add(req, res) {
        console.log(req.body)

        try {
            const doc = new Docs(req.body);
            const docEntity = await doc.save();
            return this._resp.formattedSuccessResponse(res, docEntity, 200);
        } catch (error) {
            console.error(error);
            return this._resp.formattedErrorResponse(res, req, error.message, 500);
        }
    }

    async delete(req, res) {
        try {
            await Docs.findByIdAndRemove(req.params.id);
        } catch (error) {
            return this._resp.formattedErrorResponse(res, req, error.message, 500);
        }
        return this._resp.formattedSuccessResponse(res, {}, 200);
    }

    _deleteFile(id, object) {
        let extension = object.mimetype.split('/')[1];
        let file = `${object.fieldname}.${extension}`;
        let path = `./src/backend/static/images/${id}/${file}`;
        if (fs.existsSync(path)) {
            fs.unlinkSync(path);
        }
    }

    _deleteFileByName(id, name) {
        let path = `./src/backend/static${name}`;
        if (fs.existsSync(path)) {
            fs.unlinkSync(path);
        }
    }

    _saveFile(id, logo) {
        return new Promise(function (resolve, reject) {
            let extension = logo.mimetype.split('/')[1];
            let newFile = `${logo.fieldname}.${extension}`;
            let newFolder = `/images/${id}/`;
            let newPath = `./src/backend/static${newFolder}${newFile}`;

            if (!fs.existsSync(`./src/backend/static${newFolder}`)) {
                fs.mkdirSync(`./src/backend/static${newFolder}`);
            }

            let oldpath = logo.path;
            fs.rename(oldpath, newPath, function (error) {
                if (error) reject(error);
                else resolve(newFolder + newFile);
            });
        });
    }
}