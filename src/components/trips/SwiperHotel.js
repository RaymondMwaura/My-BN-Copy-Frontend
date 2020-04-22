import React from 'react';
import Swiper from 'react-id-swiper';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import hotelPlaceholder from '../../assets/images/hotel-placeholder.jpeg';

const params = {
	breakpoints: {
		320: {
			slidesPerView: 1,
			spaceBetween: 10,
		},
		480: {
			slidesPerView: 2,
			spaceBetween: 20,
		},
		1000: {
			slidesPerView: 3,
			spaceBetween: 30,
		},
	},
	loop: true,
	shouldSwiperUpdate: true,
	pagination: {
		el: '.swiper-pagination',
		type: 'bullets',
		clickable: true,
	},
	navigation: {
		nextEl: '.swiper-button-next',
		prevEl: '.swiper-button-prev',
	},
	spaceBetween: 30,
};

const SwiperHotel = ({ hotels }) => {
	return (
		<div className='col-xl-8 col-lg-7'>
			<div className='card shadow mb-4'>
				<div className='card-header py-3 d-flex flex-row align-items-center justify-content-between'>
					<h6 className='m-0 font-weight-bold text-primary'>
						Most visited hotels
					</h6>
				</div>
				<div className='card-body'>
					<Swiper {...params}>
						{hotels
							.sort((a, b) => b.count - a.count)
							.slice(0, 10)
							.map(({ count, hotel }) => (
								<div key={hotel.id} className='container-hotel'>
									<img
										src={hotel.image || hotelPlaceholder}
										alt='Avatar'
										className='image swiper-card'
									/>
									<div className='overlay'>
										<div className='content'>
											<Link to={`/hotel/${hotel.id}`}>
												<h6 className='text-light'>{hotel.name}</h6>
											</Link>
											<small>
												{`${count} `}
												{`visit${count > 1 ? 's' : ''}`}
											</small>
										</div>
									</div>
								</div>
							))}
						{/* < */}
					</Swiper>
				</div>
			</div>
		</div>
	);
};

SwiperHotel.propTypes = {
	hotels: PropTypes.array.isRequired,
};

export default SwiperHotel;
