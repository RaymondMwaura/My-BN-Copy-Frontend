import api from '../../utils/api';
import axiosErrorHandler from './axiosErrorHandler';

export const fetchFeedback = async hotelId => {
	return api.get(`hotels/${hotelId}/feedback`).catch(axiosErrorHandler);
};

export const sendFeedback = async (hotelId, feedback) => {
	return api
		.post(`hotels/${hotelId}/feedback`, feedback)
		.catch(axiosErrorHandler);
};
