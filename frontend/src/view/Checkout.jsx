import CheckoutForm from './Payment';
import { STRIPE_PUBLIC_KEY } from '../service/payment'
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useEffect } from 'react';

const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);

function Checkout({ cart, amount, currency }) {
	const appearance = {
		theme: 'stripe',
	};
	const loader = 'auto';

	useEffect(() => {
		console.log('IN handleSubmit');
		console.log({cart, amount, currency});
	},[])

	return (
		<>
			<Elements options={{
				mode: 'payment',
				amount: amount,
				currency: currency,
				appearance,
				loader,
			}} stripe={stripePromise} >
				<CheckoutForm cart={cart} />
			</Elements>
		</>
	);
}

export default Checkout;