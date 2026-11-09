import { URL_API } from "./api";

const STRIPE_PUBLIC_KEY = 'pk_test_51UHX90KwymhlmSvc6CzDUCQYAykyQt0iPwqd0fyuIeTQOznr0BkNOedDjNsemv4BAPJt78VsR3gDgOXUQ1OIpfS0009JYphUFI';

async function createPaymentIntent(cart) {
	try {
		const token = localStorage.getItem('token');
		if (!token) {
			return [new Error('Token Not Found'), null];
		}
		const res = await fetch(`${URL_API}/payment`, {
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${token}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				cart: cart,
				currency: 'usd',
			}),
		});
		if (!res.ok) {
			return [new Error(`Response status: ${res.status}`), null];
		}
		const data = await res.json();
        console.log(data);
        return [null, data];
    } catch (err) {
        console.error(err);
        return [err, null];
    }
}

export { STRIPE_PUBLIC_KEY, createPaymentIntent };