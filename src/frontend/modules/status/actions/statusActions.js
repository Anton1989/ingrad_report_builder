import { PRJ_REQUEST, DISMISS_PRJ_ERROR, DETAILS_REQUEST } from '../constants';

export function get() {
	return (dispatch) => {
		dispatch({
			type: PRJ_REQUEST
		});
	}
}

export function getDetails(id) {
	return (dispatch) => {
		dispatch({
			type: DETAILS_REQUEST,
			id
		});
	}
}

export function dismissError() {
	return (dispatch) => {
		return dispatch({
			type: DISMISS_PRJ_ERROR
		})
	}
}
