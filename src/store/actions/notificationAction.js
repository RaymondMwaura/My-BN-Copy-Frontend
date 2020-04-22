import {
	FETCH_NOTIFICATIONS_SUCCESS,
	UPDATE_NOTIFICATION,
	LOADING,
	SET_STATS,
} from './types';
import actionFunc from '../../utils/actionFunc';
import { notificationView } from '../../lib/services/notificationService';

export const notification = () => async (dispatch, getState) => {
	dispatch(actionFunc(LOADING, true));
	const res = await notificationView();
	dispatch(actionFunc(FETCH_NOTIFICATIONS_SUCCESS, res.data));
	const { role } = JSON.parse(localStorage.bn_user_data);

	const canViewNotifications = ['requester', 'manager'];
	const { stats } = getState().profileCardsState;

	stats[role] = stats[role].filter(item => item.label !== 'Notifications');
	dispatch(
		actionFunc(SET_STATS, {
			role,
			data: canViewNotifications.includes(role)
				? [
						...stats[role],
						{
							label: 'Notifications',
							icon: 'fa-bell',
							number: res.data.data.filter(
								notificationItem => !notificationItem.isRead,
							).length,
						},
				  ]
				: [...stats[role]],
		}),
	);
	dispatch(actionFunc(LOADING, false));
};
export const getNewNotification = data => async dispatch => {
	dispatch(actionFunc(UPDATE_NOTIFICATION, data));
};
