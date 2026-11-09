import { useEffect } from 'react';
import '../styles/toast.css'

function Toast({toast, onClose}) {
	useEffect(() => {
		const timer = setTimeout(() => {
			onClose(toast.key);
		}, 3000);
		return () => clearTimeout(timer);
	}, [])

	return (
		<div className='toast'>
			<img src='/ok.svg' />
			<div className='toast-content'>
				<h5>{toast.header}</h5>
				<p>{toast.content}</p>
			</div>
		</div>
	);
}

export default Toast;