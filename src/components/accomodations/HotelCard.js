import React from 'react';
import StarRatings from 'react-star-ratings';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import moment from 'moment';
import hotelPlaceholder from '../../assets/images/hotel-placeholder.png';
import LikeUnlike from './LikeUnlike';

function HotelCard({ data }) {
	const {
		image,
		name,
		// eslint-disable-next-line camelcase
		average_rating,
		description,
		id,
		likesCount,
		unLikesCount,
		likes,
		location,
		createdAt,
	} = data;
	return (
		<div className='card hotel' data-testid='hotels'>
			<div>
				<Link to={`/hotel/${id}`}>
					<div className='embed-responsive embed-responsive-16by9'>
						<img
							className='card-img-top img-fluid embed-responsive-item'
							src={image || hotelPlaceholder}
							alt='hotel'
						/>
					</div>
					<div className='card-body'>
						<div className='d-flex flex-column'>
							<h6 className='card-title mr-3 text-dark'>{name}</h6>
							<StarRatings
								rating={Number(average_rating)}
								starRatedColor='black'
								numberOfStars={5}
								starDimension='1rem'
								starSpacing='.1rem'
								name='rating'
							/>
						</div>
						<p className='card-text text-secondary mt-3'>{description}</p>
					</div>
				</Link>
				<div className='d-inline p-3'>
					<Link
						to={`/booking/${id}`}
						className='btn btn-primary text-white mr-2'
					>
						Book Now
					</Link>
					<div className='float-right'>
						<LikeUnlike
							id={id}
							likesCount={likesCount}
							unLikesCount={unLikesCount}
							likes={likes}
						/>
					</div>
				</div>
				<div className='card-footer bg-white mt-2 text-muted'>
					Location:
					{` ${location.country}, ${location.city}.`}
				</div>
				{moment(createdAt)
					.add(7, 'days')
					.isAfter(moment()) && <div className='ribbon3'>NEW</div>}
			</div>
		</div>
	);
}

HotelCard.propTypes = {
	data: PropTypes.objectOf(PropTypes.any),
};

HotelCard.defaultProps = {
	data: null,
};

export default HotelCard;
