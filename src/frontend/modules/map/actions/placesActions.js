import { GET_PLACES_REQUEST, ADD_PLACES_REQUEST, GET_PLACES_ERROR } from '../constants';

export function getPlaces() {
	return (dispatch) => {
		dispatch({
			type: GET_PLACES_REQUEST
		});
	}
}

export function addPlace(data) {
	return (dispatch) => {
		dispatch({
			type: ADD_PLACES_REQUEST,
			data
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
