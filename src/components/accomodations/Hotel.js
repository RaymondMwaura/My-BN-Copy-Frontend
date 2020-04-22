/* eslint-disable max-len */
import React, { useState, useEffect } from 'react';
import StarRatings from 'react-star-ratings';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import hotelPlaceholder from '../../assets/images/hotel-placeholder.png';
import checkRole from '../../utils/checkRole';
import LikeUnlike from './LikeUnlike';
import RateAccomodation from './RateAccomodation';
import { getRatingData } from '../../store/actions/accomodations/rateAccomodationActions';

export default function Hotel({ data }) {
	const [role, setRole] = useState(null);
	const dispatch = useDispatch();

	const bookingData = useSelector(
		state => state.rateAccomodationState.bookingData,
	);
	const ratingData = useSelector(
		state => state.rateAccomodationState.ratingData,
	);
	useEffect(() => {
		const Role = checkRole('suppliers') || checkRole('travel_administrator');
		setRole(Role);
		const { userId } = JSON.parse(localStorage.bn_user_data);

		const fetchData = async () => {
			await dispatch(getRatingData(userId));
		};

		if (bookingData === null || ratingData === null) {
			fetchData();
		}
	}, []);
	const {
		image,
		id,
		name,
		// eslint-disable-next-line camelcase
		average_rating,
		description,
		likesCount,
		unLikesCount,
		likes,
		location,
		street,
	} = data;

	let hasBookedHotelRoom = false;
	let ratingOption = 'addNewRating';
	let foundRatingForThisHotel;
	let oldRating = [];

	if (bookingData !== null) {
		const checkBooked = bookingData.find(({ hotelId }) => hotelId === id);
		if (checkBooked !== undefined) {
			hasBookedHotelRoom = true;
		}
	}

	if (ratingData !== null) {
		foundRatingForThisHotel = ratingData.find(({ hotelId }) => hotelId === id);
		if (foundRatingForThisHotel !== undefined) {
			oldRating = foundRatingForThisHotel;
			ratingOption = 'editRating';
		}
	}

	const isAuthenticated = JSON.parse(localStorage.bn_user_data).verified;

	return (
		<div className='card hotel' data-testid='card-hotel'>
			<div className='embed-responsive embed-responsive-21by9'>
				<img
					className='card-img-top img-fluid embed-responsive-item'
					src={image || hotelPlaceholder}
					alt='hotel'
				/>
			</div>
			<div className='card-body'>
				<div className='d-flex justify-content-between singleHotelMobile'>
					<div>
						<h5 className='card-title mr-3'>{name}</h5>
					</div>
					<span />
					<div>
						<div className='d-flex flex-sm-row ratingTextDiv'>
							<p>Avg. rating</p>
							<StarRatings
								rating={Number(average_rating)}
								starRatedColor='black'
								numberOfStars={5}
								starDimension='1.2rem'
								starSpacing='.15rem'
								name='rating'
								className='float-right'
							/>
						</div>

						<div className='d-flex flex-sm-row ratingTextDiv'>
							<p>Your rating</p>
							{foundRatingForThisHotel !== undefined ? (
								<StarRatings
									rating={Number(foundRatingForThisHotel.rating)}
									starRatedColor='black'
									numberOfStars={5}
									starDimension='1.2rem'
									starSpacing='.15rem'
									name='rating'
									className='float-right'
								/>
							) : (
								'Not yet rated'
							)}
						</div>
					</div>
				</div>
				<p className='card-text mb-1'>{description}</p>
				<p className='card-text text-secondary mb-1'>
					{`  ${street} ${location.city}, ${location.country}`}
				</p>

				<div className='d-flex justify-content-between singleRatingMobile'>
					<div>
						<LikeUnlike
							id={id}
							likesCount={likesCount}
							unLikesCount={unLikesCount}
							likes={likes}
						/>
					</div>
					<span />
					<div className='buttonRateBlock'>
						{role ? (
							<Link
								to={`/hotel/${id}/room/create`}
								className='btn btn-primary btn-sm text-white brb1'
							>
								Add rooms
							</Link>
						) : (
							<div>
								<Link
									to={`/booking/${id}`}
									className='btn btn-primary book-now btn-sm text-white brb2'
								>
									Book Now
								</Link>
								{hasBookedHotelRoom === true && isAuthenticated === true ? (
									<button
										type='button'
										className='btn btn-primary hideForBooking btn-sm text-white float-right ml-2'
										data-toggle='modal'
										data-target='#rateAccomodationModal'
									>
										{ratingOption && ratingOption === 'addNewRating'
											? 'Add Rating'
											: 'Update Rating'}
									</button>
								) : null}
								<RateAccomodation
									ratingOption={{ ratingOption, oldRating, id }}
								/>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

Hotel.propTypes = {
	data: PropTypes.objectOf(PropTypes.any),
};

Hotel.defaultProps = {
	data: null,
};
