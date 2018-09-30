import { Router } from 'express';
import fs from 'fs';
import Response from '../models/responseDto';
import Layer from '../models/Layer';

export default class LayersController {

    constructor(netConfig) {
        console.log('Start init Layer controller');
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
        console.log('End init Layer controller');
    }

    getRouter() {
        return this._router;
    }

    async all(req, res) {
        try {
            const panarams = await Layer.find({ placeId: req.query.placeId }).exec();
            return this._resp.formattedSuccessResponse(res, panarams, 200);
        } catch (error) {
            return this._resp.formattedErrorResponse(res, req, error.message, 500);
        }

    }

    async add(req, res) {
        let data = JSON.parse(req.body.data);
        let images = req.files;

        let panaram = new Layer(data);
        let panaramEntity = null;
        try {
            panaramEntity = await panaram.save(data);
            panaramEntity.image = await this._saveFile(panaramEntity._id, images.image[0]);
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
            const entity = await Layer.findById(id);
            if (entity.image && !data.image) {
                this._deleteFileByName(entity.image);
            }
            
            panEntity = await Layer.findByIdAndUpdate(id, { $set: data }, { new: true });

            if (images.image && images.image.length > 0) {
                const image = images.image[0];
                this._deleteFile(panEntity._id, image);
                panEntity.image = await this._saveFile(panEntity._id, image);
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
            const entity = await Layer.findById(req.params.id);
            if (entity.image) {
                this._deleteFileByName(entity.image);
            }
            await Layer.findByIdAndRemove(req.params.id);
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