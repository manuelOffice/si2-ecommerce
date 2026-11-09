import { useEffect, useState } from 'react';
import '../styles/item.css'
import { getProductoImage } from '../service/producto';

function Item({producto}) {
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
	}

	return (
		<div className='item'>
			<img src={imagen} />
			<div className='item-container'>
				<div className='item-content'>
					<h5><b>{producto.nombre}</b></h5>
					<p>{producto.marca}, {producto.talla}</p>
				</div>
				<p>x{producto.cantidad}</p>
				<p>${(producto.cantidad * producto.precio).toFixed(2)}</p>
			</div>
		</div>
	);
}

export default Item;
