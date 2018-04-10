import {
    Router
} from 'express';
import Response from '../models/responseDto';
import Kpi from '../models/Kpi';
import xl from 'excel4node';
// import fs from 'fs';

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
            this._router.get('/:id', this.download.bind(this));
        }
        console.log('End init kpi controller');
    }

    getRouter() {
        return this._router;
    }

    async download(req, res) {
        const id = req.params.id;
        console.log(id);
        try {
            const entity = await Kpi.findById(id);

            const wb = new xl.Workbook();
            let ws = wb.addWorksheet(entity.name);

            
            entity.events.forEach((event, i) => {
                event = event.toJSON();
                Object.keys(event).forEach((key, j) => {
                    console.log(i, j, event[key].toString())
                    ws.cell(i+1, j+1).string(event[key].toString());
                });
            });

            wb.write('ExcelFile.xlsx', res);



            // var wb = XLSX.utils.book_new();
            // var ws_name = 'SheetJS';

            /* make worksheet */
            // var ws_data = [
            //     ['S', 'h', 'e', 'e', 't', 'J', 'S'],
            //     [1, 2, 3, 4, 5],
            //     '!merges': [{
            //         s: {
            //             r: 0,
            //             c: 0
            //         },
            //         e: {
            //             r: 1,
            //             c: 0
            //         }
            //     } /* A1:A2 */ ]
            // ];
            // var ws = XLSX.utils.aoa_to_sheet(ws_data);

            // for (var R = 0; R <= 5; ++R) {
            //     for (var C = 0; C <= 5; ++C) {
            //         var cell_address = {
            //             c: C,
            //             r: R
            //         };
            //         /* if an A1-style address is needed, encode the address */
            //         var cell_ref = XLSX.utils.encode_cell(cell_address);
            //         cell_ref.v = 'HH';
            //     }
            // }

            // var output_file_name = 'out.csv';
            // var stream = XLSX.stream.to_csv(ws);
            // stream.pipe(fs.createWriteStream(output_file_name));



            /* Add the worksheet to the workbook */
            // XLSX.utils.book_append_sheet(wb, ws, ws_name);
            // XLSX.writeFile(wb, 'out.xls');


            // return this._resp.formattedSuccessResponse(res, entity, 200);
        } catch (error) {
            console.error(error);
            return this._resp.formattedErrorResponse(res, req, error.message, 500);
        }
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
        let project = req.body.project;
        const id = project._id;
        delete project._id;
        console.log(project)
        try {
            project = await Kpi.findByIdAndUpdate(id, {
                $set: project
            }, {
                new: true
            });
            return this._resp.formattedSuccessResponse(res, project, 200);
        } catch (error) {
            console.error(error);
            return this._resp.formattedErrorResponse(res, req, error.message, 500);
        }
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
                    }
                ],
                events: []
            });
            const kpiEntity = await kpi.save();
            return this._resp.formattedSuccessResponse(res, kpiEntity, 200);
        } catch (error) {
            console.error(error);
            return this._resp.formattedErrorResponse(res, req, error.message, 500);
        }
    }
}