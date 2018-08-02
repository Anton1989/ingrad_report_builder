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
        case PRJ_SUCCESS: {
            let prjs = [];
            if (action.projectId && action.code) {
                prjs = [ ...state.data ];
                prjs.push(...action.projects);
            } else {
                prjs = action.projects;
            }
            return {
                ...state,
                data: [ ...prjs ],
                fetching: false,
                errors: null
            }
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