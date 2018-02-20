import { Router } from 'express';
import fs from 'fs';
import Response from '../models/responseDto';
import Places from '../models/Places';

export default class PlacesController {

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
        }
        console.log('End init places controller');
    }

    getRouter() {
        return this._router;
    }

    async all(req, res) {
        try {
            const places = await Places.find({}).populate([{
                path: 'styles'
            }]).exec();
            return this._resp.formattedSuccessResponse(res, places, 200);
        } catch (error) {
            return this._resp.formattedErrorResponse(res, req, error.message, 500);
        }

    }

    async update(req, res) {
        let data = JSON.parse(req.body.data);
        let images = req.files;

        let id = data._id;
        delete data._id;

        console.log('BODY ', data)
        console.log('files ', images)

        let placeEntity = null;
        try {
            placeEntity = await Places.findByIdAndUpdate(id, { $set: data }, { new: true });

            if (images.logo && images.logo.length > 0) {
                let logo = images.logo[0];
                this._deleteFile(placeEntity._id, logo);
                placeEntity.logo = await this._saveFile(placeEntity._id, logo);
            }
            if (images.image && images.image.length > 0) {
                let image = images.image[0];
                this._deleteFile(placeEntity._id, image);
                placeEntity.image = await this._saveFile(placeEntity._id, image);
            }
            placeEntity.save();
        } catch (error) {
            console.error(error);
            return res.status(500).send(error);
        }

        return this._resp.formattedSuccessResponse(res, placeEntity, 200);
    }

    async add(req, res) {
        let data = JSON.parse(req.body.data);
        let images = req.files;

        let place = new Places(data);
        let placeEntity = null;
        try {
            placeEntity = await place.save(data);

            if (images.logo && images.logo.length > 0) {
                placeEntity.logo = await this._saveFile(placeEntity._id, images.logo[0]);
            }
            if (images.image && images.image.length > 0) {
                placeEntity.image = await this._saveFile(placeEntity._id, images.image[0]);
            }
            placeEntity.save();
        } catch (error) {
            console.error(error);
            return res.status(500).send(error);
        }
        return this._resp.formattedSuccessResponse(res, placeEntity, 200);
    }

    _deleteFile(id, object) {
        let extension = object.mimetype.split('/')[1];
        let file = `${object.fieldname}.${extension}`;
        let path = `./src/backend/static/images/${id}/${file}`;
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