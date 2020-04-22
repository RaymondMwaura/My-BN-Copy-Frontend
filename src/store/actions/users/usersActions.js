import { LOADING, BUTTON_LOADING, SET_STATS } from '../types';
import { getUsers, updateUserRole } from '../../../lib/services/user.service';
import actionFunc from '../../../utils/actionFunc';
import ACTION_TYPES from './usersTypes';
import compareUsers from '../../../utils/sortUsers';
import Toast from '../../../lib/toast';

const fetchUsers = () => async (dispatch, getState) => {
	dispatch(actionFunc(LOADING, true));
	const usersData = await getUsers();
	const users = usersData.data.data.sort(compareUsers);
	const { role } = JSON.parse(localStorage.bn_user_data);
	dispatch(
		actionFunc(ACTION_TYPES.GET_USERS_SUCCESS, {
			users,
		}),
	);

	const { currentPath } = getState().navbarState;

	if (currentPath === '/profile') {
		dispatch(
			actionFunc(SET_STATS, {
				role,
				data: [
					{
						label: 'All Users',
						icon: 'fa-users',
						number: users.length,
					},
					{
						label: 'Requesters',
						icon: 'fa-car',
						number: users.filter(user => user.role === 'requester').length,
					},
					{
						label: 'Line Managers',
						icon: 'fa-user',
						number: users.filter(user => user.role === 'manager').length,
					},
					{
						label: 'Travel Administrators',
						icon: 'fa-car',
						number: users.filter(user =>
							['travel_administrator', 'suppliers'].includes(user.role),
						).length,
					},
				],
			}),
		);
	}
	dispatch(actionFunc(LOADING, false));
};

const setSelectedUser = user => async dispatch => {
	dispatch(
		actionFunc(ACTION_TYPES.USER_SELECTION_SUCCESS, {
			...user,
		}),
	);
};

const changeRole = user => async dispatch => {
	dispatch(actionFunc(BUTTON_LOADING, true));
	dispatch(actionFunc(LOADING, true));
	const res = await updateUserRole(user);
	dispatch(actionFunc(ACTION_TYPES.CHANGE_USER_ROLE_SUCCESS, {}));

	const usersData = await getUsers();
	const users = usersData.data.data.sort(compareUsers);

	dispatch(
		actionFunc(ACTION_TYPES.GET_USERS_SUCCESS, {
			users,
		}),
	);
	dispatch(actionFunc(BUTTON_LOADING, false));
	dispatch(actionFunc(LOADING, false));
	Toast('success', res.data.message);
};

const saveNewRole = role => async dispatch => {
	dispatch(actionFunc(ACTION_TYPES.NEW_ROLE_SELECTION_SUCCESS, role));
};

const cancelRoleAssign = () => async dispatch => {
	dispatch(actionFunc(ACTION_TYPES.ROLE_ASSIGN_CANCELED, {}));
};

export {
	fetchUsers,
	setSelectedUser,
	changeRole,
	cancelRoleAssign,
	saveNewRole,
};
