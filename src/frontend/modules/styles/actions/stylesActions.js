import { GET_STYLES_REQUEST, POST_STYLES_REQUEST, DISMISS_STYLES_ERROR } from '../constants';

export function getStyles(page = 'map') {
	return (dispatch) => {
		dispatch({
			type: GET_STYLES_REQUEST,
			page
		});
	}
}

export function save(styles, page = 'map') {
	return (dispatch) => {
		dispatch({
			type: POST_STYLES_REQUEST,
			styles,
			page
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
