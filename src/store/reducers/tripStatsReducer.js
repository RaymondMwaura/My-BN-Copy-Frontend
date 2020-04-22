import {
	FETCH_ALL_TRAVEL_STATS,
	FETCH_TRAVEL_STATS_FAIL,
	FETCH_MANAGER_USERS,
	FETCH_MANAGER_USERS_FAIL,
	FETCH_TRAVEL_STATS_TIME_X,
} from '../actions/types';

const initialState = {
	weekTravels: 0,
	monthTravels: 0,
	yearTravels: 0,
	allTravels: 0,
	travels: 0,
	mostVisitedHotels: [],
	managerUsers: [],
	status: '',
};

export default (state = initialState, action) => {
	switch (action.type) {
		case FETCH_ALL_TRAVEL_STATS:
			return {
				...state,
				...action.payload,
				status: 'success',
			};
		case FETCH_TRAVEL_STATS_FAIL:
			return {
				...state,
				status: 'error',
			};
		case FETCH_MANAGER_USERS:
			return {
				...state,
				managerUsers: action.payload,
			};
		case FETCH_MANAGER_USERS_FAIL:
			return {
				...state,
				managerUsers: [],
			};
		case FETCH_TRAVEL_STATS_TIME_X:
			return {
				...state,
				travels: action.payload,
			};
		default:
			return {
				...state,
			};
	}
};
