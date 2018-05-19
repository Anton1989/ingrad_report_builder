import { PRJ_REQUEST, PRJ_SUCCESS, PRJ_ERROR, DETAILS_REQUEST, DETAILS_SUCCESS } from '../constants';
import fetch from 'isomorphic-fetch';
import { call, put, takeEvery } from 'redux-saga/effects';

/* subscribe on actions */
function* sagaStatus() {
	yield takeEvery(PRJ_REQUEST, get);
	yield takeEvery(DETAILS_REQUEST, getDetails);
}

/* middlewares */
function* get(/*action*/) {
	try {
		const projects = yield call(getProjects);
		yield put({ type: PRJ_SUCCESS, projects: projects.data });

		/*
		let parameters = [];
		for(let i=0; i < projects.length; i++) {
			parameters.push('prjId[]=' + projects[i]['_id']);
		}
		const status = yield call(getStatus, parameters.join('&'));
		yield put({ type: STATUS_SUCCESS, status });
		*/
	} catch (e) {
		yield put({ type: PRJ_ERROR, message: e.message });
	}
}

function* getDetails(action) {
	try {
		const details = yield call(getBuilds, action.id);
		yield put({ type: DETAILS_SUCCESS, details });
	} catch (e) {
		yield put({ type: PRJ_ERROR, message: e.message });
	}
}

/* queries */
function getBuilds(project_id) {
	return fetch('http://www.mocky.io/v2/5af880f03200009a0986af0c?project_id=' + project_id, {
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
function getProjects() {
	return fetch('/v1/projects', {
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
/*
function getStatus(params) {
	return fetch('http://www.mocky.io/v2/5af0b9a13100004a0096c74c?' + params, {
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
*/
export default sagaStatus;