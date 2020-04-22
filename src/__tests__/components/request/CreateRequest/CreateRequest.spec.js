import React from "react";
import {
	cleanup,
	fireEvent,
	waitForElement,
} from "@testing-library/react";
import render from '../../../../__mocks__/render';
import "@testing-library/jest-dom";
import "@testing-library/jest-dom/extend-expect";
import localStorage from "../../../../__mocks__/LocalStorage";
import Cookies from "universal-cookie";
import CreateRequestView from '../../../../views/requests/CreateRequestView';
import { BrowserRouter } from "react-router-dom";
import { getLocationsWithHotels, getLocations, createATrip } from "../../../../lib/services/createRequest.service";
import { getUserProfile, getUsers } from '../../../../lib/services/user.service';
import {
	getBookingData,
	getUserRatingData,
} from '../../../../lib/services/rating.service';
import TripPayments from '../../../../components/request/forms/TripPayments';

global.localStorage = localStorage;
jest.mock('../../../../components/request/forms/TripPayments', () => {
  const ComponentToMock = () => <div />;
  return ComponentToMock;
})
jest.mock("universal-cookie");
jest.mock("../../../../lib/services/createRequest.service");
jest.mock("../../../../lib/services/user.service");
jest.mock('../../../../lib/services/booking.service');
jest.mock('../../../../lib/services/rating.service');

