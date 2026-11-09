import { useRef, useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { createPaymentIntent } from '../service/payment';

const STATUS = {
	LOADED: 'loaded',
	LOADING: 'loading',
	ERROR: 'error',
};

function CheckoutForm({cart}) {
	const stripe = useStripe();
	const elements = useElements();
	const [message, setMessage] = useState(null);
	const status = useRef(null);

	const handleSubmit = async (event) => {
		event.preventDefault();

		if (!stripe || !elements || status.current === STATUS.LOADING) {
			return;
		}

		console.log('IN handleSubmit');
		status.current = STATUS.LOADING;

		const { error: submitError } = await elements.submit();
		if (submitError) {
			setMessage(submitError.message);
			return;
		}

		// Create the PaymentIntent only after the customer submits payment details.
		const [err, data] = createPaymentIntent(cart);
		if (err) {
			status.current = STATUS.ERROR;
			setMessage(err.message);
			return;
		}
		const { clientSecret } = data;

		const { error } = await stripe.confirmPayment({
			elements,
			clientSecret,
			confirmParams: {
				// return_url: "http://localhost:3000/complete",
			},
			redirect: 'if_required',
		});

		// Successful payments redirect to the return_url. Display immediate errors.
		if (error) {
			status.current = STATUS.ERROR;
			setMessage(error.message);
			return;
		}
		status.current = STATUS.LOADED;
	};

	const paymentElementOptions = {
		layout: "accordion"
	}

	return (
		<form id="payment-form" onSubmit={handleSubmit}>

			<PaymentElement id="payment-element" options={paymentElementOptions} />
			<button disabled={status.current === STATUS.LOADING || !stripe || !elements} id="submit">
				<span id="button-text">
					{status.current === STATUS.LOADING ? <div className="spinner" id="spinner"></div> : "Pay now"}
				</span>
			</button>
			{/* Show any error or success messages */}
			{message && <div id="payment-message">{message}</div>}
		</form>
	);
}

export default CheckoutForm;