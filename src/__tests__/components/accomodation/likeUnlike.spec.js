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
import localStorage from '../../../__mocks__/LocalStorage';
import render from '../../../__mocks__/render';
import token from '../../../__mocks__/token';
import apiCall from '../../../utils/api';
import LikeUnlike from '../../../components/accomodations/LikeUnlike';

const mockAxios = new MockAdapter(apiCall);

let props, initialState;

describe('Like and unlike component', ()=> {
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
    initialState = {
      authState: {
        isAuthenticated: true
      }
    }
  });
  afterEach(() => {
    cleanup();
    global.localStorage.clear();
    localStorage.store = {};
    mockAxios.reset();
  });
  it("User can like ", async () => {
    props = {
      likesCount: '2',
      unLikesCount: '5',
      likes: [{userId: 2, liked: 1, unliked: 0}],
      id: 1,
      isAuth: true,
    }
    mockAxios
    .onPatch('/hotels/1/like').replyOnce(200, {})
    .onGet('/hotels').replyOnce(200, {})
    .onGet('/hotel/1').replyOnce(200, {})
		const { getByText, getByTestId } = render(
				<LikeUnlike {...props} />, initialState
    );
    
    const [ likeBtn ]= await waitForElement(
			() => [
        getByTestId("like-btn"),
      ]
    );
    fireEvent.click(likeBtn);

		const likesCount = await waitForElement(
			() => getByText("2")
    );
    
    expect(likesCount).toBeInTheDocument();
  });
  it("User can unlike ", async () => {
    props = {
      likesCount: '3',
      unLikesCount: '5',
      likes: [{userId: 2, liked: 0, unliked: 1}],
      id: 1,
      isAuth: true,
    }
    mockAxios
    .onPatch('/hotels/1/unlike').replyOnce(200, {})
    .onGet('/hotels').replyOnce(200, {message: 'successfull fetched', data: []})
    .onGet('/hotel/1').replyOnce(200, {message: 'successfull fetched', data: {}})
		const { getByText, getByTestId } = render(
				<LikeUnlike {...props} />, initialState
    );
    
    const [ unlikeBtn ]= await waitForElement(
			() => [
        getByTestId("unlike-btn")
      ]
    );
    fireEvent.click(unlikeBtn);

		const unlikesCount = await waitForElement(
			() => getByText("5")
    );
    
    expect(unlikesCount).toBeInTheDocument();
  });
  it("unauthiticated users cannot like ", async () => {
    global.localStorage.clear();
    props = {
      likesCount: '2',
      unLikesCount: '5',
      likes: [{userId: 2, liked: 1, unliked: 0}],
      id: 1,
      isAuth: false,
    }
    mockAxios
    .onPatch('/hotels/1/like').replyOnce(400, {})
    .onPatch('/hotels/1/unlike').replyOnce(400, {})
    .onGet('/hotels').replyOnce(200, {})
    .onGet('/hotel/1').replyOnce(200, {})
		const { getByText, getByTestId } = render(
				<LikeUnlike {...props} />, initialState
    );
    
    const [ likeBtn, unlikeBtn ]= await waitForElement(
			() => [
        getByTestId("like-btn"),
        getByTestId("unlike-btn")
      ]
    );
    fireEvent.click(likeBtn);
    fireEvent.click(unlikeBtn);

		const likesCount = await waitForElement(
			() => getByText("2")
    );
    
    expect(likesCount).toBeInTheDocument();
  });

  it("User can like ", async () => {
    props = {
      likesCount: '2',
      unLikesCount: '5',
      likes: [{userId: 2, liked: 1, unliked: 0}],
      id: 1,
      isAuth: false,
    }

		const { getByText, getByTestId } = render(
				<LikeUnlike {...props} />, initialState = {
          authState: {
            isAuthenticated: false
          }
        }
    );

    const [ likeBtn, unlikeBtn ]= await waitForElement(
			() => [
        getByTestId("like-btn"),
        getByTestId("unlike-btn")
      ]
    );
    fireEvent.click(likeBtn);
    fireEvent.click(unlikeBtn);

		const likesCount = await waitForElement(
			() => getByText("2")
    );
    
    expect(likesCount).toBeInTheDocument();
  });
})


