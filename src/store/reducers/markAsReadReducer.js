import {
	MARKED_AS_READ_FAILURE,
	MARKED_AS_READ_SUCCESS,
} from '../actions/types';

const initialState = { data: false, error: null };

export default (state = initialState, { type, payload }) => {
	switch (type) {
		case MARKED_AS_READ_SUCCESS:
			return { ...state, data: payload };

		case MARKED_AS_READ_FAILURE:
			return { ...state, error: payload };

		default:
			return state;
	}
};
