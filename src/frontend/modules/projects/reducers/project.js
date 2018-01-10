import { GET_PROJECTS_REQUEST, GET_PROJECTS_SUCCESS, GET_PROJECTS_ERROR, DISMISS_PROJECTS_ERROR } from '../constants';

const initialState = {
    data: [],
    errors: null,
    fetching: false
}

export default function projects(state = initialState, action) {
    switch (action.type) {
        case GET_PROJECTS_REQUEST:
            return { ...state, fetching: true }
        case GET_PROJECTS_SUCCESS:
            return { ...state, data: action.employees, fetching: false, errors: null }
        case GET_PROJECTS_ERROR:
            return { ...state, errors: action.message, fetching: false }
        case DISMISS_PROJECTS_ERROR:
            return { ...state, errors: null }
        default:
            return state;
    }
}
