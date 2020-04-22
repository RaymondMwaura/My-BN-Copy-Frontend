import {
	FETCH_USER_RATING_DATA_SUCCESS,
	FETCH_USER_RATING_DATA_FAILURE,
	RATE_ACCOMODATION_SUCCESS,
	RATE_ACCOMODATION_FAILURE,
} from '../actions/types';

const initialState = {
	ratingSuccess: null,
	responseMessage: null,
	ratingData: null,
	bookingData: null,
};

export default (state = initialState, action) => {
	switch (action.type) {
		case FETCH_USER_RATING_DATA_SUCCESS:
			return {
				...state,
				bookingData: action.payload.bookingData,
				ratingData: action.payload.ratingData,
			};
		case FETCH_USER_RATING_DATA_FAILURE:
			return {
				...state,
				responseMessage: action.payload,
			};
		case RATE_ACCOMODATION_SUCCESS:
			return {
				...state,
				ratingSuccess: true,
				responseMessage: action.payload,
			};
		case RATE_ACCOMODATION_FAILURE:
			return {
				...state,
				ratingSuccess: false,
				responseMessage: action.payload,
			};
		default:
			return { ...state };
	}
};
