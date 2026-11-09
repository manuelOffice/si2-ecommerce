import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import '../styles/login.css';
import { login } from '../service/login';

const STATUS = {
	LOGGEDIN: 'loggedin',
	LOADING: 'loading',
	ERROR: 'error',
};

function Login() {
	const [email, setEmail] = useState('');
	const [passwd, setPasswd] = useState('');
	const [loginStatus, setLoginStatus] = useState(null);
	const [error, setError] = useState('');
	const navigate = useNavigate();

	const handleSubmit = async (event) => {
		event.preventDefault();
		setLoginStatus(STATUS.LOADING);
		const [err, data] = await login(email, passwd);
		if (!err) {
			setLoginStatus(STATUS.LOGGEDIN);
			const [, payload] = data.split('.');
			const { role } = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
			console.log(role);
			navigate(role === 'admin'? '/dashboard' : '/catalogo');
			return;
		}
		setLoginStatus(STATUS.ERROR);
		setError(err.message);
	};

	return (
		<div className="login-page">
			<div className="form-card">
				<div className="form-header">
					<h2 className="form-title">
						Shopping<i>MODA</i>
					</h2>
				</div>

				{loginStatus === STATUS.LOGGEDIN && (
					<div className="form-success">
						<span className="form-success__icon">✓</span>
						<p className="form-success__text">
							Successfully logged in!
						</p>
					</div>
				)}

				{loginStatus !== STATUS.LOGGEDIN && (
					<form className="form-form" onSubmit={handleSubmit}>
						<div className="form-group">
							<label className="form-label" htmlFor="email">
								Email
							</label>

							<input
								className="form-input"
								id="email"
								type="email"
								placeholder="you@example.com"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								name="email"
								required
							/>
						</div>

						<div className="form-group">
							<label className="form-label" htmlFor="password">
								Password
							</label>

							<input
								className="form-input"
								id="password"
								type="password"
								placeholder="••••••••"
								value={passwd}
								onChange={(e) => setPasswd(e.target.value)}
								name="password"
								required
							/>
						</div>

						{loginStatus === STATUS.ERROR && (
							<div className="form-error">
								<span className="form-error__icon">
									&#9888;
								</span>
								<span className="form-error__text">
									{error}
								</span>
							</div>
						)}

						<button
							className="form-btn"
							type="submit"
							disabled={loginStatus === STATUS.LOADING}
						>
							{loginStatus === STATUS.LOADING
								? 'Cargando...'
								: 'LOGIN'}
						</button>

						<Link to="/signup">¿Aun no tienes cuenta?</Link>
					</form>
				)}
			</div>
		</div>
	);
}

export default Login;
