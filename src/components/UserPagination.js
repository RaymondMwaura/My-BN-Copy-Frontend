/* eslint-disable
no-unused-vars,
react/require-default-props,
max-len
*/
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import PaginationButtons from './request/PaginationButtons';
import { setUsersList } from '../store/actions/listAction';

/**
 * On Page Changed
 * @param data
 * @param paginateObject
 * @param setPaginateObject
 * @param setUsers
 */
export const onPageChanged = ({
	data,
	paginateObject,
	setPaginateObject,
	setUsers,
}) => {
	const { allUsers } = paginateObject;
	const { currentPage, totalPages, pageLimit } = data;
	const offset = (currentPage - 1) * pageLimit;
	const currentUsers = allUsers.slice(offset, offset + pageLimit);

	setPaginateObject({
		allUsers,
		currentPage,
		currentUsers,
		totalPages,
	});

	setUsers(currentUsers);
};

/**
 * UserPagination component
 * @param setUsers
 * @param users
 * @returns {*}
 * @constructor
 */
export const UserPagination = ({ setUsers, users }) => {
	const [paginateObject, setPaginateObject] = React.useState({
		allUsers: [],
		currentUsers: [],
		currentPage: null,
		totalPages: null,
	});

	useEffect(() => {
		setPaginateObject({ ...paginateObject, ...{ allUsers: users } });
	}, [users]);
	const { allUsers } = paginateObject;
	return (
		<div
			data-test='user-pagination'
			data-testid='user-pagination'
			className='my-4 ml-auto'
		>
			<PaginationButtons
				allListables={allUsers}
				onPageChanged={data => {
					onPageChanged({
						data,
						paginateObject,
						setPaginateObject,
						setUsers,
					});
				}}
			/>
		</div>
	);
};

UserPagination.propTypes = {
	setUsers: PropTypes.func.isRequired,
	users: PropTypes.any.isRequired,
};

const mapDispatchToProps = { setUsers: setUsersList };

export default connect(null, mapDispatchToProps)(UserPagination);
