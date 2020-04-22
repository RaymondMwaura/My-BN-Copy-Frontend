import React from 'react';
import propTypes from 'prop-types';
import { PayPalButton } from 'react-paypal-button-v2';
import toast from '../../../lib/toast';
import api from '../../../utils/api';

const success = () => {
	toast('success', 'Payment Successfully done');
};
const error = () => {
	toast('error', 'Payment Error');
};

const options = {
	clientId:
		process.env.NODE_ENV === 'production'
			? process.env.PAYPAL_CLIENT_PROD
			: process.env.PAYPAL_CLIENT_DEV,
	currency: 'USD',
	locale: 'en_US',
	disableFunding: 'card',
};

const Paypal = ({ amount, requestId, nextStep }) => {
	const onSuccess = () => {
		api
			.patch(`/booking/request/${requestId}`, {
				isPaid: true,
				paymentType: 'paypal',
			})
			.then(success)
			.then(() => nextStep())
			.catch(error);
	};
	const onCancel = () => {
		toast('info', 'The payment was cancelled!');
	};
	const onError = () => {
		toast('error', 'Something went wrong while doing the trasaction');
	};

	const style = {
		label: 'pay',
		tagline: false,
		size: 'medium',
		shape: 'rect',
		color: 'gold',
	};
	return (
		<PayPalButton
			amount={amount}
			options={options}
			style={style}
			onError={onError}
			onSuccess={onSuccess}
			onCancel={onCancel}
		/>
	);
};

Paypal.propTypes = {
	amount: propTypes.any.isRequired,
	requestId: propTypes.any.isRequired,
	nextStep: propTypes.func.isRequired,
};

export default Paypal;
