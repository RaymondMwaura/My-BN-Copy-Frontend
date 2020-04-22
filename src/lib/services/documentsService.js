import api from '../../utils/api';
import axiosErrorHandler from './axiosErrorHandler';

export const fetchDocuments = () => {
	return api.get('/users/documents').catch(axiosErrorHandler);
};

export const uploadDocument = data => {
	return api
		.post('/users/documents', data, {
			headers: {
				'content-type': 'multipart/form-data',
			},
		})
		.catch(axiosErrorHandler);
};

export const verifyDocument = id => {
	return api.patch(`/documents/${id}/verify`).catch(axiosErrorHandler);
};

export const deleteDocument = id => {
	return api.delete(`/users/documents/${id}`).catch(axiosErrorHandler);
};
