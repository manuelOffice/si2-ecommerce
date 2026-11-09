import Card from './Card';
import Toast from './Toast';
import { useCallback, useEffect, useRef, useState } from 'react';
import { getProductos } from '../service/producto';
import '../styles/catalogo.css'
import { useNavigate } from 'react-router';

const LIMIT = 10;
const STATUS = {
	LOADED: 'loaded',
	LOADING: 'loading',
	ERROR: 'error',
};

function Catalogo() {
	const [productos, setProductos] = useState([]);
	const status = useRef(null);
	const maxId = useRef(0);
	const hasMore = useRef(true);
	const [notifications, setNotifications] = useState([]);
	const [cart, setCart] = useState(() => {
		const prev = localStorage.getItem('cart');
		return prev ? JSON.parse(prev) : [];
	})
	const navigate = useNavigate();

	const cargarProductos = useCallback( async (lastId, limit) => {
		if (status.current === STATUS.LOADING || !hasMore.current) {
			return;
		}
		status.current = STATUS.LOADING;
		const [err, data] = await getProductos(lastId, limit);
		if (err) {
			status.current = STATUS.ERROR;
			return;
		}
		hasMore.current = data.length >= LIMIT;
		maxId.current = Math.max(...data.map(x => x.codigo));
		setProductos(prev => [...prev, ...data]);
		status.current = STATUS.LOADED;
	}, []);

	useEffect(() => {
		const observer = new IntersectionObserver((entries) => {
			if (entries[0].isIntersecting) {
				cargarProductos(maxId.current, LIMIT);
			}
		}, {
			threshold: 0.5,
		});
		const target = document.getElementById('observer');
		if (!target) {
			console.log(new Error('Element #observer Not Found'));
			return;
		}
		observer.observe(target);
		return () => {
			observer.disconnect();
		}
	}, []);

	const addToCart = (product) => {
		setCart((prev) => {
			const index = prev.findIndex(x => x.codigo === product.codigo);
	        if (index < 0) {
		        return [ ...prev, { ...product, cantidad: 1 }];
	        }
			const copy = [...prev];
			copy[index] = {...copy[index], cantidad: copy[index].cantidad + 1};
			return copy;
	    });
		setNotifications(prev => [...prev, {
			key: crypto.randomUUID(),
			header: 'Added To Cart',
			content: `${product.nombre} +1`
		}]);
	}

	useEffect(() => {
		localStorage.setItem('cart', JSON.stringify(cart));
	},[cart])

	const removeToast = (key) => {
		setNotifications(prev => prev.filter((toast) => toast.key !== key));
	}

	return (
		<div className="catalogo">
			<div className='header'>
				<div className="logo">
					Shopping<i>MODA</i>
				</div>
				<button className="cart-btn" type="button" onClick={() => navigate('/carrito')}>
					<img src="/cart.svg" alt="Carrito" />
					{cart.length > 0 && <span />}
				</button>
			</div>

			<div className='main'>
				<div className='catalogo-lista'>
					{productos.map((producto) => {
						return (<Card
							key={producto.codigo}
							producto={producto}
							addToCart={addToCart}
						/>);
					})}
					<div id='observer'></div>
				</div>
			</div>

			<div className='footer'>
				© 2026 Shopping<i>MODA</i>. Todos los derechos reservados.
			</div>

			<div className='toast-list'>
				{notifications.map((toast) => {
					return (<Toast
						key={toast.key}
						toast={toast}
						onClose={removeToast}
					/>);
				})}
			</div>
		</div>
	);
}

export default Catalogo;