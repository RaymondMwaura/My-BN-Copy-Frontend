import {
	FETCH_FEEDBACK_SUCCESS,
	SEND_FEEDBACK_SUCCESS,
} from '../actions/types';

const initialState = {
	feedback: [],
	showToast: true,
};
const feedbackReducer = (state = initialState, { type, payload }) => {
	switch (type) {
		case FETCH_FEEDBACK_SUCCESS:
			return {
				...state,
				feedback: payload.feedback,
			};

		case SEND_FEEDBACK_SUCCESS:
			return {
				...state,
				feedback: payload.feedback,
			};

		default:
			return state;
	}
};

export default feedbackReducer;
