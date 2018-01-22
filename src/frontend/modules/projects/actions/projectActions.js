import { GET_PROJECTS_REQUEST, GET_PROJECTS_ERROR } from '../constants';

export function getProjects() {
	return (dispatch) => {
		dispatch({
			type: GET_PROJECTS_REQUEST
		});
	}
}

export function dismissError() {
	return (dispatch) => {
		return dispatch({
			type: GET_PROJECTS_ERROR
		})
	}
}
