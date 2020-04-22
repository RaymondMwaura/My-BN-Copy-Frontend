import React, { Component } from 'react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import LoadingButton from './templates/Button';
import { formatToTime } from '../lib/time';
import { getFeedback, postFeedback } from '../store/actions/feedbackActions';

class Feedback extends Component {
	constructor(props) {
		super(props);
		this.state = {
			feedback: '',
		};
	}

	componentDidMount() {
		const { props } = this;
		props.getFeedback(props.hotelId);
	}

	componentDidUpdate() {
		const el = window.$('.feed-box');
		const height = el[0].scrollHeight;
		el.scrollTop(height);
	}

	handleFieldChange(event) {
		const { value } = event.target;
		this.setState({
			feedback: value,
		});
	}

	handleSubmit(event) {
		event.preventDefault();
		const { feedback } = this.state;
		const { props } = this;
		props.postFeedback(props.hotelId, feedback);
		this.setState({
			feedback: '',
		});
	}

	render() {
		const { feedback } = this.state;
		const { props } = this;
		const { loading } = props;

		const isTheOwner =
			JSON.parse(localStorage.bn_user_data).userId === props.hotelOwner;
		return (
			<div className='feedbackContainer'>
				<h3 className='mb-4 text-primary'>Feedback</h3>
				<ul className='list-unstyled'>
					{props.feedback
						.map(feed => (
						<li className='media mb-4' key={feed.id}>
							<div className='mr-3'>
								<div className='icon-feedback'>NZ</div>
							</div>
							<div className='media-body'>
								<div className='name text-primary'>
									<strong className=' text-capitalize d-block'>
										{`${feed.firstName} ${feed.lastName}`}
									</strong>
									<span className='text-muted'>
										{formatToTime(feed.createdAt)}
									</span>
								</div>
								<span className=''>{feed.feedback}</span>
							</div>
						</li>
					))}
				</ul>
				<div>
					{!isTheOwner && (
						<form onSubmit={e => this.handleSubmit(e)}>
							<div className='form-group'>
								{/* <label htmlFor=''>Example textarea</label> */}
								<textarea
									className='form-control'
									rows='3'
									value={feedback}
									onChange={event => this.handleFieldChange(event)}
									placeholder='Type your feedback here'
								/>
								<LoadingButton
									testId='btn-share-feedback'
									value='Share Feedback'
									buttonLoading={loading}
									classNames='btn btn-primary btn-block mt-2'
								/>
							</div>
						</form>
					)}
				</div>
			</div>
		);
	}
}

export const mapStateToProps = state => ({
	loading: state.loadingState.buttonLoading,
	feedback: state.feedbackState.feedback,
});

Feedback.propTypes = {
	loading: propTypes.bool,
	feedback: propTypes.instanceOf(Object),
	getFeedback: propTypes.func.isRequired,
	postFeedback: propTypes.func.isRequired,
	hotelOwner: propTypes.number,
	hotelId: propTypes.oneOfType([propTypes.string, propTypes.number]),
};

Feedback.defaultProps = {
	loading: null,
	feedback: null,
	hotelOwner: null,
	hotelId: null,
};

export default connect(mapStateToProps, {
	getFeedback,
	postFeedback,
})(Feedback);
