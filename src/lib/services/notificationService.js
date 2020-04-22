import apiCall from '../../utils/api';
import axiosErrorHandler from './axiosErrorHandler';

export const notificationView = async () => {
	return apiCall.get(`/notification`, {}).catch(axiosErrorHandler);
};

export const markAllAsRead = async () => {
	return apiCall.patch(`/markAsRead`, {}).catch(axiosErrorHandler);
};

export const markOneAsRead = async id => {
	return apiCall.patch(`/markAsRead/${id}`, {}).catch(axiosErrorHandler);
};
