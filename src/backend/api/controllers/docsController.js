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
            const filter = {};
            filter.project_id = req.query.project_id;
            filter.step_id = req.query.step_id;
            const docs = await Docs.find(filter).exec();
            return this._resp.formattedSuccessResponse(res, docs, 200);
        } catch (error) {
            return this._resp.formattedErrorResponse(res, req, error.message, 500);
        }

    }

    async update(req, res) {
        let data = JSON.parse(req.body.data);
        let files = req.files.file;

        console.log('BODY ', data)
        console.log('FILES ', files)

        try {
            const id = data._id;
            delete data._id;
            const docEntity = await Docs.findByIdAndUpdate(id, { $set: data }, { new: true });
            
            if (files && files.length > 0) {
                const file = files[0];
                this._deleteFile(docEntity._id, file);
                docEntity.file = await this._saveFile(docEntity._id, file);
            }
            await docEntity.save();

            return this._resp.formattedSuccessResponse(res, docEntity, 200);
        } catch (error) {
            console.error(error);
            return this._resp.formattedErrorResponse(res, req, error.message, 500);
        }
    }

    async add(req, res) {
        let data = JSON.parse(req.body.data);
        let files = req.files.file;

        console.log('BODY ', data)
        console.log('FILES ', files)

        try {
            const doc = new Docs(data);
            const docEntity = await doc.save();

            if (files && files.length > 0) {
                const file = files[0];
                docEntity.file = await this._saveFile(docEntity._id, file);
            }
            await docEntity.save();

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