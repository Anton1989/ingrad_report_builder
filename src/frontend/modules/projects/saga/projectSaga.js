import { GET_PROJECTS_REQUEST, GET_PROJECTS_SUCCESS, GET_PROJECTS_ERROR } from '../constants';
import fetch from 'isomorphic-fetch';
import config from '../../../config';
import { call, put, takeEvery } from 'redux-saga/effects';

/* subscribe on actions */
function* sagaEmployees() {
	yield takeEvery(GET_PROJECTS_REQUEST, fetchEmployees);
}

/* middlewares */
function* fetchEmployees(/* action */) {
	try {
		const employees = yield call(getEmployees);
		yield put({type: GET_PROJECTS_SUCCESS, employees: employees.data});
	} catch (e) {
		yield put({type: GET_PROJECTS_ERROR, message: e.message});
	}
}

/* queries */
function getEmployees() {
	return fetch(config.employeeURL, {
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
export default sagaEmployees;