import { ADD_PANORAME_REQUEST, UPD_PANORAME_REQUEST, DEL_PANORAME_REQUEST, DEL_PANARAMS_SUCCESS, ADD_PANARAMS_SUCCESS, SAVE_PANARAMS_SUCCESS, GET_PANARAMS_ERROR } from '../constants';
import fetch from 'isomorphic-fetch';
import config from '../../../config';
import { call, put, takeEvery } from 'redux-saga/effects';

/* subscribe on actions */
function* sagaPlaces() {
	yield takeEvery(ADD_PANORAME_REQUEST, addPanaram);
	yield takeEvery(UPD_PANORAME_REQUEST, savePanaram);
	yield takeEvery(DEL_PANORAME_REQUEST, delPanaram);
}

/* middlewares */
function* delPanaram(action) {
	try {
		yield call(deletePanaram, action.id);
		yield put({ type: DEL_PANARAMS_SUCCESS, id: action.id, placeId: action.placeId });
	} catch (e) {
		yield put({ type: GET_PANARAMS_ERROR, message: e.message });
	}
}
function* addPanaram(action) {
	try {
		const panaram = yield call(postPanarame, action.data);
		yield put({ type: ADD_PANARAMS_SUCCESS, panaram: panaram.data });
	} catch (e) {
		yield put({ type: GET_PANARAMS_ERROR, message: e.message });
	}
}
function* savePanaram(action) {
	try {
		const panaram = yield call(putPanarame, action.data);
		yield put({ type: SAVE_PANARAMS_SUCCESS, panaram: panaram.data });
	} catch (e) {
		yield put({ type: GET_PANARAMS_ERROR, message: e.message });
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
function deletePanaram(id) {
	return fetch(getUrl(config.apiConfig.getPanaramUrl) + '/' + id, {
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
function putPanarame(data) {
	const id = data._id;
	delete data._id;
	var formData = new FormData();
	if (data.src && typeof data.src === 'object') {
		formData.append('src', data.src);
		delete data.src;
	}
	formData.append('data', JSON.stringify(data));

	return fetch(getUrl(config.apiConfig.getPanaramUrl + '/' + id), {
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
function postPanarame(data) {
	var formData = new FormData();
	if (data.src) {
		formData.append('src', data.src);
	}
	delete data.src;
	formData.append('data', JSON.stringify(data));
	return fetch(getUrl(config.apiConfig.getPanaramUrl), {
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
