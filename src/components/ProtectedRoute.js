/* eslint-disable
react/jsx-props-no-spreading,
no-undef, import/no-extraneous-dependencies,
no-unused-expressions,
no-return-assign,
prettier/prettier,
max-len
*/
import { Redirect, Route } from "react-router";
import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import JWTDecode from "jwt-decode";
import queryString from "query-string";
import Cookies from 'universal-cookie';
import { setAuthenticate, logoutUser } from "../store/actions/authenticateAction";
import { storeToken, decodeToken } from "../helpers/authHelper";
import { nowSeconds } from "../lib/time";
import check2FA from "../utils/check2FA";
import { updateNavbar } from '../store/actions/navbar/navbarActions';
import toast from '../lib/toast';
 
/**
 * ProtectedRoute
 * @param setAuthState
 * @param Component
 * @param rest
 * @returns {*}
 * @constructor
 */
export const ProtectedRoute = ({
	setAuthState,
	logout,
	component: Component,
	...rest
}) => {
	setAuthState(true);

	const queries = queryString.parse(rest.location.search);

	let userData;

	if (queries.token) {
		storeToken(queries.token);
		decodeToken(queries.token);
		userData = JWTDecode(queries.token);
		check2FA(queries);
	}

	const isAuthenticated = !!localStorage.bn_user_data ||
		(queries.token && (nowSeconds - userData.iat < 3));

	const cookies = new Cookies();
	const authCookie = cookies.get('bn_auth_token');

	if (!isAuthenticated || !authCookie) {
		logout();
		updateNavbar();
		toast('info', 'Login required');
		return <Redirect to='/home' />;
	}

	return (
		<Route
			data-test='protected-route'
			render={props => ({
					"1": <Component {...props} />,
					"0": <Redirect
						to={{ pathname: "/home", state: { from: props.location } }}
					/>
				}[`${isAuthenticated * 1}`]
			)}
			{...rest}
		/>
	);
};

ProtectedRoute.propTypes = {
	component: PropTypes.any,
	location: PropTypes.shape({ pathname: PropTypes.string.isRequired }),
	setAuthState: PropTypes.func.isRequired,
	logout: PropTypes.func
};

ProtectedRoute.defaultProps = {
	location: null,
	component: null,
	logout: null
};

export default connect(null, {
	setAuthState: setAuthenticate,
	logout: logoutUser,
	updateNavbar
})(ProtectedRoute);
