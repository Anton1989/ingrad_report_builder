import { Router } from 'express';
import fs from 'fs';
import Response from '../models/responseDto';
import Kpi from '../models/Kpi';

export default class KpiController {

    constructor(netConfig) {
        console.log('Start init kpi controller');
        this._resp = new Response();
        this._netConfig = netConfig;

        this._router = Router();
        if (this._router) {
            this._router.get('/', this.all.bind(this));
            this._router.put('/:id', this.update.bind(this));
            this._router.post('/', this.add.bind(this));
        }
        console.log('End init kpi controller');
    }

    getRouter() {
        return this._router;
    }

    async all(req, res) {
        try {
            const projects = await Kpi.find({}).exec();
            return this._resp.formattedSuccessResponse(res, projects, 200);
        } catch (error) {
            return this._resp.formattedErrorResponse(res, req, error.message, 500);
        }

    }

    async update(req, res) {
        // let data = JSON.parse(req.body.data);
        // let images = req.files;

        // let id = data._id;
        // delete data._id;

        // console.log('BODY ', data)
        // console.log('files ', images)

        // let placeEntity = null;
        // try {
        //     placeEntity = await Places.findByIdAndUpdate(id, { $set: data }, { new: true });

        //     if (images.logo && images.logo.length > 0) {
        //         let logo = images.logo[0];
        //         this._deleteFile(placeEntity._id, logo);
        //         placeEntity.logo = await this._saveFile(placeEntity._id, logo);
        //     }
        //     if (images.image && images.image.length > 0) {
        //         let image = images.image[0];
        //         this._deleteFile(placeEntity._id, image);
        //         placeEntity.image = await this._saveFile(placeEntity._id, image);
        //     }
        //     if (images.layer && images.layer.length > 0) {
        //         let i = 0;
        //         let layers = [...placeEntity.layers];
        //         for (let index=0; index < layers.length; index++) {
        //             if (layers[index].image == 'TOSAVE') {
        //                 this._deleteFile(layers[index]._id, images.layer[i]);
        //                 layers[index].image = await this._saveFile(layers[index]._id, images.layer[i]);
        //                 i++;
        //             }
        //         }
        //         placeEntity.layers = layers;
        //     }
        //     placeEntity.save();
        // } catch (error) {
        //     console.error(error);
        //     return res.status(500).send(error);
        // }

        return this._resp.formattedSuccessResponse(res, [], 200);
    }

    async add(req, res) {
        const name = req.body.name;
        
        try {
            const kpi = new Kpi({
                name,
                title: `Планы ГК Инград по достижению фин. показателей на ${(new Date()).getFullYear()} год, руб`,
                planes: [{
                    name: 'Контрактация по проекту',
                    kv1: '',
                    kv2: '',
                    kv3: '',
                    year: '',
                    actual: '',
                    weight: '',
                    rate: 'свыше 100% k=1+0.02 (за каждый процент перевыполнения) <br/> 95-100% к=1<br/> 90-94% к=0.9<br/> 85-89% к=0.85<br/> 80-84% к=0.8<br/> менее 80% к=0',
                    info: 'Отчет по продажам'
                },
                {
                    name: 'Операционная маржа',
                    kv1: '',
                    kv2: '',
                    kv3: '',
                    year: '',
                    actual: '',
                    weight: '',
                    rate: '90% и выше пропорционально выполнению<br/> 85-89% к=0.9<br/> 80-84% к=0.8<br/> 75-79% к=0.7<br/> 70-74% к=0.5<br/> менее 70% к=0',
                    info: 'годовой отчет по результатам деятельности компании (данные управленческого учета)'
                },
                {
                    name: 'Объем оплат ИСР',
                    kv1: '',
                    kv2: '',
                    kv3: '',
                    year: '',
                    actual: '',
                    weight: '',
                    rate: '90% и выше к=1<br/> 80-89% к=0.8<br/> 70-79% к=0.5<br/> менее 70% к=0',
                    info: 'годовой отчет по результатам деятельности компании (данные управленческого учета)'
                },
                {
                    name: 'Ключевые события',
                    kv1: '',
                    kv2: '',
                    kv3: '',
                    year: '',
                    actual: '',
                    weight: '',
                    rate: 'Пропорционально выполнению',
                    info: 'ИСУП (отчет по ключевым событиям)'
                }],
                events: []
            });
            const kpiEntity = await kpi.save();
            return this._resp.formattedSuccessResponse(res, kpiEntity, 200);
        } catch (error) {
            console.error(error);
            return this._resp.formattedErrorResponse(res, req, error.message, 500);
        }
        // let data = JSON.parse(req.body.data);
        // let images = req.files;

        // let place = new Places(data);
        // let placeEntity = null;
        // try {
        //     placeEntity = await place.save(data);

        //     if (images.logo && images.logo.length > 0) {
        //         placeEntity.logo = await this._saveFile(placeEntity._id, images.logo[0]);
        //     }
        //     if (images.image && images.image.length > 0) {
        //         placeEntity.image = await this._saveFile(placeEntity._id, images.image[0]);
        //     }
        //     placeEntity.save();
        // } catch (error) {
        //     console.error(error);
        //     return res.status(500).send(error);
        // }
        return this._resp.formattedSuccessResponse(res, {}, 200);
    }
}
