import { ADD_LAYER_REQUEST, UPD_LAYER_REQUEST, DEL_LAYER_REQUEST, DEL_LAYERS_SUCCESS, ADD_LAYERS_SUCCESS, SAVE_LAYERS_SUCCESS, GET_LAYERS_ERROR } from '../constants';
import fetch from 'isomorphic-fetch';
import config from '../../../config';
import { call, put, takeEvery } from 'redux-saga/effects';

/* subscribe on actions */
function* sagaLayer() {
	yield takeEvery(ADD_LAYER_REQUEST, addLayer);
	yield takeEvery(UPD_LAYER_REQUEST, saveLayer);
	yield takeEvery(DEL_LAYER_REQUEST, delLayer);
}

/* middlewares */
function* delLayer(action) {
	try {
		yield call(deleteLayer, action.id);
		yield put({ type: DEL_LAYERS_SUCCESS, id: action.id, placeId: action.placeId });
	} catch (e) {
		yield put({ type: GET_LAYERS_ERROR, message: e.message });
	}
}
function* addLayer(action) {
	try {
		const panaram = yield call(postLayere, action.data);
		yield put({ type: ADD_LAYERS_SUCCESS, panaram: panaram.data });
	} catch (e) {
		yield put({ type: GET_LAYERS_ERROR, message: e.message });
	}
}
function* saveLayer(action) {
	try {
		const panaram = yield call(putLayere, action.data);
		yield put({ type: SAVE_LAYERS_SUCCESS, panaram: panaram.data });
	} catch (e) {
		yield put({ type: GET_LAYERS_ERROR, message: e.message });
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
function deleteLayer(id) {
	return fetch(getUrl(config.apiConfig.getLayerUrl) + '/' + id, {
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
function putLayere(data) {
	const id = data._id;
	delete data._id;
	var formData = new FormData();
	if (data.image && typeof data.image === 'object') {
		formData.append('image', data.image);
		delete data.image;
	}
	formData.append('data', JSON.stringify(data));

	return fetch(getUrl(config.apiConfig.getLayerUrl + '/' + id), {
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
function postLayere(data) {
	var formData = new FormData();
	if (data.image) {
		formData.append('image', data.image);
	}
	delete data.image;
	formData.append('data', JSON.stringify(data));
	return fetch(getUrl(config.apiConfig.getLayerUrl), {
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

export default sagaLayer;
