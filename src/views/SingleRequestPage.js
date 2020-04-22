import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import singleRequest from '../store/actions/requests/singleRequestActions';
import SingleRequest from '../components/request/SingleRequest';
import CommentRequest from '../components/request/CommentRequest';
import LoadingPlaceholder from '../components/templates/LoadingPlaceholder';

function SingleRequestPage(props) {
	const {
		data,
		match: {
			params: { requestId },
		},
		btnLoading,
	} = props;
	useEffect(() => {
		props.singleRequest(requestId);
	}, [requestId]);

	if (data && data.data) {
		const request = data.data;
		return (
			<div className='container request'>
				<div className='card'>
					<div className='row-flex'>
						<div className='column'>
							<SingleRequest request={request} loading={btnLoading} />
						</div>
						<div className='column-1 p-5'>
							<CommentRequest
								requestId={requestId}
								comment={request.comments}
							/>
						</div>
					</div>
				</div>
			</div>
		);
	}
	return (
		<div className='container request'>
			<div className='card'>
				<div className='card-body'>
					<LoadingPlaceholder />
				</div>
			</div>
		</div>
	);
}

SingleRequestPage.propTypes = {
	data: PropTypes.objectOf(PropTypes.any),
	btnLoading: PropTypes.bool,
	singleRequest: PropTypes.func.isRequired,
	match: PropTypes.objectOf(PropTypes.any).isRequired,
};

SingleRequestPage.defaultProps = {
	data: null,
	btnLoading: null,
};

export const mapStateToProps = state => ({
	data: state.singleRequestState.data,
	btnLoading: state.loadingState.buttonLoading,
	request: state.singleRequestState.request,
});

export default connect(mapStateToProps, {
	singleRequest,
})(SingleRequestPage);
