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
import localStorage from '../../__mocks__/LocalStorage';
import render from '../../__mocks__/render';
import token from '../../__mocks__/token';
import { BrowserRouter } from 'react-router-dom';
import moment from 'moment';
import { createMemoryHistory } from 'history';
import Feedback from '../../components/Feedback';
import { getByTestId, wait } from '@testing-library/dom';
import {
	fetchFeedback,
	sendFeedback,
} from '../../lib/services/feedbackService';

global.localStorage = localStorage;
global.$ = jest.fn((cb) => ({
  scrollTop: jest.fn(),
  0: jest.fn(cb =>({
    scrollHeight: '23'
  })),
}));
jest.mock('universal-cookie');
jest.mock('../../lib/services/feedbackService');

Cookies.mockImplementation(() => ({ get: () => token }));

beforeEach(() => {

});

afterEach(() => {
	cleanup();
	global.localStorage.clear();
	localStorage.store = {};

});

const feedback = {
	data: {
		status: 'success',
		message: 'Feedback retrieved successfully',
		data: [
			{
				firstName: 'John',
				lastName: 'Doe',
				feedback: 'Your facilities were awesome, Great work!',
				id: 26,
				createdAt: '2020-01-31T08:33:19.561Z',
			},
			{
				firstName: 'John1',
				lastName: 'Doe1',
				feedback: 'I had Amazing Experience, Great work!',
				id: 25,
				createdAt: '2020-01-31T08:31:03.884Z',
			}
		],
	}
};
fetchFeedback.mockImplementation(() => Promise.resolve(feedback));
describe('Feedback component', () => {
	let props;
	test("Hotel owner can view feedback", async () => {
		sendFeedback.mockImplementation(() => Promise.resolve({ data: { message: 'success'}}));
		global.localStorage.setItem("bn_user_data", `{
			"email":"requestero@user.com",
			"name":"Requester",
			"userId":2,
			"verified":true,
			"role":"travel_administrator",
			"lineManagerId":7,
			"iat":1578472431,
			"exp":1578558831
		}`);

		props = {
			hotelOwner: 2,
			hotelId: 2,
		}
		const { getByText, getByTestId } = render(
			<BrowserRouter>
				<Feedback {...props}/>
			</BrowserRouter>
		);

		await wait(() => {
			expect(getByText('John Doe')).toBeInTheDocument();
		})
	});

	test("Requester can view and share feedback", async () => {
		sendFeedback.mockImplementation(() => Promise.resolve({ data: { message: 'success'}}));
		global.localStorage.setItem("bn_user_data", `{
			"email":"requestero@user.com",
			"name":"Requester",
			"userId":3,
			"verified":true,
			"role":"requester",
			"lineManagerId":7,
			"iat":1578472431,
			"exp":1578558831
		}`);

		props = {
			hotelOwner: 2,
			hotelId: 2,
		}
		const { getByText, getByTestId, getByPlaceholderText } = render(
			<BrowserRouter>
				<Feedback {...props}/>
			</BrowserRouter>
		);

		await wait(() => {
			expect(getByText('John Doe')).toBeInTheDocument();
		})

		const [shareBtn, txtFeedback] = await waitForElement(() => [
			getByTestId('btn-share-feedback'),
			getByPlaceholderText('Type your feedback here'),
		]);

		fireEvent.change(txtFeedback, {target: { value: 'Feedback posted!'}})
		fireEvent.click(shareBtn);
	});

	test("Requester can not see success message in case of fetch error", async () => {
		sendFeedback.mockImplementation(() => Promise.resolve(undefined));
		global.localStorage.setItem("bn_user_data", `{
			"email":"requestero@user.com",
			"name":"Requester",
			"userId":3,
			"verified":true,
			"role":"requester",
			"lineManagerId":7,
			"iat":1578472431,
			"exp":1578558831
		}`);

		props = {
			hotelOwner: 2,
			hotelId: 2,
		}
		const { getByText, getByTestId, getByPlaceholderText } = render(
			<BrowserRouter>
				<Feedback {...props}/>
			</BrowserRouter>
		);

		const [shareBtn, txtFeedback] = await waitForElement(() => [
			getByTestId('btn-share-feedback'),
			getByPlaceholderText('Type your feedback here'),
		]);

		fireEvent.change(txtFeedback, {target: { value: 'Feedback posted!'}})
		fireEvent.click(shareBtn);
	});

});
