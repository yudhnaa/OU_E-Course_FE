import React, { useState, useContext, useEffect } from "react";
import {
	FaFacebookF,
	FaGithub,
	FaGoogle,
	FaTwitter,
	FaEye,
	FaEyeSlash,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { AppContext } from "../contexts/AppContext";
import useFormValidation from "../hooks/useFormValidation";

const quotes = [
	{
		text: "Great! Clean code, clean design, easy for customization. Thanks very much!",
		author: "Sarah Johnson",
	},
	{
		text: "The theme is really great with an amazing customer support.",
		author: "Mike Chen",
	},
	{
		text: "Excellent platform for learning. Highly recommended for everyone!",
		author: "Emily Davis",
	},
];

export default function SignIn() {
	const [currentQuote, setCurrentQuote] = useState(0);
	const [showPassword, setShowPassword] = useState(false);
	const [rememberMe, setRememberMe] = useState(false);

	const { login, isLoading, error, clearError, isAuthenticated, navigate } =
		useContext(AppContext);

	const {
		values,
		errors,
		touched,
		handleChange,
		handleBlur,
		validateForm,
		reset,
	} = useFormValidation({
		username: "",
		password: "",
	});

	// Redirect if already authenticated
	useEffect(() => {
		if (isAuthenticated) {
			navigate("/");
		}
	}, [isAuthenticated, navigate]);

	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentQuote((prev) => (prev + 1) % quotes.length);
		}, 4000);
		return () => clearInterval(timer);
	}, []);

	// Clear errors when component mounts
	useEffect(() => {
		return () => clearError();
	}, [clearError]);

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!validateForm()) {
			return;
		}

		const result = await login({
			username: values.username,
			password: values.password,
			rememberMe,
		});

		if (result.success) {
			reset();
		}
	};

	const handleSocialLogin = (provider) => {
		console.warn(`Social login not implemented: ${provider}`);
	};

	return (
		<div className="min-vh-100 d-flex align-items-center justify-content-center py-4 px-3 position-relative bg-success bg-opacity-10">
			{/* Animated background elements */}
			<div
				className="position-absolute w-100 h-100 overflow-hidden"
				style={{ pointerEvents: "none" }}
			>
				<div
					className="position-absolute bg-success bg-opacity-25 rounded-circle"
					style={{
						top: "-160px",
						right: "-160px",
						width: "320px",
						height: "320px",
						filter: "blur(40px)",
						opacity: "0.7",
					}}
				></div>
				<div
					className="position-absolute bg-success bg-opacity-25 rounded-circle"
					style={{
						bottom: "-160px",
						left: "-160px",
						width: "320px",
						height: "320px",
						filter: "blur(40px)",
						opacity: "0.7",
					}}
				></div>
				<div
					className="position-absolute bg-info bg-opacity-25 rounded-circle"
					style={{
						top: "160px",
						left: "160px",
						width: "320px",
						height: "320px",
						filter: "blur(40px)",
						opacity: "0.7",
					}}
				></div>
			</div>

			<div
				className="position-relative w-100 bg-white bg-opacity-90 rounded-4 shadow-lg overflow-hidden d-flex flex-column flex-lg-row border border-light"
				style={{ maxWidth: "1152px", backdropFilter: "blur(8px)" }}
			>
				{/* Left side with logo and quotes */}
				<div
					className="col-lg-6 p-4 p-lg-5 text-white position-relative d-flex flex-column"
					style={{
						minHeight: "500px",
						background: "linear-gradient(135deg, #16a085, #27ae60)",
					}}
				>
					{/* Decorative elements */}
					<div className="position-absolute w-100 h-100"></div>
					<div
						className="position-absolute bg-white bg-opacity-10 rounded-circle"
						style={{
							top: "0",
							right: "0",
							width: "128px",
							height: "128px",
							transform: "translate(64px, -64px)",
						}}
					></div>
					<div
						className="position-absolute bg-white bg-opacity-10 rounded-circle"
						style={{
							bottom: "0",
							left: "0",
							width: "96px",
							height: "96px",
							transform: "translate(-48px, 48px)",
						}}
					></div>

					<div className="position-relative" style={{ zIndex: 10 }}>
						<Link to="/" className="mb-4 d-inline-block text-decoration-none">
							<div className="d-flex align-items-center gap-3">
								<div
									className="bg-white bg-opacity-20 rounded-3 d-flex align-items-center justify-content-center transition"
									style={{ width: "40px", height: "40px" }}
								>
									<span className="fs-4 fw-bold text-dark">E</span>
								</div>
								<span className="fs-4 fw-bold text-white">E-Course</span>
							</div>
						</Link>

						<div className="flex-fill d-flex flex-column justify-content-center">
							<div className="mb-4 display-1 lh-1">
								<i className="ri-double-quotes-l text-success text-opacity-75"></i>
							</div>

							<div
								className="d-flex flex-column justify-content-center"
								style={{ minHeight: "120px" }}
							>
								<blockquote className="fs-5 fs-lg-4 fst-italic mb-3 transition">
									{quotes[currentQuote].text}
								</blockquote>
								<cite className="text-success text-opacity-75 small fw-medium text-dark">
									— {quotes[currentQuote].author}
								</cite>
							</div>

							{/* Carousel indicators */}
							<div className="d-flex justify-content-center mt-4 gap-3">
								{quotes.map((_, idx) => (
									<button
										key={idx}
										onClick={() => setCurrentQuote(idx)}
										aria-label={`Slide ${idx + 1}`}
										className={`rounded-circle border-0 transition ${
											idx === currentQuote
												? "bg-white"
												: "bg-white bg-opacity-50"
										}`}
										style={{ width: "12px", height: "12px" }}
									/>
								))}
							</div>
						</div>
					</div>
				</div>

				{/* Right side with form */}
				<div className="col-lg-6 p-4 p-lg-5">
					<div className="mx-auto" style={{ maxWidth: "448px" }}>
						<div className="text-center mb-4">
							<h1 className="display-6 fw-bold text-dark mb-2">
								Welcome Back!
							</h1>
							<p className="text-muted">
								Sign in to continue your learning journey
							</p>
						</div>

						{/* Error Alert */}
						{error && (
							<div
								className="alert alert-danger d-flex align-items-center mb-4"
								role="alert"
							>
								<div className="me-2">⚠️</div>
								<div className="flex-fill">{error}</div>
								<button
									type="button"
									className="btn-close"
									onClick={clearError}
									aria-label="Close"
								></button>
							</div>
						)}

						<form onSubmit={handleSubmit}>
							{/* Username Field */}
							<div className="mb-3">
								<label htmlFor="username" className="form-label fw-medium">
									Username
								</label>
								<input
									type="text"
									id="username"
									name="username"
									value={values.username}
									onChange={handleChange}
									onBlur={handleBlur}
									placeholder="Enter your username"
									className={`form-control ${
										errors.username && touched.username ? "is-invalid" : ""
									}`}
									disabled={isLoading}
								/>
								{errors.username && touched.username && (
									<div className="invalid-feedback">{errors.username}</div>
								)}
							</div>

							{/* Password Field */}
							<div className="mb-3">
								<div className="d-flex justify-content-between align-items-center mb-2">
									<label htmlFor="password" className="form-label fw-medium">
										Password
									</label>
									<Link
										to="/forgot-password"
										className="small text-success text-decoration-none"
									>
										Forgot password?
									</Link>
								</div>
								<div className="position-relative">
									<input
										type={showPassword ? "text" : "password"}
										id="password"
										name="password"
										value={values.password}
										onChange={handleChange}
										onBlur={handleBlur}
										placeholder="Enter your password"
										className={`form-control ${
											errors.password && touched.password ? "is-invalid" : ""
										}`}
										style={{ paddingRight: "3rem" }}
										disabled={isLoading}
									/>
									<button
										type="button"
										onClick={() => setShowPassword(!showPassword)}
										className="btn position-absolute top-50 end-0 translate-middle-y me-2 text-muted"
										style={{ border: "none", background: "none", zIndex: 10 }}
										aria-label="Toggle password visibility"
									>
										{showPassword ? (
											<FaEyeSlash size={18} />
										) : (
											<FaEye size={18} />
										)}
									</button>
								</div>
								{errors.password && touched.password && (
									<div className="invalid-feedback">{errors.password}</div>
								)}
							</div>

							{/* Remember Me */}
							<div className="mb-4">
								<div className="form-check">
									<input
										type="checkbox"
										checked={rememberMe}
										onChange={(e) => setRememberMe(e.target.checked)}
										className="form-check-input"
										id="rememberMe"
										disabled={isLoading}
									/>
									<label
										className="form-check-label user-select-none"
										htmlFor="rememberMe"
									>
										Remember me
									</label>
								</div>
							</div>

							{/* Submit Button */}
							<button
								type="submit"
								disabled={isLoading}
								className="btn btn-success w-100 py-3 fw-semibold shadow"
								style={{
									background: "linear-gradient(135deg, #198754, #20c997)",
									border: "none",
								}}
							>
								{isLoading ? (
									<div className="d-flex align-items-center justify-content-center gap-2">
										<div
											className="spinner-border spinner-border-sm text-light"
											role="status"
										>
											<span className="visually-hidden">Loading...</span>
										</div>
										<span>Signing In...</span>
									</div>
								) : (
									"Sign In"
								)}
							</button>
						</form>

						{/* Social Login */}
						<div className="mt-4">
							<div className="position-relative my-4">
								<hr className="text-muted" />
								<div className="position-absolute top-50 start-50 translate-middle bg-white px-3">
									<span className="small text-muted">Or continue with</span>
								</div>
							</div>

							<div className="row g-2 mt-3">
								{[
									{
										icon: FaGoogle,
										name: "Google",
										color: "btn-danger",
									},
									{
										icon: FaFacebookF,
										name: "Facebook",
										color: "btn-primary",
									},
									{
										icon: FaGithub,
										name: "GitHub",
										color: "btn-dark",
									},
									{
										icon: FaTwitter,
										name: "Twitter",
										color: "btn-info",
									},
								].map(({ icon: Icon, name, color }) => (
									<div key={name} className="col-3">
										<button
											type="button"
											onClick={() => handleSocialLogin(name.toLowerCase())}
											className={`btn ${color} w-100 d-flex align-items-center justify-content-center`}
											style={{ aspectRatio: "2.5" }}
											aria-label={`Sign in with ${name}`}
											disabled={isLoading}
										>
											<Icon size={18} />
										</button>
									</div>
								))}
							</div>
						</div>

						{/* Sign Up Link */}
						<div className="mt-4 text-center">
							<p className="text-muted mb-0">
								Don't have an account?{" "}
								<Link
									to="/signup"
									className="fw-semibold text-success text-decoration-none"
								>
									Create Account
								</Link>
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
