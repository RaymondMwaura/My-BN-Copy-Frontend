// eslint-disable-next-line import/named
import { SET_LIST } from './types';

const setRequestsList = requests => ({ type: SET_LIST, payload: { requests } });
const setUsersList = users => ({ type: SET_LIST, payload: { users } });

export { setRequestsList, setUsersList };
