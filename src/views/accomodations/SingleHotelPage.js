import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Hotel from '../../components/accomodations/Hotel';
// eslint-disable-next-line max-len
import { getHotel } from '../../store/actions/accomodations/getAccomodationActions';
import Room from '../../components/accomodations/Room';
import Feedback from '../../components/Feedback';

// eslint-disable-next-line no-shadow
export const SingleHotelPage = props => {
	const { match, data } = props;
	useEffect(() => {
		props.getHotel(match.params.id);
	}, []);
	if (!data) {
		return <h4>Please Wait</h4>;
	}
	return (
		<div className='' data-testid='single-hotel'>
			<div className='container hotel-container'>
				<div className='card'>
					<div className='row-flex upper'>
						<div className='column'>
							<Hotel data={data} />
						</div>
						<div className='column-1 p-5 feed-box'>
							<Feedback hotelOwner={data.userId} hotelId={match.params.id} />
						</div>
					</div>
				</div>
				<div className='card my-2'>
					<div className='card-body'>
						<h2 className='text-dark'>Rooms</h2>
						<div className='ml-2 card-deck'>
							{data.rooms.map(room => {
								return <Room key={room.id} data={room} />;
							})}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export const mapStateToProps = state => ({
	loading: state.loadingState.buttonLoading,
	status: state.singleHotelState.status,
	data: state.singleHotelState.data,
	feedback: state.feedbackState.feedback,
});

SingleHotelPage.propTypes = {
	getHotel: PropTypes.func.isRequired,
	data: PropTypes.objectOf(PropTypes.any),
	match: PropTypes.objectOf(PropTypes.any).isRequired,
};

SingleHotelPage.defaultProps = {
	data: null,
};

export default connect(mapStateToProps, {
	getHotel,
})(SingleHotelPage);
