import React from 'react';
import {
	act,
	cleanup,
	fireEvent,
	waitForElement,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';
import Cookies from 'universal-cookie';
import MockAdapter from 'axios-mock-adapter';
import { BrowserRouter } from 'react-router-dom';
import localStorage from '../../__mocks__/LocalStorage';
import render from '../../__mocks__/render';
import token from '../../__mocks__/token';
import apiCall from '../../utils/api';
import TravelStatsView from '../../views/TravelStatsPage';
import { getDateFromTimeX } from '../../lib/time';


const week = getDateFromTimeX(1, 'weeks');
const month = getDateFromTimeX(1, 'months');
const year = getDateFromTimeX(1, 'years');
const mockAxios = new MockAdapter(apiCall);
const tripStats = {
  status: 'success',
  message: 'trip Statistics Successfully retrieved',
  data: {
    total: 8,
  }
}
const mostVisitedHotels = {
  status:"success",
  message:"Most travelled destinations listed successfully",
  data:{
    results:[
      {count:2,
        hotel:{id:1,
          locationId:8,
          name:"new hotel",
          image:"",
          street:"kk 16 Rd",
          description:"Best hotel in kigali",
          services:"Free wifi",
          userId:4,
          average_rating:"0.00",
          createdAt:"2020-01-18T12:34:11.347Z",
          updatedAt:"2020-01-18T12:34:11.347Z"
        }
      },
      {count:1,
        hotel:{id:7,
          locationId:4,
          name:"neakn Hotel",
          image:"",
          street:"kk 12 Rd",
          description:"Best hotel in egypt",
          services:"Free wifi",
          userId:4,
          average_rating:"0.00",
          createdAt:"2020-01-29T02:25:25.182Z",
          updatedAt:"2020-01-29T02:25:25.182Z"
        }
      },
    ]
  }
};

const managerUsers = {"status":"success","message":"successfully retrieved all users","data":[{"id":2,"firstName":"Requester","lastName":"User","email":"requester@user.com","birthDate":null,"residenceAddress":null,"lineManagerId":3,"preferredLanguage":null,"preferredCurrency":null,"department":null,"gender":null,"role":"requester","phoneNumber":null,"remember":false,"createdAt":"2020-01-17T12:42:50.650Z","updatedAt":"2020-02-03T17:30:26.110Z"}]}

describe('Trips stats page manager', ()=> {
  beforeEach(() => {
    global.localStorage.setItem("bn_user_data", `{
      "email":"requestero@user.com",
      "name":"Requester",
      "userId":2,
      "verified":true,
      "role":"manager",
      "lineManagerId":7,
      "iat":1578472431,
      "exp":1578558831
    }`);
    mockAxios
    .onGet('/trips/stats').replyOnce(200, tripStats)
    .onGet(`/trips/stats?fromDate=${week}`).replyOnce(200, tripStats)
    .onGet(`/trips/stats?fromDate=${month}`).replyOnce(200, tripStats)
    .onGet(`/trips/stats?fromDate=${year}`).replyOnce(200, tripStats)
    .onGet(`/hotels/most-travelled`).replyOnce(200, mostVisitedHotels)
    .onGet(`/auth/manager/users`).replyOnce(200, managerUsers)
    .onGet(`/trips/stats?fromDate=2019-02-03&userId=2`).replyOnce(200, tripStats)
  });
  afterEach(() => {
    cleanup();
    global.localStorage.clear();
    localStorage.store = {};
    mockAxios.reset();
  });
  it("User can view booking page ", async () => {
		const { getByText, getByTestId, getByPlaceholderText } = render(
			<BrowserRouter>
				<TravelStatsView />
			</BrowserRouter>
    );
    
    const [ selectUser, dateTravel, getStatsBtn ]= await waitForElement(
			() => [
        getByPlaceholderText("User"),
        getByTestId("input-field"),
        getByTestId("submit-btn")
      ]
    );
    fireEvent.change(selectUser, {target: { value: '2'}});
    fireEvent.change(dateTravel, {target: { value: '2019-02-03'}});
    fireEvent.click(getStatsBtn);

		const hotelsTitle = await waitForElement(
			() => getByText("Most visited hotels")
    );
    
    expect(hotelsTitle).toBeInTheDocument();
	});
})

describe('Trips stats page manager', ()=> {
  beforeEach(() => {
    global.localStorage.setItem("bn_user_data", `{
      "email":"requestero@user.com",
      "name":"Requester",
      "userId":2,
      "verified":true,
      "role":"requestor",
      "lineManagerId":7,
      "iat":1578472431,
      "exp":1578558831
    }`);
    mockAxios
    .onGet('/trips/stats').replyOnce(400)
  });
  afterEach(() => {
    cleanup();
    global.localStorage.clear();
    localStorage.store = {};
    mockAxios.reset();
  });
  it("User can view trips stat page ", async () => {
		const { getByTestId } = render(
			<BrowserRouter>
				<TravelStatsView />
			</BrowserRouter>
    );

		const hotelsTitle = await waitForElement(
			() => getByTestId("loading")
    );
    
    expect(hotelsTitle).toBeInTheDocument();
	});
})

describe('Trips stats page manager fails', ()=> {
  beforeEach(() => {
    global.localStorage.setItem("bn_user_data", `{
      "email":"requestero@user.com",
      "name":"Requester",
      "userId":2,
      "verified":true,
      "role":"manager",
      "lineManagerId":7,
      "iat":1578472431,
      "exp":1578558831
    }`);
    mockAxios
    .onGet('/trips/stats').replyOnce(200, tripStats)
    .onGet(`/trips/stats?fromDate=${week}`).replyOnce(200, tripStats)
    .onGet(`/trips/stats?fromDate=${month}`).replyOnce(200, tripStats)
    .onGet(`/trips/stats?fromDate=${year}`).replyOnce(200, tripStats)
    .onGet(`/hotels/most-travelled`).replyOnce(200, mostVisitedHotels)
    .onGet(`/auth/manager/users`).replyOnce(400, managerUsers)
    .onGet(`/trips/stats?fromDate=2019-02-03&userId=2`).replyOnce(200, tripStats)
  });
  afterEach(() => {
    cleanup();
    global.localStorage.clear();
    localStorage.store = {};
    mockAxios.reset();
  });
  it("User can view trips stat page ", async () => {
		const { getByText, getByTestId, getByPlaceholderText } = render(
			<BrowserRouter>
				<TravelStatsView />
			</BrowserRouter>
    );

		const hotelsTitle = await waitForElement(
			() => getByText("Most visited hotels")
    );
    
    expect(hotelsTitle).toBeInTheDocument();
	});
})

describe('Trips stats page manager', ()=> {
  beforeEach(() => {
    global.localStorage.setItem("bn_user_data", `{
      "email":"requestero@user.com",
      "name":"Requester",
      "userId":2,
      "verified":true,
      "role":"manager",
      "lineManagerId":7,
      "iat":1578472431,
      "exp":1578558831
    }`);
    mockAxios
    .onGet('/trips/stats').replyOnce(200, tripStats)
    .onGet(`/trips/stats?fromDate=${week}`).replyOnce(200, tripStats)
    .onGet(`/trips/stats?fromDate=${month}`).replyOnce(200, tripStats)
    .onGet(`/trips/stats?fromDate=${year}`).replyOnce(200, tripStats)
    .onGet(`/hotels/most-travelled`).replyOnce(200, mostVisitedHotels)
    .onGet(`/auth/manager/users`).replyOnce(200, managerUsers)
    .onGet(`/trips/stats?fromDate=2019-02-03&userId=2`).replyOnce(400, { message: 'error' })
    .onGet(`/trips/stats?fromDate=2019-02-03&userId=2`).replyOnce(200, tripStats)
  });
  afterEach(() => {
    cleanup();
    global.localStorage.clear();
    localStorage.store = {};
    mockAxios.reset();
  });
  it("User can view trips manager page fail", async () => {
		const { getByText, getByTestId, getByPlaceholderText } = render(
			<BrowserRouter>
				<TravelStatsView />
			</BrowserRouter>
    );
    
    const [ selectUser, dateTravel, getStatsBtn, submit ]= await waitForElement(
			() => [
        getByPlaceholderText("User"),
        getByTestId("input-field"),
        getByTestId("submit-btn"),
        getByTestId("form")
      ]
    );
    fireEvent.change(selectUser, {target: { value: '2'}});
    fireEvent.change(dateTravel, {target: { value: '2019-02-03'}});
    fireEvent.click(getStatsBtn);
    fireEvent.submit(submit, { target: {checkValidity: jest.fn(cb => false)}, preventDefault: jest.fn()})

		const hotelsTitle = await waitForElement(
			() => getByText("Most visited hotels")
    );
    
    expect(hotelsTitle).toBeInTheDocument();
	});
})

describe('Trips stats page users', ()=> {
  beforeEach(() => {
    global.localStorage.setItem("bn_user_data", `{
      "email":"requestero@user.com",
      "name":"Requester",
      "userId":2,
      "verified":true,
      "role":"requestor",
      "lineManagerId":7,
      "iat":1578472431,
      "exp":1578558831
    }`);
    mockAxios
    .onGet('/trips/stats').replyOnce(200, tripStats)
    .onGet(`/trips/stats?fromDate=${week}`).replyOnce(200, tripStats)
    .onGet(`/trips/stats?fromDate=${month}`).replyOnce(200, tripStats)
    .onGet(`/trips/stats?fromDate=${year}`).replyOnce(200, tripStats)
    .onGet(`/hotels/most-travelled`).replyOnce(200, mostVisitedHotels)
    .onGet(`/trips/stats?fromDate=2019-02-03&userId=`).replyOnce(200, tripStats)
  });
  afterEach(() => {
    cleanup();
    global.localStorage.clear();
    localStorage.store = {};
    mockAxios.reset();
  });
  it("User can view trips requestor page success", async () => {
		const { getByText, getByTestId, getByPlaceholderText } = render(
			<BrowserRouter>
				<TravelStatsView />
			</BrowserRouter>
    );
    
    const [ dateTravel, getStatsBtn ]= await waitForElement(
			() => [
        getByTestId("input-field"),
        getByTestId("submit-btn"),
      ]
    );
    fireEvent.change(dateTravel, {target: { value: '2019-02-03'}});
    fireEvent.click(getStatsBtn);

		const hotelsTitle = await waitForElement(
			() => getByText("Most visited hotels")
    );
    
    expect(hotelsTitle).toBeInTheDocument();
	});
})
