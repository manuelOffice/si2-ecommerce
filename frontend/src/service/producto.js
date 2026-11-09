import { URL_API } from "./api";

async function getProductos(lastId, limit) {
	try {
		const token = localStorage.getItem('token');
		if (!token) {
			return [new Error('Token Not Found'), null];
		}
		const res = await fetch(`${URL_API}/producto?lastid=${lastId ?? 0}&limit=${limit ?? 10}`, {
			method: 'GET',
			headers: {
				'Authorization': `Bearer ${token}`
			},
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

async function getProductoById(id) {
	try {
		const token = localStorage.getItem('token');
		if (!token) {
			return [new Error('Token Not Found'), null];
		}
		const res = await fetch(`${URL_API}/producto/${id}`, {
			method: 'GET',
			headers: {
				'Authorization': `Bearer ${token}`
			},
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

async function getProductoImage(image) {
	try {
		const token = localStorage.getItem('token');
		if (!token) {
			return [new Error('Token Not Found'), null];
		}
		const res = await fetch(`${URL_API}/producto/image/${image}`, {
			method: 'GET',
			headers: {
				'Authorization': `Bearer ${token}`
			},
		});
		if (!res.ok) {
			return [new Error(`Response status: ${res.status}`), null];
		}
		const data = await res.blob();
		const url = URL.createObjectURL(data);
        return [null, url];
    } catch (err) {
        console.error(err);
        return [err, null];
    }
}

async function updateProducto(producto) {
	try {
		const token = localStorage.getItem('token');
		if (!token) {
			return [new Error('Token Not Found'), null];
		}
		const res = await fetch(`${URL_API}/producto/${producto.codigo}`, {
			method: 'PATCH',
			headers: {
				'Authorization': `Bearer ${token}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(producto),
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

async function deleteProductoById(id) {
	try {
		const token = localStorage.getItem('token');
		if (!token) {
			return [new Error('Token Not Found'), null];
		}
		const res = await fetch(`${URL_API}/producto/${id}`, {
			method: 'DELETE',
			headers: {
				'Authorization': `Bearer ${token}`
			},
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

export { getProductos, getProductoById, getProductoImage, updateProducto, deleteProductoById};