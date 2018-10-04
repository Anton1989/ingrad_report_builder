import { GET_DOCS_REQUEST, POST_DOCS_REQUEST, DEL_DOCS_REQUEST, DEL_DOCS_SUCCESS, PUT_DOCS_REQUEST, PUT_DOCS_SUCCESS, POST_DOCS_SUCCESS, GET_DOCS_SUCCESS, GET_DOCS_ERROR } from '../constants';
import fetch from 'isomorphic-fetch';
import config from '../../../config';
import { call, put, takeEvery } from 'redux-saga/effects';

/* subscribe on actions */
function* sagaProjects() {
	yield takeEvery(GET_DOCS_REQUEST, fetchDocs);
	yield takeEvery(POST_DOCS_REQUEST, postDoc);
	yield takeEvery(PUT_DOCS_REQUEST, putDoc);
	yield takeEvery(DEL_DOCS_REQUEST, delDoc);
}


/* middlewares */
function* fetchDocs(action) {
	try {
		const docs = yield call(getDocs, action.project_id, action.step_id);
		yield put({ type: GET_DOCS_SUCCESS, docs: docs.data });
	} catch (e) {
		yield put({ type: GET_DOCS_ERROR, message: e.message });
	}
}
function* postDoc(action) {
	try {
		const doc = yield call(addDoc, action.doc);
		yield put({ type: POST_DOCS_SUCCESS, doc: doc.data });
	} catch (e) {
		yield put({ type: GET_DOCS_ERROR, message: e.message });
	}
}
function* putDoc(action) {
	try {
		const doc = yield call(saveDoc, action.doc);
		yield put({ type: PUT_DOCS_SUCCESS, doc: doc.data });
	} catch (e) {
		yield put({ type: GET_DOCS_ERROR, message: e.message });
	}
}
function* delDoc(action) {
	try {
		yield call(remDoc, action.id);
		yield put({ type: DEL_DOCS_SUCCESS, id: action.id });
	} catch (e) {
		yield put({ type: GET_DOCS_ERROR, message: e.message });
	}
}

/* queries */
function remDoc(id) {
	return fetch(config.apiConfig.getDocsUrl + '/' + id, {
		method: 'DELETE',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		}
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
function saveDoc(doc) {
	var formData = new FormData();
	if (doc.file && typeof doc.file === 'object') {
		formData.append('file', doc.file);
		delete doc.file;
	}
	formData.append('data', JSON.stringify(doc));
	return fetch(config.apiConfig.getDocsUrl + '/' + doc._id, {
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
function addDoc(doc) {
	var formData = new FormData();
	if (doc.file && typeof doc.file === 'object') {
		formData.append('file', doc.file);
		delete doc.file;
	}
	formData.append('data', JSON.stringify(doc));

	return fetch(config.apiConfig.getDocsUrl, {
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
function getDocs(project_id, step_id) {
	return fetch(config.apiConfig.getDocsUrl + '/?project_id=' + project_id + '&step_id=' + step_id, {
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