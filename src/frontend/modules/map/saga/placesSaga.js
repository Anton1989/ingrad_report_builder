import { ADD_PLACES_REQUEST, DEL_PLACES_REQUEST, DEL_PLACES_SUCCESS, ADD_PLACES_SUCCESS, UPD_PLACES_REQUEST, UPD_PLACES_SUCCESS, GET_PLACES_REQUEST, GET_PLACES_SUCCESS, GET_PLACES_ERROR } from '../constants';
import fetch from 'isomorphic-fetch';
import config from '../../../config';
import { call, put, takeEvery } from 'redux-saga/effects';

/* subscribe on actions */
function* sagaPlaces() {
	yield takeEvery(GET_PLACES_REQUEST, fetchPlaces);
	yield takeEvery(ADD_PLACES_REQUEST, addPlace);
	yield takeEvery(UPD_PLACES_REQUEST, updPlace);
	yield takeEvery(DEL_PLACES_REQUEST, delPlace);
}

/* middlewares */
function* fetchPlaces(/* action */) {
	try {
		const places = yield call(getPlaces);
		yield put({ type: GET_PLACES_SUCCESS, places: places.data });
	} catch (e) {
		yield put({ type: GET_PLACES_ERROR, message: e.message });
	}
}
function* addPlace(action) {
	try {
		const place = yield call(postPlace, action.data);
		yield put({ type: ADD_PLACES_SUCCESS, place: place.data });
	} catch (e) {
		yield put({ type: GET_PLACES_ERROR, message: e.message });
	}
}
function* updPlace(action) {
	try {
		const place = yield call(putPlace, action.data);
		yield put({ type: UPD_PLACES_SUCCESS, place: place.data });
	} catch (e) {
		yield put({ type: GET_PLACES_ERROR, message: e.message });
	}
}
function* delPlace(action) {
	try {
		yield call(deletePlace, action.id);
		yield put({ type: DEL_PLACES_SUCCESS, place_id: action.id });
	} catch (e) {
		yield put({ type: GET_PLACES_ERROR, message: e.message });
	}
}

/* queries */
function getPlaces() {
	return fetch('http://' + ENV_HOST + ':' + ENV_PORT + config.apiConfig.getPlacesUrl, {
		method: 'GET'
	})
		.then(response => {
			if (200 == response.status) {
				return response
			} else {
				throw new Error('Cannot load data from server. Response status ' + response.status)
			}
		})
		.then(response => response.json())
}

function deletePlace(id) {
	return fetch('http://' + ENV_HOST + ':' + ENV_PORT + config.apiConfig.getPlacesUrl + '/' + id, {
		method: 'DELETE'
	})
		.then(response => {
			if (200 == response.status) {
				return response
			} else {
				throw new Error('Cannot load data from server. Response status ' + response.status)
			}
		})
		.then(response => response.json())
}

function putPlace(data) {
	var formData = new FormData();
	if (data.image && typeof data.image === 'object') {
		formData.append('image', data.image);
		delete data.image;
	}
	if (data.logo && typeof data.logo === 'object') {
		formData.append('logo', data.logo);
		delete data.logo;
	}
	if (data.layers && data.layers.length > 0) {
		data.layers.forEach((layer, index) => {
			delete data.layers[index].show;
			if(layer.image && typeof layer.image === 'object') {
				formData.append('layer', layer.image);
				data.layers[index].image = 'TOSAVE';
			}
		});
	}
	if (data.panarams && data.panarams.length > 0) {
		data.panarams.forEach((panaram, index) => {
			delete data.panarams[index].show;
			if(panaram.src && typeof panaram.src === 'object') {
				formData.append('panaram', panaram.src);
				data.panarams[index].src = 'TOSAVE';
			}
		});
	}
	
	formData.append('data', JSON.stringify(data));
	return fetch('http://' + ENV_HOST + ':' + ENV_PORT + config.apiConfig.getPlacesUrl + '/' + data._id, {
		method: 'PUT',
		body: formData
	})
		.then(response => {
			if (200 == response.status) {
				return response
			} else {
				throw new Error('Cannot load data from server. Response status ' + response.status)
			}
		})
		.then(response => response.json())
}

function postPlace(data) {
	var formData = new FormData();
	if (data.image) {
		formData.append('image', data.image);
	}
	if (data.logo) {
		formData.append('logo', data.logo);
	}
	delete data.image;
	delete data.logo;
	formData.append('data', JSON.stringify(data));
	return fetch('http://' + ENV_HOST + ':' + ENV_PORT + config.apiConfig.getPlacesUrl, {
		method: 'POST',
		body: formData
	})
		.then(response => {
			if (200 == response.status) {
				return response
			} else {
				throw new Error('Cannot load data from server. Response status ' + response.status)
			}
		})
		.then(response => response.json())
}

export default sagaPlaces;
