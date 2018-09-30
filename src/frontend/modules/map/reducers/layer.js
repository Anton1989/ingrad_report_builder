import { GET_DETAILS_REQUEST, SHOW_LAYERS, GET_LAYERS_SUCCESS, GET_LAYERS_ERROR, DEL_LAYERS_SUCCESS, SAVE_LAYERS_SUCCESS, DISMISS_LAYERS_ERROR, ADD_LAYERS_SUCCESS } from '../constants';

const initialState = {
    data: {},
    toShow: [],
    errors: null,
    fetching: false
}

export default function layer(state = initialState, action) {
    switch (action.type) {
        case SHOW_LAYERS: {
            const toShow = [ ...state.toShow ];
            if (toShow.includes(action.id)) {
                toShow.splice(toShow.indexOf(action.id), 1)
            } else {
                toShow.push(action.id)
            }
            return { ...state, toShow }
        }
        case GET_DETAILS_REQUEST:
            return { ...state, fetching: true }
        case ADD_LAYERS_SUCCESS: {
            const data = { ...state.data };
            if (data[action.panaram.placeId]) {
                data[action.panaram.placeId].push(action.panaram);
            } else {
                data[action.panaram.placeId] = [ action.panaram ];
            }
            return { ...state, data, fetching: false, errors: null }
        }
        case SAVE_LAYERS_SUCCESS: {
            const data = { ...state.data };

            const index = data[action.panaram.placeId].findIndex(panaram => panaram._id == action.panaram._id);
            data[action.panaram.placeId][index] = action.panaram;

            return { ...state, data, fetching: false, errors: null }
        }
        case DEL_LAYERS_SUCCESS: {
            const data = { ...state.data };

            const index = data[action.placeId].findIndex(panaram => panaram._id == action.id);
            data[action.placeId].splice(index, 1);

            return { ...state, data, fetching: false, errors: null }
        }
        case GET_LAYERS_SUCCESS: {
            const data = { ...state.data };
            data[action.id] = action.layers;
            return { ...state, data, fetching: false, errors: null }
        }
        case GET_LAYERS_ERROR:
            return { ...state, errors: action.message, fetching: false }
        case DISMISS_LAYERS_ERROR:
            return { ...state, errors: null }
        default:
            return state;
    }
}
