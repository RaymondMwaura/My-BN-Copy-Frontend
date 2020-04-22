import React from 'react';
import { shallow } from 'enzyme';
import {Success} from '../../../../components/request/forms/Success';

describe('<Accordion />  tests', () => {
	test('should render <Success /> without errors', () => {
		const props = {
			history: {
        push: jest.fn(),
      }
		};
        const wrapper = shallow(<Success {...props} />);
        wrapper.find('[data-test="btn-complete"]').simulate('click');
        expect(wrapper.find("h1")).toHaveLength(1);
	});
});
