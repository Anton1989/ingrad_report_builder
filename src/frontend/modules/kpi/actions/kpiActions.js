import { KPI_REQUEST, POST_KPI_REQUEST, PUT_KPI_REQUEST, DISMISS_PD_ERROR } from '../constants';

export function get(role) {
	return (dispatch) => {
		dispatch({
			type: KPI_REQUEST,
			role
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

export function put(project) {
	return (dispatch) => {
		dispatch({
			type: PUT_KPI_REQUEST,
			project
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
