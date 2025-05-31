import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import {
	Container,
	Row,
	Col,
	Card,
	Nav,
	Tab,
	Badge,
	Button,
	Spinner,
	ListGroup,
	Alert,
} from "react-bootstrap";
import YouTube from "react-youtube";
import { AppContext } from "../contexts/AppContext";
import { endpoints, authApis } from "../configs/Apis";
import {
	FaPlay,
	FaCheck,
	FaDownload,
	FaClock,
	FaFileAlt,
	FaPencilAlt,
	FaClipboardCheck,
	FaChevronLeft,
	FaChevronRight,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { youtubePlayerStyles } from "../utils/youtubePlayerStyles";

// Utility functions for video handling
const getLessonType = (embedLink) => {
	if (embedLink.includes("youtube.com") || embedLink.includes("youtu.be")) {
		return "youtube";
	} else if (embedLink.includes("drive.google.com")) {
		return "drive";
	}
	return "unknown";
};

const extractYouTubeVideoId = (embedLink) => {
	const regex =
		/(?:youtube\.com\/embed\/|youtu\.be\/|youtube\.com\/watch\?v=)([^&\n?#]+)/;
	const match = embedLink.match(regex);
	return match ? match[1] : null;
};

const formatLessonData = (apiLesson) => {
	const videoType = getLessonType(apiLesson.embedLink);
	let videoId = null;
	let embedUrl = apiLesson.embedLink;

	if (videoType === "youtube") {
		videoId = extractYouTubeVideoId(apiLesson.embedLink);
	}

	return {
		id: apiLesson.id,
		title: apiLesson.name,
		description: apiLesson.description,
		videoId: videoId,
		embedUrl: embedUrl,
		videoType: videoType,
		duration: "N/A",
		attachments:
			apiLesson.attachmentDtos?.map((att) => ({
				name: att.name,
				url: att.link,
				description: att.description,
			})) || [],
		isCompleted: false, // Will be set based on user progress
		orderIndex: apiLesson.orderIndex,
		instructor: `${apiLesson.userUploadIdFirstName} ${apiLesson.userUploadIdLastName}`,
		countAttachment: apiLesson.countAttachment,
		countExercise: apiLesson.countExercise,
	};
};

const CourseLearning = () => {
	const { courseId } = useParams();
	const { navigate, isAuthenticated, isAuthLoading } = useContext(AppContext);

	// State management
	const [courseData, setCourseData] = useState(null);
	const [currentVideo, setCurrentVideo] = useState(null);
	const [activeTab, setActiveTab] = useState("lessons");
	const [lessons, setLessons] = useState([]);
	const [exercises, setExercises] = useState([]);
	const [tests, setTests] = useState([]);
	const [isNavigationCollapsed, setIsNavigationCollapsed] = useState(false);
	const [loading, setLoading] = useState({
		course: true,
		lessons: false,
		exercises: false,
		tests: false,
	});
	const [progress, setProgress] = useState({
		completedLessons: [],
		completedExercises: [],
		completedTests: [],
	});
	const [collapsed, setCollapsed] = useState({
		lessons: true,
		exercises: true,
		tests: true,
	});

	// Initialize course data
	useEffect(() => {
		// Wait for auth loading to complete
		if (isAuthLoading) {
			return;
		}

		if (!isAuthenticated) {
			navigate("/login");
			return;
		}

		// Load course data
		const loadCourseData = async () => {
			try {
				setLoading((prev) => ({ ...prev, course: true }));

				// Fetch course details from API
				const courseResponse = await authApis().get(
					endpoints.courseDetails(courseId)
				);

				if (courseResponse.status === 200) {
					const courseData = courseResponse.data.course;

					// Format course data for component use
					const formattedCourseData = {
						id: courseData.id,
						title: courseData.name,
						description: courseData.description,
						instructor:
							courseData.lecturers && courseData.lecturers.length > 0
								? courseData.lecturers.length === 1
									? `${courseData.lecturers[0].userIdFirstName} ${courseData.lecturers[0].userIdLastName}`
									: `${courseData.lecturers[0].userIdFirstName} ${
											courseData.lecturers[0].userIdLastName
									  } +${courseData.lecturers.length - 1} more`
								: "No instructor assigned",
						totalLessons: 0, //  update when lessons are loaded
						totalExercises: 0, // update when exercises are loaded
						totalTests: 0, // update when tests are loaded
						image: courseData.image,
						categoryName: courseData.categoryIdName,
						studentCount: courseData.studentCount,
					};

					setCourseData(formattedCourseData);
				}

				setLoading((prev) => ({ ...prev, course: false }));

				// Set initial progress (this should come from user progress API)
				setProgress({
					completedLessons: [],
					completedExercises: [],
					completedTests: [],
				});
			} catch (error) {
				console.error("Error loading course data:", error);
				toast.error("Failed to load course data");
				setLoading((prev) => ({ ...prev, course: false }));
			}
		};

		loadCourseData();
	}, [courseId, isAuthenticated, isAuthLoading, navigate]);

	// lazy loading tabs
	useEffect(() => {
		if (!courseData) return;

		const loadTabData = async () => {
			try {
				if (activeTab === "lessons" && lessons.length === 0) {
					setLoading((prev) => ({ ...prev, lessons: true }));

					const response = await authApis().get(endpoints.lessons(courseId));
					const formattedLessons = response.data.map(formatLessonData);

					setLessons(formattedLessons);

					// Set first lesson as current video if none selected
					if (!currentVideo && formattedLessons.length > 0) {
						setCurrentVideo(formattedLessons[0]);
					}

					// Update course data with lesson count
					setCourseData((prev) => ({
						...prev,
						totalLessons: formattedLessons.length,
					}));

					setLoading((prev) => ({ ...prev, lessons: false }));
				} else if (activeTab === "exercises" && exercises.length === 0) {
					setLoading((prev) => ({ ...prev, exercises: true }));

					try {
						const response = await authApis().get(
							endpoints.exercises(courseId)
						);
						setExercises(response.data || []);

						// Update course data with exercise count
						setCourseData((prev) => ({
							...prev,
							totalExercises: response.data?.length || 0,
						}));
					} catch (exerciseError) {
						console.error("Error loading exercises:", exerciseError);
						// Set empty array if API fails
						setExercises([]);
						setCourseData((prev) => ({ ...prev, totalExercises: 0 }));
					}

					setLoading((prev) => ({ ...prev, exercises: false }));
				} else if (activeTab === "tests" && tests.length === 0) {
					setLoading((prev) => ({ ...prev, tests: true }));

					try {
						const response = await authApis().get(endpoints.tests(courseId));
						setTests(response.data || []);

						// Update course data with test count
						setCourseData((prev) => ({
							...prev,
							totalTests: response.data?.length || 0,
						}));
					} catch (testError) {
						console.error("Error loading tests:", testError);
						// Set empty array if API fails
						setTests([]);
						setCourseData((prev) => ({ ...prev, totalTests: 0 }));
					}

					setLoading((prev) => ({ ...prev, tests: false }));
				}

				// console.log("Current course data:", courseData);
				// console.log("Current lessons:", lessons);
				// console.log("Current exercises:", exercises);
				// console.log("Current tests:", tests);
			} catch (error) {
				if (error.status === 404) {
					toast.error(`No ${activeTab} not found`);
					setLoading((prev) => ({ ...prev, [activeTab]: false }));
				} else {
					console.error(`Error loading ${activeTab}:`, error);
					toast.error(`Failed to load ${activeTab}`);
					setLoading((prev) => ({ ...prev, [activeTab]: false }));
				}
			}
		};

		loadTabData();
	}, [
		activeTab,
		courseData,
		lessons.length,
		exercises.length,
		tests.length,
		courseId,
		currentVideo,
	]);

	// YouTube player options
	const youtubeOpts = {
		playerVars: {
			autoplay: 0,
			modestbranding: 1,
			rel: 0,
			controls: 1,
			showinfo: 0,
			fs: 1,
			cc_load_policy: 0,
			iv_load_policy: 3,
		},
	};

	// Handle lesson selection
	const handleLessonSelect = (lesson) => {
		setCurrentVideo(lesson);
	};

	// Handle lesson completion
	const handleLessonComplete = (lessonId) => {
		setProgress((prev) => ({
			...prev,
			completedLessons: [
				...prev.completedLessons.filter((id) => id !== lessonId),
				lessonId,
			],
		}));
		toast.success("Lesson completed!");
	};

	// Handle navigation panel toggle
	const toggleNavigationPanel = () => {
		setIsNavigationCollapsed(!isNavigationCollapsed);
	};

	// Handle exercise/test navigation
	const handleExerciseStart = (exerciseId) => {
		navigate(`/courses/${courseId}/exercises/${exerciseId}`);
	};

	const handleTestStart = (testId) => {
		navigate(`/courses/${courseId}/tests/${testId}`);
	};

	// loading while fetching course data or auth status
	if (loading.course || isAuthLoading) {
		return (
			<Container
				className="d-flex justify-content-center align-items-center"
				style={{ minHeight: "50vh" }}
			>
				<Spinner animation="border" role="status">
					<span className="visually-hidden">Loading...</span>
				</Spinner>
			</Container>
		);
	}

	return (
		<>
			<style>{youtubePlayerStyles}</style>

			{/* Floating Expand Button - Only visible when navigation is collapsed */}
			{isNavigationCollapsed && (
				<Button
					variant="primary"
					className="expand-button"
					onClick={toggleNavigationPanel}
					aria-label="Show navigation panel"
				>
					<FaChevronLeft />
				</Button>
			)}

			<Container fluid className="py-4">
				<Row>
					{/* Video Player Section */}
					<Col lg={isNavigationCollapsed ? 12 : 8}>
						<Card className="mb-4">
							<Card.Header>
								<h4 className="mb-0">
									{currentVideo?.title || "Select a lesson to start"}
								</h4>
								{currentVideo && (
									<small className="text-muted">
										Duration: {currentVideo.duration}
									</small>
								)}
							</Card.Header>
							<Card.Body className="p-0">
								{currentVideo ? (
									<div className="youtube-container">
										{currentVideo.videoType === "youtube" &&
										currentVideo.videoId ? (
											<YouTube
												videoId={currentVideo.videoId}
												opts={youtubeOpts}
												onEnd={() => handleLessonComplete(currentVideo.id)}
											/>
										) : currentVideo.videoType === "drive" ? (
											<iframe
												src={currentVideo.embedUrl}
												width="100%"
												height="100%"
												frameBorder="0"
												allowFullScreen
												title={currentVideo.title}
												style={{
													position: "absolute",
													top: 0,
													left: 0,
													width: "100%",
													height: "100%",
												}}
											/>
										) : (
											<div
												className="d-flex align-items-center justify-content-center bg-light"
												style={{ height: "300px" }}
											>
												<div className="text-center">
													<FaPlay size={48} className="text-muted mb-3" />
													<h5 className="text-muted">
														Video format not supported
													</h5>
													<p className="text-muted">
														Please contact support for assistance
													</p>
												</div>
											</div>
										)}
									</div>
								) : (
									<div
										className="d-flex align-items-center justify-content-center bg-light"
										style={{ height: "300px" }}
									>
										<div className="text-center">
											<FaPlay size={48} className="text-muted mb-3" />
											<h5 className="text-muted">
												Select a lesson to start learning
											</h5>
										</div>
									</div>
								)}
							</Card.Body>
							{currentVideo && (
								<Card.Footer>
									<div className="d-flex justify-content-between align-items-center">
										<div>
											<p className="mb-0">{currentVideo.description}</p>
										</div>
										<Button
											variant={
												progress.completedLessons.includes(currentVideo.id)
													? "success"
													: "primary"
											}
											onClick={() => handleLessonComplete(currentVideo.id)}
											disabled={progress.completedLessons.includes(
												currentVideo.id
											)}
										>
											{progress.completedLessons.includes(currentVideo.id) ? (
												<>
													<FaCheck className="me-2" />
													Completed
												</>
											) : (
												"Mark as Complete"
											)}
										</Button>
									</div>
								</Card.Footer>
							)}
						</Card>

						{/* Lesson Attachments Section */}
						{currentVideo &&
							currentVideo.attachments &&
							currentVideo.attachments.length > 0 && (
								<Card className="mb-4">
									<Card.Header>
										<h5 className="mb-0">
											<FaDownload className="me-2" />
											Lesson Attachments
										</h5>
									</Card.Header>
									<Card.Body>
										<div className="d-flex flex-wrap gap-2">
											{currentVideo.attachments.map((attachment, index) => (
												<Button
													key={index}
													variant="outline-primary"
													className="d-flex align-items-center"
													onClick={() => {
														// Handle attachment download
														if (attachment.url && attachment.url !== "#") {
															window.open(attachment.url, "_blank");
														} else {
															toast.info("Download feature coming soon!");
														}
													}}
												>
													<FaDownload className="me-2" />
													{attachment.name}
												</Button>
											))}
										</div>
									</Card.Body>
								</Card>
							)}
					</Col>

					{/* Tabs Section */}
					<Col
						lg={4}
						className={`navigation-panel ${
							isNavigationCollapsed ? "collapsed" : ""
						}`}
					>
						<Card>
							<Card.Header className="d-flex align-items-center justify-content-between">
								<div>
									<h5 className="mb-0">{courseData?.title}</h5>
									<small className="text-muted">
										by {courseData?.instructor}
									</small>
								</div>
								<Button
									variant="link"
									className="navigation-toggle p-0"
									onClick={toggleNavigationPanel}
									aria-label={
										isNavigationCollapsed
											? "Show navigation panel"
											: "Hide navigation panel"
									}
								>
									{isNavigationCollapsed ? (
										<FaChevronLeft />
									) : (
										<FaChevronRight />
									)}
								</Button>
							</Card.Header>
							<Card.Body className="p-0">
								<Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
									<Nav variant="tabs" className="px-3 pt-3">
										<Nav.Item>
											<Nav.Link eventKey="lessons">
												<FaPlay className="me-2" />
												Lessons
												<Badge bg="primary" className="ms-2">
													{courseData?.totalLessons}
												</Badge>
											</Nav.Link>
										</Nav.Item>
										<Nav.Item>
											<Nav.Link eventKey="exercises">
												<FaPencilAlt className="me-2" />
												Exercises
												<Badge bg="warning" className="ms-2">
													{courseData?.totalExercises}
												</Badge>
											</Nav.Link>
										</Nav.Item>
										<Nav.Item>
											<Nav.Link eventKey="tests">
												<FaClipboardCheck className="me-2" />
												Tests
												<Badge bg="info" className="ms-2">
													{courseData?.totalTests}
												</Badge>
											</Nav.Link>
										</Nav.Item>
									</Nav>

									<Tab.Content className="p-3 tab-content">
										{/* Lessons Tab */}
										<Tab.Pane eventKey="lessons">
											{loading.lessons ? (
												<div className="text-center py-4">
													<Spinner animation="border" size="sm" />
													<p className="mt-2">Loading lessons...</p>
												</div>
											) : (
												<ListGroup variant="flush">
													{lessons.map((lesson) => (
														<ListGroup.Item
															key={lesson.id}
															className={`cursor-pointer lesson-item ${
																currentVideo?.id === lesson.id ? "active" : ""
															}`}
															onClick={() => handleLessonSelect(lesson)}
														>
															<div className="d-flex align-items-start">
																<div className="me-3 mt-1">
																	{progress.completedLessons.includes(
																		lesson.id
																	) ? (
																		<FaCheck className="text-success" />
																	) : (
																		<FaPlay className="text-primary" />
																	)}
																</div>
																<div className="flex-grow-1">
																	<h6 className="mb-1">{lesson.title}</h6>
																	<p className="mb-1 small text-muted">
																		{lesson.description}
																	</p>
																	{lesson.instructor && (
																		<p className="mb-1 small text-info">
																			Instructor: {lesson.instructor}
																		</p>
																	)}
																	<div className="d-flex align-items-center justify-content-between">
																		<small className="text-muted">
																			<FaClock className="me-1" />
																			{lesson.duration}
																		</small>
																		<div className="d-flex gap-1">
																			{lesson.attachments.length > 0 && (
																				<Badge bg="secondary" className="small">
																					{lesson.attachments.length}{" "}
																					attachment(s)
																				</Badge>
																			)}
																			{lesson.countExercise > 0 && (
																				<Badge bg="warning" className="small">
																					{lesson.countExercise} exercise(s)
																				</Badge>
																			)}
																		</div>
																	</div>
																	{lesson.attachments.length > 0 && (
																		<div className="mt-2">
																			{lesson.attachments.map(
																				(attachment, index) => (
																					<Button
																						key={index}
																						variant="outline-primary"
																						size="sm"
																						className="me-2 mb-1"
																						onClick={(e) => {
																							e.stopPropagation();
																							// Handle attachment download
																							if (
																								attachment.url &&
																								attachment.url !== "#"
																							) {
																								window.open(
																									attachment.url,
																									"_blank"
																								);
																							} else {
																								toast.info(
																									"Download feature coming soon!"
																								);
																							}
																						}}
																					>
																						<FaDownload className="me-1" />
																						{attachment.name}
																					</Button>
																				)
																			)}
																		</div>
																	)}
																</div>
															</div>
														</ListGroup.Item>
													))}
												</ListGroup>
											)}
										</Tab.Pane>

										{/* Exercises Tab */}
										<Tab.Pane eventKey="exercises">
											{loading.exercises ? (
												<div className="text-center py-4">
													<Spinner animation="border" size="sm" />
													<p className="mt-2">Loading exercises...</p>
												</div>
											) : (
												<ListGroup variant="flush">
													{exercises.map((exercise) => (
														<ListGroup.Item
															key={exercise.id}
															className="exercise-item"
														>
															<div className="d-flex align-items-start">
																<div className="me-3 mt-1">
																	{progress.completedExercises.includes(
																		exercise.id
																	) ? (
																		<FaCheck className="text-success" />
																	) : (
																		<FaFileAlt className="text-warning" />
																	)}
																</div>
																<div className="flex-grow-1">
																	<h6 className="mb-1">{exercise.name}</h6>
																	<p className="mb-2 small text-muted">
																		{exercise.lessonIdName}
																	</p>
																	<div className="d-flex align-items-center justify-content-between mb-2">
																		<div>
																			<small className="text-muted">
																				<span bg={"Max Score"} className="me-2">
																					Max score: {exercise.maxScore}
																				</span>
																				<FaClock className="me-1" />
																				<span bg={"Max Score"} className="me-2">
																					{exercise.durationMinutes} minutes
																				</span>
																			</small>
																		</div>
																	</div>
																	<div className="d-flex gap-2">
																		<Button
																			variant={
																				progress.completedExercises.includes(
																					exercise.id
																				)
																					? "outline-primary"
																					: "primary"
																			}
																			size="sm"
																			onClick={() =>
																				handleExerciseStart(exercise.id)
																			}
																		>
																			Start Exercise
																		</Button>
																	</div>
																</div>
															</div>
														</ListGroup.Item>
													))}
												</ListGroup>
											)}
										</Tab.Pane>

										{/* Tests Tab */}
										<Tab.Pane eventKey="tests">
											{loading.tests ? (
												<div className="text-center py-4">
													<Spinner animation="border" size="sm" />
													<p className="mt-2">Loading tests...</p>
												</div>
											) : (
												<ListGroup variant="flush">
													{tests.map((test) => (
														<ListGroup.Item key={test.id} className="test-item">
															<div className="d-flex align-items-start">
																<div className="me-3 mt-1">
																	{progress.completedTests.includes(test.id) ? (
																		<FaCheck className="text-success" />
																	) : (
																		<FaClipboardCheck className="text-info" />
																	)}
																</div>
																<div className="flex-grow-1">
																	<h6 className="mb-1">{test.name}</h6>
																	<p className="mb-2 small text-muted">
																		{test.description}
																	</p>
																	<div className="d-flex align-items-center justify-content-between mb-2">
																		<div>
																			<small className="text-muted me-3">
																				<span bg={"Max Score"} className="me-2">
																					Max score: {test.maxScore}
																				</span>
																				<span bg={"Max Score"} className="me-2">
																					<FaClock className="me-1" />
																					{test.durationMinutes} minutes
																				</span>
																			</small>
																		</div>
																	</div>
																	<div className="d-flex gap-2">
																		<Button
																			variant={
																				progress.completedTests.includes(
																					test.id
																				)
																					? "outline-info"
																					: "info"
																			}
																			size="sm"
																			onClick={() => handleTestStart(test.id)}
																		>
																			Start Test
																		</Button>
																	</div>
																</div>
															</div>
														</ListGroup.Item>
													))}
												</ListGroup>
											)}
										</Tab.Pane>
									</Tab.Content>
								</Tab.Container>
							</Card.Body>
						</Card>
					</Col>
				</Row>
			</Container>
		</>
	);
};

export default CourseLearning;
