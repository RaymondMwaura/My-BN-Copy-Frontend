import React from 'react';
import PropTypes from 'prop-types';

export default function TextArea({
	placeholder,
	onChange,
	name,
	value,
	required,
	label,
	testId,
}) {
	return (
		<div data-test='input-form'>
			<label htmlFor={name}>{label}</label>
			<textarea
				name={name}
				className='form-control'
				placeholder={placeholder}
				onChange={onChange}
				minLength='10'
				maxLength='200'
				required={required}
				value={value}
				data-testid={testId}
			/>
			<span data-testid='error-text' className='invalid-feedback'>
				should have at least 15 characters...
			</span>
		</div>
	);
}

TextArea.propTypes = {
	name: PropTypes.string.isRequired,
	value: PropTypes.string.isRequired,
	label: PropTypes.string,
	placeholder: PropTypes.string,
	onChange: PropTypes.func,
	required: PropTypes.bool,
	testId: PropTypes.string,
};

TextArea.defaultProps = {
	label: null,
	placeholder: null,
	onChange: null,
	required: false,
	testId: null,
};
