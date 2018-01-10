import { GET_PROJECTS_REQUEST, GET_PROJECTS_SUCCESS, GET_PROJECTS_ERROR } from '../constants';

const receiveSuccess = employees => ({ type: GET_PROJECTS_SUCCESS, employees })

export function getProjects() {
	return (dispatch) => {
		dispatch({
			type: GET_PROJECTS_REQUEST
		});
	}
}
export function save(employee) {
	return (dispatch, getState) => {
		const state = getState();
		dispatch(receiveSuccess(state.employee.data.map(item => employee.id == item.id ? employee : item)));
	}
}
export function dismissError() {
	return (dispatch) => {
		return dispatch({
			type: GET_PROJECTS_ERROR
		})
	}
}
