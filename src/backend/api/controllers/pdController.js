import {
    Router
} from 'express';
import Response from '../models/responseDto';
import parse from 'csv-parse';
const fs = require('fs');
const xml2js = require('xml2js');
const uuidV4 = require('uuid/v4');

export default class StylesController {

    constructor(netConfig) {
        console.log('Start init styles controller');
        this._resp = new Response();
        this._netConfig = netConfig;

        this._router = Router();
        if (this._router) {
            this._router.post('/', this.generateV2.bind(this));
        }
        console.log('End init styles controller');
    }

    getRouter() {
        return this._router;
    }

    generateV2(req, res) {
        let files = req.files;
        try {
            if (!files.xmlTamplate || files.xmlTamplate.length == 0) {
                return this._resp.formattedErrorResponse(res, req, 'Приложите шаблон', 400);
            }

            let data = fs.readFileSync(files.xmlTamplate[0].path);

            const xmlParser = new xml2js.Parser();
            xmlParser.parseString(data, async (error, xmlJson) => {
                if (error) {
                    console.error(error);
                    return this._resp.formattedErrorResponse(res, req, error, 500);
                }

                if (!xmlJson) {
                    return this._resp.formattedErrorResponse(res, req, 'Пустой шаблон', 500);
                }

                if (files.csvLive && files.csvLive.length > 0) {
                    let csvLive = files.csvLive[0];
                    xmlJson = await this.fillResidentialApartment(xmlJson, csvLive);
                }

                if (files.csvDie && files.csvDie.length > 0) {
                    let csvDie = files.csvDie[0];
                    xmlJson = await this.fillNonResidentialCharacteristics(xmlJson, csvDie);
                }

                if (files.csvCommonAreas && files.csvCommonAreas.length > 0) {
                    let csvCommonAreas = files.csvCommonAreas[0];
                    xmlJson = await this.fillCommonAreas(xmlJson, csvCommonAreas);
                }

                if (files.csvOtherCommonProperties && files.csvOtherCommonProperties.length > 0) {
                    let csvOtherCommonProperties = files.csvOtherCommonProperties[0];
                    xmlJson = await this.fillOtherCommonProperties(xmlJson, csvOtherCommonProperties);
                }

                var builder = new xml2js.Builder();
                var xml = builder.buildObject(xmlJson);

                let file = `${uuidV4()}.xml`;
                let filePath = `./src/backend/static/files/${file}`;
                fs.writeFileSync(filePath, xml);
                return this._resp.formattedSuccessResponse(res, [`/files/${file}`], 200);
            });
        } catch (error) {
            console.error(error);
            return this._resp.formattedErrorResponse(res, req, error.message, 500);
        }
    }

    fillOtherCommonProperties(xmlJson, csvOtherCommonProperties) {
        return new Promise((resolve) => {
            let parser = parse({
                delimiter: ';'
            }, (err, data) => {
                // let residentialCharacteristics = this.fillResidentialApartment(data);
                let otherCommonProperties = {};
                let сommonArea = {};
                for (let i = 2; i < data.length; i++) {
                    if ((data[i][0] && data[i][0] != '' && Object.keys(сommonArea).length !== 0) ||
                            (i + 1) == data.length) {
                        if (!otherCommonProperties['mecp:OtherCommonProperty']) {
                            otherCommonProperties['mecp:OtherCommonProperty'] = [];
                        }
                        otherCommonProperties['mecp:OtherCommonProperty'].push({ ...сommonArea });
                        сommonArea = {};
                    }
                    if (data[i][1]) {
                        сommonArea['mecp:Type'] = data[i][2];
                    }
                    if (data[i][2]) {
                        сommonArea['mecp:Purpose'] = data[i][4];
                    }
                    if (data[i][3]) {
                        сommonArea['mecp:Location'] = data[i][1];
                    }
                }
                xmlJson['mecd:Declaration']['mecd:ProjectDeclaration'][0]['mecd:Project'][0]['mecp:Objects'][0]['mecp:Building'][0]['mecp:CommonProperties'][0]['mecp:OtherCommonProperties'] = otherCommonProperties;
                resolve(xmlJson);
            });
            fs.createReadStream(csvOtherCommonProperties.path).pipe(parser);
        });
    }

