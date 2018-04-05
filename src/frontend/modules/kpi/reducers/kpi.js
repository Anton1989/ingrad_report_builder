import {
    KPI_REQUEST,
    KPI_SUCCESS,
    KPI_ADD_SUCCESS,
    KPI_ERROR,
    DISMISS_KPI_ERROR,
    POST_KPI_REQUEST
} from '../constants';

const initialState = {
    data: [],
    errors: null,
    fetching: false
}

export default function kpi(state = initialState, action) {
    switch (action.type) {
        case POST_KPI_REQUEST:
        case KPI_REQUEST:
            return {
                ...state,
                fetching: true
            }
        case KPI_SUCCESS:
            return {
                ...state,
                data: action.kpi,
                fetching: false,
                errors: null
            }
        case KPI_ADD_SUCCESS:
            return {
                ...state,
                data: [...state.data, action.kpi],
                fetching: false,
                errors: null
            }
        case KPI_ERROR:
            return {
                ...state,
                errors: action.message,
                fetching: false
            }
        case DISMISS_KPI_ERROR:
            return {
                ...state,
                errors: null
            }
        default:
            return state;
    }
}