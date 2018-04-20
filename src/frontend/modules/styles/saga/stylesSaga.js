import { GET_STYLES_REQUEST, POST_STYLES_REQUEST, GET_KPI_STYLES_SUCCESS, GET_STYLES_SUCCESS, GET_STYLES_ERROR } from '../constants';
import fetch from 'isomorphic-fetch';
import config from '../../../config';
import { call, put, takeEvery } from 'redux-saga/effects';

/* subscribe on actions */
function* sagaProjects() {
	yield takeEvery(GET_STYLES_REQUEST, fetchStyles);
	yield takeEvery(POST_STYLES_REQUEST, postStyles);
}

/* middlewares */
function* fetchStyles(action) {
	try {
		const styles = yield call(getStyles, action.page);
		if (action.page == 'kpi') {
			yield put({ type: GET_KPI_STYLES_SUCCESS, styles: styles.data });
		} else {
			yield put({ type: GET_STYLES_SUCCESS, styles: styles.data });
		}
	} catch (e) {
		yield put({ type: GET_STYLES_ERROR, message: e.message });
	}
}
function* postStyles(action) {
	try {
		const styles = yield call(sendStyles, action.styles, action.page);
		if (action.page == 'kpi') {
			yield put({ type: GET_KPI_STYLES_SUCCESS, styles: styles.data });
		} else {
			yield put({ type: GET_STYLES_SUCCESS, styles: styles.data });
		}
	} catch (e) {
		yield put({ type: GET_STYLES_ERROR, message: e.message });
	}
}

/* queries */
function sendStyles(styles, page) {
	return fetch('http://' + ENV_HOST + ':' + ENV_PORT + config.apiConfig.getStylesUrl + '/' + page, {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ styles })
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
function getStyles(page) {
	return fetch('http://' + ENV_HOST + ':' + ENV_PORT + config.apiConfig.getStylesUrl + '/' + page, {
		method: 'get'
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
export default sagaProjects;