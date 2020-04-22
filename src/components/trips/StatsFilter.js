import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
	fetchManagerUsers,
	getTripstats,
} from '../../store/actions/tripStatsActions';
import SelectInput from '../templates/SelectInput';
import InputForm from '../templates/InputForm';
import { formatdate } from '../../lib/time';
import LoadingButton from '../templates/Button';
import checkRole from '../../utils/checkRole';

export class StatsFilter extends Component {
	constructor(props) {
		super(props);
		this.state = {
			fromDate: '',
			userId: '',
		};
	}

	componentDidMount() {
		const { props } = this;
		if (checkRole('manager')) {
			props.fetchManagerUsers();
		}
	}

	handleChange(event) {
		const { name, value } = event.target;
		this.setState({
			[name]: value,
		});
	}

	handleSubmit(event) {
		const { fromDate, userId } = this.state;
		const { props } = this;
		event.preventDefault();
		if (event.target.checkValidity()) {
			props.getTripstats(fromDate, userId);
		}
	}

	render() {
		const { users, stats } = this.props;
		const { fromDate, userId } = this.state;
		const isManager = checkRole('manager');
		const userOption =
			users &&
			users.map(user => ({
				id: user.id,
				name: `${user.firstName} ${user.lastName}`,
				value: user.id,
			}));
		return (
			<aside className='col-xl-4 col-lg-5'>
				<div className='card shadow w-100'>
					<div className='card-header py-3 d-flex flex-row align-items-center justify-content-between'>
						<h6 className='m-0 font-weight-bold text-primary'>
							Travels made From X Time
						</h6>
					</div>
					<div className='card-body'>
						<form
							data-testid='form'
							onSubmit={event => this.handleSubmit(event)}
						>
							{isManager && (
								<SelectInput
									name='userId'
									onChange={event => this.handleChange(event)}
									value={userId}
									option={userOption}
									placeholder='User'
									classNames='form-control form-control-sm'
								/>
							)}
							<InputForm
								name='fromDate'
								type='date'
								value={fromDate}
								onChange={event => this.handleChange(event)}
								max={formatdate(0)}
								classNames='form-control form-control-sm'
							/>
							<LoadingButton
								testId='submit-btn'
								value='Get travels'
								classNames='btn btn-primary'
							/>
						</form>
						<div className='text-center'>
							<h1 className='p-2'>{stats}</h1>
						</div>
					</div>
				</div>
			</aside>
		);
	}
}

StatsFilter.propTypes = {
	users: PropTypes.array.isRequired,
	stats: PropTypes.number.isRequired,
	fetchManagerUsers: PropTypes.func.isRequired,
	getTripstats: PropTypes.func.isRequired,
};

export const mapStateToProps = state => ({
	users: state.tripStatState.managerUsers,
	stats: state.tripStatState.travels,
});

export default connect(mapStateToProps, { fetchManagerUsers, getTripstats })(
	StatsFilter,
);
