/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { Component } from 'react';
import propTypes from 'prop-types';
import toast from '../../../lib/toast';
import Button from '../../templates/Button';
import InputForm from '../../templates/InputForm';
import SelectInput from '../../templates/SelectInput';
import {
	profileTravelFields,
	profileSelect,
} from '../../../utils/profileFields';

export class UserDetails extends Component {
	constructor(props) {
		super(props);
		this.state = {
			remember: false,
		};
	}

	async componentDidMount() {
		const { props } = this;
		this.setState({ ...props.data });
	}

	handleSave({ saveData, name, value }) {
		saveData({ [name]: value });
		this.setState({
			[name]: '',
		});
	}

	/**
	 * Save user input to the local state
	 * @param event
	 */
	handleInputChange(event) {
		let { value } = event.target;
		const { name } = event.target;

		if (value === '') {
			value = ' ';
		}

		this.setState({
			[name]: value,
		});
	}

	saveAndContinue(e) {
		e.preventDefault();
		const { errors } = this.props;
		const { handleData, nextStep, profile } = this.props;
		let error;
		Object.keys(errors).forEach(key => {
			if (errors[key] !== null) {
				error = 1;
			}
		});
		if (error === 1) {
			toast('error', 'Errors found, please review information');
			return;
		}

		handleData('profile', profile);
		nextStep();
	}

	render() {
		const { saveData, managers, errors } = this.props;
		const { state } = this;
		const { props } = this;
		if (Object.keys(props.profile).length < 1) {
			return <div>Please Wait....</div>;
		}

		const { profile } = this.props;

		return (
			<div>
				<div className='card-header w-100 bg-white'>
					<h6 className='m-0 font-weight-bold text-primary'>User Details</h6>
				</div>
				<form
					data-testid='form-user'
					onSubmit={event => this.saveAndContinue(event)}
					className='w-75 m-auto'
				>
					<div className='grid-form request-profile'>
						{profileTravelFields.map(
							({ id, placeholder, name, type, label, error }) => (
								<InputForm
									key={id}
									placeholder={placeholder}
									name={name}
									type={type}
									value={state[name] || profile[name] || ''}
									label={label}
									onChange={event => this.handleInputChange(event)}
									error={errors[error]}
									required
									onBlur={event =>
										this.handleSave({
											saveData,
											name,
											value: event.target.value,
										})}
									classNames={`form-control form-control-sm ${errors[error] &&
										'is-invalid'}`}
								/>
							),
						)}
						<SelectInput
							name='gender'
							value={profile.gender || 0}
							label='Gender'
							placeholder='Select Gender'
							option={profileSelect.gender}
							onChange={event => this.handleInputChange(event)}
							onBlur={event =>
								this.handleSave({
									saveData,
									name: 'gender',
									value: event.target.value,
								})
							}
							required
							classNames='form-control form-control-sm'
						/>

						<SelectInput
							name='lineManager'
							value={profile.lineManager.id || 0}
							label='Line Manager'
							placeholder='Line Manager'
							option={managers.map(manager => {
								const obj = {};
								obj.id = manager.id;
								obj.name = `${manager.firstName} ${manager.lastName}`;
								obj.value = manager.id;
								return obj;
							})}
							required
							error={errors.lineManagerError}
							onChange={event => this.handleInputChange(event)}
							onBlur={event =>
								this.handleSave({
									saveData,
									name: 'lineManager',
									value: event.target.value,
								})
						}
							classNames={`form-control form-control-sm ${errors.lineManagerError &&
								'is-invalid'}`}
						/>

						<SelectInput
							name='preferredCurrency'
							value={profile.preferredCurrency || 0}
							label='Preferred Currency'
							placeholder='Preferred Currency'
							option={profileSelect.preferredCurrency}
							onChange={event => this.handleInputChange(event)}
							onBlur={event =>
								this.handleSave({
									saveData,
									name: 'preferredCurrency',
									value: event.target.value,
								})}
							required
							classNames='form-control form-control-sm'
						/>
						<SelectInput
							name='preferredLanguage'
							value={profile.preferredLanguage || 0}
							label='Preferred Language'
							placeholder='Preferred Language'
							option={profileSelect.language}
							onChange={event => this.handleInputChange(event)}
							onBlur={event =>
								this.handleSave({
									saveData,
									name: 'preferredLanguage',
									value: event.target.value,
								})
							}
							classNames='form-control form-control-sm'
						/>
						<div className='form-group'>
							<div className='custom-control custom-checkbox'>
								<input
									type='checkbox'
									className='custom-control-input'
									name='remember'
									data-testid='remember'
									onClick={event => {
										const value = event.target.checked;
										this.handleSave({
											saveData,
											name: 'rememberInfo',
											value,
										});
									}}
									id='customCheck1'
									defaultChecked={profile.remember}
								/>
								<label className='custom-control-label' htmlFor='customCheck1'>
									Remember Information
									<i
										className='fa fa-question-circle-o ml-2 text-primary'
										data-toggle='tooltip'
										title='Remember your edited information to all forms'
										aria-hidden='true'
									/>
								</label>
							</div>
						</div>
					</div>
					<div className='w-100'>
						<Button
							testId='nextStep'
							classNames='btn btn-primary mr-5 float-right'
							type='submit'
							value='Continue'
						/>
					</div>
				</form>
			</div>
		);
	}
}

export const mapStateToProps = state => ({
	profile: state.profileState.userProfile,
	currentUserId: state.profileState.currentUserId,
	managers: state.profileState.managers,
	errors: state.profileState.errors,
	isEditing: state.profileState.isEditing,
});

UserDetails.propTypes = {
	profile: propTypes.instanceOf(Object).isRequired,
	managers: propTypes.instanceOf(Array).isRequired,
	errors: propTypes.instanceOf(Object).isRequired,
	saveData: propTypes.func.isRequired,
	handleData: propTypes.func.isRequired,
	data: propTypes.instanceOf(Object),
	nextStep: propTypes.func.isRequired,
};

UserDetails.defaultProps = {
	data: null,
};

export default UserDetails;
