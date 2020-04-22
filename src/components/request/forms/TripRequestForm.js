/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { Component } from 'react';
import propTypes from 'prop-types';
import Select from 'react-select';
import moment from 'moment';
import LoadingButton from '../../templates/Button';
import TextArea from '../../templates/TextArea';

export class CreateRequest extends Component {
	constructor(props) {
		super(props);

		this.state = {
			tripType: 'return',
			allTrips: [
				{
					id: 1,
					travelDate: '',
					returnDate: '',
					leavingFrom: null,
					goingTo: null,
					hotels: null,
					hotel: null,
					rooms: null,
					reason: '',
					myRef1: React.createRef(),
					leavingFromRef1: React.createRef(),
				},
			],
			checkSubmit: false,
		};
	}

	async componentDidMount() {
		const { props } = this;
		this.setState({ ...props.data.tripRequest });
	}

	createUI(allLocationOptions) {
		const { state } = this;
		const { tripType } = state;

		return state.allTrips.map((el, i) => (
			// eslint-disable-next-line react/no-array-index-key
			<div key={i} className='eachForm'>
				<div className='form-group trips-date-divs'>
					<div className='dateDivs'>
						<input
							type='date'
							name='travelDate'
							defaultValue={el.travelDate}
							className='form-control createTripInputs'
							onChange={event => this.handleChange(event, el)}
							required
							min={new Date().toISOString().split('T')[0]}
							data-testid='travelDate'
						/>
						<label htmlFor='travelDate'>travel date</label>
					</div>
					<span />
					<div className='dateDivs'>
						<input
							type='date'
							name='returnDate'
							defaultValue={el.returnDate}
							required={tripType === 'return'}
							className='form-control createTripInputs'
							onChange={event => this.handleChangeReturnDate(event, el)}
							disabled={tripType === 'one way' || tripType === 'multi-city'}
							min={
								moment(el.travelDate)
									.add(1, 'days')
									.format()
									.split('T')[0]
							}
							data-testid='returnDate'
						/>
						<label htmlFor='returnDate'>return date</label>
					</div>
				</div>

				<div className='form-group trips-date-divs'>
					<div className='dateDivs'>
						<label htmlFor='leavingFrom'>
							LEAVING FROM
							<select
								onChange={event => this.handleChange(event, el)}
								className='form-control createTripInputs'
								name='leavingFrom'
								defaultValue={el.leavingFrom || ''}
								required
								data-testid='leavingFrom'
								ref={el[`leavingFromRef${el.id}`]}
							>
								<option value=''>Choose</option>
								<optgroup>{allLocationOptions}</optgroup>
							</select>
						</label>
					</div>
					<span />
					<div className='dateDivs'>
						<label htmlFor='goingTo'>
							GOING TO
							<select
								onChange={event => this.handleChangeGoingTo(event, el)}
								className='form-control createTripInputs'
								name='goingTo'
								required
								data-testid='goingTo'
							>
								<option value='' defaultValue>
									Choose
								</option>
								<optgroup>{allLocationOptions}</optgroup>
							</select>
						</label>
					</div>
				</div>

				<div className='form-group accomodationDiv'>
					<div>
						<select
							onChange={event => this.handleChangeHotel(event, el)}
							className='form-control createTripInputs'
							name='hotel'
							data-testid='hotel'
							hidden={el.hotels === null}
						>
							<optgroup>
								<option key='someUniqueKey' value=''>
									Select hotel
								</option>
								{el.hotels &&
									el.hotels.map(({ value, name, key }) => (
										<option key={key} value={value}>
											{name}
										</option>
									))}
							</optgroup>
						</select>
					</div>
					<span />
					<div>
						{el.availableRooms ? (
							<div hidden={el.hotels === null}>
								<Select
									isMulti
									options={el.availableRooms}
									onChange={event => this.handleChangeRooms(event, el)}
									data-testid='room'
									placeholder='Select Room'
									ref={el[`myRef${el.id}`]}
								/>
								<input
									tabIndex={-1}
									autoComplete='off'
									style={{ opacity: 0, height: 0 }}
									defaultValue={el.rooms || ''}
									required={el.hotel !== null ? 'required' : false}
								/>
							</div>
						) : (
							<div hidden={el.hotels === null}>
								<Select
									isMulti
									options={[]}
									onChange={event => this.handleChangeRooms(event, el)}
									data-testid='room'
									ref={el[`myRef${el.id}`]}
								/>
							</div>
						)}
					</div>
				</div>

				<div className='tripReason'>
					<label htmlFor='reasonForTrip'>REASONS FOR THE TRIP</label>
					<TextArea
						placeholder='Type here'
						name='reason'
						defaultValue={el.reason}
						onChange={event => this.handleChange(event, el)}
						required
						value={el.reason || ''}
						testId='reason'
					/>
				</div>
				<div className='deleteTripForm'>
					<button
						type='button'
						className='btn btn-default btn-sm'
						onClick={() => this.removeClick(i)}
						data-testid='delete'
						hidden={
							tripType === 'one way' ||
							tripType === 'return' ||
							state.allTrips.length <= 1
						}
					>
						<span className='oi oi-trash' />
						Remove trip
					</button>
				</div>
			</div>
		));
	}

