import { URL_API } from './api'

export async function login(email, password) {
    try {
		const res = await fetch(`${URL_API}/auth/login`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				email: email,
				password: password
			})
		});
		if (!res.ok) {
			return [new Error(`Response status: ${res.status}`), null];
		}
		const data = await res.text();
        localStorage.setItem('token', data);
        console.log('token: ', data);
        return [null, data];
    } catch (err) {
        console.error(err);
        return [err, null];
    }
}
