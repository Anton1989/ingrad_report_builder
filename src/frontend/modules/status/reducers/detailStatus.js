import {
    DETAILS_REQUEST,
    DETAILS_SUCCESS
} from '../constants';

const initialState = {
    fetching: false,
    data: []
}

export default function detailStatus(state = initialState, action) {
    switch (action.type) {
        case DETAILS_REQUEST:
            return {
                ...state,
                fetching: true
            }
        case DETAILS_SUCCESS:
            return {
                ...state,
                fetching: false,
                data: action.details
            }
        default:
            return state;
    }
}