	handleChange(event, element) {
		const { name, value } = event.target;
		const { state } = this;
		const currentValuesInState = [...state.allTrips];

		const currentFormFieldWrapper = currentValuesInState.find(
			forms => forms.id === element.id,
		);
		const currentFormIndex = currentValuesInState.findIndex(
			forms => forms.id === element.id,
		);

		currentFormFieldWrapper[name] = value;
		currentValuesInState.splice(currentFormIndex, 1, currentFormFieldWrapper);
		this.setState({ allTrips: currentValuesInState });
	}

	handleChangeType(e) {
		const { name, value } = e.target;
		const { state } = this;

		if (value !== 'multi-city' && state.allTrips.length > 1) {
			this.setState(prevState => ({
				allTrips: [
					{
						...prevState.allTrips[0],
					},
				],
			}));
		}
		this.setState({
			[name]: value,
		});
	}

	handleChangeReturnDate(event, element) {
		const { name, value } = event.target;
		const { state } = this;
		const currentValuesInState = [...state.allTrips];
		const currentFormFieldWrapper = currentValuesInState.find(
			forms => forms.id === element.id,
		);
		const currentFormIndex = currentValuesInState.findIndex(
			forms => forms.id === element.id,
		);

		const travelDateObj = new Date(element.travelDate);
		const returnDateObj = new Date(value);

		if (travelDateObj < returnDateObj) {
			event.target.setCustomValidity('');
			currentFormFieldWrapper[name] = value;
			currentValuesInState.splice(currentFormIndex, 1, currentFormFieldWrapper);
			this.setState({ allTrips: currentValuesInState });
		} else {
			event.target.setCustomValidity(
				'Return date must be greater than travel date',
			);
		}
	}

	handleChangeGoingTo(event, element) {
		element.hotel = null;
		element.rooms = null;
		const { name, value } = event.target;
		const { state } = this;
		const currentValuesInState = [...state.allTrips];
		const currentRef = `myRef${element.id}`;
		const node = element[currentRef].current;

		if (node !== null) {
			node.state.value = '';
		}

		const currentFormFieldWrapper = currentValuesInState.find(
			forms => forms.id === element.id,
		);
		const currentFormIndex = currentValuesInState.findIndex(
			forms => forms.id === element.id,
		);

		currentFormFieldWrapper[name] = value;
		const { createTripData } = this.props;
		let hotelsArray, hotelOptions;

		if (currentFormFieldWrapper[name] !== null) {
			hotelsArray = createTripData.locationsWithHotels.find(
				({ id }) => id === Number(currentFormFieldWrapper[name]),
			);

			if (hotelsArray !== undefined) {
				if (Object.prototype.hasOwnProperty.call(hotelsArray, 'hotels')) {
					hotelsArray = hotelsArray.hotels;
					hotelOptions = hotelsArray.map(hotelOption => ({
						value: hotelOption.id,
						key: hotelOption.id,
						name: hotelOption.name.toUpperCase(),
					}));
				}
			} else {
				hotelOptions = null;
			}
			currentFormFieldWrapper.hotels = hotelOptions;
		}
		currentFormFieldWrapper.availableRooms = [];
		currentValuesInState.splice(currentFormIndex, 1, currentFormFieldWrapper);
		this.setState({ allTrips: currentValuesInState });
	}

