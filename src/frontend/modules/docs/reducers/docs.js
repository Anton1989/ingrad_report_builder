import {
    GET_DOCS_REQUEST,
    GET_DOCS_SUCCESS,
    PUT_DOCS_SUCCESS,
    POST_DOCS_SUCCESS,
    GET_DOCS_ERROR,
    DISMISS_DOCS_ERROR,
    POST_DOCS_REQUEST,
    DEL_DOCS_SUCCESS
} from '../constants';

const initialState = {
    data: [],
    errors: null,
    fetching: false
}

export default function docs(state = initialState, action) {
    switch (action.type) {
        case POST_DOCS_REQUEST:
        case GET_DOCS_REQUEST:
            return { ...state,
                fetching: true
            }
        case GET_DOCS_SUCCESS:
            return { ...state,
                data: action.docs,
                fetching: false,
                errors: null
            }
        case POST_DOCS_SUCCESS:
            {
                let docs = [...state.data];
                docs.push(action.doc);
                return { ...state,
                    data: docs,
                    fetching: false,
                    errors: null
                }
            }
        case PUT_DOCS_SUCCESS:
            {
                let docs = [...state.data];
                let doc = docs.find(doc => doc._id == action.doc._id);
                for (let key in doc) {
                    doc[key] = action.doc[key];
                }
                return { ...state,
                    data: docs,
                    fetching: false,
                    errors: null
                }
            }
        case DEL_DOCS_SUCCESS:
            {
                let docs = [...state.data].filter(doc => doc._id !== action.id);
                return { ...state,
                    data: docs,
                    fetching: false,
                    errors: null
                }
            }
        case GET_DOCS_ERROR:
            return { ...state,
                errors: action.message,
                fetching: false
            }
        case DISMISS_DOCS_ERROR:
            return { ...state,
                errors: null
            }
        default:
            return state;
    }
}