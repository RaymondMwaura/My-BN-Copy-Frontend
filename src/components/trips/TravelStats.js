import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { fetchTravelStats } from '../../store/actions/tripStatsActions';
import StatsCard from './StatsCard';
import SwiperHotel from './SwiperHotel';
import StatsFilter from './StatsFilter';
import LoadingPlaceholder from '../templates/LoadingPlaceholder';

// eslint-disable-next-line react/prefer-stateless-function
const TravelStats = props => {
	useEffect(() => {
		props.fetchTravelStats();
	}, []);
	const { loading, status } = props;

	if (!loading && status === 'success') {
		const {
			weekTravels,
			monthTravels,
			allTravels,
			yearTravels,
			mostVisitedHotels,
		} = props;
		return (
			<div className='card mb-2 border-light'>
				<div className='card-body'>
					<div className='d-flex flex-column'>
						<h1 className='text-center text-secondary mb-3'>
							Travel Statistics
						</h1>
						<div className='row mb-5'>
							<StatsCard
								color='primary'
								period='past week'
								travels={weekTravels}
							/>
							<StatsCard
								color='success'
								period='past month'
								travels={monthTravels}
							/>
							<StatsCard
								color='info'
								period='past year'
								travels={yearTravels}
							/>
							<StatsCard
								color='warning'
								period='all travels'
								travels={allTravels}
							/>
						</div>
						<div className='row'>
							<SwiperHotel hotels={mostVisitedHotels} />
							<StatsFilter />
						</div>
					</div>
				</div>
			</div>
		);
	}
	return (
		<div className='card mb-2 border-light'>
			<div className='card-body'>
				<LoadingPlaceholder />
			</div>
		</div>
	);
};

TravelStats.propTypes = {
	mostVisitedHotels: PropTypes.array,
	loading: PropTypes.bool,
	status: PropTypes.string,
	weekTravels: PropTypes.number,
	monthTravels: PropTypes.number,
	yearTravels: PropTypes.number,
	allTravels: PropTypes.number,
	fetchTravelStats: PropTypes.func.isRequired,
};

TravelStats.defaultProps = {
	mostVisitedHotels: [],
	loading: null,
	status: '',
	weekTravels: 0,
	monthTravels: 0,
	yearTravels: 0,
	allTravels: 0,
};

export const mapStateToProps = state => ({
	loading: state.loadingState.loading,
	status: state.tripStatState.status,
	weekTravels: state.tripStatState.weekTravels,
	monthTravels: state.tripStatState.monthTravels,
	yearTravels: state.tripStatState.yearTravels,
	allTravels: state.tripStatState.allTravels,
	mostVisitedHotels: state.tripStatState.mostVisitedHotels,
});

export default connect(mapStateToProps, { fetchTravelStats })(TravelStats);