	handleChangeHotel(event, element) {
		element.rooms = null;
		const { name } = event.target;
		let { value } = event.target;
		if (value === '') {
			value = null;
		}
		const { state } = this;
		const currentValuesInState = [...state.allTrips];

		const currentRef = `myRef${element.id}`;
		const node = element[currentRef].current;

		if (node !== null) {
			node.state.value = '';
		}

		const currentFormFieldWrapper = currentValuesInState.find(
			forms => forms.id === element.id,
		);
		const currentFormIndex = currentValuesInState.findIndex(
			forms => forms.id === element.id,
		);
		currentFormFieldWrapper[name] = value;
		let roomOptions;

		if (currentFormFieldWrapper[name] !== null) {
			const { createTripData } = this.props;
			let roomsInHotel = [];

			if (element.goingTo) {
				roomsInHotel = createTripData.locationsWithHotels
					.find(({ id }) => id === Number(element.goingTo))
					.hotels.find(({ id }) => id === Number(element.hotel)).rooms;
			}

			if (roomsInHotel.length > 0) {
				roomOptions = roomsInHotel.map(roomOpt => ({
					value: roomOpt.id,
					key: roomOpt.id,
					label: roomOpt.name.toUpperCase(),
				}));
			} else {
				roomOptions = null;
			}
			currentFormFieldWrapper.availableRooms = roomOptions;
		}
		currentValuesInState.splice(currentFormIndex, 1, currentFormFieldWrapper);
		this.setState({ allTrips: currentValuesInState });
	}

	handleChangeRooms(event, element) {
		const selectedOption = event || [];
		const rooms = selectedOption.map(room => room.value);
		const { state } = this;
		const currentValuesInState = [...state.allTrips];

		const currentFormFieldWrapper = currentValuesInState.find(
			forms => forms.id === element.id,
		);
		const currentFormIndex = currentValuesInState.findIndex(
			forms => forms.id === element.id,
		);

		currentFormFieldWrapper.rooms = rooms;
		currentValuesInState.splice(currentFormIndex, 1, currentFormFieldWrapper);
		this.setState({ allTrips: currentValuesInState });
	}

	addClick() {
		this.setState(prevState => {
			return {
				allTrips: [
					...prevState.allTrips,
					{
						id: prevState.allTrips[prevState.allTrips.length - 1].id + 1,
						travelDate: '',
						returnDate: '',
						leavingFrom:
							prevState.allTrips[prevState.allTrips.length - 1].goingTo,
						goingTo: null,
						hotel: null,
						hotels: null,
						rooms: null,
						reason: null,
						[`myRef${prevState.allTrips[prevState.allTrips.length - 1].id +
							1}`]: React.createRef(),
						[`leavingFromRef${prevState.allTrips[prevState.allTrips.length - 1]
							.id + 1}`]: React.createRef(),
					},
				],
			};
		});
	}

	removeClick(i) {
		const { state } = this;
		const { allTrips } = state;

		// only delete form if there is more than 1
		if (allTrips.length > 1) {
			// prevent setting goingTo to null on form deletion
			if (allTrips.length > 2 && i !== allTrips.length - 1) {
				const nextFormFieldWrapper = allTrips[i];
				const prevGoingToSelect =
					nextFormFieldWrapper[`leavingFromRef${nextFormFieldWrapper.id}`]
						.current;

				if (prevGoingToSelect !== null) {
					prevGoingToSelect.value = '';
				}
			}
			allTrips.splice(i, 1);
			this.setState({ allTrips });
		}
	}

	async handleFormSubmit(formSubmitEvent) {
		formSubmitEvent.preventDefault();
		const { state } = this;
		const { props } = this;
		const { tripType } = state;
		const formsArray = state.allTrips;
		const { profile, nextStep } = this.props;

		if (formsArray.length === 1 && tripType !== 'multi-city') {
			const thisFormState = formsArray[0];
			const {
				leavingFrom,
				goingTo,
				travelDate,
				returnDate,
				hotel,
				rooms,
				reason,
			} = thisFormState;

			let endpoint;
			let userRequest = {
				type: tripType,
				leavingFrom: Number(leavingFrom),
				goingTo: Number(goingTo),
				travelDate,
				reason,
			};

			if (hotel !== null && rooms !== null) {
				userRequest = {
					...userRequest,
					hotelId: Number(hotel),
					rooms,
				};
			}

			if (tripType === 'return') {
				userRequest = {
					...userRequest,
					returnDate,
				};
				endpoint = '/trips/return';
				await props.createTrip(userRequest, endpoint, profile);
				this.setState({ checkSubmit: true });
			} else {
				endpoint = '/trips/oneway';
				await props.createTrip(userRequest, endpoint, profile);
				this.setState({ checkSubmit: true });
			}
		} else {
			let userRequest;
			const formRequestArray = [];
			formsArray.forEach(element => {
				const {
					leavingFrom,
					goingTo,
					travelDate,
					hotel,
					rooms,
					reason,
				} = element;
				userRequest = {
					type: 'one way',
					leavingFrom: leavingFrom !== null ? Number(leavingFrom) : null,
					goingTo: Number(goingTo),
					travelDate,
					reason,
				};

				if (hotel !== null && rooms !== null) {
					userRequest = {
						...userRequest,
						hotelId: Number(hotel),
						rooms,
					};
				}
				formRequestArray.push(userRequest);
			});

			await props.createTrip(formRequestArray, '/trips/multi-city', profile);
			this.setState({ checkSubmit: true });
		}

		nextStep();
	}

