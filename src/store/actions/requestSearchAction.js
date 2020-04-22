/* eslint-disable no-unused-expressions, import/prefer-default-export */
import actionFunc from '../../utils/actionFunc';
import { LOADING, REQUEST_SEARCH_ERROR, REQUEST_SEARCH_SUCCESS } from './types';
import apiCall from '../../utils/api';

export const flNames = (firstName, lastName) =>
	`${firstName && firstName} ${lastName && lastName}`;

export const flInitials = (firstName, lastName) =>
	`${firstName && firstName.split('')[0]}${lastName && lastName.split('')[0]}`;

export const requestSearch = ({
	searchString,
	travelDate,
	returnDate,
}) => async dispatch => {
	dispatch(actionFunc(LOADING, true));
	let searchTerm = `searchString=${searchString}`;
	const { role } = JSON.parse(localStorage.getItem('bn_user_data'));
	if (travelDate) searchTerm = `${searchTerm}&travelDate=${travelDate}`;
	if (returnDate) searchTerm = `${searchTerm}&returnDate=${returnDate}`;
	const isManager = role === 'manager';
	if (isManager) searchTerm = `byLineManager=true&${searchTerm}`;

	try {
		const { data } = await apiCall.get(`/search/requests?${searchTerm}`);
		const finalData = [];

		if (isManager) {
			finalData.push(
				...data.data.map(
					({
						requestId,
						status,
						type,
						updatedAt,
						firstName,
						lastName,
						reason,
					}) => ({
						id: requestId,
						'': flInitials(firstName, lastName),
						names: flNames(firstName, lastName),
						status,
						type,
						reason,
						updatedAt,
					}),
				),
			);
		} else {
			finalData.push(
				...data.data.map(({ requestId, status, type, updatedAt, reason }) => ({
					id: requestId,
					status,
					type,
					reason,
					updatedAt,
				})),
			);
		}

		const searchData = finalData.sort(
			(a, b) => new Date(b.updatedAt) - new Date(a.updatedAt),
		);

		dispatch(actionFunc(REQUEST_SEARCH_SUCCESS, searchData));
		dispatch(actionFunc(LOADING, false));
	} catch (error) {
		dispatch(actionFunc(REQUEST_SEARCH_ERROR, error));
		dispatch(actionFunc(LOADING, false));
	}
};
