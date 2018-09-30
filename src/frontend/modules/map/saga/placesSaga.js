import { ADD_PLACES_REQUEST, DEL_PLACES_REQUEST, GET_BUILDS_SUCCESS, GET_LAYERS_SUCCESS, GET_PANARAMS_SUCCESS, GET_DETAILS_REQUEST, DEL_PLACES_SUCCESS, ADD_PLACES_SUCCESS, UPD_PLACES_REQUEST, UPD_PLACES_SUCCESS, GET_PLACES_REQUEST, GET_PLACES_SUCCESS, GET_PLACES_ERROR } from '../constants';
import fetch from 'isomorphic-fetch';
import config from '../../../config';
import { call, put, takeEvery } from 'redux-saga/effects';

/* subscribe on actions */
function* sagaPlaces() {
	yield takeEvery(GET_PLACES_REQUEST, fetchPlaces);
	yield takeEvery(GET_DETAILS_REQUEST, fetchDetails);
	yield takeEvery(ADD_PLACES_REQUEST, addPlace);
	yield takeEvery(UPD_PLACES_REQUEST, updPlace);
	yield takeEvery(DEL_PLACES_REQUEST, delPlace);
}

/* middlewares */
function* fetchDetails(action) {
	try {
		const panarams = yield call(getPanarams, action.id);
		yield put({ type: GET_PANARAMS_SUCCESS, id: action.id, panarams: panarams.data });

		const layers = yield call(getLayers, action.id);
		yield put({ type: GET_LAYERS_SUCCESS, id: action.id, layers: layers.data });

		const builds = yield call(getBuilds, action.id);
		yield put({ type: GET_BUILDS_SUCCESS, id: action.id, builds: builds.data });
	} catch (e) {
		yield put({ type: GET_PLACES_ERROR, message: e.message });
	}
}
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

function getUrl(path) {
	let url = null;
	if (ENV_DEVELOPMENT) {
		url = 'http://' + ENV_HOST + ':' + ENV_PORT + '/' + path;
	} else {
		url = 'https://' + ENV_HOST + CORE_URL + path;
	}
	return url;
}

/* queries */
function getBuilds(id) {
	return fetch(getUrl(config.apiConfig.getBuildUrl + '?placeId=' + id), {
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
function getLayers(id) {
	return fetch(getUrl(config.apiConfig.getLayerUrl + '?placeId=' + id), {
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
function getPanarams(id) {
	return fetch(getUrl(config.apiConfig.getPanaramUrl + '?placeId=' + id), {
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
function getPlaces() {
	return fetch(getUrl(config.apiConfig.getPlacesUrl), {
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
	return fetch(getUrl(config.apiConfig.getPlacesUrl) + '/' + id, {
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
	return fetch(getUrl(config.apiConfig.getPlacesUrl + '/' + data._id), {
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
	return fetch(getUrl(config.apiConfig.getPlacesUrl), {
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