	handleBack(event) {
		event.preventDefault();
		const { handleData, prevStep } = this.props;

		handleData('tripRequest', this.state);
		prevStep();
	}

	render() {
		const { createTripData } = this.props;
		const { state } = this;
		const { tripType } = state;

		let allLocationOptions, allLocationsWithHotels;

		if (createTripData.fetchStatus === 'success') {
			allLocationOptions = createTripData.allLocations.map(location => (
				<option value={location.id} key={location.id}>
					{location.city.toUpperCase()}
				</option>
			));
			allLocationsWithHotels = createTripData.locationsWithHotels;
		}

		const { loadingData } = this.props;
		const { buttonLoading } = loadingData;
		return (
			<div>
				<div className='card-header w-100 bg-white'>
					<h6 className='m-0 font-weight-bold text-primary'>
						Trip request Details
					</h6>
				</div>
				<div className='createTripContainer'>
					<form
						data-testid='submitInput'
						className='createTripForm card-body'
						onSubmit={event => this.handleFormSubmit(event)}
					>
						<div className='center-trip-radio-buttons'>
							<div className='form-check'>
								<label>
									<input
										type='radio'
										name='tripType'
										className='form-check-input'
										value='one way'
										checked={state.tripType === 'one way'}
										onChange={event => this.handleChangeType(event)}
										data-testid='oneway'
									/>
									One way trip
								</label>
							</div>
							<div className='form-check'>
								<label>
									<input
										type='radio'
										name='tripType'
										className='form-check-input'
										value='return'
										checked={state.tripType === 'return'}
										onChange={event => this.handleChangeType(event)}
										data-testid='return'
									/>
									Return trip
								</label>
							</div>
							<div className='form-check'>
								<label>
									<input
										type='radio'
										name='tripType'
										className='form-check-input'
										value='multi-city'
										checked={state.tripType === 'multi-city'}
										onChange={event => this.handleChangeType(event)}
										data-testid='multi-city'
									/>
									Multi-city trip
								</label>
							</div>
						</div>

						{this.createUI(allLocationOptions, allLocationsWithHotels)}
						<button
							type='button'
							className='btn btn-default btn-sm'
							onClick={() => this.addClick()}
							data-testid='addbutton'
							hidden={tripType === 'one way' || tripType === 'return'}
						>
							<span className='oi oi-plus' />
							Add trip
						</button>

						<div className='w-100 mt-5'>
							<button
								data-testid='back-btn'
								type='button'
								className='btn btn-primary float-left'
								onClick={event => this.handleBack(event)}
							>
								Back
							</button>
							<LoadingButton
								data-test='submitbtn'
								classNames='btn btn-primary float-right'
								buttonLoading={buttonLoading}
								value='Save & Proceed'
							/>
						</div>
					</form>
				</div>
			</div>
		);
	}
}

CreateRequest.propTypes = {
	createTripData: propTypes.object,
	createTrip: propTypes.func,
	handleData: propTypes.func.isRequired,
	prevStep: propTypes.func.isRequired,
	loadingData: propTypes.objectOf(propTypes.any),
	profile: propTypes.instanceOf(Object).isRequired,
	data: propTypes.instanceOf(Object).isRequired,
	nextStep: propTypes.func.isRequired,
};

CreateRequest.defaultProps = {
	createTripData: null,
	createTrip: null,
	loadingData: null,
};

export default CreateRequest;
