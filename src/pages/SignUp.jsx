import React, { useState, useContext, useEffect } from "react";
import {
	FaFacebookF,
	FaGithub,
	FaGoogle,
	FaTwitter,
	FaEye,
	FaEyeSlash,
	FaUser,
	FaEnvelope,
	FaLock,
	FaCalendarAlt,
	FaUpload,
	FaImage,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { AppContext } from "../contexts/AppContext";
import useFormValidation from "../hooks/useFormValidation";
import Apis, { endpoints } from "../configs/Apis";
import { toast } from "react-toastify";

const quotes = [
	{
		text: "Education is the most powerful weapon which you can use to change the world.",
		author: "Nelson Mandela",
	},
	{
		text: "The beautiful thing about learning is that no one can take it away from you.",
		author: "B.B. King",
	},
	{
		text: "Live as if you were to die tomorrow. Learn as if you were to live forever.",
		author: "Mahatma Gandhi",
	},
];

export default function SignUp() {
	const [currentQuote, setCurrentQuote] = useState(0);
	const [showPassword, setShowPassword] = useState(false);
	const [agreeTerms, setAgreeTerms] = useState(false);
	const [avatarFile, setAvatarFile] = useState(null);
	const [avatarPreview, setAvatarPreview] = useState(null);

	const {
		isLoading,
		setIsLoading,
		error,
		clearError,
		isAuthenticated,
		navigate,
	} = useContext(AppContext);

	const {
		values,
		errors,
		touched,
		handleChange,
		handleBlur,
		validateForm,
		reset,
	} = useFormValidation({
		firstName: "",
		lastName: "",
		username: "",
		email: "",
		password: "",
		birthday: "",
	});

	// Password validation state
	const [passwordValidation, setPasswordValidation] = useState({
		length: false,
		number: false,
		// lowercase: false,
		// uppercase: false,
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

	// Password validation effect
	useEffect(() => {
		const password = values.password;
		setPasswordValidation({
			length: password.length >= 3,
			number: /\d/.test(password),
		});
	}, [values.password]);

	// Handle avatar file selection
	const handleAvatarChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			// Validate file type
			if (!file.type.startsWith("image/")) {
				alert("Please select an image file");
				return;
			}

			// Validate file size (5MB max)
			if (file.size > 5 * 1024 * 1024) {
				alert("File size must be less than 5MB");
				return;
			}

			setAvatarFile(file);

			// Create preview URL
			const reader = new FileReader();
			reader.onload = (e) => setAvatarPreview(e.target.result);
			reader.readAsDataURL(file);
		}
	};

	const signup = async (data) => {
		let formData = new FormData();
		for (let key in data) {
			formData.append(key, data[key]);
		}

		const res = await Apis.post(endpoints["signup"], formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});

		if (res.status === 201) {
			return {
				isSuccess: true,
				message: "Account created successfully",
			};
		} else {
			return {
				isSuccess: false,
				message: "Failed to create account",
			};
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (isLoading) return; // Prevent multiple submissions
		setIsLoading(true);

		if (!validateForm()) {
			return;
		}

		if (!agreeTerms) {
			alert("Please agree to the Terms of Use");
			return;
		}

		// Check if password meets all requirements
		const isPasswordValid = Object.values(passwordValidation).every(Boolean);
		if (!isPasswordValid) {
			alert("Password does not meet all requirements");
			return;
		}

		const res = await signup({
			userIdFirstName: values.firstName,
			userIdLastName: values.lastName,
			userIdUsername: values.username,
			userIdEmail: values.email,
			userIdPassword: values.password,
			userIdBirthday: values.birthday,
			avatarFile: avatarFile,
		});

		if (res.isSuccess === true) {
			toast.success(res.message, {
				position: "top-right",
				autoClose: 3000,
				closeOnClick: true,
				pauseOnHover: true,
			});
			navigate("/login");
			reset();
		} else {
			toast.error(res.message, {
				position: "top-right",
				autoClose: 3000,
				closeOnClick: true,
				pauseOnHover: true,
			});
		}
		setIsLoading(false);
	};

	const handleSocialLogin = (provider) => {
		console.warn(`Social login not implemented: ${provider}`);
	};

	return (
		<div className="min-vh-100 d-flex align-items-center justify-content-center py-4 px-3 position-relative bg-success bg-opacity-10">
			<div
				className="position-relative w-100 bg-white bg-opacity-90 rounded-4 shadow-lg overflow-hidden d-flex flex-column flex-lg-row border border-light"
				style={{ maxWidth: "1152px", backdropFilter: "blur(8px)" }}
			>
				{/* Left side with logo and quotes */}
				<div
					className="col-xl-5 p-4 p-lg-5 text-white position-relative d-flex flex-column"
					style={{
						minHeight: "600px",
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
								<i className="ri-double-quotes-l text-primary text-opacity-75"></i>
							</div>

							<div
								className="d-flex flex-column justify-content-center"
								style={{ minHeight: "120px" }}
							>
								<blockquote className="fs-5 fs-lg-4 fst-italic mb-3 transition">
									{quotes[currentQuote].text}
								</blockquote>
								<cite className="text-primary text-opacity-75 small fw-medium text-light">
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
				<div className="col-xl-7 p-4 p-lg-5">
					<div className="mx-auto" style={{ maxWidth: "600px" }}>
						<div className="text-center mb-4">
							<h1 className="display-6 fw-bold text-dark mb-2">
								Create Account
							</h1>
							<p className="text-muted">
								Join us and start your learning journey today
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
							{/* Name Fields */}
							<div className="row mb-3">
								<div className="col-md-6">
									<label htmlFor="firstName" className="form-label fw-medium">
										<FaUser className="me-2" />
										First Name
									</label>
									<input
										type="text"
										id="firstName"
										name="firstName"
										value={values.firstName}
										onChange={handleChange}
										onBlur={handleBlur}
										placeholder="Enter your first name"
										className={`form-control ${
											errors.firstName && touched.firstName ? "is-invalid" : ""
										}`}
										disabled={isLoading}
									/>
									{errors.firstName && touched.firstName && (
										<div className="invalid-feedback">{errors.firstName}</div>
									)}
								</div>
								<div className="col-md-6">
									<label htmlFor="lastName" className="form-label fw-medium">
										<FaUser className="me-2" />
										Last Name
									</label>
									<input
										type="text"
										id="lastName"
										name="lastName"
										value={values.lastName}
										onChange={handleChange}
										onBlur={handleBlur}
										placeholder="Enter your last name"
										className={`form-control ${
											errors.lastName && touched.lastName ? "is-invalid" : ""
										}`}
										disabled={isLoading}
									/>
									{errors.lastName && touched.lastName && (
										<div className="invalid-feedback">{errors.lastName}</div>
									)}
								</div>
							</div>

							{/* Username Field */}
							<div className="mb-3">
								<label htmlFor="username" className="form-label fw-medium">
									<FaUser className="me-2" />
									Username <span className="text-danger">*</span>
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
									required
								/>
								{errors.username && touched.username && (
									<div className="invalid-feedback">{errors.username}</div>
								)}
							</div>

							{/* Email Field */}
							<div className="mb-3">
								<label htmlFor="email" className="form-label fw-medium">
									<FaEnvelope className="me-2" />
									Email <span className="text-danger">*</span>
								</label>
								<input
									type="email"
									id="email"
									name="email"
									value={values.email}
									onChange={handleChange}
									onBlur={handleBlur}
									placeholder="Enter your email address"
									className={`form-control ${
										errors.email && touched.email ? "is-invalid" : ""
									}`}
									disabled={isLoading}
									required
								/>
								{errors.email && touched.email && (
									<div className="invalid-feedback">{errors.email}</div>
								)}
							</div>

							{/* Password Field */}
							<div className="mb-3">
								<label htmlFor="password" className="form-label fw-medium">
									<FaLock className="me-2" />
									Password <span className="text-danger">*</span>
								</label>
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
										pattern="(?=.*[0-9]).{3,}"
										required
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

							{/* Password Requirements */}
							{values.password && (
								<div className="mb-3 p-3 bg-light rounded">
									<h6 className="fs-6 fw-semibold mb-2">
										Password must contain:
									</h6>
									<div className="row">
										<div className="col-6">
											<p
												className={`fs-7 mb-1 ${
													passwordValidation.length
														? "text-success"
														: "text-danger"
												}`}
											>
												{passwordValidation.length ? "✓" : "✗"} Minimum 3
												characters
											</p>
										</div>
										<div className="col-6">
											<p
												className={`fs-7 mb-0 ${
													passwordValidation.number
														? "text-success"
														: "text-danger"
												}`}
											>
												{passwordValidation.number ? "✓" : "✗"} Number (0-9)
											</p>
										</div>
									</div>
								</div>
							)}

							{/* Birthday and Role Fields */}
							<div className="row mb-3">
								<div className="col-md-6">
									<label htmlFor="birthday" className="form-label fw-medium">
										<FaCalendarAlt className="me-2" />
										Birthday
									</label>
									<input
										type="date"
										id="birthday"
										name="birthday"
										value={values.birthday}
										onChange={handleChange}
										onBlur={handleBlur}
										className={`form-control ${
											errors.birthday && touched.birthday ? "is-invalid" : ""
										}`}
										disabled={isLoading}
									/>
									{errors.birthday && touched.birthday && (
										<div className="invalid-feedback">{errors.birthday}</div>
									)}
								</div>
								<div className="col-md-6">
									<label htmlFor="avatar" className="form-label fw-medium">
										<FaImage className="me-2" />
										Avatar
									</label>
									<input
										type="file"
										id="avatar"
										name="avatar"
										accept="image/*"
										onChange={handleAvatarChange}
										className="form-control"
										disabled={isLoading}
										required
									/>
									<div className="form-text">
										Max file size: 2MB. Supported formats: JPG, PNG, GIF
									</div>
								</div>
							</div>

							{/* Avatar Preview */}
							{avatarPreview && (
								<div className="mb-3 text-center">
									<label className="form-label fw-medium">
										<FaUpload className="me-2" />
										Avatar Preview
									</label>
									<div className="d-flex justify-content-center">
										<div className="position-relative">
											<img
												src={avatarPreview}
												alt="Avatar preview"
												className="rounded-circle border"
												style={{
													width: "100px",
													height: "100px",
													objectFit: "cover",
												}}
											/>
											<button
												type="button"
												onClick={() => {
													setAvatarFile(null);
													setAvatarPreview(null);
													document.getElementById("avatar").value = "";
												}}
												className="btn btn-sm btn-danger position-absolute top-0 end-0 rounded-circle"
												style={{ transform: "translate(25%, -25%)" }}
												aria-label="Remove avatar"
											>
												×
											</button>
										</div>
									</div>
								</div>
							)}

							{/* Terms Agreement */}
							<div className="mb-4">
								<div className="form-check">
									<input
										type="checkbox"
										checked={agreeTerms}
										onChange={(e) => setAgreeTerms(e.target.checked)}
										className="form-check-input"
										id="agreeTerms"
										disabled={isLoading}
										required
									/>
									<label
										className="form-check-label user-select-none fs-7"
										htmlFor="agreeTerms"
									>
										By registering you agree to the{" "}
										<Link
											to="/terms"
											className="text-primary text-decoration-none fw-medium"
										>
											Terms of Use
										</Link>{" "}
										and{" "}
										<Link
											to="/privacy"
											className="text-primary text-decoration-none fw-medium"
										>
											Privacy Policy
										</Link>
									</label>
								</div>
							</div>

							{/* Submit Button */}
							<button
								type="submit"
								disabled={isLoading || !agreeTerms}
								className="btn btn-primary w-100 py-3 fw-semibold shadow"
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
										<span>Creating Account...</span>
									</div>
								) : (
									"Create Account"
								)}
							</button>
						</form>

						{/* Social Login */}
						<div className="mt-4">
							<div className="position-relative my-4">
								<hr className="text-muted" />
								<div className="position-absolute top-50 start-50 translate-middle bg-white px-3">
									<span className="small text-muted">Or sign up with</span>
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
											aria-label={`Sign up with ${name}`}
											disabled={isLoading}
										>
											<Icon size={18} />
										</button>
									</div>
								))}
							</div>
						</div>

						{/* Sign In Link */}
						<div className="mt-4 text-center">
							<p className="text-muted mb-0">
								Already have an account?{" "}
								<Link
									to="/login"
									className="fw-semibold text-primary text-decoration-none"
								>
									Sign In
								</Link>
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
