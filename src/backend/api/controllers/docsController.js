import { Router } from 'express';
import fs from 'fs';
import Response from '../models/responseDto';
import Docs from '../models/Docs';
import ProjectSchema from '../models/Projects';
import mongoose from 'mongoose';
const ObjectId = mongoose.Types.ObjectId;
import config from '../../../frontend/config';

export default class DocsController {

    constructor(netConfig, db) {
        console.log('Start init places controller');
        this._resp = new Response();
        this._netConfig = netConfig;
        this._db = db;

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

    _getStatus(task) {
        if (task == null) {
            return 'NONE';
        } else if (task.percentComplete > 0 && !task.actualStart) {
            if (task.percentComplete < 100) {
                return 'IN PROGRESS';
            } else {
                return 'DONE';
            }
        } else {
            if (task.actualStart == '0001-01-01T00:00:00' || !task.actualStart) {
                return 'IN PLAN';
            } else if (task.actualFinish == '0001-01-01T00:00:00' || !task.actualFinish) {
                return 'IN PROGRESS';
            } else {
                return 'DONE';
            }
        }
    }

    async all(req, res) {
        try {
            const filter = {};
            filter.project_id = req.query.project_id;
            filter.step_id = req.query.step_id;
            const docs = await Docs.find(filter).exec();

           const Projects = this._db.model('projects', ProjectSchema);

            const projects = await Projects.aggregate([
                // { $match: { '_id': ObjectId(filter.project_id) } },
                { $project : {
                    'tasks.name': 1,
                    'tasks.taskId': 1,
                    'tasks.statusReport': 1,
                    'tasks.position': 1,
                    'tasks.haveChildren': 1,
                    'tasks.actualStart': 1,
                    'tasks.actualFinish': 1,
                    'tasks.percentComplete': 1,
                    'tasks.kt': 1,
                    'tasks.to': 1
                } },
                { $unwind: '$tasks' },
                { $match: { 'tasks.kt': { $in: config.defaultVars.kt[filter.step_id].kts }, 'tasks.to': filter.project_id } },
                { $group: { '_id': '$_id', 'tasks': { $push: '$tasks' } } },
            ]).exec();

            

            let out = [];
            if (projects[0]) {
                out = docs.map(doc => {
                    const task = projects[0].tasks.find(task => task.kt == doc.point)
                    doc.status = this._getStatus(task);
                    return doc;
                })
            } else {
                out = docs;
            }
            

            return this._resp.formattedSuccessResponse(res, out, 200);
        } catch (error) {
            console.log(error)
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