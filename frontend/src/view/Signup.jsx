import { useState } from 'react';
import '../styles/signup.css';
import { signup } from '../service/signup';
import { useNavigate } from 'react-router';

const STATUS = {
	SIGNEDUP: 'signedup',
	LOADING: 'loading',
	ERROR: 'error',
};

function Signup() {
	const [loginForm, setLoginForm] = useState({
		email: '',
		password: '',
		nombre: '',
		telefono: ''
	});
	const [loginStatus, setLoginStatus] = useState(null);
	const [error, setError] = useState('');
	const navigate = useNavigate();

	const handleSubmit = async (event) => {
		event.preventDefault();
		setLoginStatus(STATUS.LOADING);
		const [err, data] = await signup(loginForm);
		if (!err) {
			setLoginStatus(STATUS.LOGGEDIN);
			navigate('/catalogo');
			return;
		}
		setLoginStatus(STATUS.ERROR);
		setError(err.message);
	};

	return (
		<div className="signup-page">
			<div className="form-card">
				<div className="form-header">
					<h2 className="form-title">
						Shopping<i>MODA</i>
					</h2>
				</div>

				{loginStatus === STATUS.SIGNEDUP && (
					<div className="form-success">
						<span className="form-success__icon">✓</span>
						<p className="form-success__text">
							Successfully logged in!
						</p>
					</div>
				)}

				{loginStatus !== STATUS.SIGNEDUP && (
					<form className="form-form" onSubmit={handleSubmit}>
						<div className="form-group">
							<label className="form-label" htmlFor="email">
								Email*
							</label>

							<input
								className="form-input"
								id="email"
								type="email"
								placeholder="you@example.com"
								value={loginForm.email}
								onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
								name="email"
								required
							/>
						</div>

						<div className="form-group">
							<label className="form-label" htmlFor="password">
								Password*
							</label>

							<input
								className="form-input"
								id="password"
								type="password"
								placeholder="••••••••"
								value={loginForm.password}
								onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
								name="password"
								required
							/>
						</div>
						<div className="form-row">
							<div className="form-group">
								<label className="form-label" htmlFor="name">Nombre</label>
								<input
									id="nameInput"
									className="form-input"
									type="text"
									placeholder="John Doe"
									value={loginForm.nombre}
									onChange={(e) => setLoginForm({...loginForm, nombre: e.target.value})}
									name="name"
								/>
							</div>
							<div className="form-group">
								<label className="form-label" htmlFor="phone"> Telefono </label>
								<input
									id="phoneInput"
									className="form-input"
									type="tel"
									placeholder="12345678"
									value={loginForm.telefono}
									onChange={(e) => setLoginForm({...loginForm, telefono: e.target.value})}
									name="phone"
									pattern="\d{8}"
									title="Phone must least 8 digits"
								/>
							</div>
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
								: 'SIGN UP'}
						</button>

					</form>
				)}
			</div>
		</div>
	);
}

export default Signup;