import {
    PD_SUCCESS,
    PD_ERROR,
    DISMISS_PD_ERROR,
    POST_PD_REQUEST
} from '../constants';

const initialState = {
    data: [],
    errors: null,
    fetching: false
}

export default function styles(state = initialState, action) {
    switch (action.type) {
        case POST_PD_REQUEST:
            return { ...state,
                fetching: true
            }
        case PD_SUCCESS:
            return { ...state,
                data: action.styles,
                fetching: false,
                errors: null
            }
        case PD_ERROR:
            return { ...state,
                errors: action.message,
                fetching: false
            }
        case DISMISS_PD_ERROR:
            return { ...state,
                errors: null
            }
        default:
            return state;
    }
}