    fillCommonAreas(xmlJson, csvCommonAreas) {
        return new Promise((resolve) => {
            let parser = parse({
                delimiter: ';'
            }, (err, data) => {
                // let residentialCharacteristics = this.fillResidentialApartment(data);
                let сommonAreas = {};
                let сommonArea = {};
                for (let i = 2; i < data.length; i++) {
                    if ((data[i][0] && data[i][0] != '' && Object.keys(сommonArea).length !== 0) ||
                            (i + 1) == data.length) {
                        if (!сommonAreas['mecp:CommonArea']) {
                            сommonAreas['mecp:CommonArea'] = [];
                        }
                        сommonAreas['mecp:CommonArea'].push({ ...сommonArea });
                        сommonArea = {};
                    }
                    if (data[i][1]) {
                        сommonArea['mecp:Type'] = data[i][1];
                    }
                    if (data[i][2]) {
                        сommonArea['mecp:Location'] = data[i][2];
                    }
                    if (data[i][3]) {
                        сommonArea['mecp:Purpose'] = data[i][3];
                    }
                    if (data[i][4]) {
                        сommonArea['mecp:Square'] = data[i][4];
                    }
                }
                xmlJson['mecd:Declaration']['mecd:ProjectDeclaration'][0]['mecd:Project'][0]['mecp:Objects'][0]['mecp:Building'][0]['mecp:CommonProperties'][0]['mecp:CommonAreas'] = сommonAreas;
                resolve(xmlJson);
            });
            fs.createReadStream(csvCommonAreas.path).pipe(parser);
        });
    }

    fillNonResidentialCharacteristics(xmlJson, csvLive) {
        // mecp:NonResidentialCharacteristics
        return new Promise((resolve) => {
            let parser = parse({
                delimiter: ';'
            }, (err, data) => {
                // let residentialCharacteristics = this.fillResidentialApartment(data);
                let residentialCharacteristics = {};
                let residentialApartment = {};
                for (let i = 3; i < data.length; i++) {
                    if ((data[i][0] && data[i][0] != '' && Object.keys(residentialApartment).length !== 0) ||
                            (i + 1) == data.length) {
                        if (!residentialCharacteristics['mecp:NonResidentialApartment']) {
                            residentialCharacteristics['mecp:NonResidentialApartment'] = [];
                        }
                        residentialCharacteristics['mecp:NonResidentialApartment'].push({ ...residentialApartment });
                        residentialApartment = {};
                    }
                    if (data[i][0]) {
                        residentialApartment['mecp:ProvisionalNumber'] = data[i][0];
                    }
                    if (data[i][1]) {
                        residentialApartment['mecp:Purpose'] = data[i][1];
                    }
                    if (data[i][2]) {
                        residentialApartment['mecp:Floor'] = data[i][2];
                    }
                    if (data[i][3]) {
                        residentialApartment['mecp:Entrance'] = data[i][3];
                    }
                    if (data[i][4]) {
                        residentialApartment['mecp:Square'] = data[i][4];
                    }
        
                    if (!residentialApartment['mecp:ServingRoomsInfo']) {
                        residentialApartment['mecp:ServingRoomsInfo'] = [];
                    }
                    if (data[i][5] && data[i][6]) {
                        residentialApartment['mecp:ServingRoomsInfo'].push({
                            'mecp:Title': data[i][5],
                            'mecp:Square': data[i][6]
                        });
                    }
                }
                xmlJson['mecd:Declaration']['mecd:ProjectDeclaration'][0]['mecd:Project'][0]['mecp:Objects'][0]['mecp:Building'][0]['mecp:Apartments'][0]['mecp:NonResidentialCharacteristics'] = residentialCharacteristics;
                resolve(xmlJson);
            });
            fs.createReadStream(csvLive.path).pipe(parser);
        });
    }

