import { ADD_LAYER_REQUEST, UPD_LAYER_REQUEST, DEL_LAYER_REQUEST, SHOW_LAYERS } from '../constants';

export function addLayer(data) {
	return (dispatch) => {
		dispatch({
			type: ADD_LAYER_REQUEST,
			data
		});
	}
}

export function saveLayer(data) {
	return (dispatch) => {
		dispatch({
			type: UPD_LAYER_REQUEST,
			data
		});
	}
}

export function deleteLayer(placeId, id) {
	return (dispatch) => {
		dispatch({
			type: DEL_LAYER_REQUEST,
			placeId,
			id
		});
	}
}

export function showOnMap(id) {
	return (dispatch) => {
		dispatch({
			type: SHOW_LAYERS,
			id
		});
	}
}