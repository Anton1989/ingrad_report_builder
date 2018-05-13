import {
    STATUS_SUCCESS
} from '../constants';

const initialState = {
    data: []
}

export default function status(state = initialState, action) {
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