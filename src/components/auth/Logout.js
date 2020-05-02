/* eslint-disable
jsx-a11y/click-events-have-key-events,
jsx-a11y/no-static-element-interactions,
jsx-a11y/anchor-is-valid,
no-shadow,
react/prop-types
*/
import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logoutUser } from '../../store/actions/authenticateAction';
import { updateNavbar } from '../../store/actions/navbar/navbarActions';

/**
 * Logout
 * @param history
 * @param logoutUser
 * @param updateNavbar
 * @returns {*}
 * @constructor
 */
export const Logout = ({ history, logoutUser, updateNavbar }) => (
	<button
		type='button'
		className='dropdown-item'
		href='/home'
		onClick={() => {
			logoutUser();
			updateNavbar();
			history.push('/home');
		}}
	>
		Logout
	</button>
);

Logout.defaultProps = {
	logoutUser: null,
	updateNavbar: null,
	history: null,
};

Logout.propTypes = {
	logoutUser: PropTypes.func,
	history: PropTypes.shape({
		push: PropTypes.func,
	}),
	updateNavbar: PropTypes.func,
};

export default withRouter(
	connect(null, {
		logoutUser,
		updateNavbar,
	})(Logout),
);
