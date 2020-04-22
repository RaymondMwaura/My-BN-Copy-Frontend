import React from 'react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import roomPlaceholder from '../../assets/images/room-placeholder.png';
import Stripe from './booking/Stripe';
import Paypal from './booking/Paypal';
import toast from '../../lib/toast';
import api from '../../utils/api';

const handlePayLater = async (bookingIds, history) => {
	try {
		await api.patch('/booking/payment', {
			isPaid: false,
			paymentType: 'unpaid',
			bookingIds,
		});
		toast('info', 'Payment to be made later');
		history.push('/booking');
	} catch (err) {
		toast('error', 'Something went wrong');
	}
};

function BookingPayment({ data, history }) {
	return (
		<div>
			{data ? (
				<div className='d-flex justify-content-center mt-7'>
					<div className='card w-75'>
						<div className='card-header bg-white'>
							<h6 className='m-0 font-weight-bold text-primary'>
								Booked Rooms Payments
							</h6>
						</div>
						<div className='card-body'>
							<div className='container-fluid'>
								{data.bookings.map(
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
										<div className='col text-primary'>
											{`$ ${data.total.toFixed(2)}`}
										</div>
									</div>
									<hr />
								</>
								<>
									<div className='row align-items-center'>
										<div className='col m-5'>
											<Stripe
												name='Booking Payments'
												description='Booking payments'
												amount={data.total}
												bookingIds={data.bookingsId}
												history={history}
											/>
										</div>
										<div className='col m-5'>
											<Paypal
												amount={data.total}
												bookingIds={data.bookingsId}
												history={history}
											/>
										</div>
										<button
											type='button'
											onClick={() => handlePayLater(data.bookingsId, history)}
											className='btn btn-primary col m-5'
										>
											Pay later
										</button>
									</div>
									<hr />
								</>
							</div>
						</div>
					</div>
				</div>
			) : (
				<></>
			)}
		</div>
	);
}

export const mapStateToProps = state => ({
	data: state.bookingPaymentState.data,
});

BookingPayment.propTypes = {
	data: propTypes.instanceOf(Object),
	history: propTypes.instanceOf(Object).isRequired,
};

BookingPayment.defaultProps = {
	data: null,
};

export default connect(mapStateToProps, null)(BookingPayment);
