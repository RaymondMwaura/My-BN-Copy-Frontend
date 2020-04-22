import { BOOKING_SUCCESS } from '../actions/types';

const initialState = {
	data: null,
};

export default function(state = initialState, action) {
	switch (action.type) {
		case BOOKING_SUCCESS:
			return {
				...state,
				data: action.payload,
			};
		default:
			return state;
	}
}
