import { POST_PD_REQUEST, DISMISS_PD_ERROR } from '../constants';

export function upload(csv) {
	return (dispatch) => {
		dispatch({
			type: POST_PD_REQUEST,
			csv
		});
	}
}

export function dismissError() {
	return (dispatch) => {
		return dispatch({
			type: DISMISS_PD_ERROR
		})
	}
}
