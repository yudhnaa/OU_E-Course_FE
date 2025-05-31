import React, { useReducer, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import cookie from "react-cookies";
import {
	userReducer,
	initialUserState,
	USER_ACTIONS,
} from "../reducers/userReducer";
import Apis, { authApis, endpoints } from "../configs/Apis";
import { toast } from "react-toastify";

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

		if (token) {
			if (userData) {
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
			} else {
				// Token exists but no user data, fetch user profile
				getUserProfile();
			}
		}
	}, []);

	// Auth functions

	const getUserProfile = async () => {
		const token = cookie.load("token");

		if (!token) {
			return Promise.reject("User not authenticated");
		}

		const res = await Apis.get(endpoints["profile"], {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})
			.then((response) => {
				if (response.status === 200) {
					const user = response.data;
					// Store user data in cookies
					const expires = new Date();
					expires.setDate(expires.getDate() + 1);
					cookie.save("userData", JSON.stringify(user), {
						path: "/",
						expires,
					});

					userDispatch({
						type: USER_ACTIONS.LOGIN,
						payload: { user, token },
					});

					return {
						success: true,
						message: "User profile fetched successfully",
					};
				}
			})
			.catch((error) => {
				// Token is invalid, clear it
				cookie.remove("token", { path: "/" });
				console.error("Failed to fetch user profile:", error);

				return {
					success: false,
					error: "Failed to fetch user profile",
				};
			});
	};

	const login = async (credentials) => {
		setIsLoading(true);
		setError(null);

		try {
			const response = await Apis.post(endpoints["login"], {
				username: credentials.username,
				password: credentials.password,
				// "rememberMe": credentials.rememberMe, // not implemented in the API yet
			});
			if (response.status === 200) {
				const { token } = response.data;

				// Store token in cookies with expiration
				const expires = new Date();
				expires.setDate(expires.getDate() + 1);
				// expires.setDate(expires.getDate() + (credentials.rememberMe ? 30 : 1));

				cookie.save("token", token, { path: "/", expires });

				// Fetch user profile data
				try {
					const profileResponse = await Apis.get(endpoints["profile"], {
						headers: {
							Authorization: `Bearer ${token}`,
						},
					});

					if (profileResponse.status === 200) {
						const user = profileResponse.data;

						// Store user data in cookies with enhanced security
						storeCookieData("userData", user, expires);

						userDispatch({
							type: USER_ACTIONS.LOGIN,
							payload: { user, token },
						});
					}
				} catch (profileError) {
					console.warn("Failed to fetch user profile:", profileError);
				}

				setIsLoading(false);
				navigate("/"); // Redirect to home
				return { success: true, message: "Login successful" };
			} else {
				throw new Error(response.message || "Login failed");
			}
		} catch (error) {
			setError(error.message || "An error occurred during login");
			setIsLoading(false);
			return { success: false, error: error.message };
		}
	};

	const logout = () => {
		// Clear cookies
		cookie.remove("token", { path: "/" });
		cookie.remove("userData", { path: "/" });

		// Clear user state
		userDispatch({ type: USER_ACTIONS.LOGOUT });

		// Clear any loading states and errors
		setIsLoading(false);
		setError(null);

		// Navigate to login page
		navigate("/login");
	};

	const clearError = () => {
		setError(null);
	};

	// Enhanced cookie storage with security considerations
	const storeCookieData = (key, data, expires) => {
		try {
			const jsonString = JSON.stringify(data);

			// Check size limit (4KB = 4096 bytes)
			if (jsonString.length > 4000) {
				console.warn(`Cookie ${key} exceeds recommended size limit`);

				const essentialData = {
					id: data.id,
					name: data.name,
					email: data.email,
					avatar: data.avatar,
				};

				cookie.save(key, JSON.stringify(essentialData), {
					path: "/",
					expires,
				});
			} else {
				cookie.save(key, jsonString, {
					path: "/",
					expires,
				});
			}
		} catch (error) {
			console.error(`Failed to store ${key} in cookie:`, error);
		}
	};

	const value = {
		navigate,
		// User state
		user: userState.user,
		isAuthenticated: userState.isAuthenticated,
		isLoading,
		setIsLoading,
		error,
		// Auth functions
		login,
		getUserProfile,
		logout,
		clearError,
	};

	return (
		<AppContext.Provider value={value}>{props.children}</AppContext.Provider>
	);
};

export { AppContext, AppContextProvider };
