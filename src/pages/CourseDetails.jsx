import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Apis, { endpoints } from "../configs/Apis";
import ExercisesSection from "../components/ExerciseSection";
import TestsSection from "../components/TestSection";

const CourseDetails = () => {
	const { courseId } = useParams();
	const [exercises, setExercises] = useState([]);
	const [tests, setTests] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	// Fetch exercises and tests for the course
	const fetchExercises = async () => {
		let url = endpoints.exercises(courseId);
		try {
			setLoading(true);
			const { data } = await Apis.get(url);

			if (Array.isArray(data)) {
				setExercises(data);
			} else if (data && Array.isArray(data.exercises)) {
				setExercises(data.exercises);
			} else {
				toast.error("No exercises found or invalid data format");
				setError("No exercises found or invalid data format");
				setExercises([]);
			}
		} catch (error) {
			toast.error(error.message);
			setError(error.message);
			setExercises([]);
		}
	};

	const fetchTests = async () => {
		let url = endpoints.tests(courseId);
		try {
			setLoading(true);
			const { data } = await Apis.get(url);

			if (Array.isArray(data)) {
				setTests(data);
			} else if (data && Array.isArray(data.tests)) {
				setTests(data.tests);
			} else {
				toast.error("No tests found or invalid data format");
				setError("No tests found or invalid data format");
				setTests([]);
			}
		} catch (error) {
			toast.error(error.message);
			setError(error.message);
			setTests([]);
		}
	};

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			try {
				await Promise.all([fetchExercises(), fetchTests()]);
			} catch (error) {
				setError(error.message);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [courseId]);

	if (loading) {
		return <div className="container my-4">Loading exercises...</div>;
	}

	if (error) {
		return <div className="container my-4">Error: {error}</div>;
	}

	return (
		<div className="container my-4">




			{exercises.length > 0 && <ExercisesSection exercises={exercises} />}
			{tests.length > 0 && <TestsSection tests={tests} />}
			{exercises.length === 0 && tests.length === 0 && (
				<div className="alert alert-info">No exercises or tests found for this course.</div>
			)}
		</div>
	);
};

export default CourseDetails;