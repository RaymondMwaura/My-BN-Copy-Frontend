import apiCall from '../../utils/api';

export const getBookingData = async () => {
	return apiCall.get('/booking');
};

export const getUserRatingData = async userId => {
	return apiCall.get(`/rating?userId=${userId}`);
};

export const postRating = async (endpoint, userRequest) => {
	return apiCall.post(endpoint, userRequest);
};

export const updateRating = async (endpoint, userRequest) => {
	return apiCall.patch(endpoint, userRequest);
};
