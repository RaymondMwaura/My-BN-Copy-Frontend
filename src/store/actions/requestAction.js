/* eslint-disable
 no-shadow,
 import/prefer-default-export,
 no-unused-expressions
*/
import actionFunc from '../../utils/actionFunc';
import {
	LOADING,
	REQUEST_FETCH_FAILURE,
	REQUEST_FETCH_SUCCESS,
	SET_STATS,
} from './types';
import { getAllRequests } from '../../lib/services/requests.service';

/**
 * Get requests by type
 * @param status
 * @returns {function(...[*]=)}
 */
export const getRequests = status => async (dispatch, getState) => {
	dispatch(actionFunc(LOADING, true));
	const { role } = JSON.parse(localStorage.bn_user_data);
	const requestAPIPath = role === 'manager' ? '/requests/manager' : '/requests';

	try {
		const { data } = await getAllRequests(
			requestAPIPath + (status !== 'all' ? `?status=${status}` : ''),
		);

		const requestData = data.data.sort(
			(a, b) => new Date(b.updatedAt) - new Date(a.updatedAt),
		);

		dispatch(
			actionFunc(
				REQUEST_FETCH_SUCCESS,
				requestData.map(({ id, status, type, updatedAt, user, trips }) => {
					let requestData = {
						status,
						type,
						reason: trips.map(trip => trip.reason)[0],
						updatedAt,
					};

					if (user) {
						requestData = {
							...{
								'': `${user.firstName.split('')[0]}${
									user.lastName.split('')[0]
								}`,
								names: `${user.firstName} ${user.lastName}`,
							},
							...requestData,
						};
					}
					return { id, ...requestData };
				}),
			),
		);

		const { stats } = getState().profileCardsState;

		stats[role] = stats[role].filter(item => item.data != 'request');
		dispatch(
			actionFunc(SET_STATS, {
				role,
				data: [
					...stats[role],
					{
						data: 'request',
						label: 'All Requests',
						icon: 'fa-car',
						number: data.data.length,
					},
					{
						data: 'request',
						label: 'Approved Trips',
						icon: 'fa-check-circle',
						number: data.data.filter(request => request.status === 'approved')
							.length,
					},
					{
						data: 'request',
						label: 'Denied Requests',
						icon: 'fa-times-circle',
						number: data.data.filter(request => request.status === 'declined')
							.length,
					},
				],
			}),
		);
	} catch (error) {
		dispatch(actionFunc(REQUEST_FETCH_FAILURE, error.response.data));
	}
	dispatch(actionFunc(LOADING, false));
};
