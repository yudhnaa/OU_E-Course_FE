import axios from "axios";
import cookie from "react-cookies";

const API_BASE_URL = "http://localhost:8080/Ecourse/api";

export const endpoints = {
	login: `${API_BASE_URL}/login`,
	signup: `${API_BASE_URL}/user/create`,

	profile: `${API_BASE_URL}/secure/profile`,
	updateProfile: `${API_BASE_URL}/secure/profile`,
	changePassword: `${API_BASE_URL}/secure/change-password`,

	courseList: `${API_BASE_URL}/course-list`,
	courseDetails: (courseId) => `${API_BASE_URL}/course/${courseId}`,
	enrolledCourses: `${API_BASE_URL}/secure/enrolled-courses`,
	isEnrollCourse: (courseId) =>
		`${API_BASE_URL}/secure/course/${courseId}/is-enrolled-course`,

	createPaymentSession: `${API_BASE_URL}/secure/payment/checkout`,

	// Course lessons
	lessons: (courseId) => `${API_BASE_URL}/secure/${courseId}/lessons`,

	// Course exercises
	exercises: (courseId) => `${API_BASE_URL}/courses/${courseId}/exercises`,
	exerciseDetail: (courseId, exerciseId) =>
		`${API_BASE_URL}/courses/${courseId}/exercises/${exerciseId}`,
	exerciseAttempt: (courseId, exerciseId) =>
		`${API_BASE_URL}/secure/courses/${courseId}/exercises/${exerciseId}/attempts`,
	exerciseQuestions: (courseId, exerciseId) =>
		`${API_BASE_URL}/courses/${courseId}/exercises/${exerciseId}/questions`,
	exerciseSubmit: (courseId, exerciseId) =>
		`${API_BASE_URL}/secure/courses/${courseId}/exercises/${exerciseId}/attempts/add`,

	// Course tests
	tests: (courseId) => `${API_BASE_URL}/courses/${courseId}/tests`,
	testDetail: (courseId, testId) =>
		`${API_BASE_URL}/courses/${courseId}/tests/${testId}`,
	testQuestions: (courseId, testId) =>
		`${API_BASE_URL}/courses/${courseId}/tests/${testId}/questions`,
	testAttempt: (courseId, testId) =>
		`${API_BASE_URL}/secure/courses/${courseId}/tests/${testId}/attempts`,
	testSubmit: (courseId, testId) =>
		`${API_BASE_URL}/secure/courses/${courseId}/tests/${testId}/attempts/add`,
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
