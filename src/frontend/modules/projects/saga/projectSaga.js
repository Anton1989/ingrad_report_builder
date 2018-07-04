import { GET_PROJECTS_REQUEST, GET_PROJECTS_SUCCESS, GET_PROJECTS_ERROR } from '../constants';
import fetch from 'isomorphic-fetch';
import config from '../../../config';
import { call, put, takeEvery } from 'redux-saga/effects';

/* subscribe on actions */
function* sagaProjects() {
	yield takeEvery(GET_PROJECTS_REQUEST, fetchProjects);
}

/* middlewares */
function* fetchProjects(/* action */) {
	try {
		const projects = yield call(getProjects);
		yield put({type: GET_PROJECTS_SUCCESS, projects: projects.data});
	} catch (e) {
		yield put({type: GET_PROJECTS_ERROR, message: e.message});
	}
}

/* queries */
function getProjects() {
	return fetch('https://' + ENV_HOST + CORE_URL + config.apiConfig.getProjectsUrl, {
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
export default sagaProjects;