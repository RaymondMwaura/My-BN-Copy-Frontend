/* eslint-disable default-case */
import React, { Component } from 'react';
import { ProgressBar, Step } from 'react-step-progress-bar';
import CreateRequest from '../../components/request/forms/CreateRequest';

const transitionStyles = {
	entering: { transform: 'scale(1.2)' },
	entered: { transform: 'scale(1.3)' },
	exiting: { transform: 'scale(1.2)' },
	exited: { transform: 'scale(1)' },
};

export class CreateRequestView extends Component {
	constructor(props) {
		super(props);
		this.state = {
			progress: 0,
		};
		this.handleProgress = this.handleProgress.bind(this);
	}

	handleProgress(progress) {
		this.setState({ progress });
	}

	render() {
		const { progress } = this.state;
		return (
			<div className='container'>
				<div className='m-5 card my-4'>
					<ProgressBar
						percent={progress}
						filledBackground='linear-gradient(to right, #8fd6ff, #0076ba)'
					>
						<Step>
							{({ accomplished, transitionState, index }) => (
								<div
									style={transitionStyles[transitionState]}
									className={`indexedStep ${
										accomplished ? 'accomplished' : ''
									}`}
								>
									{index + 1}
								</div>
							)}
						</Step>
						<Step>
							{({ accomplished, transitionState, index }) => (
								<div
									style={transitionStyles[transitionState]}
									className={`indexedStep ${
										accomplished ? 'accomplished' : ''
									}`}
								>
									{index + 1}
								</div>
							)}
						</Step>
						<Step>
							{({ accomplished, transitionState, index }) => (
								<div
									style={transitionStyles[transitionState]}
									className={`indexedStep ${
										accomplished ? 'accomplished' : ''
									}`}
								>
									{index + 1}
								</div>
							)}
						</Step>
						<Step>
							{({ accomplished, transitionState, index }) => (
								<div
									style={transitionStyles[transitionState]}
									className={`indexedStep ${
										accomplished ? 'accomplished' : ''
									}`}
								>
									{accomplished ? (
										<i className='fa fa-check' aria-hidden='true' />
									) : (
										index + 1
									)}
								</div>
							)}
						</Step>
					</ProgressBar>
					<CreateRequest handleProgress={this.handleProgress} />
				</div>
			</div>
		);
	}
}

export default CreateRequestView;
