import React from "react";
import { ProtectedRoute } from "../../components/ProtectedRoute";
import { shallow } from "enzyme";
import localStorage from "../../helpers/localStorageMock";

const setUp = (props = {}) => shallow(<ProtectedRoute {...props} />);
describe("\"ProtectedRoute\"", () => {
  let wrapper;
  it("should render without error", function() {
    Object.defineProperty(document, 'cookie', {
      get: jest.fn().mockImplementation(() => {
        return "bn_auth_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InJlcXVlc3RlckB1c2VyLmNvbSIsIm5hbWUiOiJSZXF1ZXN0ZXIiLCJ1c2VySWQiOjIsInZlcmlmaWVkIjp0cnVlLCJyb2xlIjoicmVxdWVzdGVyIiwibGluZU1hbmFnZXJJZCI6MywiaWF0IjoxNTg4Mzk3MTQ0LCJleHAiOjE1ODg0ODM1NDR9.ihYz6A8-w5zEe1A0uOyiIzsAcuaq_0YiiJ3jx_M4dII"; 
      })
    });

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
    const props = {
      setAuthState: jest.fn(),
      logout: jest.fn(),
      Component: null,
      location: {
        pathname: "/profile",
      }
    };
    wrapper = setUp(props);
    const component = wrapper.find(`[data-test='protected-route']`);
    expect(component.length).toBe(1);
  });
});
