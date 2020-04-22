import React from "react";
import { useDispatch } from 'react-redux'; 
import {
	cleanup,
	fireEvent,
	render as reactRender,
	waitForElement
} from "@testing-library/react";
import socketClient from 'socket.io-client';
import Mockio, { serverSocket, cleanUp, socket } from '../../__mocks__/socketMock';
import "@testing-library/jest-dom";
import "@testing-library/jest-dom/extend-expect";
import localStorage from "../../__mocks__/LocalStorage";
import render from '../../__mocks__/render';
import Cookies from "universal-cookie";
import ChatView from "../../views/ChatView";

global.localStorage = localStorage;

jest.mock("socket.io-client")

socketClient.mockImplementation(
  () => socket
);

jest.mock("universal-cookie");
Cookies.mockImplementation(
	() => ({ get: () => "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImdpbGRuaXkwNUBnbWFpbC5jb20iLCJuYW1lIjoiR2lsZGFzIiwidXNlcklkIjoxLCJ2ZXJpZmllZCI6dHJ1ZSwicm9sZSI6InJlcXVlc3RlciIsImxpbmVNYW5hZ2VySWQiOm51bGwsImlhdCI6MTU3ODU3MTM0OSwiZXhwIjoxNTc4NjU3NzQ5fQ.SmBRYQ-zYgEl08jObfqrtFjrJTCU33-DsMGCRC2RZuc" }));



describe("User should be be able to view and edit profile", () => {
  global.$ = jest.fn((cb) => ({
    scrollTop: jest.fn(),
    0: jest.fn(cb =>({
      scrollHeight: '23'
    })),
  }));
	let Component;
	const initialState = {
    authState: {
      isAuthenticated: true,
    }
  };

	beforeEach(() => {
		Component = (
			<ChatView isAuth={true} />
		);

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

	afterEach(() => {
    cleanup();
    cleanUp();
		global.localStorage.clear();
		localStorage.store = {};
	});

	test("User be able to chat", async () => {
    socket.on('get_messages', jest.fn());
    const { getByText, getByTestId } = render(Component, initialState);
    serverSocket.emit('getting', {messages: [
      {id: 1, userId:2, message: 'message number', createdAt: '2020-01-25T04:43:29.176Z', user: {firstName: 'bon'}},
      {id: 2, userId:1, message: 'message', createdAt: '2020-01-25T04:43:29.176Z', user: {firstName: 'bon'}}
    ]})
    serverSocket.emit('new_message', {
      id: 3,
      userId: 2,
      message: 'message',
      timestamp: '2020-01-25T04:43:29.176Z',
      username: 'Bonvic',
    });
    serverSocket.emit('authentication_error', 'please login again');
    serverSocket.emit('new_comment', {messages: 'new comment here'});
    serverSocket.emit('new_request', {messages: 'new request here'});
    serverSocket.emit('request_approved_or_rejected', {messages: 'your request was approved'});
    serverSocket.emit('edited_request', {messages: 'your request was edited'});

    const [ textArea, toggleChatBox, sendBtn ]= await waitForElement(
			() => [
        getByTestId("txtMessage"),
        getByTestId("toggle-chat-box"),
        getByTestId("sendMessage")
      ]
    );
    fireEvent.click(toggleChatBox);
    fireEvent.change(textArea, {target: { value: 'hello world!'}});
    fireEvent.click(sendBtn)
    fireEvent.change(textArea, {target: { value: ''}});
    fireEvent.click(sendBtn)

		expect(getByText('message number')).toBeInTheDocument();
	});

});

