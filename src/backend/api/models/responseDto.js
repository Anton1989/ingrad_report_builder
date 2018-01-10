import moment from 'moment';

export default class Response {

    formattedSuccessResponse(res, data, status) {
        console.log("Response: " + JSON.stringify(data));
        res.contentType('application/json');
        let result = {data: data, timestamp: moment.utc().format('x')};
        return res.status(status).json(result);
    }

    formattedErrorResponse(res, req, message, status) {
        status = status || 500;
        let result = {
            error: {code: status, message: message, method: req.method, endpoint: req.originalUrl},
            timestamp: moment.utc().format('x')
        };
        console.error(result);
        res.contentType('application/json');
        return res.status(status).json(result);
    }

    formattedErrorJSON(message, status,req) {
        status = status || 500;
        let errorJSON = {code: status, message: message};
        if(req){
            errorJSON.method = req.method;
            errorJSON.endpoint = req.originalUrl;
        }
        let result = {
            error: errorJSON,
            timestamp: moment.utc().format('x')
        };
        console.error(result);
        return result;
    }
}