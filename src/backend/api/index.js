import cors from 'cors';

export default class ApiConfig {
    
    constructor(express){
        this._log = logger.getLogger('network/NetworkConfig');
        console.log('Start init api configuration');
        this._appConfig = appConfig;
        this._network = express;
        this._initNetworksConfig();
        this._initEndpoints();
        console.log('End init network configuration');
    }

    _initNetworksConfig(){
        //Init CORS filter and body parser for express.
        this._network.use(cors());
        this._network.use(bodyParser.json());
        this._network.use(bodyParser.urlencoded({extended: false}));
    }

    _initEndpoints(){
        //Init class controllers with methods
        let transactionsController = new TransactionsController(this.getExpress(), this._logger, this._dbConfig, this._defaultParams, this._appConfig);

        //Init endpoints for express.
        this._network.use('/v1/price/product/status', priceProdStatusController.getRouter());
    }
}