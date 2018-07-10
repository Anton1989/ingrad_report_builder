import { KPI_REQUEST, POST_KPI_REQUEST, PUT_KPI_REQUEST, KPI_SUCCESS, KPI_SAVE_SUCCESS, KPI_ADD_SUCCESS, KPI_ERROR } from '../constants';
import fetch from 'isomorphic-fetch';
import config from '../../../config';
import { call, put, takeEvery } from 'redux-saga/effects';

/* subscribe on actions */
function* sagaKpi() {
	yield takeEvery(KPI_REQUEST, get);
	yield takeEvery(POST_KPI_REQUEST, post);
	yield takeEvery(PUT_KPI_REQUEST, save);
}

/* middlewares */
function* get(/*action*/) {
	try {
		const kpi = yield call(getRequest);
		yield put({ type: KPI_SUCCESS, kpi: kpi.data });
	} catch (e) {
		yield put({ type: KPI_ERROR, message: e.message });
	}
}
function* post(action) {
	try {
		const kpi = yield call(postRequest, action.name);
		yield put({ type: KPI_ADD_SUCCESS, kpi: kpi.data });
	} catch (e) {
		yield put({ type: KPI_ERROR, message: e.message });
	}
}
function* save(action) {
	try {
		const kpi = yield call(putRequest, action.project);
		yield put({ type: KPI_SAVE_SUCCESS, kpi: kpi.data });
	} catch (e) {
		yield put({ type: KPI_ERROR, message: e.message });
	}
}

/* queries */
function getRequest() {
	const protocol = ENV_DEVELOPMENT ? 'http' : 'https';
	return fetch(protocol + '://' + ENV_HOST + ':' + ENV_PORT + CORE_URL + config.apiConfig.getKpiUrl, {
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
function postRequest(name) {
	const protocol = ENV_DEVELOPMENT ? 'http' : 'https';
	return fetch(protocol + '://' + ENV_HOST + ':' + ENV_PORT + CORE_URL + config.apiConfig.getKpiUrl, {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ name })
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
function putRequest(project) {
	const protocol = ENV_DEVELOPMENT ? 'http' : 'https';
	return fetch(protocol + '://' + ENV_HOST + ':' + ENV_PORT + CORE_URL + config.apiConfig.getKpiUrl + '/' + project._id, {
		method: 'PUT',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ project })
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

export default sagaKpi;
