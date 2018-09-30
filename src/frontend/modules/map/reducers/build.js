import { GET_DETAILS_REQUEST, GET_BUILDS_SUCCESS, GET_BUILDS_ERROR, DEL_BUILDS_SUCCESS, SAVE_BUILDS_SUCCESS, DISMISS_BUILDS_ERROR, ADD_BUILDS_SUCCESS } from '../constants';

const initialState = {
    data: {},
    errors: null,
    fetching: false
}

export default function build(state = initialState, action) {
    switch (action.type) {
        case GET_DETAILS_REQUEST:
            return { ...state, fetching: true }
        case ADD_BUILDS_SUCCESS: {
            const data = { ...state.data };
            if (data[action.build.placeId]) {
                data[action.build.placeId].push(action.build);
            } else {
                data[action.build.placeId] = [ action.build ];
            }
            return { ...state, data, fetching: false, errors: null }
        }
        case SAVE_BUILDS_SUCCESS: {
            const data = { ...state.data };

            const index = data[action.build.placeId].findIndex(panaram => panaram._id == action.build._id);
            data[action.build.placeId][index] = action.build;

            return { ...state, data, fetching: false, errors: null }
        }
        case DEL_BUILDS_SUCCESS: {
            const data = { ...state.data };

            const index = data[action.placeId].findIndex(panaram => panaram._id == action.id);
            data[action.placeId].splice(index, 1);

            return { ...state, data, fetching: false, errors: null }
        }
        case GET_BUILDS_SUCCESS: {
            const data = { ...state.data };
            data[action.id] = action.builds;
            return { ...state, data, fetching: false, errors: null }
        }
        case GET_BUILDS_ERROR:
            return { ...state, errors: action.message, fetching: false }
        case DISMISS_BUILDS_ERROR:
            return { ...state, errors: null }
        default:
            return state;
    }
}
