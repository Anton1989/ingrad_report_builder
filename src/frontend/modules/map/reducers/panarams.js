import { GET_PANARAMS_SUCCESS, GET_PANARAMS_ERROR, DEL_PANARAMS_SUCCESS, SAVE_PANARAMS_SUCCESS, DISMISS_PANARAMS_ERROR, GET_DETAILS_REQUEST, ADD_PANARAMS_SUCCESS } from '../constants';

const initialState = {
    data: {},
    errors: null,
    fetching: false
}

export default function panarams(state = initialState, action) {
    switch (action.type) {
        case GET_DETAILS_REQUEST:
            return { ...state, fetching: true }
        case ADD_PANARAMS_SUCCESS: {
            const data = { ...state.data };
            if (data[action.panaram.placeId]) {
                data[action.panaram.placeId].push(action.panaram);
            } else {
                data[action.panaram.placeId] = [ action.panaram ];
            }
            return { ...state, data, fetching: false, errors: null }
        }
        case SAVE_PANARAMS_SUCCESS: {
            const data = { ...state.data };

            const index = data[action.panaram.placeId].findIndex(panaram => panaram._id == action.panaram._id);
            data[action.panaram.placeId][index] = action.panaram;

            return { ...state, data, fetching: false, errors: null }
        }
        case DEL_PANARAMS_SUCCESS: {
            const data = { ...state.data };

            const index = data[action.placeId].findIndex(panaram => panaram._id == action.id);
            data[action.placeId].splice(index, 1);

            return { ...state, data, fetching: false, errors: null }
        }
        case GET_PANARAMS_SUCCESS: {
            const data = { ...state.data };
            data[action.id] = action.panarams;
            return { ...state, data, fetching: false, errors: null }
        }
        case GET_PANARAMS_ERROR:
            return { ...state, errors: action.message, fetching: false }
        case DISMISS_PANARAMS_ERROR:
            return { ...state, errors: null }
        default:
            return state;
    }
}
