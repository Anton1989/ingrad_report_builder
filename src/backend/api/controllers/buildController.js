import { Router } from 'express';
import fs from 'fs';
import Response from '../models/responseDto';
import Build from '../models/Build';

export default class BuildController {

    constructor(netConfig) {
        console.log('Start init Build controller');
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
        console.log('End init Build controller');
    }

    getRouter() {
        return this._router;
    }

    async all(req, res) {
        try {
            const panarams = await Build.find({ placeId: req.query.placeId }).exec();
            return this._resp.formattedSuccessResponse(res, panarams, 200);
        } catch (error) {
            return this._resp.formattedErrorResponse(res, req, error.message, 500);
        }

    }

    async add(req, res) {
        let data = req.body;

        let panaram = new Build(data);
        let panaramEntity = null;
        try {
            panaramEntity = await panaram.save(data);
        } catch (error) {
            console.error(error);
            return res.status(500).send(error);
        }
        return this._resp.formattedSuccessResponse(res, panaramEntity, 200);
    }

    async update(req, res) {
        let data = req.body;
        const id = req.params.id;

        console.log('BODY ', data)

        let bEntity = null;
        try {
            bEntity = await Build.findByIdAndUpdate(id, { $set: data }, { new: true });
        } catch (error) {
            console.error(error);
            return res.status(500).send(error);
        }

        return this._resp.formattedSuccessResponse(res, bEntity, 200);
    }

    async delete(req, res) {
        try {
            await Build.findByIdAndRemove(req.params.id);
        } catch (error) {
            return this._resp.formattedErrorResponse(res, req, error.message, 500);
        }
        return this._resp.formattedSuccessResponse(res, {}, 200);
    }

    _deleteFile(id, object) {
        console.log('TRY TO DELETE FILE', id, object);
        try {
            let directory = `./src/backend/static/images/layers/${id}/`;
            let files = fs.readdirSync(directory);  
            for (const file of files) {
                console.log('FILE', file);
                if (object && file.indexOf(object.fieldname) !== -1) {
                    if (fs.existsSync(directory + file)) {
                        fs.unlinkSync(directory + file);
                        console.log(`FILE ${file} was deleted`);
                    }
                }
            }
        } catch (error) {
            console.error(error);
        }
    }

    _deleteFileByName(name) {
        let path = `./src/backend/static${name}`;
        if (fs.existsSync(path)) {
            fs.unlinkSync(path);
        }
    }

    _saveFile(id, img) {
        return new Promise(function (resolve, reject) {
            let extension = img.mimetype.split('/')[1];
            let newFile = `${img.fieldname}.${extension}`;
            let newFolder = `/images/layers/${id}/`;
            let newPath = `./src/backend/static${newFolder}${newFile}`;

            if (!fs.existsSync(`./src/backend/static${newFolder}`)) {
                fs.mkdirSync(`./src/backend/static${newFolder}`);
            }

            let oldpath = img.path;
            fs.rename(oldpath, newPath, function (error) {
                if (error) reject(error);
                else resolve(newFolder + newFile);
            });
        });
    }
}