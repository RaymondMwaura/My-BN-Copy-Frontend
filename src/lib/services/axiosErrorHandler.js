import Toast from '../toast';
import store from '../../store';
import actionFunc from '../../utils/actionFunc';
import { BUTTON_LOADING, LOADING } from '../../store/actions/types';

const axiosErrorHandler = error => {
	if (error.response) {
		if (Array.isArray(error.response.data.message)) {
			error.response.data.message.map(message => {
				Toast('error', message);
			});
			store.dispatch(actionFunc(BUTTON_LOADING, false));
			store.dispatch(actionFunc(LOADING, false));
			return Promise.reject(error);
		}
		store.dispatch(actionFunc(BUTTON_LOADING, false));
		store.dispatch(actionFunc(LOADING, false));
		Toast('error', error.response.data.message);
		return Promise.reject(error);
	}

	if (error.request) {
		store.dispatch(actionFunc(BUTTON_LOADING, false));
		store.dispatch(actionFunc(LOADING, false));
		Toast('error', 'Service Unreachable, check you internet connection');
		return Promise.reject(error);
	}
	store.dispatch(actionFunc(LOADING, false));
	store.dispatch(actionFunc(BUTTON_LOADING, false));
	Toast('error', 'Something went wrong');
	return Promise.reject(error);
};

export default axiosErrorHandler;
