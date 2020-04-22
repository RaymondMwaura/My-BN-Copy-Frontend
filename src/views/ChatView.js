import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Chat from '../components/chat/Chat';

export function ChatView({ isAuth }) {
	return <div data-testid='chatView'>{isAuth && <Chat />}</div>;
}

ChatView.propTypes = {
	isAuth: PropTypes.bool,
};

ChatView.defaultProps = {
	isAuth: null,
};

const mapStateToProps = state => ({
	isAuth: state.authState.isAuthenticated,
});

export default connect(mapStateToProps, {})(ChatView);
