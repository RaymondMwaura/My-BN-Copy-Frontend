import React from 'react';
import { shallow } from 'enzyme';
import MockAdapter from 'axios-mock-adapter';
import TripPayments from '../../../../components/request/forms/TripPayments';
import api from '../../../../utils/api';

const mockAxios = new MockAdapter(api);
describe('<TripPayments />  tests', () => {
  afterEach(() => {
    mockAxios.reset();
  });
	test('should render <TripPayments /> without errors', () => {
		const props = {
			bookingsData: {
        total: 40,
        requestId: 85,
        bookings: [
          {
            id: 123,
            roomImage: "https://boondocks-bn-images.s3.us-east-2.amazonaws.com/rooms/1582002142932-film-placeholder.jpg",
            hotelName: "Hotel",
            roomName: "rm1",
            roomUnitCost: 10,
            bookingAmount: "20.00",
            days: 2,
          },
          {
            id: 122,
            roomImage: "",
            hotelName: "Hotel",
            roomName: "room 1",
            roomUnitCost: 10,
            bookingAmount: "20.00",
            days: 2,
          }
        ]
      },
      nextStep: jest.fn()
    };
    mockAxios
    .onPatch('/booking/request/85').replyOnce(400)
        const wrapper = shallow(<TripPayments {...props} />);
        wrapper.find('[test-data="next-btn"]').simulate('click');
        expect(wrapper.find('[data-test="total"]').text()).toHaveLength(7);
  });
  test('should render <TripPayments /> without errors', () => {
		const props = {
			bookingsData: {
        total: 40,
        requestId: 85,
        bookings: [
          {
            id: 123,
            roomImage: "https://boondocks-bn-images.s3.us-east-2.amazonaws.com/rooms/1582002142932-film-placeholder.jpg",
            hotelName: "Hotel",
            roomName: "rm1",
            roomUnitCost: 10,
            bookingAmount: "20.00",
            days: 2,
          },
          {
            id: 122,
            roomImage: "",
            hotelName: "Hotel",
            roomName: "room 1",
            roomUnitCost: 10,
            bookingAmount: "20.00",
            days: 2,
          }
        ]
      },
      nextStep: jest.fn()
    };
    mockAxios
    .onPatch('/booking/request/85').replyOnce(200)
        const wrapper = shallow(<TripPayments {...props} />);
        wrapper.find('[test-data="next-btn"]').simulate('click');
        expect(wrapper.find('[data-test="total"]').text()).toHaveLength(7);
  });
  test('should render <TripPayments /> without errors', () => {
		const props = {
			bookingsData: {
        total: 0,
        requestId: 85,
        bookings: []
      },
      nextStep: jest.fn()
    };
        const wrapper = shallow(<TripPayments {...props} />);
        wrapper.find('[test-data="next-btn"]').simulate('click');
        expect(wrapper.find('[data-test="total"]').text()).toHaveLength(6);
	});
});
