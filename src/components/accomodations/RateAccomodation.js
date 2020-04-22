/* eslint-disable max-len */
import React, { Component } from 'react';
import Rating from 'react-rating';
import { connect } from 'react-redux';
import propTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { rateHotel } from '../../store/actions/accomodations/rateAccomodationActions';
import LoadingButton from '../templates/Button';

export class RateAccomodation extends Component {
	constructor(props) {
		super(props);

		this.state = {
			currentRating: 1,
		};
	}

	componentDidUpdate(prevProps) {
		const { props } = this;
		if (prevProps.ratingOption.oldRating !== props.ratingOption.oldRating) {
			// eslint-disable-next-line react/no-did-update-set-state
			this.setState({ previousRating: props.ratingOption.oldRating.rating });
		}
	}

	handleChangeRating(value) {
		const { state } = this;
		if (state.previousRating !== undefined) {
			this.setState({
				previousRating: value,
			});
		} else {
			this.setState({
				currentRating: value,
			});
		}
	}

	handleSubmit(event) {
		event.preventDefault();
		const { props } = this;
		const { oldRating } = props.ratingOption;
		// eslint-disable-next-line react/prop-types
		const { id } = props.ratingOption;
		const { state } = this;
		let rating, endpoint;

		if (state.previousRating !== undefined) {
			rating = {
				rating: state.previousRating,
			};
			endpoint = `/rating/${oldRating.id}`;
		} else {
			rating = {
				rating: state.currentRating,
			};
			endpoint = `/hotels/${id}/rating`;
		}
		props.rateHotel(endpoint, rating, id);
		window.$('#rateAccomodationModal').modal('hide');
	}

	render() {
		const { state } = this;
		const { currentRating, previousRating } = state;
		const { props } = this;
		const { ratingOption } = props.ratingOption;
		const { loadingData } = props;
		const { buttonLoading } = loadingData;

		return (
			<div
				className='modal'
				tabIndex='-1'
				role='dialog'
				id='rateAccomodationModal'
			>
				<div className='modal-dialog modal-dialog-centered' role='document'>
					<div className='modal-content'>
						<form
							onSubmit={event => this.handleSubmit(event)}
							className='rateModalContent'
						>
							<div>
								<div className='d-flex justify-content-center rateModalHeading'>
									<h5 className='rateModalText'>
										{ratingOption === 'editRating'
											? 'Update your rating (1 - 5 stars)'
											: 'Add your rating (1 - 5 stars)'}
									</h5>
								</div>
							</div>
							<div className='modal-body d-flex justify-content-center rateModalBody'>
								<Rating
									start={0}
									stop={5}
									step={1}
									emptySymbol='fa fa-star-o fa-2x'
									fullSymbol='fa fa-star fa-2x'
									initialRating={
										previousRating === undefined
											? currentRating
											: previousRating
									}
									direction='ltr'
									onChange={value => this.handleChangeRating(value)}
								/>
							</div>
							<div className='modal-footer no-border-modal d-flex justify-content-center rateModalButtons'>
								<LoadingButton
									data-test='triggerSubmit'
									testId='submitInput'
									classNames='btn btn-success btn-round-login'
									value={
										ratingOption === 'editRating'
											? 'Update rating'
											: 'Post rating'
									}
									buttonLoading={buttonLoading}
								/>
								<span />
								<button
									type='button'
									className='btn btn-outline-danger btn-round-login'
									data-dismiss='modal'
								>
									Cancel
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		);
	}
}

RateAccomodation.propTypes = {
	rateHotel: propTypes.func,
	loadingData: propTypes.object,
	ratingOption: propTypes.object,
};

RateAccomodation.defaultProps = {
	rateHotel: null,
	loadingData: null,
	ratingOption: null,
};

export const mapStateToProps = state => ({
	loadingData: state.loadingState,
});

const mapDispatchToProps = {
	rateHotel,
};

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(withRouter(RateAccomodation));
