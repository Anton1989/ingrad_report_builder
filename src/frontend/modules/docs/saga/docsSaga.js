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
function* fetchDocs(/*action*/) {
	try {
		const docs = yield call(getDocs);
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
	return fetch('http://' + ENV_HOST + ':' + ENV_PORT + config.apiConfig.getDocsUrl + '/' + id, {
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
	return fetch('http://' + ENV_HOST + ':' + ENV_PORT + config.apiConfig.getDocsUrl + '/' + doc._id, {
		method: 'PUT',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(doc)
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
	return fetch('http://' + ENV_HOST + ':' + ENV_PORT + config.apiConfig.getDocsUrl, {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(doc)
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
function getDocs() {
	return fetch('http://' + ENV_HOST + ':' + ENV_PORT + config.apiConfig.getDocsUrl, {
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