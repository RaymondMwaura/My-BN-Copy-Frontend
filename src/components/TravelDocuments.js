/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import propTypes from 'prop-types';
import Modal from './Modal';
import {
	getDocuments,
	addDocument,
	approveDocument,
	removeDocument,
} from '../store/actions/documentsActions';
import {
	renderPageLoadingSpinner,
	closePageLoadingSpinner,
} from '../store/actions/loadingActions';

const TravelDocuments = props => {
	useEffect(() => {
		props.getDocuments();
	}, []);

	const [popUpVisibility, setPopUpVisibility] = useState(false);
	const [preview, setPreview] = useState(false);
	const [currentDocument, setCurrentDocument] = useState('');
	const [documentDetails, setDocumentDetails] = useState({
		name: '',
		document: null,
	});

	const imagesTypes = ['png', 'jpg', 'jpeg'];

	const { role } = JSON.parse(localStorage.getItem('bn_user_data'));

	const handleFileUpload = event => {
		const { files } = event.target;
		setDocumentDetails({
			...documentDetails,
			document: files[0],
			imageName: files[0].name,
		});
	};

	const handleChange = event => {
		const { name, value } = event.target;
		setDocumentDetails({
			...documentDetails,
			[name]: value,
		});
	};

	const handleSubmit = async event => {
		event.preventDefault();
		const { name, document } = documentDetails;

		const data = new FormData();
		data.append('document', document);
		data.append('name', name);
		await props.addDocument(data);
		setDocumentDetails({
			name: '',
			document: null,
		});
		setPopUpVisibility(false);
	};

	const handleApprove = async id => {
		await props.approveDocument(id);
	};

	const handleRemove = async id => {
		await props.removeDocument(id);
	};

	if (preview) {
		props.renderPageLoadingSpinner();
	}

	const { documents } = props;

	return (
		<div className='container mt-5 mb-2'>
			{!preview ? (
				<div className='card border-light'>
					<div className='card-header bg-white border-light'>
						<div className='float-left '>
							<h4>Travel Documents</h4>
						</div>
						<div className='float-right'>
							{role === 'requester' && (
								<button
									type='button'
									className='btn btn-primary  drop-shadow rounded-pill'
									onClick={() => setPopUpVisibility(true)}
								>
									Add Document
								</button>
							)}
						</div>
					</div>
					<div className='card-body'>
						{documents.map(document => {
							const icon = imagesTypes.includes(document.url.split('.').pop())
								? 'fa-file-image-o'
								: 'fa-file-pdf-o';

							return (
								<div
									className='card my-1 border-light drop-shadow'
									key={document.id}
								>
									<div className='card-body'>
										<div className='row'>
											<div className='col-2 col-sm-2 col-md-2 border-right border-secondary  text-secondary'>
												<i className={`fa ${icon} fa-3x`} />
											</div>
											<div className='col-6 col-sm-6 col-md-6'>
												<div>
													<strong>{document.name}</strong>
												</div>
												<div>
													{role === 'requester' &&
														(document.verified ? (
															<span className='text-success'>
																<i className='fa fa-check-circle-o' />
																&nbsp;
																{`Verified by ${document.admin &&
																	`${document.admin.firstName} ${document.admin.lastName}`}`}
															</span>
														) : (
															<span className='text-danger'>
																<i className='fa fa-times-circle-o' />
																&nbsp; Waiting for verification
															</span>
														))}

													{role === 'travel_administrator' && (
														<>
															<span className='text-muted'>
																<i className='fa fa-cloud-upload' />
																&nbsp;
																{`Uploaded by ${document.documentOwner &&
																	`${document.documentOwner.firstName} ${document.documentOwner.lastName}`}`}
															</span>
															<span className='text-danger'>
																<br />
																{document.verified ? (
																	<span className='text-success'>
																		<i className='fa fa-check-circle-o' />
																		&nbsp;
																		{`Verified by ${document.admin.firstName} ${document.admin.lastName}`}
																	</span>
																) : (
																	<span className='text-danger'>
																		<i className='fa fa-times-circle-o' />
																		&nbsp; Waiting for verification
																	</span>
																)}
															</span>
														</>
													)}
												</div>
											</div>
											<div className='col-4 col-sm-4 col-md-4'>
												<div className='row'>
													<div className='col-4 col-sm-4 col-md-4'>
														<a
															href={`${process.env.API_URL}/api/v1/documents/${document.id}/download`}
															target='_blank'
															rel='noopener noreferrer'
														>
															<i className='fa fa-cloud-download fa-2x' />
														</a>
													</div>
													<div className='col-4 col-sm-4 col-md-4'>
														<a
															href='#/preview'
															target='_blank'
															rel='noopener noreferrer'
															data-testid='preview'
															onClick={e => {
																e.preventDefault();
																setCurrentDocument(document);
																setPreview(true);
															}}
														>
															<i className='fa fa-eye fa-2x' />
														</a>
													</div>
													<div className='col-4 col-sm-4 col-md-4'>
														{role === 'requester' && (
															<a
																href='#delete/'
																data-testid='delete'
																onClick={() => handleRemove(document.id)}
															>
																<i className='fa fa-trash fa-2x' />
															</a>
														)}
														{role === 'travel_administrator' && (
															<button
																data-testid='approve'
																type='button'
																disabled={document.verified}
																className='btn btn-success btn-sm'
																onClick={() => handleApprove(document.id)}
															>
																{!document.verified ? (
																	'Approve'
																) : (
																	<>
																		<i className='fa fa-check-circle-o' />
																		&nbsp; Verified
																	</>
																)}
															</button>
														)}
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			) : (
				<div className='card border-light shadow-md'>
					<div className='card-header bg-light border-light'>
						<button
							type='button'
							className='btn btn-link'
							onClick={() => setPreview(false)}
							data-testid='bcktodocs'
						>
							<span className='btn-label'>
								<i className='fa fa-chevron-left' />
							</span>
							&nbsp; Back to documents
						</button>
						{role === 'requester' && (
							<a
								href='#delete/'
								data-testid='delete'
								className='float-right'
								onClick={() => {
									handleRemove(currentDocument.id);
									setPreview(false);
								}}
							>
								<i className='fa fa-trash fa-2x' />
							</a>
						)}
{' '}
						{role === 'travel_administrator' && (
							<button
								data-testid='approve'
								type='button'
								className='btn btn-outline-success btn-sm float-right'
								onClick={() => {
									handleApprove(currentDocument.id);
									setPreview(false);
								}}
							>
								{!currentDocument.verified ? (
									'Approvee'
								) : (
									<>
										<i className='fa fa-check-circle-o' />
										&nbsp; Verified
									</>
								)}
							</button>
						)}
						<a
							href={`${process.env.API_URL}/api/v1/documents/${currentDocument.id}/download`}
							className='float-right mr-4'
							target='_blank'
							rel='noopener noreferrer'
						>
							<i className='fa fa-cloud-download fa-2x' />
						</a>
					</div>
					<div className='card-body'>
						<div className='embed-responsive embed-responsive-16by9'>
							<embed
								title='Preview'
								frameBorder='0'
								data-testid='prev-iframe'
								onLoad={() => {
									props.closePageLoadingSpinner();
								}}
								className='embed-responsive-item'
								src={currentDocument.url}
							/>
						</div>
					</div>
				</div>
			)}

			<Modal visible={popUpVisibility} hideOverlay>
				<div className='card drop-shadow'>
					<div className='card-header bg-white border-light'>
						<strong>Upload Document</strong>
					</div>
					<div className='card-body'>
						<form method='POST' onSubmit={e => handleSubmit(e)}>
							<div className='form-group'>
								<label>Document Name</label>
								<input
									type='text'
									className='form-control'
									name='name'
									placeholder='E.g: VISA, Passport, etc'
									value={documentDetails.name || ''}
									onChange={e => handleChange(e)}
									required
								/>
							</div>
							<div className='form-group'>
								<div className='custom-file'>
									<input
										type='file'
										className='custom-file-input'
										id='customFile'
										name='document'
										onChange={e => handleFileUpload(e)}
										accept='image/png, image/jpeg, image/jpg, application/pdf'
										required
										data-testid='document'
									/>
									<label
										className='custom-file-label'
										style={{ overflow: 'hidden' }}
									>
										{documentDetails.imageName || 'Choose file'}
									</label>
								</div>
								<small id='emailHelp' className='form-text text-muted'>
									Upload a PDF, PNG, JPG document of less than 10MB.
								</small>
							</div>
							<button type='submit' className='btn btn-primary'>
								Upload
							</button>
							<button
								type='button'
								className='btn btn-warning ml-2'
								onClick={() => {
									setDocumentDetails({
										name: '',
										document: null,
									});
									setPopUpVisibility(false);
								}}
							>
								Cancel
							</button>
						</form>
					</div>
				</div>
			</Modal>
		</div>
	);
};

const mapStateToProps = state => ({
	document: state.documentsState.document,
	documents: state.documentsState.documents,
});

TravelDocuments.propTypes = {
	getDocuments: propTypes.func.isRequired,
	addDocument: propTypes.func.isRequired,
	approveDocument: propTypes.func.isRequired,
	removeDocument: propTypes.func.isRequired,
	renderPageLoadingSpinner: propTypes.func.isRequired,
	closePageLoadingSpinner: propTypes.func.isRequired,
	documents: propTypes.array.isRequired,
};

export default connect(mapStateToProps, {
	getDocuments,
	addDocument,
	approveDocument,
	removeDocument,
	renderPageLoadingSpinner,
	closePageLoadingSpinner,
})(TravelDocuments);
