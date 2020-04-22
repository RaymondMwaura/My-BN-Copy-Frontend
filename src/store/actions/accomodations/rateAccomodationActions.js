/* eslint-disable import/no-cycle */
import toast from '../../../lib/toast';
import {
	FETCH_USER_RATING_DATA_SUCCESS,
	FETCH_USER_RATING_DATA_FAILURE,
	RATE_ACCOMODATION_SUCCESS,
	RATE_ACCOMODATION_FAILURE,
	BUTTON_LOADING,
	FETCH_SINGLE_HOTEL_SUCCESS,
} from '../types';
import actionFunc from '../../../utils/actionFunc';
import { getHotelById } from '../../../lib/services/accommodation.service';
import {
	getBookingData,
	getUserRatingData,
	postRating,
	updateRating,
} from '../../../lib/services/rating.service';

const getRatingData = userId => async dispatch => {
	try {
		const bookingData = await getBookingData();
		const ratingData = await getUserRatingData(userId);
		dispatch(
			actionFunc(FETCH_USER_RATING_DATA_SUCCESS, {
				bookingData: bookingData.data.data,
				ratingData: ratingData.data.data,
			}),
		);
	} catch (error) {
		dispatch(
			actionFunc(FETCH_USER_RATING_DATA_FAILURE, error.response.data.message),
		);
	}
};

const rateHotel = (endpoint, userRequest, hotelId) => async dispatch => {
	dispatch(actionFunc(BUTTON_LOADING, true));
	const newRating = endpoint.includes('hotels');
	const { userId } = JSON.parse(localStorage.bn_user_data);

	try {
		if (newRating === true) {
			const res = await postRating(endpoint, userRequest);
			dispatch(actionFunc(RATE_ACCOMODATION_SUCCESS, res.data.message));
			// trigger re-render: to revisit
			dispatch(getRatingData(userId));
			const res2 = await getHotelById(hotelId);
			dispatch(actionFunc(FETCH_SINGLE_HOTEL_SUCCESS, res2.data));
		} else {
			const res = await updateRating(endpoint, userRequest);
			dispatch(actionFunc(RATE_ACCOMODATION_SUCCESS, res.data.message));
			// trigger re-render: to revisit
			dispatch(getRatingData(userId));
			const res2 = await getHotelById(hotelId);
			dispatch(actionFunc(FETCH_SINGLE_HOTEL_SUCCESS, res2.data));
		}
	} catch (error) {
		dispatch(
			actionFunc(RATE_ACCOMODATION_FAILURE, error.response.data.message),
		);
		toast(
			error.response.data.status,
			JSON.stringify(error.response.data.message),
		);
	}
	dispatch(actionFunc(BUTTON_LOADING, false));
};

export { getRatingData, rateHotel };
