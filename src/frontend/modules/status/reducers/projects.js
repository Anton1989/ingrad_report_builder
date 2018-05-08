import {
    PRJ_REQUEST, PRJ_SUCCESS, PRJ_ERROR, DISMISS_PRJ_ERROR
} from '../constants';

const initialState = {
    data: [],
    errors: null,
    fetching: false
}

export default function projects(state = initialState, action) {
    switch (action.type) {
        case PRJ_REQUEST:
            return {
                ...state,
                fetching: true
            }
        case PRJ_SUCCESS:
            return {
                ...state,
                data: action.projects,
                fetching: false,
                errors: null
            }
        case PRJ_ERROR:
            return {
                ...state,
                errors: action.message,
                fetching: false
            }
        case DISMISS_PRJ_ERROR:
            return {
                ...state,
                errors: null
            }
        default:
            return state;
    }
}