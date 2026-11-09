import { redirect, createContext } from "react-router";

function getPayload() {
	const token = localStorage.getItem('token');
	if (!token) {
		throw redirect('/login');
	}
	try {
		const [, payload] = token.split('.');
		return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
	} catch {
		throw redirect('/login');
	}
}

export async function timingGuard({ request, context }, next) {
	const payload = getPayload();
	if (!payload.exp || payload.exp <= Date.now() / 1000) {
		throw redirect('/login');
	}
	context.payload = payload;
	return next();
}

export async function roleGuard({ request, context }, next) {
	if (!context.payload || !context.payload.role || context.payload.role !== 'admin') {
		throw redirect('/login');
	}
	return next();
}