jest.mock("react-select", () => ({ options, value, onChange }) => {
  function handleChange(event) {
    const option = options.find(
      option => option.value === event.currentTarget.value
    );
    onChange(option);
  }
  return (
    <select data-testid="room" value={value} onChange={handleChange}>
      {options.map(({ label, value }) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  );
});
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImdpbGRuaXkwNUBnbWFpbC5jb20iLCJuYW1lIjoiR2lsZGFzIiwidXNlcklkIjoxLCJ2ZXJpZmllZCI6dHJ1ZSwicm9sZSI6InJlcXVlc3RlciIsImxpbmVNYW5hZ2VySWQiOm51bGwsImlhdCI6MTU3ODU3MTM0OSwiZXhwIjoxNTc4NjU3NzQ5fQ.SmBRYQ-zYgEl08jObfqrtFjrJTCU33-DsMGCRC2RZuc";
Cookies.mockImplementation(
	() => ({
    get: () =>  token,
    remove: () => true,

  })
);

const locations = {
  data: {
	status: 'success',
	message: 'Locations fetched successfully',
	data: [
		{
			id: 1,
			country: 'Kenya',
			city: 'Nairobi',
			long: null,
			lat: null,
			createdAt: '2020-01-22T16:14:30.382Z',
			updatedAt: '2020-01-22T16:14:30.382Z',
		},
		{
			id: 7,
			country: 'Rwanda',
			city: 'Kigali',
			long: null,
			lat: null,
			createdAt: '2020-01-22T16:14:30.382Z',
			updatedAt: '2020-01-22T16:14:30.382Z',
		},
	],
}};

const locationWithNoHotels = {
  data: {
    status: 'success',
    message: 'Locations fetched successfully',
    data: [
      {
        id: 7,
        country: 'Rwanda',
        city: 'Kigali',
        long: null,
        lat: null,
        createdAt: '2020-01-22T16:14:30.382Z',
        updatedAt: '2020-01-22T16:14:30.382Z',
      }
    ]
  }
};


const hotelsWithNoRooms = {
  data: {
	status: 'success',
	message: 'Locations fetched successfully',
	data: [
		{
			id: 7,
			country: 'Rwanda',
			city: 'Kigali',
			long: null,
			lat: null,
			createdAt: '2020-01-22T16:14:30.382Z',
			updatedAt: '2020-01-22T16:14:30.382Z',
			hotels: [
				{
					id: 1,
					locationId: 7,
					name: 'Marriot Hotel',
					image:
						'https://boondocks-bn-images.s3.us-east-2.amazonaws.com/hotels/1579710026813-longHotel.jpg',
					street: 'kk 15 Rd',
					description: 'Best hotel in kigali',
					services: 'Free wifi',
					userId: 4,
					average_rating: '0.00',
					createdAt: '2020-01-22T16:20:32.401Z',
					updatedAt: '2020-01-22T16:20:32.401Z',
          rooms: null,
        }
      ]
    }
  ]}};

const locationWithHotels = {
  data: {
	status: 'success',
	message: 'Locations fetched successfully',
	data: [
		{
			id: 7,
			country: 'Rwanda',
			city: 'Kigali',
			long: null,
			lat: null,
			createdAt: '2020-01-22T16:14:30.382Z',
			updatedAt: '2020-01-22T16:14:30.382Z',
			hotels: [
				{
					id: 1,
					locationId: 7,
					name: 'Marriot Hotel',
					image:
						'https://boondocks-bn-images.s3.us-east-2.amazonaws.com/hotels/1579710026813-longHotel.jpg',
					street: 'kk 15 Rd',
					description: 'Best hotel in kigali',
					services: 'Free wifi',
					userId: 4,
					average_rating: '0.00',
					createdAt: '2020-01-22T16:20:32.401Z',
					updatedAt: '2020-01-22T16:20:32.401Z',
					rooms: [
						{
							id: 9,
							hotelId: 1,
							name: 'Longonot 11',
							type: 'VIP',
							description: 'Wide room for a couple',
							image: '',
							cost: 5000,
							status: 'available',
							createdAt: '2020-01-22T22:38:32.153Z',
							updatedAt: '2020-01-22T22:38:32.153Z',
						},
						{
							id: 10,
							hotelId: 1,
							name: 'Aberdare 11',
							type: 'VIP',
							description: 'Wide room for a couple',
							image: '',
							cost: 5000,
							status: 'available',
							createdAt: '2020-01-22T22:38:37.067Z',
							updatedAt: '2020-01-22T22:38:37.067Z',
						},
					],
				},
			],
		},
	],
}};

const responseData = {
	data: {
		status: 'success',
		message: 'created',
		data: {
      "request": {
          "id": 27,
          "status": "open",
          "userId": 2,
          "type": "single",
          "createdAt": "2020-02-18T08:12:40.401Z",
          "updatedAt": "2020-02-18T08:12:40.401Z"
      },
      "bookingDetails": [
          {
              "id": 30,
              "arrivalDate": "2030-08-01T00:00:00.000Z",
              "leavingDate": null,
              "roomImage": "",
              "bookingAmount": "4000.00",
              "createdAt": "2020-02-18T08:12:40.554Z",
              "hotelName": "neak Hotel",
              "roomName": "Virunga",
              "roomUnitCost": 4000
          },
          {
              "id": 31,
              "arrivalDate": "2030-08-01T00:00:00.000Z",
              "leavingDate": null,
              "roomImage": "",
              "bookingAmount": "4000.00",
              "createdAt": "2020-02-18T08:12:40.549Z",
              "hotelName": "neak Hotel",
              "roomName": "Virunga",
              "roomUnitCost": 4000
          }
      ]
  },
	},
};

const bookingDataResponse = {
	data: {
		status: 'success',
		message: 'Bookings retrieved successfully',
		data: [
			{
				id: 18,
				roomId: 6,
				roomStatus: 'reserved',
				firstName: 'Requester',
				lastName: 'User',
				arrivalDate: '2020-02-03T00:00:00.000Z',
				leavingDate: '2020-02-07T00:00:00.000Z',
				createdAt: '2020-01-31T08:30:21.576Z',
				hotel: 'Marriot Hotel',
				room: 'Cheetah',
				hotelId: 1,
			},
			{
				id: 15,
				roomId: 10,
				roomStatus: 'reserved',
				firstName: 'Requester',
				lastName: 'User',
				arrivalDate: '2020-01-30T00:00:00.000Z',
				leavingDate: '2020-01-31T00:00:00.000Z',
				createdAt: '2020-01-30T13:07:17.918Z',
				hotel: 'Best Western Hotel',
				room: 'Rain',
				hotelId: 2,
			},
		],
	},
};

const ratingDataResponse = {
	data: {
		status: 'success',
		message: 'Hotel ratings fetched successfully',
		data: [
			{
				id: 18,
				hotelId: 4,
				userId: 2,
				rating: 4,
				createdAt: '2020-01-30T13:29:53.571Z',
				updatedAt: '2020-01-30T13:30:01.477Z',
			},
			{
				id: 17,
				hotelId: 2,
				userId: 2,
				rating: 4,
				createdAt: '2020-01-30T13:13:53.368Z',
				updatedAt: '2020-01-31T07:39:11.490Z',
			},
			{
				id: 20,
				hotelId: 1,
				userId: 2,
				rating: 4,
				createdAt: '2020-01-31T08:30:51.807Z',
				updatedAt: '2020-01-31T08:31:18.034Z',
			},
		],
	},
};

describe(' ', () => {
  beforeAll(() => {
    global.localStorage.setItem("bn_user_data", `{
      "email":"requestero@user.com",
      "name":"Requester",
      "userId":2,
      "verified":true,
      "role":"requester",
      "lineManagerId":7,
      "iat":1578472431,
      "exp":1578558831
    }`);
  })

  afterEach(cleanup);
  afterAll(() => {

    global.localStorage.clear();
    localStorage.store = {};
   });

	const userProfile = {
		data: {
			data: {
				firstName: "Requester",
				lastName: "User",
				email: "requester@user.com",
				isVerified: true,
				birthDate: "2001-11-11T00:00:00.000Z",
				residenceAddress: '',
				preferredLanguage: "French USA",
				preferredCurrency: "usd",
				department: "marketing",
				gender: "male",
				lastLogin: "2020-01-04T08:19:43.909Z",
				role: "requester",
				phoneNumber: "0786466253",
				lineManager: {
					id: 7,
					firstName: "john",
					lastName: "doe",
				},
			}
		}
	};

	const managers = {
		data: {
			data: [
				{
					id: 1,
					firstName: "john",
					lastName: "doe",
					email: "john@barefoot.com",
					birthDate: '2001-11-11T00:00:00.000Z',
					residenceAddress: '',
					lineManagerId: '',
					preferredLanguage: '',
					preferredCurrency: '',
					department: '',
					gender: '',
					role: "manager",
					phoneNumber: '',
					createdAt: "2019-12-11T18:15:54.157Z",
					updatedAt: "2019-12-12T11:05:52.591Z"
				}
			]
		}
	};

	const initialState = {
		profileState: {
			userProfile: {},
			errors: {},
			managers: [],
			initialProfile: {},
			isFetching: false,
			fetchError: null,
			isEditing: true,
			currentUserId: null
		}
	};

  test('User can create a one way trip', async () => {
    getLocations.mockImplementation(() => Promise.resolve(locations));
    getLocationsWithHotels.mockImplementation(() => Promise.resolve(locationWithHotels));
    createATrip.mockImplementation(() => Promise.resolve(responseData));
		getUserProfile.mockImplementation(() => Promise.resolve(userProfile));
    getUsers.mockImplementation(() => Promise.resolve(managers));
    getUserRatingData.mockImplementation(() => Promise.resolve(ratingDataResponse));
    getBookingData.mockImplementation(() => Promise.resolve(bookingDataResponse));

    const initialState = {
      authState: {
        isAuthenticated: true
      }
    };
    const { getByTestId, getByPlaceholderText, debug, queryByText } = render(<BrowserRouter><CreateRequestView /></BrowserRouter>, initialState);

    const [
			departmentField,
			firstNameField,
			managerField,
			genderField,
			currencyField,
			languageField,
			rememberInfo,
      submitButton,
    ] = await waitForElement(() => [
			getByPlaceholderText('Enter Department'),
			getByPlaceholderText('Enter First Name'),
			getByPlaceholderText('Line Manager'),
			getByPlaceholderText('Select Gender'),
			getByPlaceholderText('Preferred Currency'),
			getByPlaceholderText('Preferred Language'),
      getByTestId('remember'),
      getByTestId('form-user'),
    ]);

		fireEvent.change(firstNameField, { target: { value: ''}});
    fireEvent.blur(firstNameField);
    
    fireEvent.change(firstNameField, { target: { value: 'd'}});
    fireEvent.blur(firstNameField);
    
    fireEvent.change(firstNameField, { target: { value: ''}});
		fireEvent.blur(firstNameField);

		fireEvent.change(departmentField, { target: { value: ''}});
		fireEvent.blur(departmentField);

		fireEvent.change(genderField, { target: { value: 'male'}});
		fireEvent.blur(genderField);

		fireEvent.change(currencyField, { target: { value: 'Dollars'}});
		fireEvent.blur(currencyField);

		fireEvent.change(languageField, { target: { value: 'English'}});
		fireEvent.blur(languageField);

		fireEvent.change(managerField, { target: { value: '1'}});
    fireEvent.blur(managerField);
    
    fireEvent.click(rememberInfo)

    fireEvent.submit(submitButton, {preventDefault: jest.fn()});

    fireEvent.change(firstNameField, { target: { value: 'user'}});
		fireEvent.blur(firstNameField);

		fireEvent.change(departmentField, { target: { value: 'devops'}});
    fireEvent.blur(departmentField);
    
    fireEvent.submit(submitButton, {preventDefault: jest.fn()});
    
    const [
      oneWayTypeField,
      travelDateField,
      leavingFromField,
      goingToField,
      selectHotelField,
      selectRoomField,
      reasonField,
      submitTrip
    ] = await waitForElement(() => [
      getByTestId('oneway'),
      getByTestId('travelDate'),
      getByTestId('leavingFrom'),
      getByTestId('goingTo'),
      getByTestId('hotel'),
      getByTestId('room'),
      getByTestId('reason'),
      getByTestId('submitInput'),
    ]);

    fireEvent.click(oneWayTypeField);
    fireEvent.change(travelDateField, {target:{value: '2021-01-31'}});
    fireEvent.change(leavingFromField, {target:{value: 1}});
    fireEvent.change(goingToField, {target:{value: 7}});
    fireEvent.change(selectHotelField, {target:{value: 1}});
    fireEvent.change(selectRoomField, {target:{value: 9}});
    fireEvent.change(reasonField, {target:{value: 'Reason for the trip goes here'}});

    fireEvent.submit(submitTrip, {preventDefault: jest.fn()})

    expect(queryByText('Back')).toBeInTheDocument();

  });

  test('User can create a return trip', async () => {
    getLocations.mockImplementation(() => Promise.resolve(locations));
    getLocationsWithHotels.mockImplementation(() => Promise.resolve(locationWithHotels));
    createATrip.mockImplementation(() => Promise.resolve(responseData));
		getUserProfile.mockImplementation(() => Promise.resolve(userProfile));
    getUsers.mockImplementation(() => Promise.resolve(managers));
    getUserRatingData.mockImplementation(() => Promise.resolve(ratingDataResponse));
    getBookingData.mockImplementation(() => Promise.resolve(bookingDataResponse));


		const initialState = {
      authState: {
        isAuthenticated: true
      }
    };
    const { getByTestId, getByPlaceholderText, debug } = render(<BrowserRouter><CreateRequestView /></BrowserRouter>, initialState);

    const [
			departmentField,
			firstNameField,
			managerField,
			genderField,
			currencyField,
			languageField,
			rememberInfo,
      submitButton,
    ] = await waitForElement(() => [
			getByPlaceholderText('Enter Department'),
			getByPlaceholderText('Enter First Name'),
			getByPlaceholderText('Line Manager'),
			getByPlaceholderText('Select Gender'),
			getByPlaceholderText('Preferred Currency'),
			getByPlaceholderText('Preferred Language'),
      getByTestId('remember'),
      getByTestId('form-user'),
    ]);

		fireEvent.change(firstNameField, { target: { value: ''}});
    fireEvent.blur(firstNameField);
    
    fireEvent.change(firstNameField, { target: { value: 'd'}});
    fireEvent.blur(firstNameField);
    
    fireEvent.change(firstNameField, { target: { value: ''}});
		fireEvent.blur(firstNameField);

		fireEvent.change(departmentField, { target: { value: ''}});
		fireEvent.blur(departmentField);

		fireEvent.change(genderField, { target: { value: 'male'}});
		fireEvent.blur(genderField);

		fireEvent.change(currencyField, { target: { value: 'Dollars'}});
		fireEvent.blur(currencyField);

		fireEvent.change(languageField, { target: { value: 'English'}});
		fireEvent.blur(languageField);

		fireEvent.change(managerField, { target: { value: '1'}});
    fireEvent.blur(managerField);
    
    fireEvent.click(rememberInfo)

    fireEvent.submit(submitButton, {preventDefault: jest.fn()});

    fireEvent.change(firstNameField, { target: { value: 'user'}});
		fireEvent.blur(firstNameField);

		fireEvent.change(departmentField, { target: { value: 'devops'}});
    fireEvent.blur(departmentField);
    
    fireEvent.submit(submitButton, {preventDefault: jest.fn()});

    const [
      returnTypeField,
      travelDateField,
      returnDateField,
      leavingFromField,
      goingToField,
      selectHotelField,
      selectRoomField,
      reasonField,
      submitTrip
    ] = await waitForElement(() => [
      getByTestId('return'),
      getByTestId('travelDate'),
      getByTestId('returnDate'),
      getByTestId('leavingFrom'),
      getByTestId('goingTo'),
      getByTestId('hotel'),
      getByTestId('room'),
      getByTestId('reason'),
      getByTestId('submitInput'),
    ]);

    fireEvent.click(returnTypeField);
    fireEvent.change(returnDateField, {target:{value: '2021-03-31'}});
    fireEvent.change(travelDateField, {target:{value: '2021-01-31'}});
    fireEvent.change(leavingFromField, {target:{value: 1}});
    fireEvent.change(goingToField, {target:{value: 7}});
    fireEvent.change(selectHotelField, {target:{value: 1}});
    fireEvent.change(selectRoomField, {target:{value: 9}});
    fireEvent.change(reasonField, {target:{value: 'Reason for the trip goes here'}});

    fireEvent.submit(submitTrip, {preventDefault: jest.fn()})

  });


  test('User can clear date validation error after correcting return trip dates', async () => {
    getLocations.mockImplementation(() => Promise.resolve(locations));
    getLocationsWithHotels.mockImplementation(() => Promise.resolve(locationWithHotels));
    createATrip.mockImplementation(() => Promise.resolve(responseData));
		getUserProfile.mockImplementation(() => Promise.resolve(userProfile));
    getUsers.mockImplementation(() => Promise.resolve(managers));
    getUserRatingData.mockImplementation(() => Promise.resolve(ratingDataResponse));
    getBookingData.mockImplementation(() => Promise.resolve(bookingDataResponse));


		const initialState = {
      authState: {
        isAuthenticated: true
      }
    };
    const { getByTestId, getByPlaceholderText } = render(<BrowserRouter><CreateRequestView /></BrowserRouter>, initialState);

    const [
			departmentField,
			firstNameField,
			managerField,
			genderField,
			currencyField,
			languageField,
			rememberInfo,
      submitButton,
    ] = await waitForElement(() => [
			getByPlaceholderText('Enter Department'),
			getByPlaceholderText('Enter First Name'),
			getByPlaceholderText('Line Manager'),
			getByPlaceholderText('Select Gender'),
			getByPlaceholderText('Preferred Currency'),
			getByPlaceholderText('Preferred Language'),
      getByTestId('remember'),
      getByTestId('form-user'),
    ]);

		fireEvent.change(firstNameField, { target: { value: ''}});
    fireEvent.blur(firstNameField);
    
    fireEvent.change(firstNameField, { target: { value: 'd'}});
    fireEvent.blur(firstNameField);
    
    fireEvent.change(firstNameField, { target: { value: ''}});
		fireEvent.blur(firstNameField);

		fireEvent.change(departmentField, { target: { value: ''}});
		fireEvent.blur(departmentField);

		fireEvent.change(genderField, { target: { value: 'male'}});
		fireEvent.blur(genderField);

		fireEvent.change(currencyField, { target: { value: 'Dollars'}});
		fireEvent.blur(currencyField);

		fireEvent.change(languageField, { target: { value: 'English'}});
		fireEvent.blur(languageField);

		fireEvent.change(managerField, { target: { value: '1'}});
    fireEvent.blur(managerField);
    
    fireEvent.click(rememberInfo)

    fireEvent.submit(submitButton, {preventDefault: jest.fn()});

    fireEvent.change(firstNameField, { target: { value: 'user'}});
		fireEvent.blur(firstNameField);

		fireEvent.change(departmentField, { target: { value: 'devops'}});
    fireEvent.blur(departmentField);
    
    fireEvent.submit(submitButton, {preventDefault: jest.fn()});

    const [
      returnTypeField,
      travelDateField,
      returnDateField,
      leavingFromField,
      goingToField,
      selectHotelField,
      selectRoomField,
      reasonField,
      submitTrip
    ] = await waitForElement(() => [
      getByTestId('return'),
      getByTestId('travelDate'),
      getByTestId('returnDate'),
      getByTestId('leavingFrom'),
      getByTestId('goingTo'),
      getByTestId('hotel'),
      getByTestId('room'),
      getByTestId('reason'),
      getByTestId('submitInput'),
    ]);

    fireEvent.click(returnTypeField);
    fireEvent.change(returnDateField, {target:{value: '2020-03-31'}});
    fireEvent.change(travelDateField, {target:{value: '2021-01-31'}});
    fireEvent.change(leavingFromField, {target:{value: 1}});
    fireEvent.change(goingToField, {target:{value: 7}});
    fireEvent.change(selectHotelField, {target:{value: 1}});
    fireEvent.change(selectRoomField, {target:{value: 9}});
    fireEvent.change(reasonField, {target:{value: 'Reason for the trip goes here'}});
    fireEvent.submit(submitTrip, {preventDefault: jest.fn()})
    fireEvent.change(returnDateField, {target:{value: '2021-03-31'}});
    fireEvent.submit(submitTrip, {preventDefault: jest.fn()})
  });

  test('User can create a multi-city trip', async () => {
    getLocations.mockImplementation(() => Promise.resolve(locations));
    getLocationsWithHotels.mockImplementation(() => Promise.resolve(locationWithHotels));
    createATrip.mockImplementation(() => Promise.resolve(responseData));
		getUserProfile.mockImplementation(() => Promise.resolve(userProfile));
    getUsers.mockImplementation(() => Promise.resolve(managers));
    getUserRatingData.mockImplementation(() => Promise.resolve(ratingDataResponse));
    getBookingData.mockImplementation(() => Promise.resolve(bookingDataResponse));


    const initialState = {
      authState: {
        isAuthenticated: true
      }
    };
    const { getByTestId, getAllByTestId, getByPlaceholderText, debug } = render(<BrowserRouter><CreateRequestView /></BrowserRouter>, initialState);

    const [
			departmentField,
			firstNameField,
			managerField,
			genderField,
			currencyField,
			languageField,
			rememberInfo,
      submitButton,
    ] = await waitForElement(() => [
			getByPlaceholderText('Enter Department'),
			getByPlaceholderText('Enter First Name'),
			getByPlaceholderText('Line Manager'),
			getByPlaceholderText('Select Gender'),
			getByPlaceholderText('Preferred Currency'),
			getByPlaceholderText('Preferred Language'),
      getByTestId('remember'),
      getByTestId('form-user'),
    ]);

		fireEvent.change(firstNameField, { target: { value: ''}});
    fireEvent.blur(firstNameField);
    
    fireEvent.change(firstNameField, { target: { value: 'd'}});
    fireEvent.blur(firstNameField);
    
    fireEvent.change(firstNameField, { target: { value: ''}});
		fireEvent.blur(firstNameField);

		fireEvent.change(departmentField, { target: { value: ''}});
		fireEvent.blur(departmentField);

		fireEvent.change(genderField, { target: { value: 'male'}});
		fireEvent.blur(genderField);

		fireEvent.change(currencyField, { target: { value: 'Dollars'}});
		fireEvent.blur(currencyField);

		fireEvent.change(languageField, { target: { value: 'English'}});
		fireEvent.blur(languageField);

		fireEvent.change(managerField, { target: { value: '1'}});
    fireEvent.blur(managerField);
    
    fireEvent.click(rememberInfo)

    fireEvent.submit(submitButton, {preventDefault: jest.fn()});

    fireEvent.change(firstNameField, { target: { value: 'user'}});
		fireEvent.blur(firstNameField);

		fireEvent.change(departmentField, { target: { value: 'devops'}});
    fireEvent.blur(departmentField);
    
    fireEvent.submit(submitButton, {preventDefault: jest.fn()});

    const [
      multiCityTypeField,
      travelDateField,
      leavingFromField,
      goingToField,
      selectHotelField,
      selectRoomField,
      reasonField,
      submitTrip,
      addTripButton,
      removeBtn,
    ] = await waitForElement(() => [
      getAllByTestId('multi-city'),
      getAllByTestId('travelDate'),
      getAllByTestId('leavingFrom'),
      getAllByTestId('goingTo'),
      getAllByTestId('hotel'),
      getAllByTestId('room'),
      getAllByTestId('reason'),
      getByTestId('submitInput'),
      getByTestId('addbutton'),
    ]);


    fireEvent.click(addTripButton);
    fireEvent.click(addTripButton);

    const [
      travelDateField1,
      leavingFromField1,
      goingToField1,
      selectHotelField1,
      selectRoomField1,
      reasonField1,
      addTripButton1,
      multiCityTypeField1,
    ] = await waitForElement(() => [
      getAllByTestId('travelDate'),
      getAllByTestId('leavingFrom'),
      getAllByTestId('goingTo'),
      getAllByTestId('hotel'),
      getAllByTestId('room'),
      getAllByTestId('reason'),
      getByTestId('addbutton'),
      getAllByTestId('multi-city'),
    ]);

    fireEvent.click(multiCityTypeField[0]);
    fireEvent.change(travelDateField[0], {target:{value: '2021-01-31'}});
    fireEvent.change(leavingFromField[0], {target:{value: 1}});
    fireEvent.change(goingToField[0], {target:{value: 7}});
    fireEvent.change(selectHotelField[0], {target:{value: 1}});
    fireEvent.change(selectRoomField[0], {target:{value: 9}});
    fireEvent.change(reasonField[0], {target:{value: 'Reason for the trip goes here'}});

    fireEvent.change(travelDateField1[1], {target:{value: '2021-01-31'}});
    fireEvent.change(leavingFromField1[1], {target:{value: 1}});
    fireEvent.change(goingToField1[1], {target:{value: 7}});
    fireEvent.change(reasonField1[1], {target:{value: 'Reason for the trip goes here'}});

    fireEvent.submit(submitTrip, {preventDefault: jest.fn()});

  });

  test('User can delete a multi-city trip form', async () => {
    getLocations.mockImplementation(() => Promise.resolve(locations));
    getLocationsWithHotels.mockImplementation(() => Promise.resolve(locationWithHotels));
    createATrip.mockImplementation(() => Promise.resolve(responseData));

		getUserProfile.mockImplementation(() => Promise.resolve(userProfile));
		getUsers.mockImplementation(() => Promise.resolve(managers));

    const initialState = {
      authState: {
        isAuthenticated: true
      }
    };

    const { getByTestId, getAllByTestId, getByPlaceholderText, debug } = render(<BrowserRouter><CreateRequestView /></BrowserRouter>, initialState);

    const [
			departmentField,
			firstNameField,
			managerField,
			genderField,
			currencyField,
			languageField,
			rememberInfo,
      submitButton,
    ] = await waitForElement(() => [
			getByPlaceholderText('Enter Department'),
			getByPlaceholderText('Enter First Name'),
			getByPlaceholderText('Line Manager'),
			getByPlaceholderText('Select Gender'),
			getByPlaceholderText('Preferred Currency'),
			getByPlaceholderText('Preferred Language'),
      getByTestId('remember'),
      getByTestId('form-user'),
    ]);

		fireEvent.change(firstNameField, { target: { value: ''}});
    fireEvent.blur(firstNameField);
    
    fireEvent.change(firstNameField, { target: { value: 'd'}});
    fireEvent.blur(firstNameField);
    
    fireEvent.change(firstNameField, { target: { value: ''}});
		fireEvent.blur(firstNameField);

		fireEvent.change(departmentField, { target: { value: ''}});
		fireEvent.blur(departmentField);

		fireEvent.change(genderField, { target: { value: 'male'}});
		fireEvent.blur(genderField);

		fireEvent.change(currencyField, { target: { value: 'Dollars'}});
		fireEvent.blur(currencyField);

		fireEvent.change(languageField, { target: { value: 'English'}});
		fireEvent.blur(languageField);

		fireEvent.change(managerField, { target: { value: '1'}});
    fireEvent.blur(managerField);
    
    fireEvent.click(rememberInfo)

    fireEvent.submit(submitButton, {preventDefault: jest.fn()});

    fireEvent.change(firstNameField, { target: { value: 'user'}});
		fireEvent.blur(firstNameField);

		fireEvent.change(departmentField, { target: { value: 'devops'}});
    fireEvent.blur(departmentField);
    
    fireEvent.submit(submitButton, {preventDefault: jest.fn()});

    const [
      addTripButton,

    ] = await waitForElement(() => [
      getByTestId('addbutton'),
    ]);


    fireEvent.click(addTripButton);

    const [
      removeButton
    ] = await waitForElement(() => [
  getAllByTestId('delete')
    ]);

    fireEvent.click(removeButton[1])

  });

  test('User can delete a multi-city trip form', async () => {
    getLocations.mockImplementation(() => Promise.resolve(locations));
    getLocationsWithHotels.mockImplementation(() => Promise.resolve(locationWithHotels));
    createATrip.mockImplementation(() => Promise.resolve(responseData));

		getUserProfile.mockImplementation(() => Promise.resolve(userProfile));
		getUsers.mockImplementation(() => Promise.resolve(managers));

    const initialState = {
      authState: {
        isAuthenticated: true
      }
    };

    const { getByTestId, getAllByTestId, getByPlaceholderText, debug } = render(<BrowserRouter><CreateRequestView /></BrowserRouter>, initialState);

    const [
			departmentField,
			firstNameField,
			managerField,
			genderField,
			currencyField,
			languageField,
			rememberInfo,
      submitButton,
    ] = await waitForElement(() => [
			getByPlaceholderText('Enter Department'),
			getByPlaceholderText('Enter First Name'),
			getByPlaceholderText('Line Manager'),
			getByPlaceholderText('Select Gender'),
			getByPlaceholderText('Preferred Currency'),
			getByPlaceholderText('Preferred Language'),
      getByTestId('remember'),
      getByTestId('form-user'),
    ]);

		fireEvent.change(firstNameField, { target: { value: ''}});
    fireEvent.blur(firstNameField);
    
    fireEvent.change(firstNameField, { target: { value: 'd'}});
    fireEvent.blur(firstNameField);
    
    fireEvent.change(firstNameField, { target: { value: ''}});
		fireEvent.blur(firstNameField);

		fireEvent.change(departmentField, { target: { value: ''}});
		fireEvent.blur(departmentField);

		fireEvent.change(genderField, { target: { value: 'male'}});
		fireEvent.blur(genderField);

		fireEvent.change(currencyField, { target: { value: 'Dollars'}});
		fireEvent.blur(currencyField);

		fireEvent.change(languageField, { target: { value: 'English'}});
		fireEvent.blur(languageField);

		fireEvent.change(managerField, { target: { value: '1'}});
    fireEvent.blur(managerField);
    
    fireEvent.click(rememberInfo)

    fireEvent.submit(submitButton, {preventDefault: jest.fn()});

    fireEvent.change(firstNameField, { target: { value: 'user'}});
		fireEvent.blur(firstNameField);

		fireEvent.change(departmentField, { target: { value: 'devops'}});
    fireEvent.blur(departmentField);
    
    fireEvent.submit(submitButton, {preventDefault: jest.fn()});

    const [
      addTripButton,

    ] = await waitForElement(() => [
      getByTestId('back-btn'),
    ]);


    fireEvent.click(addTripButton);

  });

  test('Prevent goingTo from being set to null on form delete', async () => {
    getLocations.mockImplementation(() => Promise.resolve(locations));
    getLocationsWithHotels.mockImplementation(() => Promise.resolve(locationWithHotels));
    createATrip.mockImplementation(() => Promise.resolve(responseData));
		getUserProfile.mockImplementation(() => Promise.resolve(userProfile));
    getUsers.mockImplementation(() => Promise.resolve(managers));
    getUserRatingData.mockImplementation(() => Promise.resolve(ratingDataResponse));
    getBookingData.mockImplementation(() => Promise.resolve(bookingDataResponse));


    const initialState = {
      authState: {
        isAuthenticated: true
      }
    };
    const { getByTestId, getAllByTestId, getByPlaceholderText, debug } = render(<BrowserRouter><CreateRequestView /></BrowserRouter>, initialState);

    const [
			departmentField,
			firstNameField,
			managerField,
			genderField,
			currencyField,
			languageField,
			rememberInfo,
      submitButton,
    ] = await waitForElement(() => [
			getByPlaceholderText('Enter Department'),
			getByPlaceholderText('Enter First Name'),
			getByPlaceholderText('Line Manager'),
			getByPlaceholderText('Select Gender'),
			getByPlaceholderText('Preferred Currency'),
			getByPlaceholderText('Preferred Language'),
      getByTestId('remember'),
      getByTestId('form-user'),
    ]);

		fireEvent.change(firstNameField, { target: { value: ''}});
    fireEvent.blur(firstNameField);
    
    fireEvent.change(firstNameField, { target: { value: 'd'}});
    fireEvent.blur(firstNameField);
    
    fireEvent.change(firstNameField, { target: { value: ''}});
		fireEvent.blur(firstNameField);

		fireEvent.change(departmentField, { target: { value: ''}});
		fireEvent.blur(departmentField);

		fireEvent.change(genderField, { target: { value: 'male'}});
		fireEvent.blur(genderField);

		fireEvent.change(currencyField, { target: { value: 'Dollars'}});
		fireEvent.blur(currencyField);

		fireEvent.change(languageField, { target: { value: 'English'}});
		fireEvent.blur(languageField);

		fireEvent.change(managerField, { target: { value: '1'}});
    fireEvent.blur(managerField);
    
    fireEvent.click(rememberInfo)

    fireEvent.submit(submitButton, {preventDefault: jest.fn()});

    fireEvent.change(firstNameField, { target: { value: 'user'}});
		fireEvent.blur(firstNameField);

		fireEvent.change(departmentField, { target: { value: 'devops'}});
    fireEvent.blur(departmentField);
    
    fireEvent.submit(submitButton, {preventDefault: jest.fn()});

    const [
      multiCityTypeField,
      travelDateField,
      leavingFromField,
      goingToField,
      selectHotelField,
      selectRoomField,
      reasonField,
      addTripButton,
    ] = await waitForElement(() => [
      getAllByTestId('multi-city'),
      getAllByTestId('travelDate'),
      getAllByTestId('leavingFrom'),
      getAllByTestId('goingTo'),
      getAllByTestId('hotel'),
      getAllByTestId('room'),
      getAllByTestId('reason'),
      getByTestId('addbutton'),
    ]);

    fireEvent.click(multiCityTypeField[0]);


    fireEvent.click(addTripButton);
    fireEvent.click(addTripButton);

    const [
      travelDateField1,
      leavingFromField1,
      goingToField1,
      selectHotelField1,
      selectRoomField1,
      reasonField1,
      addTripButton1,
      multiCityTypeField1,
    ] = await waitForElement(() => [
      getAllByTestId('travelDate'),
      getAllByTestId('leavingFrom'),
      getAllByTestId('goingTo'),
      getAllByTestId('hotel'),
      getAllByTestId('room'),
      getAllByTestId('reason'),
      getByTestId('addbutton'),
      getAllByTestId('multi-city'),
    ]);

    fireEvent.change(travelDateField[0], {target:{value: '2021-01-31'}});
    fireEvent.change(leavingFromField[0], {target:{value: 1}});
    fireEvent.change(goingToField[0], {target:{value: 7}});
    fireEvent.change(selectHotelField[0], {target:{value: 1}});
    fireEvent.change(selectRoomField[0], {target:{value: 9}});
    fireEvent.change(reasonField[0], {target:{value: 'Reason for the trip goes here'}});

    fireEvent.change(travelDateField1[1], {target:{value: '2021-01-31'}});
    fireEvent.change(leavingFromField1[1], {target:{value: 1}});
    fireEvent.change(goingToField1[1], {target:{value: 7}});
    fireEvent.change(reasonField1[1], {target:{value: 'Reason for the trip goes here'}});


    const [
      removeBtns,
    ] = await waitForElement(() => [
      getAllByTestId('delete'),
    ]);

    fireEvent.click(removeBtns[1]);
  });

})
