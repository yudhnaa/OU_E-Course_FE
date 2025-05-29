import axios from "axios";
import cookie from "react-cookies";

const API_BASE_URL = "http://localhost:8080/Ecourse/api";

export const endpoints = {
	login: `${API_BASE_URL}/login`,
	signup: `${API_BASE_URL}/user/create`,

	profile: `${API_BASE_URL}/secure/profile`,
	updateProfile: `${API_BASE_URL}/secure/profile`,
	changePassword: `${API_BASE_URL}/secure/change-password`,
};

export const authApis = () => {
	return axios.create({
		baseURL: API_BASE_URL,
		headers: {
			Authorization: `Bearer ${cookie.load("token")}`,
		},
	});
};

export default axios.create({
	baseURL: API_BASE_URL,
});
