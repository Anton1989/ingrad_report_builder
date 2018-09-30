import { Router } from 'express';
import fs from 'fs';
import Response from '../models/responseDto';
import Panaram from '../models/Panaram';

export default class PanaramsController {

    constructor(netConfig) {
        console.log('Start init Panaram controller');
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
        console.log('End init Panaram controller');
    }

    getRouter() {
        return this._router;
    }

    async all(req, res) {
        try {
            const panarams = await Panaram.find({ placeId: req.query.placeId }).exec();
            return this._resp.formattedSuccessResponse(res, panarams, 200);
        } catch (error) {
            return this._resp.formattedErrorResponse(res, req, error.message, 500);
        }

    }

    async add(req, res) {
        let data = JSON.parse(req.body.data);
        let images = req.files;

        let panaram = new Panaram(data);
        let panaramEntity = null;
        try {
            panaramEntity = await panaram.save(data);
            panaramEntity.src = await this._saveFile(panaramEntity._id, images.src[0]);
            panaramEntity.save();
        } catch (error) {
            console.error(error);
            return res.status(500).send(error);
        }
        return this._resp.formattedSuccessResponse(res, panaramEntity, 200);
    }

    async update(req, res) {
        const data = JSON.parse(req.body.data);
        const images = req.files;
        const id = req.params.id;

        console.log('BODY ', data)
        console.log('files ', images)

        let panEntity = null;
        try {
            const entity = await Panaram.findById(id);
            if (entity.src && !data.src) {
                this._deleteFileByName(entity.src);
            }
            
            panEntity = await Panaram.findByIdAndUpdate(id, { $set: data }, { new: true });

            if (images.src && images.src.length > 0) {
                const src = images.src[0];
                this._deleteFile(panEntity._id, src);
                panEntity.src = await this._saveFile(panEntity._id, src);
            }
            panEntity.save();
        } catch (error) {
            console.error(error);
            return res.status(500).send(error);
        }

        return this._resp.formattedSuccessResponse(res, panEntity, 200);
    }

    async delete(req, res) {
        try {
            const entity = await Panaram.findById(req.params.id);
            if (entity.src) {
                this._deleteFileByName(entity.src);
            }
            await Panaram.findByIdAndRemove(req.params.id);
        } catch (error) {
            return this._resp.formattedErrorResponse(res, req, error.message, 500);
        }
        return this._resp.formattedSuccessResponse(res, {}, 200);
    }

    _deleteFile(id, object) {
        console.log('TRY TO DELETE FILE', id, object);
        try {
            let directory = `./src/backend/static/images/360/${id}/`;
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
            let newFolder = `/images/360/${id}/`;
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