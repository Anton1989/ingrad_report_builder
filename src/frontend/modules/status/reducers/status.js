import {
    STATUS_SUCCESS
} from '../constants';

const initialState = {
    data: []
}

export default function kpi(state = initialState, action) {
    switch (action.type) {
        case STATUS_SUCCESS:
            return {
                ...state,
                data: action.status
            }
        default:
            return state;
    }
}