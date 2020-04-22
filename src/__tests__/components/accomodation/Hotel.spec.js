import React from 'react';
import { BrowserRouter } from "react-router-dom";
import '@testing-library/jest-dom/extend-expect';
import { render as reactRender } from "@testing-library/react";
import Hotel from '../../../components/accomodations/Hotel';
import localStorage from '../../../__mocks__/LocalStorage';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from "redux";
import reducers from "../../../store/reducers";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";

const render = (ui, initialState = {}, options = {}) => {
	const store = createStore(reducers, initialState,
		composeWithDevTools(applyMiddleware(thunk)));
	const Providers = ({ children }) => (
		<Provider store={store}>{children}</Provider>
	);
	return reactRender(ui, { wrapper: Providers, ...options });
};

jest.mock('../../../components/accomodations/LikeUnlike', () => {
  const ComponentToMock = () => <div />;
  return ComponentToMock;
})

describe('<Hotel /> Test suite', () => {
  let props;
  beforeEach(() => {

    global.localStorage = localStorage;
    global.localStorage.setItem('bn_user_data', `{
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
      data: {
        name: 'hotel',
        average_rating: '1',
        description: 'new hotel here',
        likesCount: '1',
        unLikesCount: '2',
        location: {
          country: 'Kenya',
          city: 'Nairobi'
        },
        street: 'upperhill, 23rd av',
      }
    }
  })

  it('Should render without errors', () => {
    const { getByTestId } = render(
      <BrowserRouter><Hotel {...props} /></BrowserRouter>
  );

  expect(getByTestId('card-hotel')).toBeInTheDocument();
  });

});
