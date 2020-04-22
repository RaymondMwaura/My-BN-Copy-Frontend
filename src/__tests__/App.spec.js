import { App } from "../App";
import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { Provider } from "react-redux";
import { makeMockStore } from "../utils/makeMockStore";
import { render } from "@testing-library/react";
const initialState = {
	signupState: {
		data: null,
		error: null,
		status: ''
	},
	resetState: {
		data: null,
		error: null,
		status: ''
	},
	forgotState: {
		data: null,
		error: null,
		status: ''
	},
	loadingState: {
		loading: false,
		buttonLoading: false
	},
	loginState: {
		loggedIn: false,
		data: null,
		error: null
	},
	profileState: {
		userProfile: {},
		currentUserId: null,
		errors: {},
		managers: [],
		initialProfile: {},
		isFetching: false,
		fetchError: null,
		isEditing: false
	},
	singleRequestState: {
		data: null,
		error: null,
		status: '',
		request: {}
	},
	authState: {
		isAuthenticated: false
	},
	errorState: [],
	requestPageLimitState: {
		pageLimit: 5
	},
	requestsState: {
		requestsData: [],
		requestsError: null
	},
	usersState: {
		users: [],
		selectedUser: {}
	},
	navbarState: {
		navItems: [
			{
				linkText: 'Home',
				linkRoute: '/home'
			},
			{
				linkText: 'Login',
				linkRoute: '/login'
			},
			{
				linkText: 'Register',
				linkRoute: '/register'
			}
		],
		notifications: [
			{
				title: 'Request from John Doe',
				body: 'Lorem ipsum dolor sit amet, consectetur',
				dateTime: '27.11.2019, 15:00',
				link: '111'
			},
			{
				title: 'Request from John Doe',
				body: 'Lorem ipsum dolor sit amet, consectetur',
				dateTime: '27.11.2019, 15:00',
				link: '222'
			},
			{
				title: 'Request from John Doe',
				body: 'Lorem ipsum dolor sit amet, consectetur',
				dateTime: '27.11.2019, 15:00',
				link: '333'
			}
		]
	},
	createHotelState: {
		data: null,
		error: null,
		status: ''
	},
	createRoomState: {
		data: null,
		error: null,
		status: ''
	},
	hotelState: {
		data: [
			{
				id: 1,
				name: 'Gildas Niyigena',
				image: 'https://boondocks-bn-images.s3.us-east-2.amazonaws.com/hotels/1580302604407-kisspng-hashtag-instagram-facebook-social-network-android-5affda88dc5118.2997826215267170649024.png',
				description: 'This is a nice one',
				street: 'KG 740 St, 0788840482',
				services: 'resto, bar',
				average_rating: '0.00',
				createdAt: '2020-01-29T12:56:48.388Z',
				likesCount: '0',
				unLikesCount: '0',
				likes: [],
				location: {
					id: 7,
					country: 'Rwanda',
					city: 'Kigali',
					'long': null,
					lat: null,
					createdAt: '2020-01-23T11:36:11.365Z',
					updatedAt: '2020-01-23T11:36:11.365Z'
				}
			}
		],
		error: null,
		status: 'success'
	},
	singleHotelState: {
		data: null,
		error: null,
		status: ''
	},
	requestSearchState: {
		requests: [],
		error: null
	},
	isSearchingState: false,
	listState: [],
	commentState: {
		data: null,
		error: null,
		status: ''
	},
	createTripState: {
		data: null,
		error: null,
		fetchStatus: null,
		createStatus: null,
		tripCreated: false,
		allLocations: null,
		locationsWithHotels: null
	},
	updateTripState: {
		data: null,
		error: null,
		status: ''
	},
	deleteCommentState: {
		data: null,
		error: null,
		status: ''
	},
	bookingState: {
		booking: {}
	},
	notificationState: {
		data: [],
		error: null,
		status: ''
	},
	markAsReadState: {
		data: false,
		error: null
	},
	updateNotificationState: {
		newNotification: null
	},
	tripStatState: {
		weekTravels: 0,
		monthTravels: 0,
		yearTravels: 0,
		allTravels: 0,
		travels: 0,
		mostVisitedHotels: [],
		managerUsers: [],
		status: ''
	},
	rateAccomodationState: {
		ratingSuccess: null,
		responseMessage: null,
		ratingData: null,
		bookingData: null
	},
	feedbackState: {
		feedback: [],
		showToast: true
	}
};

describe("App component", () => {
	let store, props;
	beforeEach(() => {
		store = makeMockStore(initialState);
		props = { setAuthenticate: jest.fn(), updateNavbar: jest.fn() };
	});
	it("should render without error", () => {
		props = {...props, ...{isAuthenticated: false}};
		const { getByTestId } = render(
			<Provider store={store}>
				<App {...props}/>
			</Provider>
		);
		expect(getByTestId("app")).toBeInTheDocument();
	});

	it("should render without error", () => {
		props = {...props, ...{isAuthenticated: true}};
		const { getByTestId } = render(
			<Provider store={store}>
				<App {...props}/>
			</Provider>
		);
		expect(getByTestId("app")).toBeInTheDocument();
	});
});
