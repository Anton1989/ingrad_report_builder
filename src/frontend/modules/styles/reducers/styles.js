import { GET_STYLES_REQUEST, GET_STYLES_SUCCESS, GET_STYLES_ERROR, DISMISS_STYLES_ERROR, POST_STYLES_REQUEST } from '../constants';

const initialState = {
    data: [],
    errors: null,
    fetching: false
}

export default function styles(state = initialState, action) {
    switch (action.type) {
        case POST_STYLES_REQUEST:
        case GET_STYLES_REQUEST:
            return { ...state, fetching: true }
        case GET_STYLES_SUCCESS:
            return { ...state, data: action.styles, fetching: false, errors: null }
        case GET_STYLES_ERROR:
            return { ...state, errors: action.message, fetching: false }
        case DISMISS_STYLES_ERROR:
            return { ...state, errors: null }
        default:
            return state;
    }
}
