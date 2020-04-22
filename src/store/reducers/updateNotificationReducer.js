import { UPDATE_NOTIFICATION } from '../actions/types';

const initialState = {
	newNotification: null,
};

export default (state = initialState, action) => {
	switch (action.type) {
		case UPDATE_NOTIFICATION:
			return {
				...state,
				newNotification: action.payload,
			};
		default:
			return {
				...state,
			};
	}
};
