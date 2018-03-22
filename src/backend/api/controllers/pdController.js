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
            this._router.post('/', this.generate.bind(this));
        }
        console.log('End init styles controller');
    }

    getRouter() {
        return this._router;
    }

    getPath(data, columnIndex) {
        let res = [];
        for (let i=0; i < 8; i++) {
            for (let j=columnIndex; j >= 0; j--) {
                if (data[i][j]) {
                    res.push(data[i][j]);
                    if (j == columnIndex && !data[i+1][j]) {
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
        if (aPaths.length == (i+1)) {
            body[aPaths[i]] = value;
            // console.log('>>>', aPaths[i], body);
            return body;
        }

        if (!body[aPaths[i]]) {
            body[aPaths[i]] = {};
        }

        body[aPaths[i]] = this.setValue(body[aPaths[i]], aPaths, value, (i+1));
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

                    for (let i=8; i < data.length; i++) {
                        let doc = {};
                        let body = {};
                        doc['mecd:Number'] = '-';
                        for (let j=0; j < data[i].length; j++) {
                            if (data[i][j]) {
                                let aPaths = this.getPath(data, j);
                                body = this.setValue(body, aPaths, data[i][j], 0);
                            }
                        }
                        doc['mecd:ProjectDeclaration'] = {
                            $: { Id: 0 },
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