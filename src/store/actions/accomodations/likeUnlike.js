import toast from '../../../lib/toast';
import { FETCH_HOTEL_SUCCESS, FETCH_SINGLE_HOTEL_SUCCESS } from '../types';
import actionFunc from '../../../utils/actionFunc';
import apiCall from '../../../utils/api';

export const updateLike = id => async dispatch => {
	try {
		await apiCall.patch(`/hotels/${id}/like`);
		const res1 = await apiCall.get(`/hotels`);
		const res2 = await apiCall.get(`/hotel/${id}`);
		dispatch(actionFunc(FETCH_HOTEL_SUCCESS, res1.data));
		dispatch(actionFunc(FETCH_SINGLE_HOTEL_SUCCESS, res2.data));
	} catch (error) {
		toast('error', 'something went while liking');
	}
};

export const updateUnlike = id => async dispatch => {
	try {
		await apiCall.patch(`/hotels/${id}/unlike`);
		const res1 = await apiCall.get(`/hotels`);
		const res2 = await apiCall.get(`/hotel/${id}`);
		dispatch(actionFunc(FETCH_HOTEL_SUCCESS, res1.data));
		dispatch(actionFunc(FETCH_SINGLE_HOTEL_SUCCESS, res2.data));
	} catch (error) {
		toast('error', 'something went wrong while unliking');
	}
};
