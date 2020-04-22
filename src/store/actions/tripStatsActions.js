import toast from '../../lib/toast';
import {
	FETCH_ALL_TRAVEL_STATS,
	FETCH_TRAVEL_STATS_FAIL,
	FETCH_TRAVEL_STATS_TIME_X,
	FETCH_TRAVEL_STATS_TIME_X_FAIL,
	FETCH_MANAGER_USERS,
	FETCH_MANAGER_USERS_FAIL,
	BUTTON_LOADING,
	LOADING,
} from './types';
import actionFunc from '../../utils/actionFunc';
import apiCall from '../../utils/api';
import { getDateFromTimeX } from '../../lib/time';

export const fetchTravelStats = () => async dispatch => {
	dispatch(actionFunc(LOADING, true));
	try {
		const week = getDateFromTimeX(1, 'weeks');
		const month = getDateFromTimeX(1, 'months');
		const year = getDateFromTimeX(1, 'years');
		const res = await apiCall.get('/trips/stats');
		const res1 = await apiCall.get(`/trips/stats?fromDate=${week}`);
		const res2 = await apiCall.get(`/trips/stats?fromDate=${month}`);
		const res3 = await apiCall.get(`/trips/stats?fromDate=${year}`);
		const res4 = await apiCall.get(`/hotels/most-travelled`);
		dispatch(
			actionFunc(FETCH_ALL_TRAVEL_STATS, {
				weekTravels: res1.data.data.total,
				monthTravels: res2.data.data.total,
				yearTravels: res3.data.data.total,
				allTravels: res.data.data.total,
				mostVisitedHotels: res4.data.data.results,
			}),
		);
		dispatch(actionFunc(LOADING, false));
	} catch (error) {
		dispatch(actionFunc(FETCH_TRAVEL_STATS_FAIL, error.response.data));
		dispatch(actionFunc(LOADING, false));
		toast('error', 'Something went wrong');
	}
};

export const getTripstats = (fromDate, userId) => async dispatch => {
	try {
		const res = await apiCall.get(
			`/trips/stats?fromDate=${fromDate}&userId=${userId}`,
		);
		dispatch(actionFunc(FETCH_TRAVEL_STATS_TIME_X, res.data.data.total));
		dispatch(actionFunc(BUTTON_LOADING, false));
		toast(res.data.status, 'Successfully retrieved the stats');
	} catch (error) {
		dispatch(actionFunc(FETCH_TRAVEL_STATS_TIME_X_FAIL, error.response.data));
		dispatch(actionFunc(BUTTON_LOADING, false));
		toast('error', error.response.data.message);
	}
};

export const fetchManagerUsers = () => async dispatch => {
	try {
		const res = await apiCall.get(`/auth/manager/users`);
		dispatch(actionFunc(FETCH_MANAGER_USERS, res.data.data));
	} catch (error) {
		dispatch(actionFunc(FETCH_MANAGER_USERS_FAIL, error.response.data));
		toast(error.response.data.status, error.response.data.message);
	}
};
