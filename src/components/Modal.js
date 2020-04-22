import React from 'react';

function Modal(props) {
	const { visible, children, hideOverlay } = props;
	return (
		<div className='popup-view-container'>
			<div
				className={`popup view ${visible && 'visible'} ${hideOverlay &&
					'hide-overlay'}`}
			>
				<div className='popup-content'>{children}</div>
			</div>
		</div>
	);
}

export default Modal;