    fillResidentialApartment(xmlJson, csvLive) {
        return new Promise((resolve) => {
            let parser = parse({
                delimiter: ';'
            }, (err, data) => {
                // let residentialCharacteristics = this.fillResidentialApartment(data);
                let residentialCharacteristics = {};
                let residentialApartment = {};
                for (let i = 2; i < data.length; i++) {
                    if ((data[i][0] && data[i][0] != '' && Object.keys(residentialApartment).length !== 0) ||
                            (i + 1) == data.length) {
                        if (!residentialCharacteristics['mecp:ResidentialApartment']) {
                            residentialCharacteristics['mecp:ResidentialApartment'] = [];
                        }
                        residentialCharacteristics['mecp:ResidentialApartment'].push({ ...residentialApartment });
                        residentialApartment = {};
                    }
                    if (data[i][0]) {
                        residentialApartment['mecp:ProvisionalNumber'] = data[i][0];
                    }
                    if (data[i][1]) {
                        residentialApartment['mecp:Purpose'] = data[i][1];
                    }
                    if (data[i][2]) {
                        residentialApartment['mecp:Floor'] = data[i][2];
                    }
                    if (data[i][3]) {
                        residentialApartment['mecp:Entrance'] = data[i][3];
                    }
                    if (data[i][4]) {
                        residentialApartment['mecp:Square'] = data[i][4];
                    }
                    if (data[i][5]) {
                        residentialApartment['mecp:RoomCount'] = data[i][5];
                    }
        
                    if (!residentialApartment['mecp:LivingRoomsInfo']) {
                        residentialApartment['mecp:LivingRoomsInfo'] = [];
                    }
                    if (data[i][6] && data[i][7]) {
                        residentialApartment['mecp:LivingRoomsInfo'].push({
                            'mecp:Number': data[i][6],
                            'mecp:Square': data[i][7]
                        });
                    }
        
                    if (!residentialApartment['mecp:ServingRoomsInfo']) {
                        residentialApartment['mecp:ServingRoomsInfo'] = [];
                    }
                    if (data[i][8] && data[i][9]) {
                        residentialApartment['mecp:ServingRoomsInfo'].push({
                            'mecp:Title': data[i][8],
                            'mecp:Square': data[i][9]
                        });
                    }
                }
                xmlJson['mecd:Declaration']['mecd:ProjectDeclaration'][0]['mecd:Project'][0]['mecp:Objects'][0]['mecp:Building'][0]['mecp:Apartments'][0]['mecp:ResidentialCharacteristics'] = residentialCharacteristics;
                resolve(xmlJson);
            });
            fs.createReadStream(csvLive.path).pipe(parser);
        });
    }

    getPath(data, columnIndex) {
        let res = [];
        for (let i = 0; i < 8; i++) {
            for (let j = columnIndex; j >= 0; j--) {
                if (data[i][j]) {
                    res.push(data[i][j]);
                    if (j == columnIndex && !data[i + 1][j]) {
                        return res;
                    }
                    break;
                }
            }
        }
        return res;
    }

    setValue(body, aPaths, value, i) {
        // if (i == 0)
        // console.log('>', aPaths, value);
        if (aPaths.length == (i + 1)) {
            body[aPaths[i]] = value;
            // console.log('>>>', aPaths[i], body);
            return body;
        }

        if (!body[aPaths[i]]) {
            body[aPaths[i]] = {};
        }

        body[aPaths[i]] = this.setValue(body[aPaths[i]], aPaths, value, (i + 1));
        // console.log('>>', aPaths[i]);
        return body;
    }

    async generate(req, res) {
        let files = req.files;
        try {

            if (files.csv && files.csv.length > 0) {
                let csv = files.csv[0];
                var parser = parse({
                    delimiter: ';'
                }, (err, data) => {
                    var builder = new xml2js.Builder({
                        rootName: 'mecd:Declaration'
                    });
                    let files = [];

                    for (let i = 8; i < data.length; i++) {
                        let doc = {};
                        let body = {};
                        doc['mecd:Number'] = '-';
                        for (let j = 0; j < data[i].length; j++) {
                            if (data[i][j]) {
                                let aPaths = this.getPath(data, j);
                                body = this.setValue(body, aPaths, data[i][j], 0);
                            }
                        }
                        doc['mecd:ProjectDeclaration'] = {
                            $: {
                                Id: 0
                            },
                            ...body
                        };

                        let xml = builder.buildObject({
                            $: {
                                'xmlns:mecd': 'http://dol.minstroyrf.ru/v1.2/eqcondec.xsd',
                                'xmlns:ds': 'http://www.w3.org/2000/09/xmldsig#',
                                'xmlns:mec': 'http://dol.minstroyrf.ru/v1.2/eqcon.xsd',
                                'xmlns:mecc': 'http://dol.minstroyrf.ru/v1.2/eqconcom.xsd',
                                'xmlns:mecdv': 'http://dol.minstroyrf.ru/v1.2/eqcondev.xsd',
                                'xmlns:mecp': 'http://dol.minstroyrf.ru/v1.2/eqconprj.xsd',
                                'xmlns:xs': 'http://www.w3.org/2001/XMLSchema',
                                'Id': 'dreg'
                            },
                            ...doc
                        });

                        let file = `${uuidV4()}.xml`;
                        let filePath = `./src/backend/static/files/${file}`;
                        fs.writeFileSync(filePath, xml);
                        files.push(`/files/${file}`);
                    }

                    return this._resp.formattedSuccessResponse(res, files, 200);
                });

                fs.createReadStream(csv.path).pipe(parser);
            }
        } catch (error) {
            console.error(error);
            return this._resp.formattedErrorResponse(res, req, error.message, 500);
        }
    }

}