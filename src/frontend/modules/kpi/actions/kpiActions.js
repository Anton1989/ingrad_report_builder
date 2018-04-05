import { KPI_REQUEST, POST_KPI_REQUEST, DISMISS_PD_ERROR } from '../constants';

export function get(csv) {
	return (dispatch) => {
		dispatch({
			type: KPI_REQUEST,
			csv
		});
	}
}

export function post(name) {
	return (dispatch) => {
		dispatch({
			type: POST_KPI_REQUEST,
			name
		});
	}
}

export function put(name) {
	return (dispatch) => {
		dispatch({
			type: POST_KPI_REQUEST,
			name
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
