import { PRJ_REQUEST, DISMISS_PRJ_ERROR } from '../constants';

export function get() {
	return (dispatch) => {
		dispatch({
			type: PRJ_REQUEST
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
