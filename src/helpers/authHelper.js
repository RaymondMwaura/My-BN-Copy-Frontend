import Cookies from 'universal-cookie';
import JWTDecode from 'jwt-decode';

const cookies = new Cookies();

const storeToken = token => {
	let expiryDate = JWTDecode(token).exp;
	expiryDate = parseInt(expiryDate, 10) * 1000;
	expiryDate = new Date(expiryDate);
	cookies.set('bn_auth_token', token, {
		path: '/',
		expires: expiryDate,
	});
};

const decodeToken = token => {
	const userData = JWTDecode(token);
	localStorage.setItem('bn_user_data', JSON.stringify(userData));
	localStorage.setItem(
		'name_initials',
		userData.name
			.split(' ')
			.map(name => name.split('')[0])
			.join(),
	);
};

const getToken = () => cookies.get('bn_auth_token');

export { storeToken, decodeToken, getToken };
