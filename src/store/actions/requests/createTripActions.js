import toast from '../../../lib/toast';
import {
	CREATE_TRIP_FAILURE,
	CREATE_TRIP_SUCCESS,
	BUTTON_LOADING,
	FETCH_CREATE_TRIP_DATA_SUCCESS,
	FETCH_CREATE_TRIP_DATA_FAILURE,
	LOADING,
} from '../types';
import actionFunc from '../../../utils/actionFunc';
import {
	getLocations,
	getLocationsWithHotels,
	createATrip,
} from '../../../lib/services/createRequest.service';
import { transformProfile } from '../profile/profileActions';
import {
	getUserProfile,
	updateUserProfile,
} from '../../../lib/services/user.service';
import ACTION_TYPES from '../profile/profileTypes';
import { getRatingData } from '../accomodations/rateAccomodationActions';
import formatBookingData from '../../../utils/formatBookingData';

const fetchCreateTripData = () => async dispatch => {
	try {
		dispatch(actionFunc(LOADING, true));
		const allLocations = await getLocations();
		const locationsWithHotels = await getLocationsWithHotels();

		dispatch(
			actionFunc(FETCH_CREATE_TRIP_DATA_SUCCESS, {
				allLocations: allLocations.data.data,
				locationsWithHotels: locationsWithHotels.data.data,
			}),
		);
		dispatch(actionFunc(LOADING, false));
	} catch (error) {
		dispatch(
			actionFunc(FETCH_CREATE_TRIP_DATA_FAILURE, error.response.data.message),
		);
		dispatch(actionFunc(LOADING, false));
	}
};

const createTrip = (userRequest, endpoint, profile) => async dispatch => {
	dispatch(actionFunc(BUTTON_LOADING, true));
	const { userId } = JSON.parse(localStorage.bn_user_data);
	const userProfile = transformProfile(profile, dispatch);

	if (!userProfile) {
		dispatch(actionFunc(BUTTON_LOADING, false));
		return false;
	}

	const updatedProfileData = { ...userProfile };
	delete updatedProfileData.profilePicture;

	const objectKeys = Object.keys(updatedProfileData);
	const data = new FormData();

	objectKeys.forEach(key => {
		data.append(key, userProfile[key]);
	});

	await updateUserProfile(data);
	const profileData = await getUserProfile(userId);
	const updatedProfile = profileData.data.data;

	dispatch(
		actionFunc(ACTION_TYPES.SAVE_PROFILE_SUCCESS, {
			updatedProfile: {
				...(!updatedProfile.remember
					? {
							lineManager:
								updatedProfile.lineManager === 'none'
									? 0
									: updatedProfile.lineManager,
							email: updatedProfile.email,
							remember: updatedProfile.remember,
					  }
					: updatedProfile),
				birthDate:
					updatedProfile.birthDate && updatedProfile.birthDate.split('T')[0],
			},
			userId,
		}),
	);

	try {
		const res = await createATrip(userRequest, endpoint);
		dispatch(actionFunc(CREATE_TRIP_SUCCESS, formatBookingData(res.data.data)));
		// trigger re-render: to revisit
		dispatch(getRatingData(userId));
		toast('success', 'Trip request created successfully');
	} catch (error) {
		dispatch(actionFunc(CREATE_TRIP_FAILURE, error.response.data.message));
		toast(
			error.response.data.status,
			JSON.stringify(error.response.data.message),
		);
	}
	dispatch(actionFunc(BUTTON_LOADING, false));
};

export { fetchCreateTripData, createTrip };
