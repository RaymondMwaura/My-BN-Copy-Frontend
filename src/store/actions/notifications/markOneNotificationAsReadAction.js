/* eslint-disable import/named */
import actionFunc from '../../../utils/actionFunc';
import {
	MARKED_AS_READ_FAILURE,
	MARKED_AS_READ_SUCCESS,
	LOADING,
} from '../types';
import toast from '../../../lib/toast';
import { markOneAsRead } from '../../../lib/services/notificationService';

const markOneNotificationAsRead = id => {
	return async dispatch => {
		try {
			dispatch(actionFunc(LOADING, true));
			await markOneAsRead(id);
			dispatch(actionFunc(MARKED_AS_READ_SUCCESS, true));
		} catch (error) {
			dispatch(
				actionFunc(MARKED_AS_READ_FAILURE, JSON.stringify(error.response)),
			);
			dispatch(actionFunc(LOADING, false));
			toast('error', JSON.stringify(error.response));
		}
	};
};

export default markOneNotificationAsRead;
