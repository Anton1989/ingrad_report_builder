import { GET_DOCS_REQUEST, POST_DOCS_REQUEST, DEL_DOCS_REQUEST, PUT_DOCS_REQUEST, DISMISS_DOCS_ERROR } from '../constants';

export function get() {
	return (dispatch) => {
		dispatch({
			type: GET_DOCS_REQUEST
		});
	}
}

export function add(doc) {
	return (dispatch) => {
		dispatch({
			type: POST_DOCS_REQUEST,
			doc
		});
	}
}

export function save(doc) {
	return (dispatch) => {
		dispatch({
			type: PUT_DOCS_REQUEST,
			doc
		});
	}
}

export function del(id) {
	return (dispatch) => {
		dispatch({
			type: DEL_DOCS_REQUEST,
			id
		});
	}
}

export function dismissError() {
	return (dispatch) => {
		return dispatch({
			type: DISMISS_DOCS_ERROR
		})
	}
}
