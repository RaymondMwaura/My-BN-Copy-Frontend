import { SET_STATS, CLEAR_STATS } from '../actions/types';

const initialState = {
	stats: {
		requester: [],
		manager: [],
		travel_administrator: [],
		super_administrator: [],
		suppliers: [],
	},
};

const profileCardsReducer = (state = initialState, { type, payload }) => {
	switch (type) {
		case SET_STATS:
			return {
				...state,
				stats: {
					...state.stats,
					[payload.role]: payload.data,
				},
			};
		case CLEAR_STATS:
			return initialState;
		default:
			return state;
	}
};

export default profileCardsReducer;
