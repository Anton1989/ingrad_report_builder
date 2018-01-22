import { GET_PLACES_REQUEST, GET_PLACES_ERROR } from '../constants';

export function getPlaces() {
	return (dispatch) => {
		dispatch({
			type: GET_PLACES_REQUEST
		});
	}
}

export function dismissError() {
	return (dispatch) => {
		return dispatch({
			type: GET_PLACES_ERROR
		})
	}
}
