import { POST_PD_REQUEST, PD_SUCCESS, PD_ERROR } from '../constants';
import fetch from 'isomorphic-fetch';
import config from '../../../config';
import { call, put, takeEvery } from 'redux-saga/effects';

/* subscribe on actions */
function* sagaPd() {
	yield takeEvery(POST_PD_REQUEST, postCsv);
}

/* middlewares */
function* postCsv(action) {
	try {
		const xml = yield call(uploadCsv, action.csv);
		yield put({ type: PD_SUCCESS, styles: xml.data });
	} catch (e) {
		yield put({ type: PD_ERROR, message: e.message });
	}
}

/* queries */
function uploadCsv(csv) {
	var formData = new FormData();
	console.log(csv)
	formData.append('csvDie', csv.csvDie);
	formData.append('csvLive', csv.csvLive);
	formData.append('csvCommonAreas', csv.csvCommonAreas);
	formData.append('csvOtherCommonProperties', csv.csvOtherCommonProperties);
	formData.append('xmlTamplate', csv.xmlTamplate);

	return fetch('https://' + ENV_HOST + CORE_URL + config.apiConfig.generatePdUrl, {
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

export default sagaPd;
