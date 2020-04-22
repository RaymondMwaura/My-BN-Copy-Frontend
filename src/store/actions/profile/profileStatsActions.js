import actionFunc from '../../../utils/actionFunc';
import { CLEAR_STATS } from '../types';

const clearStats = () => async dispatch => {
	dispatch(actionFunc(CLEAR_STATS));
};

export default clearStats;
