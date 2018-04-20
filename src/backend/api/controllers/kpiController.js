import {
    Router
} from 'express';
import Response from '../models/responseDto';
import Kpi from '../models/Kpi';
import KpiStyles from '../models/KpiStyles';
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
        try {
            const entity = await Kpi.findById(id);
            const styles = await KpiStyles.find({}).exec();

            const wb = new xl.Workbook();
            var optionsWorksheet = {
                // 'outline': {
                //     'summaryBelow': false,
                //     'summaryRight': false
                // },
            };
            let ws = wb.addWorksheet(optionsWorksheet);
            ws.column(1).setWidth(30);
            ws.column(2).setWidth(14);
            ws.column(3).setWidth(14);
            ws.column(4).setWidth(14);
            ws.column(5).setWidth(14);
            ws.column(6).setWidth(14);
            ws.column(7).setWidth(4);
            ws.column(8).setWidth(20);
            ws.column(9).setWidth(40);

            let stylesConf = {};
            styles.forEach(style => {
                let conf = {
                    font: {
                        color: style.textColor,
                        bold: style.textStyle == 'normal' ? false : true
                    },
                    fill: {
                        type: 'pattern',
                        patternType: 'solid',
                        fgColor: style.cellColor.replace('#', ''),
                        bgColor: style.cellColor.replace('#', '')
                    }
                };
                stylesConf[style._id] = wb.createStyle(conf);
            });

            let headerStyleConf = {
                font: {
                    color: '#000000',
                    size: 12
                },
                alignment: {
                    wrapText: true,
                    vertical: 'center'
                },
                border: {
                    left: {
                        style: 'thin',
                        color: 'dddddd'
                    },
                    right: {
                        style: 'thin',
                        color: 'dddddd'
                    },
                    top: {
                        style: 'thin',
                        color: 'dddddd'
                    },
                    bottom: {
                        style: 'thin',
                        color: 'dddddd'
                    },
                },
                fill: {
                    type: 'pattern',
                    patternType: 'solid',
                    fgColor: '92e3ee',
                    bgColor: '92e3ee',
                }
            };
            const headerStyle = wb.createStyle(headerStyleConf);
            headerStyleConf.alignment = {
                wrapText: true,
                vertical: 'center',
                horizontal: 'center'
            };
            const headerCenterStyle = wb.createStyle(headerStyleConf);

            let generalStyleConf = {
                font: {
                    color: '#000000',
                    size: 12
                },
                alignment: {
                    wrapText: true,
                    vertical: 'center'
                },
                border: {
                    left: {
                        style: 'thin',
                        color: 'dddddd'
                    },
                    right: {
                        style: 'thin',
                        color: 'dddddd'
                    },
                    top: {
                        style: 'thin',
                        color: 'dddddd'
                    },
                    bottom: {
                        style: 'thin',
                        color: 'dddddd'
                    },
                }
            };
            const generalStyle = wb.createStyle(generalStyleConf);
            headerStyleConf.alignment = {
                wrapText: true,
                vertical: 'center',
                horizontal: 'center'
            };
            const generalCenterStyle = wb.createStyle(generalStyleConf);

            let header = [
                [
                    {
                        v: 'Наименование показателей',
                        rc: [1, 1, 2, 1],
                        s: headerCenterStyle
                    },
                    {
                        v: entity.title,
                        rc: [1, 2, 1, 6],
                        s: headerStyle
                    },
                    {
                        v: 'Вес',
                        rc: [1, 7, 2, 7],
                        s: headerStyle
                    },
                    {
                        v: 'Шкала',
                        rc: [1, 8, 2, 8],
                        s: headerCenterStyle
                    },
                    {
                        v: 'Источник информации',
                        rc: [1, 9, 2, 9],
                        s: headerCenterStyle
                    }
                ],
                [
                    {
                        v: 'I кв',
                        rc: [2, 2],
                        s: headerStyle
                    },
                    {
                        v: 'II кв',
                        rc: [2, 3],
                        s: headerStyle
                    },
                    {
                        v: 'III кв',
                        rc: [2, 4],
                        s: headerStyle
                    },
                    {
                        v: 'Годовой',
                        rc: [2, 5],
                        s: headerStyle
                    },
                    {
                        v: 'Факт на текущий квартал',
                        rc: [2, 6],
                        s: headerStyle
                    }
                ]
            ];

            ws.cell(3, 1, 3, 9, true).string(entity.name).style(generalStyle);
            if (entity.nameStyle) ws.cell(3, 1, 3, 9).style(stylesConf[entity.nameStyle]);

            header.forEach(row => {
                row.forEach(col => {
                    if (col.rc.length > 2) {
                        ws.cell(...col.rc, true).string(col.v.toString()).style(col.s);
                    } else {
                        ws.cell(...col.rc).string(col.v.toString()).style(col.s);
                    }
                });
            });

            let index = 1;
            entity.planes.forEach((plane, i) => {
                ws.cell(4 + i, 1).string((i + 1) + '. ' + plane.name.toString()).style(generalStyle);
                ws.cell(4 + i, 2).string(plane.kv1.toString()).style(generalCenterStyle);
                if (plane.kv1Style) ws.cell(4 + i, 2).style(stylesConf[plane.kv1Style]);
                ws.cell(4 + i, 3).string(plane.kv2.toString()).style(generalCenterStyle);
                if (plane.kv2Style) ws.cell(4 + i, 3).style(stylesConf[plane.kv2Style]);
                ws.cell(4 + i, 4).string(plane.kv3.toString()).style(generalCenterStyle);
                if (plane.kv3Style) ws.cell(4 + i, 4).style(stylesConf[plane.kv3Style]);
                ws.cell(4 + i, 5).string(plane.year.toString()).style(generalCenterStyle);
                if (plane.yearStyle) ws.cell(4 + i, 5).style(stylesConf[plane.yearStyle]);
                ws.cell(4 + i, 6).string(plane.actual.toString()).style(generalStyle);
                if (plane.actualStyle) ws.cell(4 + i, 6).style(stylesConf[plane.actualStyle]);
                ws.cell(4 + i, 7).string(plane.weight.toString()).style(generalStyle);
                if (plane.weightStyle) ws.cell(4 + i, 7).style(stylesConf[plane.weightStyle]);
                ws.cell(4 + i, 8).string(plane.rate.split('<br/>').join('\n')).style(generalStyle);
                ws.cell(4 + i, 9).string(plane.info.toString()).style(generalStyle);
                index = i;
            });
            index += 5;

            let header2 = [
                [
                    {
                        v: 'Дата выполнения ключевого события',
                        rc: [index, 1, index, 6],
                        s: headerStyle
                    },
                    {
                        v: 'Вес',
                        rc: [index, 7],
                        s: headerStyle
                    },
                    {
                        v: 'Критичность срыва сроков',
                        rc: [index, 8],
                        s: headerCenterStyle
                    },
                    {
                        v: 'Описание критичности',
                        rc: [index, 9],
                        s: headerCenterStyle
                    }
                ]
            ];

            header2.forEach(row => {
                row.forEach(col => {
                    if (col.rc.length > 2) {
                        ws.cell(...col.rc, true).string(col.v.toString()).style(col.s);
                    } else {
                        ws.cell(...col.rc).string(col.v.toString()).style(col.s);
                    }
                });
            });

            entity.events.forEach((event, i) => {
                index += 1;
                ws.cell(index, 1).string(`4.${(i + 1)}. ${event.name.toString()}`).style(generalStyle);
                if (event.nameStyle) ws.cell(index, 1).style(stylesConf[event.nameStyle]);
                ws.cell(index, 2).string(event.kv1.toString()).style(generalStyle);
                if (event.kv1Style) ws.cell(index, 2).style(stylesConf[event.kv1Style]);
                ws.cell(index, 3).string(event.kv2.toString()).style(generalStyle);
                if (event.kv2Style) ws.cell(index, 3).style(stylesConf[event.kv2Style]);
                ws.cell(index, 4).string(event.kv3.toString()).style(generalStyle);
                if (event.kv3Style) ws.cell(index, 4).style(stylesConf[event.kv3Style]);
                ws.cell(index, 5).string(event.year.toString()).style(generalStyle);
                if (event.yearStyle) ws.cell(index, 5).style(stylesConf[event.yearStyle]);
                ws.cell(index, 6).string(event.actual.toString()).style(generalStyle);
                if (event.actualStyle) ws.cell(index, 6).style(stylesConf[event.actualStyle]);
                ws.cell(index, 7).string(event.weight.toString()).style(generalStyle);
                if (event.weightStyle) ws.cell(index, 7).style(stylesConf[event.weightStyle]);
                ws.cell(index, 8).string(event.critical.toString()).style(generalCenterStyle);
                if (event.criticalStyle) ws.cell(index, 8).style(stylesConf[event.criticalStyle]);
            });

            if (entity.events.length > 0) {
                ws.cell(index - entity.events.length + 1, 9, index, 9, true).string('Если в графе стоит - 0\nто срыв на 1 месяц обнуляет это событие\nЕсли в графе стоит - 1\n- то срыв на 1 месяц дает 90% от этого события в общую сумму KPI\n- срыв на 2 месяца обнуляет это событие\nЕсли в графе стоит - 2\n- то срыв на 1 месяц дает 90% от этого события в общую сумму KPI\n- то срыв на 2 месяц дает 80% от этого события в общую сумму KPI\n- срыв на 3 месяца обнуляет это событие').style(generalStyle);
            }

            wb.write('kpi.xlsx', res);
        } catch (error) {
            console.error(error);
            return this._resp.formattedErrorResponse(res, req, error.message, 500);
        }
    }

    async all(req, res) {
        try {
            let projects = [];
            if (req.query.role) {
                projects = await Kpi.find({ role: req.query.role }).exec();
            } else {
                projects = await Kpi.find({}).exec();
            }
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