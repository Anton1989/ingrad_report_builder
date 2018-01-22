import { GET_PLACES_REQUEST, GET_PLACES_SUCCESS, GET_PLACES_ERROR } from '../constants';
import fetch from 'isomorphic-fetch';
import config from '../../../config';
import { call, put, takeEvery } from 'redux-saga/effects';

/* subscribe on actions */
function* sagaPlaces() {
	yield takeEvery(GET_PLACES_REQUEST, fetchPlaces);
}

/* middlewares */
function* fetchPlaces(/* action */) {
	try {
		const places = yield call(getPlaces);
		yield put({type: GET_PLACES_SUCCESS, places: places.data});
	} catch (e) {
		yield put({type: GET_PLACES_ERROR, message: e.message});
	}
}

/* queries */
function getPlaces() {
	return fetch('http://' + ENV_HOST + ':' + ENV_PORT + config.apiConfig.getPlacesUrl, {
		method: 'get'
	})
	.then(response => {
		if( 200 == response.status ) {
			return response
		} else {
			throw new Error('Cannot load data from server. Response status ' + response.status)
		}
	})
	.then(response => response.json())
}
export default sagaPlaces;