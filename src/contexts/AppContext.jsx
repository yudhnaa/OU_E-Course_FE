import React, { useReducer, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import cookie  from "react-cookies";
import {
	userReducer,
	initialUserState,
	USER_ACTIONS,
} from "../reducers/userReducer";

const AppContext = React.createContext();

const AppContextProvider = (props) => {
	const navigate = useNavigate();
	const [userState, userDispatch] = useReducer(userReducer, initialUserState);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);

	// Check for existing token on app load
	useEffect(() => {
		const token = cookie.load("token");
		const userData = cookie.load("userData");

		if (token && userData) {
			try {
				const user =
					typeof userData === "string" ? JSON.parse(userData) : userData;
				userDispatch({
					type: USER_ACTIONS.LOGIN,
					payload: { user, token },
				});
			} catch (error) {
				// Clear invalid data
				cookie.remove("token", { path: "/" });
				cookie.remove("userData", { path: "/" });
			}
		}
	}, []);

	// Auth functions
	const login = async (credentials) => {
		setIsLoading(true);
		setError(null);

		try {
			// Simulate API call - replace with actual API endpoint
			const response = await simulateLogin(credentials);

			if (response.success) {
				const { user, token } = response.data;

				// Store in cookies with expiration
				const expires = new Date();
				expires.setDate(expires.getDate() + (credentials.rememberMe ? 30 : 1)); // 30 days if remember me, otherwise 1 day

				cookie.save("token", token, { path: "/", expires });
				cookie.save("userData", user, { path: "/", expires });

				userDispatch({
					type: USER_ACTIONS.LOGIN,
					payload: { user, token },
				});

				setIsLoading(false);
				navigate("/"); // Redirect to home
				return { success: true };
			} else {
				throw new Error(response.message || "Login failed");
			}
		} catch (error) {
			setError(error.message);
			setIsLoading(false);
			return { success: false, error: error.message };
		}
	};

	const logout = () => {
		cookie.remove("token", { path: "/" });
		cookie.remove("userData", { path: "/" });
		userDispatch({ type: USER_ACTIONS.LOGOUT });
		navigate("/login");
	};

	const clearError = () => {
		setError(null);
	};

	// Simulate login API call - replace with actual API
	const simulateLogin = async (credentials) => {
		return new Promise((resolve) => {
			setTimeout(() => {
				// Mock validation
				if (
					credentials.username === "admin" &&
					credentials.password === "password"
				) {
					resolve({
						success: true,
						data: {
							user: {
								id: 1,
								username: credentials.username,
								email: "admin@example.com",
								name: "Admin User",
							},
							token: "mock-jwt-token-123",
						},
					});
				} else {
					resolve({
						success: false,
						message: "Invalid username or password",
					});
				}
			}, 1000); // Simulate network delay
		});
	};

	const value = {
		navigate,
		// User state
		user: userState.user,
		isAuthenticated: userState.isAuthenticated,
		isLoading,
		error,
		// Auth functions
		login,
		logout,
		clearError,
	};

	return (
		<AppContext.Provider value={value}>{props.children}</AppContext.Provider>
	);
};

export { AppContext, AppContextProvider };
