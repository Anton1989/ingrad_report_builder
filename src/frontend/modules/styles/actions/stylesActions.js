import { GET_STYLES_REQUEST, POST_STYLES_REQUEST, DISMISS_STYLES_ERROR } from '../constants';

export function getStyles() {
	return (dispatch) => {
		dispatch({
			type: GET_STYLES_REQUEST
		});
	}
}

export function save(styles) {
	return (dispatch) => {
		dispatch({
			type: POST_STYLES_REQUEST,
			styles
		});
	}
}

export function dismissError() {
	return (dispatch) => {
		return dispatch({
			type: DISMISS_STYLES_ERROR
		})
	}
}
