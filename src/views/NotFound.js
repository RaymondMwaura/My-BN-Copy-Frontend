import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
	return (
		<section data-testid='page-404' className='page_404 mt-4'>
			<div className='text-center'>
				<div className='four_zero_four_bg'>
					<h1 className='text-center'>404</h1>
				</div>

				<div className='contant_box_404'>
					<h3 className='h2 text-dark'>
						Sometimes even the bravest adventurer gets lost.
					</h3>

					<p className='text-secondary'>
						The page you are looking for is not available!
					</p>

					<Link to='/' className='link_404'>
						Go to Home
					</Link>
				</div>
			</div>
		</section>
	);
}
