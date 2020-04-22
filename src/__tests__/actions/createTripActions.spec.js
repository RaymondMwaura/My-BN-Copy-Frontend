import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import moxios from 'moxios';
import { FETCH_CREATE_TRIP_DATA_FAILURE, LOADING } from '../../store/actions/types';
import { fetchCreateTripData } from '../../store/actions/requests/createTripActions';
import apiCall from '../../utils/api';
import localStorage from "../../__mocks__/LocalStorage";
import actionFunc from '../../utils/actionFunc';

let store;
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('Create Trip Test Suite', () => {
  beforeAll(() => {
    global.localStorage = localStorage;
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
  });
  beforeEach(() => {
    moxios.install(apiCall);
  });

  afterEach(() => {
    moxios.uninstall(apiCall);
  });

  it('It fails to fetch create trip data', async () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        response: {
          "status": "error",
          "message": "failed to fetch create trip data"
        },
        status: 400
      });
    });

    const expectedActions = [
      actionFunc(LOADING, true),
      {
        payload: "failed to fetch create trip data",
        type: FETCH_CREATE_TRIP_DATA_FAILURE,
      },
      actionFunc(LOADING, false)
    ];

    store = mockStore({});
    await store.dispatch(fetchCreateTripData())
    .then(async () => {
      const calledActions = store.getActions();
      expect(calledActions).toEqual(expectedActions);
    });
  });
});