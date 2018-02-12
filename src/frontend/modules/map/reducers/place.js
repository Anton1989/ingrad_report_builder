import { ADD_PLACES_REQUEST, ADD_PLACES_SUCCESS, GET_PLACES_REQUEST, GET_PLACES_SUCCESS, GET_PLACES_ERROR, DISMISS_PLACES_ERROR } from '../constants';

const initialState = {
    data: [],
    errors: null,
    fetching: false
}

export default function places(state = initialState, action) {
    switch (action.type) {
        case GET_PLACES_REQUEST:
            return { ...state, fetching: true }
        case GET_PLACES_SUCCESS:
            return { ...state, data: action.places, fetching: false, errors: null }
        case ADD_PLACES_REQUEST:
            return { ...state, fetching: true }
        case ADD_PLACES_SUCCESS: {
            let updateData = [...state.data];
            updateData.push(action.place);
            return { ...state, data: updateData, fetching: false, errors: null }
        }
        case GET_PLACES_ERROR:
            return { ...state, errors: action.message, fetching: false }
        case DISMISS_PLACES_ERROR:
            return { ...state, errors: null }
        default:
            return state;
    }
}
