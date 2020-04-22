import {
	getUserBooking,
	bookAccommodation,
} from '../../lib/services/booking.service';
import actionFunc from '../../utils/actionFunc';
import {
	GET_BOOKING_SUCCESS,
	BUTTON_LOADING,
	SET_STATS,
	LOADING,
	BOOKING_SUCCESS,
} from './types';
import Toast from '../../lib/toast';
import { getRatingData } from './accomodations/rateAccomodationActions';
import { formatBooking } from '../../utils/formatBookingData';

export const book = bookingInfo => async dispatch => {
	const { userId } = JSON.parse(localStorage.bn_user_data);
	dispatch(actionFunc(BUTTON_LOADING, true));
	const res = await bookAccommodation(bookingInfo);
	dispatch(
		actionFunc(BOOKING_SUCCESS, formatBooking(res.data.data.bookedRooms)),
	);
	dispatch(actionFunc(LOADING, true));
	dispatch(getRatingData(userId));
	Toast('success', 'Accommodation booked successfully');
	dispatch(actionFunc(BUTTON_LOADING, false));
	dispatch(actionFunc(LOADING, false));
};

export const getBooking = () => async (dispatch, getState) => {
	dispatch(actionFunc(LOADING, true));
	const bookingData = await getUserBooking();
	const { role } = JSON.parse(localStorage.bn_user_data);
	const { stats } = getState().profileCardsState;

	stats[role] = stats[role].filter(item => item.data != 'booking');
	dispatch(
		actionFunc(SET_STATS, {
			role,
			data: [
				{
					data: 'booking',
					label: 'All Booking',
					icon: 'fa-bookmark',
					number: bookingData.data.data.length,
				},
			],
		}),
	);

	dispatch(actionFunc(GET_BOOKING_SUCCESS, bookingData.data.data));
	dispatch(actionFunc(LOADING, false));
};
