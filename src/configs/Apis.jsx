import axios from "axios";

const API_BASE_URL = "http://localhost:8080/Ecourse/api";

export const endpoints = {
	login: `${API_BASE_URL}/login`,
	profile: `${API_BASE_URL}/secure/profile`,
};

export const authApis = () => {
	return axios.create({
		baseURL: API_BASE_URL,
		headers: {
			Authorization: "`Bearer ${cookie.load('token')}`",
		},
	});
};

export default axios.create({
	baseURL: API_BASE_URL,
});
