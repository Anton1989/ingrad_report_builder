import { GET_PLACES_REQUEST, GET_DETAILS_REQUEST, DEL_PLACES_REQUEST, ADD_PLACES_REQUEST, UPD_PLACES_REQUEST, GET_PLACES_ERROR, SET_PLACE_CENTER } from '../constants';

export function setPlaceCenter(id, coordinates) {
	return (dispatch) => {
		dispatch({
			type: SET_PLACE_CENTER,
			id,
			coordinates
		});
	}
}

export function getDetails(id) {
	return (dispatch) => {
		dispatch({
			type: GET_DETAILS_REQUEST,
			id
		});
	}
}

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

export function updatePlace(data) {
	return (dispatch) => {
		dispatch({
			type: UPD_PLACES_REQUEST,
			data
		});
	}
}

export function delPlace(id) {
	return (dispatch) => {
		dispatch({
			type: DEL_PLACES_REQUEST,
			id
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
