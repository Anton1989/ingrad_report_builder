import { KPI_REQUEST, POST_KPI_REQUEST, KPI_SUCCESS, KPI_ADD_SUCCESS, KPI_ERROR } from '../constants';
import fetch from 'isomorphic-fetch';
import config from '../../../config';
import { call, put, takeEvery } from 'redux-saga/effects';

/* subscribe on actions */
function* sagaKpi() {
	yield takeEvery(KPI_REQUEST, get);
	yield takeEvery(POST_KPI_REQUEST, post);
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

/* queries */
function getRequest() {
	return fetch('http://' + ENV_HOST + ':' + ENV_PORT + config.apiConfig.getKpiUrl, {
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
	return fetch('http://' + ENV_HOST + ':' + ENV_PORT + config.apiConfig.getKpiUrl, {
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

export default sagaKpi;
