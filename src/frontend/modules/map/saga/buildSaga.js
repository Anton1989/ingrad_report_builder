import { GET_BUILDS_ERROR, ADD_BUILD_REQUEST, UPD_BUILD_REQUEST, DEL_BUILD_REQUEST, DEL_BUILDS_SUCCESS, SAVE_BUILDS_SUCCESS, ADD_BUILDS_SUCCESS } from '../constants';
import fetch from 'isomorphic-fetch';
import config from '../../../config';
import { call, put, takeEvery } from 'redux-saga/effects';

/* subscribe on actions */
function* buildBuild() {
	yield takeEvery(ADD_BUILD_REQUEST, addBuild);
	yield takeEvery(UPD_BUILD_REQUEST, saveBuild);
	yield takeEvery(DEL_BUILD_REQUEST, delBuild);
}

/* middlewares */
function* delBuild(action) {
	try {
		yield call(deleteBuild, action.id);
		yield put({ type: DEL_BUILDS_SUCCESS, id: action.id, placeId: action.placeId });
	} catch (e) {
		yield put({ type: GET_BUILDS_ERROR, message: e.message });
	}
}
function* addBuild(action) {
	try {
		const build = yield call(postBuild, action.data);
		yield put({ type: ADD_BUILDS_SUCCESS, build: build.data });
	} catch (e) {
		yield put({ type: GET_BUILDS_ERROR, message: e.message });
	}
}
function* saveBuild(action) {
	try {
		const build = yield call(putBuilde, action.data);
		yield put({ type: SAVE_BUILDS_SUCCESS, build: build.data });
	} catch (e) {
		yield put({ type: GET_BUILDS_ERROR, message: e.message });
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
function deleteBuild(id) {
	return fetch(getUrl(config.apiConfig.getBuildUrl) + '/' + id, {
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
function putBuilde(data) {
	const id = data._id;
	delete data._id;

	return fetch(getUrl(config.apiConfig.getBuildUrl + '/' + id), {
		method: 'PUT',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
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
function postBuild(data) {
	return fetch(getUrl(config.apiConfig.getBuildUrl), {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
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

export default buildBuild;
