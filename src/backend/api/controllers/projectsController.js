import {
    Router
} from 'express';
import Response from '../models/responseDto';
import Projects from '../models/Projects';
import Objects from '../models/Objects';
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

    group(tasks, parentId) {
        let parentTasks = [];
        tasks.forEach((task, i) => {
            if (task.parentId == parentId) {
                if (task.haveChildren) {
                    task.subTasks = this.group(tasks, task.taskId);
                }
                parentTasks.push({
                    name: task.name,
                    taskId: task.taskId,
                    position: task.position,
                    haveChildren: task.haveChildren,
                    actualStart: task.actualStart,
                    actualFinish: task.actualFinish,
                    percentComplete: task.percentComplete,
                    kt: task.kt,
                    to: task.to,
                    subTasks: task.subTasks
                });
                tasks.splice(i, 1);
            }
        });
        return parentTasks;
    }

    getKt(tasks) {
        let kt = '';
        tasks.forEach(task => {
            let tmp = '';
            if (task.kt.replace(/\s/g,'') == '' && task.haveChildren) {
                tmp = this.getKt(task.subTasks);
            } else {
                tmp = task.kt;
            }
            if (tmp.replace(/\s/g,'') != '') {
                kt = tmp;
            }
        });
        return kt;
    }

    _prepareTopLevelResponse(descriptions, objects, tasks) {
        console.log(`objects ${objects.length} tasks ${tasks.length}`);
        return objects.map(object => {
            const description = descriptions.find(description => object.projectId == description.projectIntegrationId);
            const task = tasks.find(task => object.projectId == task.projectIntegrationId);
            return Object.assign({}, object, description, task);
        });
    }

    _prepareSubLevelResponse(objects, tasks) {
        return objects.map(object => {
            if (tasks[0] && tasks[0].tasks && tasks[0].tasks.length > 0) {
                object.tasks = tasks[0].tasks.filter(status => object.code == status.to);
            } else {
                object.tasks = [];
            }
            return object;
        });
    }

    async all(req, res) {
        try {
            const parent = req.query.parent ? req.query.parent : '00-000022';
            const projectId = req.query.projectId ? req.query.projectId : null;

            let start = Date.now();
            let objects = await Objects.find({ parent }).lean().exec();

            const projectIntegrationIds = [];
            const codes = [];
            let projects = [];
            let response = null;
            if (parent == '00-000022') {
                objects.map(object => {
                    projectIntegrationIds.push(object.projectId);
                    codes.push(object.code);
                });
                projects = await Projects.aggregate([
                    { $match: { projectIntegrationId: { $in: projectIntegrationIds } } },
                    { $project : {
                        'location': 1,
                        'projectIntegrationId': 1,
                        'tasks.name': 1,
                        'tasks.taskId': 1,
                        'tasks.position': 1,
                        'tasks.haveChildren': 1,
                        'tasks.actualStart': 1,
                        'tasks.actualFinish': 1,
                        'tasks.percentComplete': 1,
                        'tasks.kt': 1,
                        'tasks.to': 1
                    } },
                    { $unwind: '$tasks' },
                    { $match: { 'tasks.to': { $in: codes }, 'tasks.kt': { $ne: '' }, 'tasks.kt': { $ne: ' ' } } },
                    { $group: { '_id': '$_id', 'projectIntegrationId': { $first: '$projectIntegrationId' }, 'location': { $first: '$location' }, 'tasks': { $push: '$tasks' } } },
                ]).exec();
                const descriptions = await Projects.find({ projectIntegrationId: { $in: projectIntegrationIds }})
                    .select({ projectIntegrationId: 1, location: 1 })
                    .lean().exec();
                response = this._prepareTopLevelResponse(descriptions, objects, projects);
            } else {
                projectIntegrationIds.push(projectId);
                objects.map(object => {
                    codes.push(object.code);
                });
                projects = await Projects.aggregate([
                    { $match: { projectIntegrationId: { $in: projectIntegrationIds } } },
                    { $project : {
                        'tasks.name': 1,
                        'tasks.taskId': 1,
                        'tasks.position': 1,
                        'tasks.haveChildren': 1,
                        'tasks.actualStart': 1,
                        'tasks.actualFinish': 1,
                        'tasks.percentComplete': 1,
                        'tasks.kt': 1,
                        'tasks.to': 1
                    } },
                    { $unwind: '$tasks' },
                    { $match: { 'tasks.to': { $in: codes }, 'tasks.kt': { $ne: '' }, 'tasks.kt': { $ne: ' ' } } },
                    { $group: { '_id': '$_id', 'tasks': { $push: '$tasks' } } },
                ]).exec();
                response = this._prepareSubLevelResponse(objects, projects);
            }
            console.log(`Request was processed in ${Date.now() - start} ms`);
            return this._resp.formattedSuccessResponse(res, response, 200);
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