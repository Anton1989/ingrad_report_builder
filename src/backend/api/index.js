import cors from 'cors';
import ProjectsController from './controllers/projectsController';
import PlacesController from './controllers/placesController';
import StylesController from './controllers/stylesController';
import bodyParser from 'body-parser';
import multer from 'multer';

var upload = multer({ dest: 'uploads/' });

export default class ApiConfig {

    constructor(express) {
        console.log('Start init api configuration');
        this._network = express;
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
        let projectsController = new ProjectsController(this._network);
        let placesController = new PlacesController(this._network);
        let stylesController = new StylesController(this._network);

        //Init endpoints for express.
        var cpUpload = upload.fields([
            { name: 'image', maxCount: 1 },
            { name: 'logo', maxCount: 1 }
        ]);
        this._network.use('/v1/projects', projectsController.getRouter());
        this._network.use('/v1/styles', stylesController.getRouter());
        this._network.use('/v1/places', cpUpload, placesController.getRouter());
    }
}