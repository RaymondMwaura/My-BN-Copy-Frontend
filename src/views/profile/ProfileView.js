import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Info from './Info';
import InfoCard from './InfoCard';
import LoadingPlaceholder from '../../components/templates/LoadingPlaceholder';

const Profile = ({ setIsEditing, profile, currentUser, cardStats }) => {
	if (Object.keys(profile).length < 1) {
		return (
			<div className='card profile border-light rounded'>
				<LoadingPlaceholder />
			</div>
		);
	}

	const { userId } = JSON.parse(localStorage.getItem('bn_user_data'));
	const isLoggedInUser = currentUser === userId;

	return (
		<div className='card profile border-light rounded'>
			<div className='card-body'>
				<div className='row'>
					<div className='col-md-6'>
						<h4 className='font-weight-bold pb-4 text-center text-secondary'>
							Profile Information
						</h4>
					</div>
					<div className='col-md-6'>
						{isLoggedInUser && (
							<Link
								to='/edit'
								data-testid='btn-edit'
								type='button'
								className='btn btn-link float-right'
								onClick={() => {
									setIsEditing(true);
								}}
							>
								<i className='fa fa-pencil-square-o fa-2x' />
								<span> Edit Profile</span>
							</Link>
						)}
					</div>
				</div>

				<div className='row'>
					<div className='col-md-6'>
						<h5
							className='
									 pt-4 pb-2 mb-3 text-secondary'
						>
							Contact Information
						</h5>
						<Info label='Email' value={profile.email} />
						<Info label='Phone Number' value={profile.phoneNumber} />
						<Info label='Residence Address' value={profile.residenceAddress} />
					</div>
					<div className='col-md-6'>
						<h5 className=' pt-4 pb-2 mb-0 text-secondary'>
							Additional Information
						</h5>

						<Info
							label='Preferred Language'
							value={profile.preferredLanguage}
						/>

						<Info
							label='Preferred Currency'
							value={profile.preferredCurrency}
						/>
					</div>
				</div>

				<div className='row'>
					<div className='col-md-6'>
						<h5 className='pt-4 pb-2 mb-0 text-secondary'>
							General Information
						</h5>

						<Info
							label='Line Manager'
							value={`${profile.lineManager.firstName || ''} ${profile
								.lineManager.lastName || ''}`}
						/>
						<Info label='First Name' value={profile.firstName} />
						<Info label='Last Name' value={profile.lastName} />
						<Info label='Birth Date' value={profile.birthDate} />
						<Info label='Department' value={profile.department} />
						<Info label='Gender' value={profile.gender} />
					</div>
					<div className='col-sm-6 col-md-6'>
						<div className='row pt-4 pb-2'>
							<div className='col-sm-6 col-md-6'>
								{cardStats[0] && (
									<InfoCard
										label={cardStats[0].label}
										icon={cardStats[0].icon}
										number={cardStats[0].number}
									/>
								)}
							</div>
							<div className='col-sm-6 col-md-6'>
								{cardStats[1] && (
									<InfoCard
										label={cardStats[1].label}
										icon={cardStats[1].icon}
										number={cardStats[1].number}
									/>
								)}
							</div>
						</div>
						<div className='row mt-4'>
							<div className='col-sm-6 col-md-6'>
								{cardStats[2] && (
									<InfoCard
										label={cardStats[2].label}
										icon={cardStats[2].icon}
										number={cardStats[2].number}
									/>
								)}
							</div>
							<div className='col-sm-6 col-md-6'>
								{cardStats[3] && (
									<InfoCard
										label={cardStats[3].label}
										icon={cardStats[3].icon}
										number={cardStats[3].number}
									/>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
Profile.propTypes = {
	profile: PropTypes.instanceOf(Object),
	currentUser: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	setIsEditing: PropTypes.func.isRequired,
	cardStats: PropTypes.array.isRequired,
};
Profile.defaultProps = {
	currentUser: null,
	profile: null,
};

export default Profile;
