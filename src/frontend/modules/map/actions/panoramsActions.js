import { ADD_PANORAME_REQUEST, UPD_PANORAME_REQUEST, DEL_PANORAME_REQUEST } from '../constants';

export function addPanorame(data) {
	return (dispatch) => {
		dispatch({
			type: ADD_PANORAME_REQUEST,
			data
		});
	}
}

export function savePanorame(data) {
	return (dispatch) => {
		dispatch({
			type: UPD_PANORAME_REQUEST,
			data
		});
	}
}

export function deletePanaram(placeId, id) {
	return (dispatch) => {
		dispatch({
			type: DEL_PANORAME_REQUEST,
			placeId,
			id
		});
	}
}