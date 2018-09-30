import { ADD_BUILD_REQUEST, UPD_BUILD_REQUEST, DEL_BUILD_REQUEST } from '../constants';

export function addBuild(data) {
	return (dispatch) => {
		dispatch({
			type: ADD_BUILD_REQUEST,
			data
		});
	}
}

export function saveBuild(data) {
	return (dispatch) => {
		dispatch({
			type: UPD_BUILD_REQUEST,
			data
		});
	}
}

export function deleteBuild(placeId, id) {
	return (dispatch) => {
		dispatch({
			type: DEL_BUILD_REQUEST,
			placeId,
			id
		});
	}
}
