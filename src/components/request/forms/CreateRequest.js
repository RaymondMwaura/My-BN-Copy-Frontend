/* eslint-disable default-case */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import propTypes from 'prop-types';
import UserDetails from './UserDetails';
import TripRequestForm from './TripRequestForm';
import TripPayments from './TripPayments';
import Success from './Success';
import {
	fetchCreateTripData,
	createTrip,
} from '../../../store/actions/requests/createTripActions';
import {
	renderPageLoadingSpinner,
	closePageLoadingSpinner,
} from '../../../store/actions/loadingActions';
import {
	fetchUserProfile,
	saveProfile,
	updateProfile,
} from '../../../store/actions/profile/profileActions';

export class CreateRequest extends Component {
	constructor(props) {
		super(props);
		this.state = {
			step: 1,
			profileState: null,
		};
		this.handleData = this.handleData.bind(this);
		this.nextStep = this.nextStep.bind(this);
		this.prevStep = this.prevStep.bind(this);
	}

	async componentDidMount() {
		const { props } = this;
		props.renderPageLoadingSpinner();
		await props.fetchCreateTripData();
		const user = JSON.parse(localStorage.getItem('bn_user_data'));
		props.fetchUserProfile(user.userId, true);
		props.closePageLoadingSpinner();
	}

	componentDidUpdate(prevProps, prevState) {
		const { state, props } = this;
		const progress = {
			1: 0,
			2: 34,
			3: 68,
			4: 100,
		};
		if (state.step !== prevState.step) {
			props.handleProgress(progress[state.step]);
		}
	}

	nextStep() {
		const { step } = this.state;
		this.setState({
			step: step + 1,
		});
	}

	prevStep() {
		const { step } = this.state;
		this.setState({
			step: step - 1,
		});
	}

	skipPaymentStep() {
		const { step } = this.state;
		this.setState({
			step: step + 2,
		});
	}

	handleData(form, data) {
		this.setState({ [form]: data });
	}

	render() {
		const { state } = this;
		const { step, profileState } = state;
		const {
			updateProf,
			profile,
			editErrors,
			managers,
			isEditing,
			createTripData,
			loadingData,
			bookingDetails,
			createRequest,
		} = this.props;
		switch (step) {
			case 1:
				return (
					<UserDetails
						nextStep={this.nextStep}
						handleData={this.handleData}
						data={profileState}
						saveData={updateProf}
						profile={profile}
						errors={editErrors}
						managers={managers}
						isEditing={isEditing}
					/>
				);

			case 2:
				return (
					<TripRequestForm
						prevStep={this.prevStep}
						nextStep={this.nextStep}
						handleData={this.handleData}
						data={state}
						profile={profile}
						fetchCreateTripData={fetchCreateTripData}
						createTripData={createTripData}
						loadingData={loadingData}
						createTrip={createRequest}
					/>
				);
			case 3:
				return (
					<TripPayments
						nextStep={this.nextStep}
						bookingsData={bookingDetails}
					/>
				);
			case 4:
				return <Success />;
		}
	}
}

CreateRequest.propTypes = {
	fetchCreateTripData: propTypes.func,
	createTripData: propTypes.object,
	createRequest: propTypes.func,
	loadingData: propTypes.objectOf(propTypes.any),
	renderPageLoadingSpinner: propTypes.func,
	closePageLoadingSpinner: propTypes.func,
	fetchUserProfile: propTypes.func.isRequired,
	profile: propTypes.instanceOf(Object).isRequired,
	updateProf: propTypes.func.isRequired,
	editErrors: propTypes.instanceOf(Object).isRequired,
	managers: propTypes.instanceOf(Array).isRequired,
	isEditing: propTypes.bool.isRequired,
	handleProgress: propTypes.func.isRequired,
	bookingDetails: propTypes.objectOf(propTypes.any),
};

CreateRequest.defaultProps = {
	bookingDetails: null,
	fetchCreateTripData: null,
	createTripData: null,
	createRequest: null,
	loadingData: null,
	renderPageLoadingSpinner: null,
	closePageLoadingSpinner: null,
};

export const mapStateToProps = state => ({
	loadingData: state.loadingState,
	createTripData: state.createTripState,
	bookingDetails: state.createTripState.data,
	profile: state.profileState.userProfile,
	currentUserId: state.profileState.currentUserId,
	loggedIn: state.loginState.loggedIn,
	managers: state.profileState.managers,
	editErrors: state.profileState.errors,
	isEditing: state.profileState.isEditing,
});

const mapDispatchToProps = {
	fetchCreateTripData,
	createRequest: createTrip,
	renderPageLoadingSpinner,
	closePageLoadingSpinner,
	fetchUserProfile,
	updateProf: updateProfile,
	saveUserInfo: saveProfile,
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateRequest);
