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

    prepareTree(objects, parent, tasks) {
        const filtered = [];
        objects.forEach(object => {
            if (object.parent == parent) {
                const item = object.toJSON();
                if (parent == '00-000022') {
                    // const tasksLoaded = tasks.find(task => {
                    //     console.log(object.name, object.projectId, task.projectIntegrationId)
                    //     return task.projectIntegrationId == object.projectId
                    // });
                    const tasksLoaded = tasks.find(task => task.projectIntegrationId == object.projectId);
                    if (tasksLoaded) {
                        item.location = tasksLoaded.location;
                        item.childes = this.prepareTree(objects, object.code, tasksLoaded.tasks);
                        item.statuses = tasksLoaded.tasks.filter(task => task.to == object.code && task.kt.trim() !== '').map(task => {
                            return {
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
                            };
                        });
                    }
                } else {
                    item.childes = this.prepareTree(objects, object.code, tasks);
                    item.statuses = tasks.filter(task => task.to == object.code && task.kt.trim() !== '').map(task => {
                        return {
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
                        };
                    });
                }
                
                filtered.push(item);
            }
        });
        return filtered;
    }

    async all(req, res) {
        try {
            let objects = await Objects.find({}).exec();
            const projects = await Projects.find({}).exec();
            objects = this.prepareTree(objects, '00-000022', projects);
            return this._resp.formattedSuccessResponse(res, objects, 200);
            
            // const projectsArray = [];
            // projects.forEach(entity => {
            //     const project = entity.toJSON();
            //     let parent = project.tasks.find(task => task.parentId == 0);
            //     // console.log(parent.subTasks);
            //     project.tasks = this.group([...project.tasks], parent.taskId);

            //     project.tasks.forEach(main => {
            //         if (main.haveChildren) {
            //             main.hasKt = main.kt.replace(/\s/g,'') !== '' ? true : false;
                        
            //             let testkt = this.getKt(main.subTasks);
            //             if (testkt.replace(/\s/g,'') !== '') {
            //                 main.hasKt = true;
            //             }
            //         }
                    
            //     });

            //     projectsArray.push({
            //         _id: project._id,
            //         name: project.name,
            //         tasks: project.tasks,
            //         tasksAmount: project.tasksAmount,
            //         location: project.location
            //     });
            // });
            return this._resp.formattedSuccessResponse(res, projectsArray, 200);
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