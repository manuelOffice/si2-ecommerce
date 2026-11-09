import Item from './Item'
import { useEffect, useState, useRef } from 'react';
import '../styles/cart.css'
import { useNavigate } from 'react-router';
import Checkout from './Checkout';

const STATUS = {
	LOADED: 'loaded',
	LOADING: 'loading',
	ERROR: 'error',
};
const TAX_IVA = 0.13;

function Cart() {
	const status = useRef(null);
	const [cart, setCart] = useState(() => {
		const prev = localStorage.getItem('cart');
		return prev ? JSON.parse(prev) : [];
	})
	const navigate = useNavigate();
	const [subtotal, setSubtotal] = useState(0);
	const [descuento, setDescuento] = useState(0);
	const [impuesto, setImpuesto] = useState(0);
	const [total, setTotal] = useState(0);

	useEffect(() => {
		setSubtotal((
			cart.reduce((sum, item) =>
				sum + item.cantidad * item.precio, 0
			)
		).toFixed(2));
	}, []);

	useEffect(() => {
		localStorage.setItem('cart', JSON.stringify(cart));
		setSubtotal(
			cart.reduce((sum, item) =>
				sum + item.cantidad * item.precio, 0
			)
		);
	}, [cart]);

	useEffect(() => {
		const taxes = TAX_IVA * (subtotal - descuento);
		setImpuesto(taxes);
		setTotal(taxes + subtotal - descuento);
	}, [descuento, subtotal]);

	return (
		<div className='cart'>
			<div className='header'>
				<button className='logo' type='button' onClick={() => navigate('/catalogo')}>
					Shopping<i>MODA</i>
				</button>
			</div>

			<div className='main'>
				{ cart.length > 0 && (
					<div className='cart-container'>
						<div className='cart-list'>
							{cart.map((producto) => {
								return (<Item
									key={producto.codigo}
									producto={producto}
								/>);
							})}
						</div>
						<div className='cart-math'>
							<div className='cart-math__tittles'>
								<p>subtotal</p>
								<p>impuestos</p>
							</div>
							<div className='cart-math__numbers'>
								<p>${subtotal.toFixed(2)}</p>
								<p>${impuesto.toFixed(2)}</p>
							</div>
						</div>
						<div className='cart-total'>
							<div className='cart-total__tittle'>
								<p><b>total</b></p>
							</div>
							<div className='cart-total__number'>
								<p><b>${total.toFixed(2)}</b></p>
							</div>
						</div>
					</div>
				)}
				{cart.length > 0 && total > 0 && (
					<Checkout
						cart={cart}
						amount={total}
						currency='usd'
					/>
				)}
				{ cart.length <= 0 && (
					<div className='cart-empty'>
						<img src='/empty.svg'/>
						<p>
							Tu carrito de compras parece estar vacío.
							Vuelve al catálogo para añadir productos.
						</p>
						<button className='form-btn' type='button' onClick={() => navigate('/catalogo')}>
							VOLVER
						</button>
					</div>
				)}
			</div>

			<div className='footer'>
				© 2026 Shopping<i>MODA</i>. Todos los derechos reservados.
			</div>
		</div>
	);
}

export default Cart;