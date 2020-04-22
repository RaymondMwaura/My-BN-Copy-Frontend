import React from 'react';

function LoadingPlaceholder() {
	return (
		<div className='content__loading' data-testid='loading'>
			<div className='content__loading--line' />
			<div className='content__loading--line' />
			<div className='content__loading--line' />
			<div className='content__loading--line' />
			<div className='content__loading--line' />
			<div className='content__loading--line' />
			<div className='content__loading--line' />
			<div className='content__loading--line' />
			<div className='content__loading--line' />
			<div className='content__loading--line' />
		</div>
	);
}

export default LoadingPlaceholder;
