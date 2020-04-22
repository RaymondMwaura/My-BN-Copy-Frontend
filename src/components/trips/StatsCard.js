import React from 'react';
import PropTypes from 'prop-types';

const StatsIcon = ({ period }) => {
	if (period === 'past week') {
		return (
			<i
				className='fa fa-calendar-minus-o fa-2x text-secondary'
				aria-hidden='true'
			/>
		);
	}
	if (period === 'past month') {
		return (
			<i className='fa fa-calendar fa-2x text-secondary' aria-hidden='true' />
		);
	}
	if (period === 'past year') {
		return (
			<i
				className='fa fa-calendar-o  fa-2x text-secondary'
				aria-hidden='true'
			/>
		);
	}
	if (period === 'all travels') {
		return (
			<i className='fa fa-clock-o fa-2x text-secondary' aria-hidden='true' />
		);
	}
};

export const StatsCard = ({ color, period, travels }) => {
	return (
		<div className='col-xl-3 col-md-6 mb-4'>
			<div className={`card border-left-${color} shadow h-100 py-2`}>
				<div className='card-body'>
					<div className='row no-gutters align-items-center'>
						<div className='col mr-2'>
							<div
								className={`text-xs font-weight-bold text-${color} text-uppercase mb-1`}
							>
								{period}
							</div>
							<div className='h5 mb-0 font-weight-bold text-gray-800'>
								{travels}
								<small className='font-weight-light text-muted ml-1'>
									Travels
								</small>
							</div>
						</div>
						<div className='col-auto'>
							<StatsIcon period={period} />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

StatsCard.propTypes = {
	color: PropTypes.string.isRequired,
	period: PropTypes.string.isRequired,
	travels: PropTypes.number.isRequired,
};

StatsIcon.propTypes = {
	period: PropTypes.string.isRequired,
};

export default StatsCard;
