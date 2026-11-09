import { URL_API } from './api'

export async function signup(data) {
    try {
		const res = await fetch(`${URL_API}/cliente/signup`,{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				email: data.email,
				password: data.password,
				nombre: data.nombre,
				telefono: data.telefono
			})
        })
		if (!res.ok) {
			return [new Error(`Response status: ${res.status}`), null];
		}
		const token = await res.text();
        localStorage.setItem('token', token);
        console.log('token: ', token);
        return [null, token];
    } catch (err) {
        console.error(err);
        return [err, null];
    }
}