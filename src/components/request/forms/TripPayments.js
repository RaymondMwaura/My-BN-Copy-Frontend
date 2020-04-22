import React, { Component } from 'react';
import propTypes from 'prop-types';
import roomPlaceholder from '../../../assets/images/room-placeholder.png';
import { Stripe, Paypal } from '../../payments';
import toast from '../../../lib/toast';
import api from '../../../utils/api';

// eslint-disable-next-line react/prefer-stateless-function
export class TripPayments extends Component {
	async handlePayLater(requestId, nextStep) {
		try {
			await api.patch(`/booking/request/${requestId}`, {
				isPaid: false,
				paymentType: 'unpaid',
			});
			toast('info', 'Payment to be made later');
			nextStep();
		} catch (err) {
			toast('error', 'Something went wrong');
		}
	}

	render() {
		const { bookingsData, nextStep } = this.props;
		return (
			<div>
				<div className='card-header w-100 bg-white'>
					<h6 className='m-0 font-weight-bold text-primary'>
						Booked Rooms Payments
					</h6>
				</div>
				<div className='card-body'>
					<div className='container-fluid'>
						{bookingsData.bookings.map(
							({
								roomImage,
								id,
								hotelName,
								roomName,
								roomUnitCost,
								days,
								bookingAmount,
							}) => (
								<div key={id}>
									<div className='row align-items-center'>
										<img
											src={roomImage || roomPlaceholder}
											className='cart-image'
											alt='room'
										/>
										<div className='col text-dark'>
											<h5>{hotelName}</h5>
											<h6>{roomName}</h6>
										</div>
										<div className='col text-black-50'>
											{`${days} X ${roomUnitCost}/night`}
										</div>
										<div className='col text-primary'>
											{`$ ${bookingAmount}`}
										</div>
									</div>
									<hr />
								</div>
							),
						)}
						<>
							<div className='row align-items-center'>
								<div className='cart-image' />
								<div className='col text-black-50'>Total</div>
								<div className='col' />
								<div className='col text-primary' data-test='total'>
									{`$ ${bookingsData.total.toFixed(2)}`}
								</div>
							</div>
							<hr />
						</>
						{bookingsData.bookings.length === 0 ? (
							<div className='w-100'>
								<button
									test-data='next-btn'
									onClick={() => nextStep()}
									type='button'
									className='btn btn-primary float-right m-5'
								>
									Complete
								</button>
							</div>
						) : (
							<>
								<div className='row align-items-center'>
									<div className='col m-5'>
										<Stripe
											name='Booking Payments'
											Description='Booking payments'
											amount={Number(bookingsData.total)}
											requestId={bookingsData.requestId}
											nextStep={nextStep}
										/>
									</div>
									<div className='col m-5'>
										<Paypal
											amount={Number(bookingsData.total)}
											requestId={bookingsData.requestId}
											nextStep={nextStep}
										/>
									</div>
									<button
										test-data='next-btn'
										onClick={() =>
											this.handlePayLater(bookingsData.requestId, nextStep)
										}
										type='button'
										className='btn btn-primary col m-5'
									>
										Pay later
									</button>
								</div>
								<hr />
							</>
						)}
					</div>
				</div>
			</div>
		);
	}
}

TripPayments.propTypes = {
	bookingsData: propTypes.instanceOf(Object).isRequired,
	nextStep: propTypes.func.isRequired,
};

export default TripPayments;
