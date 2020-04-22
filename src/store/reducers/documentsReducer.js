import {
	FETCH_DOCUMENTS_SUCCESS,
	UPLOAD_DOCUMENT_SUCCESS,
} from '../actions/types';

const initialState = {
	documents: [],
	document: {},
};

export default (state = initialState, action) => {
	switch (action.type) {
		case FETCH_DOCUMENTS_SUCCESS:
		case UPLOAD_DOCUMENT_SUCCESS:
			return {
				...state,
				documents: action.payload,
			};
		default:
			return state;
	}
};
