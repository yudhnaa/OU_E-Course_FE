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

	// // Quote carousel effect
	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentQuote((prev) => (prev + 1) % quotes.length);
		}, 4000);
		return () => clearInterval(timer);
	}, []);

	// Redirect if already authenticated
	useEffect(() => {
		if (isAuthenticated) {
			navigate("/");
		}
	}, [isAuthenticated, navigate]);

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
		// chua implement kip
		console.log(`Login with ${provider}`);
	};

	return (
		<div className="min-h-screen flex items-center justify-center py-8 px-4 relative bg-gradient-to-br from-green-50 via-emerald-50 to-teal-100">
			{/* Animated background elements */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				<div className="absolute -top-40 -right-40 w-80 h-80 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
				<div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
				<div className="absolute top-40 left-40 w-80 h-80 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
			</div>

			<div className="relative max-w-6xl w-full bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden flex flex-col lg:flex-row border border-white/20">
				{/* Left side with logo and quotes */}
				<div className="lg:w-1/2 p-8 lg:p-12 bg-gradient-to-br from-green-600 to-emerald-700 text-white relative flex flex-col min-h-[500px]">
					{/* Decorative elements */}
					<div className="absolute inset-0 bg-gradient-to-br from-green-800/20 to-transparent"></div>
					<div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
					<div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>

					<div className="relative z-10">
						<Link to="/" className="mb-8 inline-block group">
							<div className="flex items-center space-x-3">
								<div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-colors">
									<span className="text-xl font-bold">E</span>
								</div>
								<span className="text-xl font-bold">E-Course</span>
							</div>
						</Link>

						<div className="flex-grow flex flex-col justify-center">
							<div className="mb-6 text-5xl leading-none">
								<i className="ri-double-quotes-l text-green-300 opacity-80"></i>
							</div>

							<div className="min-h-[120px] flex flex-col justify-center">
								<blockquote className="text-lg lg:text-xl leading-relaxed italic mb-4 transform transition-all duration-500">
									{quotes[currentQuote].text}
								</blockquote>
								<cite className="text-green-200 text-sm font-medium">
									— {quotes[currentQuote].author}
								</cite>
							</div>

							{/* Carousel indicators */}
							<div className="flex justify-center mt-8 space-x-3">
								{quotes.map((_, idx) => (
									<button
										key={idx}
										onClick={() => setCurrentQuote(idx)}
										aria-label={`Slide ${idx + 1}`}
										className={`w-3 h-3 rounded-full transition-all duration-300 ${
											idx === currentQuote
												? "bg-white scale-125"
												: "bg-white/50 hover:bg-white/75"
										}`}
									/>
								))}
							</div>
						</div>
					</div>
				</div>

				{/* Right side with form */}
				<div className="lg:w-1/2 p-8 lg:p-12">
					<div className="max-w-md mx-auto">
						<div className="text-center mb-8">
							<h1 className="text-3xl font-bold text-gray-900 mb-2">
								Welcome Back!
							</h1>
							<p className="text-gray-600">
								Sign in to continue your learning journey
							</p>
						</div>

						{/* Error Alert */}
						{error && (
							<div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3">
								<div className="w-5 h-5 text-red-500">⚠️</div>
								<div className="text-red-700 text-sm">{error}</div>
								<button
									onClick={clearError}
									className="ml-auto text-red-500 hover:text-red-700"
								>
									×
								</button>
							</div>
						)}

						<form onSubmit={handleSubmit} className="space-y-6">
							{/* Username Field */}
							<div>
								<label
									htmlFor="username"
									className="block mb-2 text-sm font-medium text-gray-700"
								>
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
									className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
										errors.username && touched.username
											? "border-red-300 focus:ring-red-500"
											: "border-gray-300 focus:ring-green-500 focus:border-green-500"
									}`}
									disabled={isLoading}
								/>
								{errors.username && touched.username && (
									<p className="mt-1 text-sm text-red-600">{errors.username}</p>
								)}
							</div>

							{/* Password Field */}
							<div>
								<div className="flex justify-between items-center mb-2">
									<label
										htmlFor="password"
										className="text-sm font-medium text-gray-700"
									>
										Password
									</label>
									<Link
										to="/forgot-password"
										className="text-sm text-green-600 hover:text-green-700 hover:underline transition-colors"
									>
										Forgot password?
									</Link>
								</div>
								<div className="relative">
									<input
										type={showPassword ? "text" : "password"}
										id="password"
										name="password"
										value={values.password}
										onChange={handleChange}
										onBlur={handleBlur}
										placeholder="Enter your password"
										className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
											errors.password && touched.password
												? "border-red-300 focus:ring-red-500"
												: "border-gray-300 focus:ring-green-500 focus:border-green-500"
										}`}
										disabled={isLoading}
									/>
									<button
										type="button"
										onClick={() => setShowPassword(!showPassword)}
										className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-green-600 transition-colors"
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
									<p className="mt-1 text-sm text-red-600">{errors.password}</p>
								)}
							</div>

							{/* Remember Me */}
							<div className="flex items-center justify-between">
								<label className="flex items-center space-x-3 cursor-pointer">
									<input
										type="checkbox"
										checked={rememberMe}
										onChange={(e) => setRememberMe(e.target.checked)}
										className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
										disabled={isLoading}
									/>
									<span className="text-sm text-gray-700 select-none">
										Remember me
									</span>
								</label>
							</div>

							{/* Submit Button */}
							<button
								type="submit"
								disabled={isLoading}
								className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
							>
								{isLoading ? (
									<div className="flex items-center justify-center space-x-2">
										<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
										<span>Signing In...</span>
									</div>
								) : (
									"Sign In"
								)}
							</button>
						</form>

						{/* Social Login */}
						<div className="mt-8">
							<div className="relative">
								<div className="absolute inset-0 flex items-center">
									<div className="w-full border-t border-gray-300"></div>
								</div>
								<div className="relative flex justify-center text-sm">
									<span className="px-4 bg-white text-gray-500">
										Or continue with
									</span>
								</div>
							</div>

							<div className="mt-6 grid grid-cols-4 gap-3">
								{[
									{
										icon: FaGoogle,
										name: "Google",
										color: "bg-red-500 hover:bg-red-600",
									},
									{
										icon: FaFacebookF,
										name: "Facebook",
										color: "bg-blue-600 hover:bg-blue-700",
									},
									{
										icon: FaGithub,
										name: "GitHub",
										color: "bg-gray-900 hover:bg-gray-800",
									},
									{
										icon: FaTwitter,
										name: "Twitter",
										color: "bg-sky-500 hover:bg-sky-600",
									},
								].map(({ icon: Icon, name, color }) => (
									<button
										key={name}
										type="button"
										onClick={() => handleSocialLogin(name.toLowerCase())}
										className={`${color} p-3 rounded-lg text-white transition-all duration-200 transform hover:scale-105 flex items-center justify-center shadow-md hover:shadow-lg`}
										aria-label={`Sign in with ${name}`}
										disabled={isLoading}
									>
										<Icon size={18} />
									</button>
								))}
							</div>
						</div>

						{/* Sign Up Link */}
						<div className="mt-8 text-center">
							<p className="text-gray-600">
								Don't have an account?{" "}
								<Link
									to="/signup"
									className="font-semibold text-green-600 hover:text-green-700 hover:underline transition-colors"
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
