import React from 'react';
import { BrowserRouter as Router, } from 'react-router-dom';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import NotFound from '../../views/NotFound';

describe('404 page', () => {
	test('should render without error', () => {
		const { getByTestId } = render(<Router><NotFound /></Router>);
		expect(getByTestId('page-404')).toBeInTheDocument();
	});
});
