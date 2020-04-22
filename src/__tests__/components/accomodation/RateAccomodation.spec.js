import React from "react";
import {
  cleanup,
  fireEvent,
  render as reactRender,
  waitForElement,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import "@testing-library/jest-dom/extend-expect";
import { applyMiddleware, createStore } from "redux";
import reducers from "../../../store/reducers";
import { Provider } from "react-redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import localStorage from "../../../__mocks__/LocalStorage";
import RateAccomodation from '../../../components/accomodations/RateAccomodation';
import { BrowserRouter } from "react-router-dom";
import {
  getBookingData,
  getUserRatingData,
  postRating,
  updateRating
} from "../../../lib/services/rating.service";
import { getHotelById } from '../../../lib/services/accommodation.service';
import Cookies from "universal-cookie";

global.localStorage = localStorage;
jest.mock('../../../lib/services/booking.service');
jest.mock('../../../lib/services/rating.service');
jest.mock('../../../lib/services/accommodation.service');
jest.mock("universal-cookie");
Cookies.mockImplementation(() => ({
  get: () =>
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InJlcXVlc3RlckB1c2VyLmNvbSIsIm5hbWUiOiJSZXF1ZXN0ZXIiLCJ1c2VySWQiOjIsInZlcmlmaWVkIjp0cnVlLCJyb2xlIjoicmVxdWVzdGVyIiwibGluZU1hbmFnZXJJZCI6MywiaWF0IjoxNTgwODExMjAwLCJleHAiOjE1ODA4OTc2MDB9.gvnrpPx9C9_hHciZez61XdZbmyBi92A7N5OxUpm_cvc',
}));
Cookies.mockImplementation(() => ({ get: () => token }));
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
      }
    ],
  },
};

const postRatingResponse = {
  status: 'success',
  message: 'Hotel rated successfully',
  data: [
    {
      id: 2,
      hotelId: 1,
      userId: 2,
      rating: 3,
      updatedAt: '2020-02-04T12:53:35.206Z',
      createdAt: '2020-02-04T12:53:35.206Z',
    },
    true,
  ],
};

const updateRatingResponse = {
  status: 'success',
  message: 'Hotel rating updated successfully',
  data: [
    1,
    [
      {
        id: 2,
        hotelId: 1,
        userId: 2,
        rating: 4,
        createdAt: '2020-02-04T12:53:35.206Z',
        updatedAt: '2020-02-04T12:55:40.888Z',
      },
    ],
  ],
};

const getHotelByIdResponse = {
  status: 'success',
  message: 'hotel retrieved successfully',
  data: {
    id: 1,
    name: 'The Majestic',
    image: '',
    ratings: [
      {
        id: 2,
        hotelId: 1,
        userId: 2,
        rating: 4,
        createdAt: '2020-02-04T12:53:35.206Z',
        updatedAt: '2020-02-04T12:55:40.888Z',
      },
    ],
  },
};

const render = (ui, initialState = {}, options = {}) => {
  const store = createStore(reducers, initialState,
    composeWithDevTools(applyMiddleware(thunk)));
  const Providers = ({ children }) => (
    <Provider store={store}>{children}</Provider>
  );
  return reactRender(ui, { wrapper: Providers, ...options });
};

jest.mock("react-rating", () => ({start,
  stop,
  step,
  emptySymbol,
  fullSymbol,
  initialRating,
  direction,
  onChange
}) => {
  function handleChange(event) {
    const values = [1,2,3,4,5];
    const option = values.find(
      option => option.value === event.currentTarget.value
    );
    onChange(option);
  }
  return (
    <select data-testid="ratingSelect" value={initialRating} onChange={handleChange}>
      {[1,2,3,4,5].map( value => (
        <option key={value} value={value}>
          {value}
        </option>
      ))}
    </select>
  );
});

describe(' ', () => {
  beforeAll(() => {
    global.$ = jest.fn((cb) => ({
      modal: jest.fn(cb => {jest.fn();}),
    }));

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

  test('Should render without error', async () => {
    getUserRatingData.mockImplementation(() => Promise.resolve(ratingDataResponse));
    getBookingData.mockImplementation(() => Promise.resolve(bookingDataResponse));

      const initialState = {
        loadingState: {
          loading: false,
          buttonLoading: false
        }
      };

    const oldRating = [];
    const ratingOption = 'addNewRating';
    const id = 1;

    const { getByTestId, getByText } = render(<BrowserRouter>
        <RateAccomodation ratingOption={{ ratingOption, oldRating, id }}/>
    </BrowserRouter>, initialState);

    const [
      submitInput
    ] = await waitForElement(() => [
      getByTestId('submitInput'),
    ]);

    expect(getByText('Post rating')).toBeInTheDocument();
  });

  test('Should rate a center', async () => {
    getUserRatingData.mockImplementation(() => Promise.resolve(ratingDataResponse));
    getBookingData.mockImplementation(() => Promise.resolve(bookingDataResponse));
    postRating.mockImplementation(() => Promise.resolve(postRatingResponse));
    getHotelById.mockImplementation(() => Promise.resolve(getHotelByIdResponse));

      const initialState = {
        loadingState: {
          loading: false,
          buttonLoading: false
        }
      };

    const oldRating = [];
    const ratingOption = 'addNewRating';
    const id = 1;

    const { getByTestId } = render(<BrowserRouter>
        <RateAccomodation ratingOption={{ ratingOption, oldRating, id }}/>
    </BrowserRouter>, initialState);

    const [
      submitButton
    ] = await waitForElement(() => [
      getByTestId('submitInput'),
    ]);
    fireEvent.click(submitButton);
  });

  test('Should update user rating of a center', async () => {
    getUserRatingData.mockImplementation(() => Promise.resolve(ratingDataResponse));
    getBookingData.mockImplementation(() => Promise.resolve(bookingDataResponse));
    updateRating.mockImplementation(() => Promise.resolve(updateRatingResponse));
    getHotelById.mockImplementation(() => Promise.resolve(getHotelByIdResponse));

    const initialState = {
      loadingState: {
        loading: false,
        buttonLoading: false
      }
    };

    let oldRating = [];
    let ratingOption = 'editRating';
    const id = 2;

    const { getByTestId, rerender } = render(<BrowserRouter>
    <RateAccomodation ratingOption={{ ratingOption, oldRating, id }}/>
    </BrowserRouter>, initialState);

    oldRating = {
      "id": 17,
      "hotelId": 2,
      "userId": 2,
      "rating": 4,
      "createdAt": "2020-01-30T13:13:53.368Z",
      "updatedAt": "2020-02-03T23:00:57.743Z"
    };

    ratingOption = 'editRating';

    rerender(<BrowserRouter>
      <RateAccomodation ratingOption={{ ratingOption, oldRating, id }}/>
      </BrowserRouter>);

    const [
      submitButton,
      selectRoomField
    ] = await waitForElement(() => [
      getByTestId('submitInput'),
      getByTestId('ratingSelect'),
    ]);
    fireEvent.change(selectRoomField, {target:{value: 5}});
    fireEvent.click(submitButton);
  });
});

