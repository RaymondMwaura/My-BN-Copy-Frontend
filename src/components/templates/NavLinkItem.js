/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Notifications from '../Notifications';
import { notification } from '../../store/actions/notificationAction';

export const NavLinkItem = ({
	linkText,
	linkRoute,
	icon,
	haspopup,
	notifications,
	newNotification,
	readNotifications,
	setNotifications,
}) => {
	const [unreadNotifications, setUnreadNotifications] = useState([]);

	useEffect(() => {
		if (haspopup) {
			setNotifications();
		}
	}, [readNotifications]);

	useEffect(() => {
		if (notifications && notifications.data) {
			setUnreadNotifications(
				notifications.data.filter(notif => notif.isRead === false),
			);
		}
	}, [notifications]);

	useEffect(() => {
		if (newNotification && notifications) {
			const findNotification = unreadNotifications.some(
				el => el.id === newNotification.id,
			);
			if (!findNotification) {
				setUnreadNotifications(prevNotifications => [
					...prevNotifications,
					newNotification,
				]);
			}
		}
	}, [newNotification]);

	useEffect(() => {}, [unreadNotifications]);

	return (
		<li className='nav-item mx-0 mx-md-3'>
			<NavLink
				{...{
					className: `nav-link${haspopup ? ' text-light' : ''}`,
					to: linkRoute,
					...(haspopup && {
						id: 'navbarDropdown',
						role: 'button',
						'data-toggle': 'dropdown',
						'aria-haspopup': 'true',
						'aria-expanded': 'false',
					}),
				}}
			>
				{icon && icon !== ';)' ? (
					<>
						<div data-testid='fa-icon' className={`fa fa-${icon}`}>
							{!!unreadNotifications.length && (
								<span className='notification-number'>
									{unreadNotifications.length}
								</span>
							)}
						</div>
						<span className='pl-2'>{linkText}</span>
					</>
				) : (
					linkText
				)}
			</NavLink>
			{haspopup && (
				<Notifications
					clearNotification={setUnreadNotifications}
					notifications={unreadNotifications.reverse()}
				/>
			)}
		</li>
	);
};

NavLinkItem.propTypes = {
	linkText: PropTypes.string.isRequired,
	linkRoute: PropTypes.string,
	icon: PropTypes.string,
	haspopup: PropTypes.bool,
	notifications: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
	newNotification: PropTypes.object,
	readNotifications: PropTypes.object.isRequired,
	setNotifications: PropTypes.func.isRequired,
};

NavLinkItem.defaultProps = {
	linkRoute: '#',
	haspopup: false,
	icon: ';)',
	notifications: null,
	newNotification: null,
};

const mapStateToProps = state => ({
	readNotifications: state.markAsReadState,
	notifications: state.notificationState.data,
	newNotification: state.updateNotificationState.newNotification,
});

const mapDispatchToProps = { setNotifications: notification };

export default connect(mapStateToProps, mapDispatchToProps)(NavLinkItem);
