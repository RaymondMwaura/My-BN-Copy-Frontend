import React from 'react';
import propTypes from 'prop-types';
import StripeCheckout from 'react-stripe-checkout';
import toast from '../../../lib/toast';
import api from '../../../utils/api';

const CURRENCY = 'USD';
const fromUSDToCent = amount => amount * 100;
const successPayment = () => {
	toast('success', 'Payment Successful done');
};
const errorPayment = () => {
	toast('error', 'Payment Error');
};

const onToken = (amount, description, bookingIds, history) => token =>
	api
		.patch('/booking/payment', {
			description,
			source: token.id,
			currency: CURRENCY,
			amount: fromUSDToCent(amount),
			isPaid: true,
			paymentType: 'stripe',
			bookingIds,
		})
		.then(successPayment)
		.then(() => history.push('/booking'))
		.catch(errorPayment);
const Checkout = ({ name, description, amount, bookingIds, history }) => (
	<StripeCheckout
		name={name}
		description={description}
		amount={fromUSDToCent(amount)}
		token={onToken(amount, description, bookingIds, history)}
		currency={CURRENCY}
		stripeKey={process.env.STRIPE_PUBLISHABLE}
	/>
);

Checkout.propTypes = {
	name: propTypes.string.isRequired,
	description: propTypes.string.isRequired,
	amount: propTypes.any.isRequired,
	bookingIds: propTypes.array.isRequired,
	history: propTypes.object.isRequired,
};

export default Checkout;
