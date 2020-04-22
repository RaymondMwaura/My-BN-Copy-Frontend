import React, { useRef } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

export const Loader = ({ loading }) => {
	const progressBarRef = useRef({});

	if (progressBarRef.current.style) {
		if (loading) {
			progressBarRef.current.classList.add('show-loader');
		} else {
			progressBarRef.current.classList.remove('show-loader');
		}
	}

	return (
		<div className='loading-bar' ref={progressBarRef}>
			<div className='indeterminate' />
		</div>
	);
};

Loader.propTypes = {
	loading: PropTypes.bool,
};

Loader.defaultProps = {
	loading: null,
};

export const mapStateToProps = state => ({
	loading: state.loadingState.loading,
});

export default connect(mapStateToProps)(Loader);
