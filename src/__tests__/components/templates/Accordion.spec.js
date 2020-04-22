import React from 'react';
import { shallow } from 'enzyme';
import Accordion from '../../../components/templates/Accordion';

describe('<Accordion />  tests', () => {
	test('should render <Accordion /> without errors', () => {
		const props = {
			children: <h1>hello world</h1>,
		};
        const wrapper = shallow(<Accordion {...props} />);
        wrapper.find('[data-test="toggle-accordion"]').simulate('click');
        expect(wrapper.find("h1")).toHaveLength(1);
	});
});
