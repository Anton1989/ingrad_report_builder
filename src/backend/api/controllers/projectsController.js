import {
    Router
} from 'express';
import Response from '../models/responseDto';
import ProjectSchema from '../models/Projects';
import Objects from '../models/Objects';
//import Floors from '../models/Floors';
//import Sections from '../models/Sections';
import Docs from '../models/Docs';

export default class ProjectsController {

    constructor(netConfig, db) {
        console.log('Start init projects controller');
        this._resp = new Response();
        this._netConfig = netConfig;
        this._db = db;

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

    _prepareTopLevelResponse(descriptions, objects, tasks, current_codes, docs) {
        // console.log(`objects ${objects.length} tasks ${tasks.length}`);
        const projects = [];
        objects.forEach(object => {
            const isInner = !current_codes.includes(object.code);
            const oDocs = docs.filter(doc => doc.project_id == object.code);
            if (!isInner) {
                const project = tasks.find(prj => object.projectId == prj.projectIntegrationId);
                const description = descriptions.find(description => object.projectId == description.projectIntegrationId);
                if (project) {
                    if (project.tasks) {
                        project.tasks = project.tasks.map(task => {
                            const isInner = !current_codes.includes(task.to);
                            const status = this._getStatus(task);
                            task.docCounter = oDocs.filter(doc => doc.step_id == task.statusReport).length;
                            if (isInner) {
                                return { isInner, status, statusReport: task.statusReport };
                            }
                            return Object.assign({isInner, status}, task);
                        });
                    } else {
                        project.tasks = [];
                    }
                    projects.push(Object.assign({}, object, description, project));
                }
            }
        });
        return projects;
    }

    _filterChildTasks(objects, parent, tasks) {
        const filtered = [];

        objects.forEach(object => {
            if (parent == object.parent) {
                tasks.forEach(task => {
                    if (object.code == task.to) {
                        const status = this._getStatus(task);
                        filtered.push({ isInner: true, status, statusReport: task.statusReport });
                    }
                });
                filtered.push( ...this._filterChildTasks(objects, object.code, tasks) );
            }
        });

        return filtered;
    }

    _prepareSubLevelResponse(objects, projects, current_codes, docs) {
        const subProjects = [];

        objects.forEach(object => {
            const isInner = !current_codes.includes(object.code);
            const oDocs = docs.filter(doc => doc.project_id == object.code);
            if (!isInner) {
                object.tasks = [];
                if (projects[0] && projects[0].tasks && projects[0].tasks.length > 0) {
                    projects[0].tasks.forEach(task => {
                        task.docCounter = oDocs.filter(doc => doc.step_id == task.statusReport).length;
                        if (object.code == task.to) {
                            const status = this._getStatus(task);
                            object.tasks.push(Object.assign({ isInner: false, status }, task));
                        }
                    });
                    object.tasks.push(...this._filterChildTasks(objects, object.code, projects[0].tasks));
                }
                subProjects.push(object);
            }
        });

        return subProjects;
    }

    _filterFromParent(objectEnts, parent, all_codes, current_codes, projectIntegrationIds) {
        const objects = [];

        objectEnts.forEach(object => {
            if (object.parent == parent) {
                objects.push(object);
                if (current_codes) current_codes.push(object.code);
                if (projectIntegrationIds) projectIntegrationIds.push(object.projectId);
                all_codes.push(object.code);
                objects.push(...this._filterFromParent(objectEnts, object.code, all_codes, false, false));
            }
        });
        
        return objects;
    }

    async all(req, res) {
        try {
            const parent = req.query.parent ? req.query.parent : '00-000022';
            const projectId = req.query.projectId ? req.query.projectId : null;

            const Projects = this._db.model('projects', ProjectSchema);

            let start = Date.now();
            let objectEnts = await Objects.find({}).lean().exec();
            const current_codes = [];
            const all_codes = [];
            const projectIntegrationIds = [];
            let objects = this._filterFromParent(objectEnts, parent, all_codes, current_codes, projectIntegrationIds);

            const docs = await Docs.find({ 'project_id': { $in: current_codes } }).exec();
            // docs.forEach(doc => console.log(doc.step_id + ' - ' + objectEnts.find(o => o.code == doc.project_id).name))

            let projects = [];
            let response = null;
            if (parent == '00-000022') {
                projects = await Projects.aggregate([
                    { $match: { projectIntegrationId: { $in: projectIntegrationIds } } },
                    { $project : {
                        'location': 1,
                        'projectIntegrationId': 1,
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
                    // { $match: { 'tasks.to': { $in: codes }, $or: [ 
                    // { $match: { $or: [ 
                    //     { 'tasks.statusReport': { $ne: '' }, 'tasks.statusReport': { $ne: ' ' } },
                    //     { 'tasks.kt': { $ne: '' }, 'tasks.kt': { $ne: ' ' } }
                    // ] } },
                    { $match: { 'tasks.to': { $in: all_codes }, 'tasks.statusReport': { $ne: '' }, 'tasks.statusReport': { $ne: ' ' } } },
                    // { $match: { 'tasks.to': { $in: codes }, 'tasks.kt': { $ne: '' }, 'tasks.kt': { $ne: ' ' } } },
                    { $group: { '_id': '$_id', 'projectIntegrationId': { $first: '$projectIntegrationId' }, 'location': { $first: '$location' }, 'tasks': { $push: '$tasks' } } },
                ]).exec();
                const descriptions = await Projects.find({ projectIntegrationId: { $in: projectIntegrationIds }})
                    .select({ projectIntegrationId: 1, location: 1 })
                    .lean().exec();
                response = this._prepareTopLevelResponse(descriptions, objects, projects, current_codes, docs);
            } else {
                projectIntegrationIds.push(projectId);
                projects = await Projects.aggregate([
                    { $match: { projectIntegrationId: { $in: projectIntegrationIds } } },
                    { $project : {
                        'tasks.name': 1,
                        'tasks.taskId': 1,
                        'tasks.position': 1,
                        'tasks.statusReport': 1,
                        'tasks.haveChildren': 1,
                        'tasks.actualStart': 1,
                        'tasks.actualFinish': 1,
                        'tasks.percentComplete': 1,
                        'tasks.kt': 1,
                        'tasks.to': 1
                    } },
                    { $unwind: '$tasks' },
                    { $match: { 'tasks.to': { $in: all_codes }, 'tasks.statusReport': { $ne: '' }, 'tasks.statusReport': { $ne: ' ' } } },
                    { $group: { '_id': '$_id', 'tasks': { $push: '$tasks' } } },
                ]).exec();
                response = this._prepareSubLevelResponse(objects, projects, current_codes, docs);
            }
            console.log(`Request was processed in ${Date.now() - start} ms`);
            return this._resp.formattedSuccessResponse(res, response, 200);
        } catch (error) {
            console.error(error);
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