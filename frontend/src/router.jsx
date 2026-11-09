import { createBrowserRouter } from 'react-router';
import { roleGuard, timingGuard } from './service/auth.js';
import { App, Admin } from './App';
import Login from './view/Login';
import Signup from './view/Signup';
import Catalogo from './view/Catalogo';
import Cart from './view/Cart';

const Router = createBrowserRouter([
	{
		path: 'dashboard',
		middleware: [timingGuard, roleGuard],
		Component: Admin,
	},
	{
		path: 'catalogo',
		middleware: [timingGuard],
		Component: Catalogo,
	},
	{
		path: 'carrito',
		middleware: [timingGuard],
		Component: Cart,
	},
	{
		index: true,
		Component: Login,
	},
	{
		path: 'login',
		Component: Login,
	},
	{
		path: 'signup',
		Component: Signup,
	},
]);

export default Router;