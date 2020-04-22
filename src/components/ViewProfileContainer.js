import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
	fetchUserProfile,
	updateProfile,
	saveProfile,
	setIsEditing,
	revertChanges,
} from '../store/actions/profile/profileActions';
import { getRequests } from '../store/actions/requestAction';
import setAuthenticate from '../store/actions/authenticateAction';
import Profile from '../views/profile/ProfileView';
import { updateNavbar } from '../store/actions/navbar/navbarActions';
import { getBooking } from '../store/actions/bookingActions';
import { getAllHotels } from '../store/actions/accomodations/getAccomodationActions';
import { fetchUsers } from '../store/actions/users/usersActions';
import clearStats from '../store/actions/profile/profileStatsActions';
import { notification } from '../store/actions/notificationAction';

class ViewProfileContainer extends Component {
	async componentDidMount() {
		const { props } = this;
		props.setAuthenticate(true);
		props.updateNavbar();
		const user = JSON.parse(localStorage.getItem('bn_user_data'));
		if (props.match.params.userId || user) {
			const userId = props.match.params.userId || user.userId;
			props.fetchUserProfile(userId);

			const canViewRequestsAndNotifications = ['requester', 'manager'];
			const canViewBookings = ['travel_administrator', 'suppliers'];
			const canViewUsers = ['super_administrator'];

			const { cardStats } = props;
			if (cardStats[user.role].length < 4) {
				await Promise.all([
					canViewRequestsAndNotifications.includes(user.role) &&
						props.getRequests('all'),
					canViewBookings.includes(user.role) &&
						props.getBooking() &&
						props.getAllHotels(),
					canViewUsers.includes(user.role) && props.fetchUsers(),
				]);
			}
		}
	}

	render() {
		const { props } = this;
		const user = JSON.parse(localStorage.getItem('bn_user_data'));
		return (
			<div className='container profile-container p-3'>
				<Profile
					profile={props.profile}
					currentUser={props.currentUserId}
					setIsEditing={props.setIsEditing}
					cardStats={props.cardStats[user.role]}
				/>
			</div>
		);
	}
}
const mapStateToProps = state => ({
	profile: state.profileState.userProfile,
	currentUserId: state.profileState.currentUserId,
	loggedIn: state.loginState.loggedIn,
	managers: state.profileState.managers,
	editErrors: state.profileState.errors,
	loading: state.loadingState.buttonLoading,
	isEditing: state.profileState.isEditing,
	cardStats: state.profileCardsState.stats,
});
export default connect(mapStateToProps, {
	fetchUserProfile,
	updateProfile,
	saveProfile,
	setIsEditing,
	revertChanges,
	setAuthenticate,
	updateNavbar,
	getRequests,
	getBooking,
	fetchUsers,
	clearStats,
	notification,
	getAllHotels,
})(ViewProfileContainer);

ViewProfileContainer.propTypes = {
	fetchUserProfile: PropTypes.func.isRequired,
	currentUserId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
	setAuthenticate: PropTypes.func.isRequired,
	match: PropTypes.shape({
		params: PropTypes.shape({
			userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
		}),
	}),
	profile: PropTypes.instanceOf(Object).isRequired,
	setIsEditing: PropTypes.func.isRequired,
	updateNavbar: PropTypes.func.isRequired,
	getBooking: PropTypes.func.isRequired,
	fetchUsers: PropTypes.func.isRequired,
	getRequests: PropTypes.func.isRequired,
	cardStats: PropTypes.object.isRequired,
	getAllHotels: PropTypes.func.isRequired,
};

ViewProfileContainer.defaultProps = {
	currentUserId: null,
	match: null,
};
