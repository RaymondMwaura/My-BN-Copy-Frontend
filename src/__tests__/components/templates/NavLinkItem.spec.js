import "@testing-library/jest-dom/extend-expect";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import render from "../../../__mocks__/render";
import Navbar from "../../../components/Navbar";
import { cleanup, fireEvent } from "@testing-library/react";
import {
  markAllAsRead,
  notificationView
} from "../../../lib/services/notificationService";
import { wait, waitForElement } from "@testing-library/dom";
import localStorage from "../../../__mocks__/LocalStorage";
import { getUserProfile, getUsers } from '../../../lib/services/user.service';

jest.mock("../../../lib/services/notificationService");
jest.mock("../../../lib/services/user.service");
jest.mock("socket.io-client");

const initialState = {
  notificationState: {
    data: {
      status: "success",
      message: "Notifications fetched successfully",
      data: [
        {
          id: 1,
          userId: 2,
          type: "new_request",
          messages: "New Travel Requested 1",
          isRead: false,
          requestId: 1,
          createdAt: "2020-01-23T11:36:42.470Z",
          updatedAt: "2020-01-29T11:55:17.937Z"
        },
        {
          id: 4,
          userId: 2,
          type: "new_request",
          messages: "New Travel Requested",
          isRead: false,
          requestId: 4,
          createdAt: "2020-01-23T11:36:51.720Z",
          updatedAt: "2020-01-29T11:55:17.937Z"
        },
        {
          id: 3,
          userId: 2,
          type: "new_comment",
          messages: "New Comment on Travel Requested",
          isRead: false,
          requestId: 3,
          createdAt: "2020-01-23T11:36:48.851Z",
          updatedAt: "2020-01-29T11:55:17.937Z"
        },
        {
          id: 5,
          userId: 2,
          type: "request_approved_or_rejected",
          messages: "Travel Requested approved",
          isRead: false,
          requestId: 5,
          createdAt: "2020-01-23T11:36:54.791Z",
          updatedAt: "2020-01-29T11:55:17.937Z"
        },
        {
          id: 2,
          userId: 2,
          type: "edited_request",
          messages: "Travel Request edited",
          isRead: false,
          requestId: 2,
          createdAt: "2020-01-23T11:36:46.765Z",
          updatedAt: "2020-01-29T11:55:17.937Z"
        }
      ]
    },
    error: null,
    status: "success"
  },
  navbarState: {
    navItems: [
      {
        linkText: "Home",
        linkRoute: "/home"
      },
      {
        linkText: "Request a trip",
        linkRoute: "/trip-request"
      },
      {
        linkText: "Requests",
        linkRoute: "/requests"
      },
      {
        linkText: "Booking",
        linkRoute: "/booking"
      }
    ],
  },
  authState: {
    isAuthenticated: true
  },
  updateNotificationState: {
    newNotification: null
  },
  profileState: {
    userProfile: {},
    managers: [],
  }
};

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
        id: 2,
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

notificationView.mockImplementation(() => Promise.resolve({
    data: {
      "status": "success",
      "message": "Notifications fetched successfully",
      "data": [
        {
          "id": 1,
          "userId": 2,
          "type": "new_request",
          "messages": "New Travel Requested",
          "isRead": false,
          "requestId": 1,
          "createdAt": "2020-01-23T11:36:42.470Z",
          "updatedAt": "2020-01-29T11:55:17.937Z"
        }]
    }
  }
));

markAllAsRead.mockImplementation(() => Promise.resolve({
  data: {
    "status": "success",
    "message": "All notifications marked as read"
  }
}));

beforeEach(() => {
  global.localStorage = localStorage;
  global.localStorage.setItem("bn_user_data", `{
			"email":"requestero@user.com",
			"name":"requester",
			"userId":2,
			"verified":true,
			"role":"requester",
			"lineManagerId":7,
			"iat":1578472431,
			"exp":1578558831
		}`);
});
afterEach(cleanup);


describe("NavLinkItem template component", () => {

  it("should display \"No unread notifications\" when no notification is present", () => {
    getUserProfile.mockImplementation(() => Promise.resolve(userProfile));
    getUsers.mockImplementation(() => Promise.resolve(managers));
    const { getByText } = render(
      <BrowserRouter>
        <Navbar/>
      </BrowserRouter>,
      { ...initialState, notificationState: { data: null } }
    );
    expect(getByText("No unread notifications")).toBeInTheDocument();
  });

  it("should display \"Mark all as read\" when there are some notifications", async () => {
    getUserProfile.mockImplementation(() => Promise.resolve(userProfile));
    getUsers.mockImplementation(() => Promise.resolve(managers));

    const { getByText } = render(
      <BrowserRouter>
        <Navbar/>
      </BrowserRouter>,
      initialState
    );

    const notificationHeader = await waitForElement(
      () => getByText("Mark all as read"));

    notificationView.mockImplementation(() => Promise.resolve({
        data: {
          "status": "success",
          "message": "Notifications fetched successfully",
          "data": [
            {
              "id": 1,
              "userId": 2,
              "type": "new_request",
              "messages": "New Travel Requested",
              "isRead": true,
              "requestId": 1,
              "createdAt": "2020-01-23T11:36:42.470Z",
              "updatedAt": "2020-01-29T11:55:17.937Z"
            }]
        }
      }
    ));
    fireEvent.click(notificationHeader);

    await wait(() => {
      expect(getByText("No unread notifications")).toBeInTheDocument();
    });
  });

  it("should display \"Mark all as read\" when one notification was read and others are still there", () => {
    getUserProfile.mockImplementation(() => Promise.resolve(userProfile));
    getUsers.mockImplementation(() => Promise.resolve(managers));
    const { getByText } = render(
      <BrowserRouter>
        <Navbar/>
      </BrowserRouter>,
      initialState
    );

    const notificationItem = getByText("New Travel Requested 1");
    fireEvent.click(notificationItem);
    expect(getByText("Mark all as read")).toBeInTheDocument();
  });
});
