import rateAccomodationReducer from '../../store/reducers/rateAccomodationReducer';
import {
  FETCH_USER_RATING_DATA_SUCCESS,
  FETCH_USER_RATING_DATA_FAILURE,
  RATE_ACCOMODATION_SUCCESS,
  RATE_ACCOMODATION_FAILURE
} from '../../store/actions/types';

describe('Login Reducer Tests ', () => {
	it('Should fetch rating data', () => {
		const fetchSuccessful = {
			type: FETCH_USER_RATING_DATA_SUCCESS,
			payload: {}
		};
		const changedState = rateAccomodationReducer(undefined, fetchSuccessful);
		expect(changedState).toEqual({
      ratingSuccess: null,
      responseMessage: null,
      bookingData: fetchSuccessful.payload.bookingData,
      ratingData: fetchSuccessful.payload.ratingData,
		})
	});

	it('Should return a fetching error', () => {
		const fetchFailed = {
			type: FETCH_USER_RATING_DATA_FAILURE,
			payload: {}
		};
		const changedState = rateAccomodationReducer(undefined, fetchFailed);
		expect(changedState).toEqual({
      ratingSuccess: null,
      responseMessage: fetchFailed.payload,
      ratingData: null,
      bookingData: null,
		})
	});

	it('Should return success on rating posted', () => {
		const ratingSuccessful = {
			type: RATE_ACCOMODATION_SUCCESS,
			payload: {}
		};
		const changedState = rateAccomodationReducer(undefined, ratingSuccessful);
		expect(changedState).toEqual({
      ratingSuccess: true,
      responseMessage: ratingSuccessful.payload,
      ratingData: null,
      bookingData: null,
		})
	});

	it('Should return error message on unsuccessful rating action', () => {
		const ratingFailure = {
			type: RATE_ACCOMODATION_FAILURE,
			payload: {}
		};
		const changedState = rateAccomodationReducer(undefined, ratingFailure);
		expect(changedState).toEqual({
      ratingSuccess: false,
      responseMessage: ratingFailure.payload,
      ratingData: null,
      bookingData: null,
		})
  });
  
  it('Should return default state', () => {
		const defaultState = rateAccomodationReducer(undefined, {});
		expect(defaultState).toEqual({
      ratingSuccess: null,
      responseMessage: null,
      ratingData: null,
      bookingData: null,
		})
	});
});
