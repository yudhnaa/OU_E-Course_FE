import React, { useContext, useEffect, useState } from "react";
// import Footer from "../../components/student/Footer";
// import { assets } from "../../assets/assets";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../contexts/AppContext";
import { toast } from "react-toastify";
import Apis, { endpoints } from "../configs/Apis";
// import humanizeDuration from "humanize-duration";
// import YouTube from "react-youtube";
// import { useAuth } from "@clerk/clerk-react";
// import Loading from "../../components/student/Loading";
import { useNavigate } from "react-router-dom";

const CourseDetails = () => {
	const { courseId } = useParams();
	const [exercises, setExercises] = useState([]);
	const [tests, setTests] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const navigate = useNavigate();

	// const [courseData, setCourseData] = useState(null);
	// const [playerData, setPlayerData] = useState(null);
	// const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false);

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
				setExercises([]); // Set to empty array to prevent reduce error
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
				setTests([]); // Set to empty array to prevent reduce error
			}
		} catch (error) {
			toast.error(error.message);
			setError(error.message);
			setTests([]);
		}
	}

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

	const groupedExercises = exercises?.reduce((acc, exercise) => {
		const lessonName = exercise.lessonIdName || "Other";
		if (!acc[lessonName]) {
			acc[lessonName] = [];
		}
		acc[lessonName].push(exercise);
		return acc;
	}, {}) || {};

	if (loading) {
		return <div className="container my-4">Loading exercises...</div>;
	}

	if (error) {
		return <div className="container my-4">Error: {error}</div>;
	}

	if (!exercises || exercises.length === 0) {
		return <div className="container my-4">No exercises found for this course.</div>;
	}
	// const {
	// 	backendUrl,
	// 	currency,
	// 	userData,
	// 	calculateChapterTime,
	// 	calculateCourseDuration,
	// 	calculateRating,
	// 	calculateNoOfLectures,
	// } = useContext(AppContext);
	// const { getToken } = useAuth();

	// const fetchCourseData = async () => {
	// 	try {
	// 		const { data } = await axios.get(backendUrl + "/api/course/" + id);

	// 		if (data.success) {
	// 			setCourseData(data.courseData);
	// 		} else {
	// 			toast.error(data.message);
	// 		}
	// 	} catch (error) {
	// 		toast.error(error.message);
	// 	}
	// };

	// const [openSections, setOpenSections] = useState({});

	// const toggleSection = (index) => {
	// 	setOpenSections((prev) => ({
	// 		...prev,
	// 		[index]: !prev[index],
	// 	}));
	// };

	// const enrollCourse = async () => {
	// 	try {
	// 		if (!userData) {
	// 			return toast.warn("Login to Enroll");
	// 		}

	// 		if (isAlreadyEnrolled) {
	// 			return toast.warn("Already Enrolled");
	// 		}

	// 		const token = await getToken();

	// 		const { data } = await axios.post(
	// 			backendUrl + "/api/user/purchase",
	// 			{ courseId: courseData._id },
	// 			{ headers: { Authorization: `Bearer ${token}` } }
	// 		);

	// 		if (data.success) {
	// 			const { session_url } = data;
	// 			window.location.replace(session_url);
	// 		} else {
	// 			toast.error(data.message);
	// 		}
	// 	} catch (error) {
	// 		toast.error(error.message);
	// 	}
	// };

	// useEffect(() => {
	// 	fetchCourseData();
	// }, []);

	// useEffect(() => {
	// 	if (userData && courseData) {
	// 		setIsAlreadyEnrolled(userData.enrolledCourses.includes(courseData._id));
	// 	}
	// }, [userData, courseData]);



	// return courseData ? (
	// 	<>
	// 		<div className="d-flex flex-column flex-md-row gap-4 position-relative align-items-start justify-content-between px-3 px-md-5 pt-4 pt-md-5 text-start">
	// 			<div
	// 				className="position-absolute top-0 start-0 w-100 h-100 bg-info bg-opacity-10"
	// 				style={{ zIndex: -1 }}
	// 			></div>

	// 			<div
	// 				className="position-relative flex-fill"
	// 				style={{ maxWidth: "576px", zIndex: 10 }}
	// 			>
	// 				<h1 className="h1 fw-semibold text-dark">{courseData.courseTitle}</h1>{" "}
	// 				<p
	// 					className="pt-3 text-muted"
	// 					dangerouslySetInnerHTML={{
	// 						__html: courseData.courseDescription.slice(0, 200),
	// 					}}
	// 				></p>
	// 				<div className="d-flex align-items-center gap-2 pt-3 pb-1 small">
	// 					<p className="text-dark">{calculateRating(courseData)}</p>
	// 					<div className="d-flex">
	// 						{[...Array(5)].map((_, i) => (
	// 							<img
	// 								key={i}
	// 								src={
	// 									i < Math.floor(calculateRating(courseData))
	// 										? assets.star
	// 										: assets.star_blank
	// 								}
	// 								alt=""
	// 								style={{ width: "14px", height: "14px" }}
	// 							/>
	// 						))}
	// 					</div>
	// 					<p className="text-primary">
	// 						({courseData.courseRatings.length}{" "}
	// 						{courseData.courseRatings.length > 1 ? "ratings" : "rating"})
	// 					</p>

	// 					<p className="text-muted">
	// 						{courseData.enrolledStudents.length}{" "}
	// 						{courseData.enrolledStudents.length > 1 ? "students" : "student"}
	// 					</p>
	// 				</div>
	// 				{/* <p className='text-sm'>Course by <span className='text-blue-600 underline'>{courseData.educator.name}</span></p> */}{" "}
	// 				<div className="pt-4 text-dark">
	// 					<h2 className="h5 fw-semibold">Course Structure</h2>
	// 					<div className="pt-3">
	// 						{courseData.courseContent.map((chapter, index) => (
	// 							<div
	// 								key={index}
	// 								className="border border-light bg-white mb-2 rounded"
	// 							>
	// 								<div
	// 									className="d-flex align-items-center justify-content-between px-3 py-3 cursor-pointer user-select-none"
	// 									onClick={() => toggleSection(index)}
	// 									style={{ cursor: "pointer" }}
	// 								>
	// 									<div className="d-flex align-items-center gap-2">
	// 										<img
	// 											src={assets.down_arrow_icon}
	// 											alt="arrow icon"
	// 											className={`transition ${
	// 												openSections[index] ? "rotate-180" : ""
	// 											}`}
	// 											style={{
	// 												transform: openSections[index]
	// 													? "rotate(180deg)"
	// 													: "rotate(0deg)",
	// 												transition: "transform 0.3s ease",
	// 											}}
	// 										/>
	// 										<p className="fw-medium mb-0">{chapter.chapterTitle}</p>
	// 									</div>
	// 									<p className="small mb-0">
	// 										{chapter.chapterContent.length} lectures -{" "}
	// 										{calculateChapterTime(chapter)}
	// 									</p>
	// 								</div>

	// 								<div
	// 									className={`overflow-hidden ${
	// 										openSections[index] ? "" : "d-none"
	// 									}`}
	// 								>
	// 									<ul className="list-unstyled ps-4 pe-3 py-2 text-muted border-top border-light mb-0">
	// 										{chapter.chapterContent.map((lecture, i) => (
	// 											<li
	// 												key={i}
	// 												className="d-flex align-items-start gap-2 py-1"
	// 											>
	// 												<img
	// 													src={assets.play_icon}
	// 													alt="bullet icon"
	// 													style={{
	// 														width: "16px",
	// 														height: "16px",
	// 														marginTop: "2px",
	// 													}}
	// 												/>
	// 												<div className="d-flex align-items-center justify-content-between w-100 text-dark small">
	// 													<p className="mb-0">{lecture.lectureTitle}</p>
	// 													<div className="d-flex gap-2">
	// 														{lecture.isPreviewFree && (
	// 															<p
	// 																onClick={() =>
	// 																	setPlayerData({
	// 																		videoId: lecture.lectureUrl
	// 																			.split("/")
	// 																			.pop(),
	// 																	})
	// 																}
	// 																className="text-primary mb-0"
	// 																style={{ cursor: "pointer" }}
	// 															>
	// 																Preview
	// 															</p>
	// 														)}
	// 														<p className="mb-0">
	// 															{humanizeDuration(
	// 																lecture.lectureDuration * 60 * 1000,
	// 																{ units: ["h", "m"] }
	// 															)}
	// 														</p>
	// 													</div>
	// 												</div>
	// 											</li>
	// 										))}
	// 									</ul>
	// 								</div>
	// 							</div>
	// 						))}
	// 					</div>
	// 				</div>{" "}
	// 				<div className="py-5">
	// 					<h3 className="h5 fw-semibold text-dark">Course Description</h3>
	// 					<p
	// 						className="rich-text pt-3"
	// 						dangerouslySetInnerHTML={{ __html: courseData.courseDescription }}
	// 					></p>
	// 				</div>
	// 			</div>

	// 			<div
	// 				className="position-relative shadow rounded bg-white"
	// 				style={{ minWidth: "300px", maxWidth: "420px", zIndex: 10 }}
	// 			>
	// 				{playerData ? (
	// 					<YouTube
	// 						videoId={playerData.videoId}
	// 						opts={{ playerVars: { autoplay: 1 } }}
	// 						iframeClassName="w-100"
	// 						style={{ aspectRatio: "16/9" }}
	// 					/>
	// 				) : (
	// 					<img
	// 						src={courseData.courseThumbnail}
	// 						alt=""
	// 						className="w-100 rounded-top"
	// 					/>
	// 				)}
	// 				<div className="p-4">
	// 					<div className="d-flex align-items-center gap-2">
	// 						<img
	// 							style={{ width: "14px" }}
	// 							src={assets.time_left_clock_icon}
	// 							alt="time left clock icon"
	// 						/>
	// 						<p className="text-danger mb-0">
	// 							<span className="fw-medium">5 days</span> left at this price!
	// 						</p>
	// 					</div>
	// 					<div className="d-flex gap-3 align-items-center pt-2">
	// 						<p className="text-dark h2 fw-semibold mb-0">
	// 							{currency}
	// 							{(
	// 								courseData.coursePrice -
	// 								(courseData.discount * courseData.coursePrice) / 100
	// 							).toFixed(2)}
	// 						</p>
	// 						<p className="h5 text-muted text-decoration-line-through mb-0">
	// 							{currency}
	// 							{courseData.coursePrice}
	// 						</p>
	// 						<p className="h5 text-muted mb-0">{courseData.discount}% off</p>
	// 					</div>
	// 					<div className="d-flex align-items-center small gap-3 pt-2 pt-md-3 text-muted">
	// 						<div className="d-flex align-items-center gap-1">
	// 							<img
	// 								src={assets.star}
	// 								alt="star icon"
	// 								style={{ width: "16px" }}
	// 							/>
	// 							<p className="mb-0">{calculateRating(courseData)}</p>
	// 						</div>
	// 						<div
	// 							style={{
	// 								height: "16px",
	// 								width: "1px",
	// 								backgroundColor: "rgba(108, 117, 125, 0.4)",
	// 							}}
	// 						></div>
	// 						<div className="d-flex align-items-center gap-1">
	// 							<img
	// 								src={assets.time_clock_icon}
	// 								alt="clock icon"
	// 								style={{ width: "16px" }}
	// 							/>
	// 							<p className="mb-0">{calculateCourseDuration(courseData)}</p>
	// 						</div>
	// 						<div
	// 							style={{
	// 								height: "16px",
	// 								width: "1px",
	// 								backgroundColor: "rgba(108, 117, 125, 0.4)",
	// 							}}
	// 						></div>
	// 						<div className="d-flex align-items-center gap-1">
	// 							<img
	// 								src={assets.lesson_icon}
	// 								alt="clock icon"
	// 								style={{ width: "16px" }}
	// 							/>
	// 							<p className="mb-0">
	// 								{calculateNoOfLectures(courseData)} lessons
	// 							</p>
	// 						</div>
	// 					</div>
	// 					<button
	// 						onClick={enrollCourse}
	// 						className="btn btn-primary w-100 py-3 fw-medium mt-3 mt-md-4"
	// 					>
	// 						{isAlreadyEnrolled ? "Already Enrolled" : "Enroll Now"}
	// 					</button>
	// 					<div className="pt-4">
	// 						<p className="h5 fw-medium text-dark">What's in the course?</p>
	// 						<ul className="ms-3 pt-2 small text-muted">
	// 							<li>Lifetime access with free updates.</li>
	// 							<li>Step-by-step, hands-on project guidance.</li>
	// 							<li>Downloadable resources and source code.</li>
	// 							<li>Quizzes to test your knowledge.</li>
	// 							<li>Certificate of completion.</li>
	// 						</ul>
	// 					</div>
	// 				</div>
	// 			</div>
	// 		</div>
	// 		<Footer />
	// 	</>
	// ) : (
	// 	<Loading />
	// );
	return (
		<>
			<div className="container my-4">
				{/* Exercises Section */}
				{exercises.length > 0 && (
					<>
						<h2 className="mb-4">Exercises</h2>
						<div className="accordion mb-5" id="exerciseAccordion">
							{Object.entries(groupedExercises).map(([lessonName, lessonExercises], index) => (
								<div className="accordion-item" key={`ex-${index}`}>
									<h2 className="accordion-header" id={`exercise-heading-${index}`}>
										<button
											className="accordion-button collapsed"
											type="button"
											data-bs-toggle="collapse"
											data-bs-target={`#exercise-collapse-${index}`}
											aria-expanded="false"
											aria-controls={`exercise-collapse-${index}`}
										>
											{lessonName}
										</button>
									</h2>
									<div
										id={`exercise-collapse-${index}`}
										className="accordion-collapse collapse"
										aria-labelledby={`exercise-heading-${index}`}
										data-bs-parent="#exerciseAccordion"
									>
										<div className="accordion-body">
											<ul className="list-group list-group-flush">
												{lessonExercises.map((exercise) => (
													<li key={exercise.id} className="list-group-item d-flex justify-content-between align-items-center">
														<div>
															<h6 className="mb-1">{exercise.name}</h6>
															<small>Duration: {exercise.durationMinutes} minutes | Max Score: {exercise.maxScore}</small>
														</div>
														<button className="btn btn-sm btn-outline-primary"
															onClick={() => navigate(`/courses/${courseId}/exercises/${exercise.id}`)}
														>View</button>
													</li>
												))}
											</ul>
										</div>
									</div>
								</div>
							))}
						</div>
					</>
				)}

				{/* Tests Section */}
				{tests.length > 0 && (
					<>
						<h2 className="mb-4">Tests</h2>
						<div className="accordion" id="testAccordion">
							{tests.map((test, index) => (
								<div className="accordion-item" key={`test-${test.id}`}>
									<h2 className="accordion-header" id={`test-heading-${index}`}>
										<button
											className="accordion-button"
											type="button"
											data-bs-toggle="collapse"
											data-bs-target={`#test-collapse-${index}`}
											aria-expanded={index === 0 ? "true" : "false"}
											aria-controls={`test-collapse-${index}`}
										>
											{test.name}
										</button>
									</h2>
									<div
										id={`test-collapse-${index}`}
										className={`accordion-collapse collapse ${index === 0 ? "show" : ""}`}
										aria-labelledby={`test-heading-${index}`}
										data-bs-parent="#testAccordion"
									>
										<div className="accordion-body">
											<div className="card">
												<div className="card-body">
													<h5 className="card-title">{test.name}</h5>
													<p className="card-text">{test.description}</p>
													<ul className="list-group list-group-flush">
														<li className="list-group-item">
															<strong>Duration:</strong> {test.durationMinutes} minutes
														</li>
														<li className="list-group-item">
															<strong>Max Score:</strong> {test.maxScore}
														</li>
														<li className="list-group-item">
															<strong>Created:</strong> {new Date(Date.UTC(...test.createdAt)).toLocaleDateString()}
														</li>
													</ul>
													<div className="mt-3">
														<button className="btn btn-primary"
																onClick={() => navigate(`/courses/${courseId}/tests/${test.id}`)}>View Test</button>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							))}
						</div>
					</>
				)}

				{/* No content message */}
				{exercises.length === 0 && tests.length === 0 && (
					<div className="alert alert-info">No exercises or tests found for this course.</div>
				)}

			</div>
		</>
	);
};

export default CourseDetails;
