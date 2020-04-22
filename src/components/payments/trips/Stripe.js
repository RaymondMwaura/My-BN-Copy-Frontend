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

const onToken = (amount, description, requestId, nextStep) => token =>
	api
		.patch(`/booking/request/${requestId}`, {
			description,
			source: token.id,
			currency: CURRENCY,
			amount: fromUSDToCent(amount),
			isPaid: true,
			paymentType: 'stripe',
		})
		.then(successPayment)
		.then(() => nextStep())
		.catch(errorPayment);
const Checkout = ({ name, description, amount, requestId, nextStep }) => (
	<StripeCheckout
		label='Pay with 💳'
		name={name}
		description={description}
		amount={fromUSDToCent(amount)}
		token={onToken(amount, description, requestId, nextStep)}
		currency={CURRENCY}
		stripeKey={process.env.STRIPE_PUBLISHABLE}
	/>
);

Checkout.propTypes = {
	name: propTypes.string.isRequired,
	description: propTypes.string,
	amount: propTypes.any.isRequired,
	requestId: propTypes.any.isRequired,
	nextStep: propTypes.func.isRequired,
};

Checkout.defaultProps = {
	description: null,
};

export default Checkout;
