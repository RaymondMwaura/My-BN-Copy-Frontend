import React, { Component } from 'react';
import cx from 'classnames/dedupe';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
	updateLike,
	updateUnlike,
} from '../../store/actions/accomodations/likeUnlike';

// eslint-disable-next-line react/prefer-stateless-function
export class LikeUnlike extends Component {
	handleUpdateLike(id) {
		const { props } = this;
		if (props.isAuth) {
			props.updateLike(id);
		}
	}

	handleUpdateUnlike(id) {
		const { props } = this;
		if (props.isAuth) {
			props.updateUnlike(id);
		}
	}

	render() {
		const userId =
			localStorage.bn_user_data && JSON.parse(localStorage.bn_user_data).userId;
		const checkLike = like => like.userId === userId && like.liked === 1;
		const checkUnlike = like => like.userId === userId && like.unliked === 1;
		const { likesCount, unLikesCount, likes, id, isAuth } = this.props;
		const isLike = likes.some(checkLike);
		const isUnlike = likes.some(checkUnlike);
		return (
			<div>
				<div className='d-inline-block'>
					<i
						className={cx(`fa fa-thumbs-up like like-btn grow`, {
							'active-rate': isLike,
							'like-btn': isAuth,
							grow: isAuth,
						})}
						data-testid='like-btn'
						onClick={() => this.handleUpdateLike(id)}
						aria-hidden='true'
					/>
					<span className='text-like text-dark'>{likesCount}</span>
				</div>
				<div className='d-inline-block'>
					<i
						className={cx(`fa fa-thumbs-down like like-btn grow`, {
							'active-rate': isUnlike,
							'like-btn': isAuth,
							grow: isAuth,
						})}
						data-testid='unlike-btn'
						onClick={() => this.handleUpdateUnlike(id)}
						aria-hidden='true'
					/>

					<span className='text-like text-dark'>{unLikesCount}</span>
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	isAuth: state.authState.isAuthenticated,
});

LikeUnlike.propTypes = {
	likesCount: PropTypes.string.isRequired,
	unLikesCount: PropTypes.string.isRequired,
	likes: PropTypes.array.isRequired,
	id: PropTypes.number.isRequired,
	isAuth: PropTypes.bool.isRequired,
	updateLike: PropTypes.func.isRequired,
	updateUnlike: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, { updateLike, updateUnlike })(
	LikeUnlike,
);
