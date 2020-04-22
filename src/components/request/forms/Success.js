import React from 'react';
import propTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

export const Success = ({ history }) => {
	return (
		<div>
			<div className='card-header w-100 bg-white'>
				<h6 className='m-0 font-weight-bold text-primary'>
					Successful completed
				</h6>
			</div>
			<div className='card-body mx-auto justify-content-center align-items-center m-5 mt-7'>
				<div className='container'>
					<div className='row'>
						<div className='modalbox success col-sm-8 col-md-6 col-lg-5 center animate'>
							<div className='icon'>
								<span className='fa fa-check' />
							</div>
							<h1>Success!</h1>
							<p>Successfully created a trip!</p>
							<button
								data-test='btn-complete'
								type='button'
								onClick={() => history.push('/requests')}
								className='redo btn'
							>
								Complete
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

Success.propTypes = {
	history: propTypes.object.isRequired,
};

export default withRouter(Success);
