// eslint-disable-next-line import/named
import { SET_LIST } from '../actions/types';

export default (state = [], { type, payload }) =>
	(type === SET_LIST && payload) || state;
