import Cookies from 'universal-cookie';
import actionFunc from '../../utils/actionFunc';
import {
	IS_AUTHENTICATED,
	NOT_AUTHENTICATED,
	LOGIN_SUCCESS,
	LOGIN_FAILURE,
	RESET_TWO_FACTOR_STATE,
} from './types';
import { decodeToken } from '../../helpers/authHelper';
import clearStats from './profile/profileStatsActions';

const logoutUser = (unsetTimeout = true) => dispatch => {
	const cookies = new Cookies();
	cookies.remove('bn_auth_token', {
		path: '/',
	});
	localStorage.removeItem('bn_user_data');
	localStorage.removeItem('name_initials');
	localStorage.removeItem('bn_user_2fa');
	dispatch(actionFunc(NOT_AUTHENTICATED));
	dispatch(actionFunc(LOGIN_FAILURE, null));
	dispatch(actionFunc(RESET_TWO_FACTOR_STATE));
	clearStats();

	if (unsetTimeout) {
		clearTimeout(localStorage.getItem('bn_authSetTimeOutID'));
		localStorage.removeItem('bn_authSetTimeOutID');
	}
};

const setAuthenticate = isAuthenticated => dispatch => {
	const cookies = new Cookies();
	const authCookie = cookies.get('bn_auth_token');

	if (authCookie) {
		if (isAuthenticated) {
			decodeToken(authCookie);
			dispatch(actionFunc(IS_AUTHENTICATED));
			dispatch(actionFunc(LOGIN_SUCCESS, null));
		}
	}
};

export { logoutUser, setAuthenticate };
