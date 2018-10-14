const cors = require('cors');
const ProjectsController = require('./controllers/projectsController');
const StylesController = require('./controllers/stylesController');
// const PdController = require('./controllers/pdController');
const DocsController = require('./controllers/docsController');
const bodyParser = require('body-parser');
const multer = require('multer');
// import PlacesController from './controllers/ placesController';
// import KpiController from './controllers/kpiController';

var upload = multer({ dest: 'uploads/' });

module.exports = class ApiConfig {

    constructor(express, dbPWA) {
        console.log('Start init api configuration');
        this._network = express;
        this._db = dbPWA;
        // this._config = config;
        this._initNetworksConfig();
        this._initEndpoints();
        console.log('End init network configuration');
    }

    _initNetworksConfig() {
        //Init CORS filter and body parser for express.
        this._network.use(cors());
        this._network.use(bodyParser.json());
        this._network.use(bodyParser.urlencoded({ extended: false }));
    }

    _initEndpoints() {
        //Init class controllers with methods
        let projectsController = new ProjectsController(this._network, this._db);
        // let placesController = new PlacesController(this._network);
        let stylesController = new StylesController(this._network);
        // let kpiController = new KpiController(this._network);
        // let pdController = new PdController(this._network);
        let docsController = new DocsController(this._network, this._db);

        //Init endpoints for express.
        var cpUpload = upload.fields([
            { name: 'file', maxCount: 1 },
            { name: 'image', maxCount: 1 },
            { name: 'logo', maxCount: 1 },
            { name: 'layer', maxCount: 100 },
            { name: 'csv', maxCount: 1 },
            { name: 'csvDie', maxCount: 1 },
            { name: 'csvLive', maxCount: 1 },
            { name: 'csvCommonAreas', maxCount: 1 },
            { name: 'csvOtherCommonProperties', maxCount: 1 },
            { name: 'xmlTamplate', maxCount: 1 }
        ]);
        this._network.use('/v1/projects', projectsController.getRouter());
        this._network.use('/v1/styles', stylesController.getRouter());
        // this._network.use('/v1/places', cpUpload, placesController.getRouter());
        // this._network.use('/v1/pd', cpUpload, pdController.getRouter());
        // this._network.use('/v1/kpi', kpiController.getRouter());
        this._network.use('/v1/docs', cpUpload, docsController.getRouter());
    }
}