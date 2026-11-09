import { useEffect, useState } from 'react';
import '../styles/card.css'
import { getProductoImage } from '../service/producto';

function Card({producto, addToCart}) {
	const [imagen, setImagen] = useState(null)

	useEffect(() => {
		const getImageUrl = async () => {
			const image = producto.fotos?.[0];
			if (!image) {
				return;
			}
			const [err, data] = await getProductoImage(image);
			if (err) {
				console.log(err);
				return;
			}
			setImagen(data);
		}
		getImageUrl();
	},[producto.fotos?.[0]])

	const handleClick = (event) => {
		addToCart(producto);
	}

	return (
		<div className="card">
			<div className="card-image">
				{imagen && <img src={imagen} />}
				<button
					className="card-btn"
					type="button"
					onClick={handleClick}
				>
					<img src="/cart.svg" />
				</button>
			</div>
			<div className="card-text">
				<div className="card-name">
					{producto.nombre}
				</div>
				<div className="card-price">
					${producto.precio}
				</div>
			</div>
		</div>
	);
}

export default Card;