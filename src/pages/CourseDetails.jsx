import React, { useContext, useEffect, useState, useCallback } from "react";
import { assets } from "../assets/assets";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { AppContext } from "../contexts/AppContext";
import { useCart } from "../contexts/CartContext";
import {
	Container,
	Row,
	Col,
	Card,
	Button,
	Badge,
	Alert,
	Spinner,
	Image,
	ListGroup,
	Stack,
	Form,
	Modal,
} from "react-bootstrap";
import Apis, { authApis, endpoints } from "../configs/Apis";
import StarRating from "../components/StarRating";
import Rating from "../components/Rating";
import {
	formatDate,
	formatPrice,
	calculateAverageRating,
} from "../utils/formatUtils";

const CourseDetails = () => {
	const { courseId } = useParams();
	const { addCourseToCart, removeCourseFromCart, isInCart } = useCart();

	const [courseData, setCourseData] = useState(null);
	const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false);
	const [isInCartState, setIsInCartState] = useState(false);
	const [showReviewModal, setShowReviewModal] = useState(false);
	const [userReview, setUserReview] = useState({
		rating: 0,
		comment: "",
	});
	const [isSubmittingReview, setIsSubmittingReview] = useState(false);
	const [hasUserReviewed, setHasUserReviewed] = useState(false);
	const [existingReview, setExistingReview] = useState(null);
	const [isEditingReview, setIsEditingReview] = useState(false);
	const [certificates, setCertificates] = useState([]);
	const [isLoadingCertificates, setIsLoadingCertificates] = useState(false);
	const { user, isAuthenticated, isLoading, setIsLoading, navigate } =
		useContext(AppContext);

	const fetchCourseData = useCallback(async () => {
		try {
			setIsLoading(true);

			await Apis.get(endpoints["courseDetails"](courseId)).then((res) => {
				if (res.status === 200) {
					console.log("Course data fetched successfully:", res.data);
					setCourseData(res.data);
					setIsLoading(false);
				} else {
					throw new Error("Failed to fetch course data");
				}
			});
		} catch (error) {
			toast.error("Failed to load course details. Please try again later.");
			setCourseData(null);
			setIsLoading(false);
			console.error("Error fetching course data:", error);
		}
	}, [courseId, setIsLoading]);

	const handleAddToCart = () => {
		if (!courseData?.course) return;

		const courseToAdd = {
			id: courseData.course.id,
			name: courseData.course.name,
			price: courseData.course.price,
			image: courseData.course.image,
			instructor: courseData.course.lecturers?.[0]
				? `${courseData.course.lecturers[0].userIdFirstName} ${courseData.course.lecturers[0].userIdLastName}`
				: "Instructor",
		};

		if (addCourseToCart(courseToAdd)) {
			setIsInCartState(true);
		}
	};

	const handleRemoveFromCart = () => {
		if (!courseData?.course) return;

		removeCourseFromCart(courseData.course.id);
		setIsInCartState(false);
	};

	const handleViewCart = () => {
		navigate("/cart");
	};

	// open new reivew
	const handleWriteReview = () => {
		setIsEditingReview(false);
		setUserReview({ rating: 0, comment: "" });
		setShowReviewModal(true);
	};

	// open update review
	const handleEditReview = () => {
		if (existingReview) {
			setIsEditingReview(true);
			setUserReview({
				rating: existingReview.rate,
				comment: existingReview.comment,
			});
			setShowReviewModal(true);
		}
	};

	const handleEnrollment = () => {
		if (!isAuthenticated) {
			toast.info("Please login to enroll in this course");
			navigate("/login");
			return;
		}

		if (isAlreadyEnrolled) {
			// Navigate to course content or player
			navigate(`/course/${courseId}/learning`);
			return;
		}
	};

	useEffect(() => {
		fetchCourseData();
	}, [fetchCourseData]);

	// Check cart status
	useEffect(() => {
		if (courseData?.course) {
			setIsInCartState(isInCart(courseData.course.id));
		}
	}, [courseData, isInCart]);

	// Check if user is enrolled
	const checkEnrollmentStatus = useCallback(async () => {
		if (user && courseData?.course && isAuthenticated) {
			try {
				authApis()
					.get(endpoints["isEnrollCourse"](courseId))
					.then((res) => {
						if (res.status === 200) {
							setIsAlreadyEnrolled(res.data);
						} else {
							setIsAlreadyEnrolled(false);
						}
					});
			} catch (error) {
				console.error("Error checking enrollment status:", error);
				setIsAlreadyEnrolled(false);
			}
		} else {
			setIsAlreadyEnrolled(false);
		}
	}, [user, courseData?.course, isAuthenticated, courseId]);

	// Fetch certificates for enrolled students
	const fetchCertificates = useCallback(async () => {
		if (isAuthenticated && isAlreadyEnrolled && user) {
			try {
				setIsLoadingCertificates(true);
				const response = await authApis().get(endpoints.certificates(courseId));

				if (response.status === 200 && response.data.success) {
					setCertificates(response.data.certificates || []);
				} else {
					setCertificates([]);
				}
			} catch (error) {
				console.error("Error fetching certificates:", error);
				setCertificates([]);
			} finally {
				setIsLoadingCertificates(false);
			}
		} else {
			setCertificates([]);
		}
	}, [isAuthenticated, isAlreadyEnrolled, user, courseId]);

	// Check if user has already reviewed this course
	const checkUserReview = useCallback(() => {
		if (courseData?.courseRates && user) {
			const existingReview = courseData.courseRates.find((review) => {
				return review.studentIdUsername === user.userIdUsername;
			});

			setHasUserReviewed(!!existingReview);
			setExistingReview(existingReview || null);
		}
	}, [courseData?.courseRates, user]);

	// Handle review submission
	const handleReviewSubmit = async () => {
		if (!userReview.rating || !userReview.comment.trim()) {
			toast.error("Please provide both rating and comment");
			return;
		}

		if (userReview.comment.trim().length < 10) {
			toast.error("Comment must be at least 10 characters long");
			return;
		}

		if (userReview.comment.length > 65535) {
			toast.error(
				"Comment is too long. Please keep it under 65535 characters."
			);
			return;
		}

		setIsSubmittingReview(true);
		try {
			const reviewData = {
				rate: userReview.rating,
				comment: userReview.comment.trim(),
				courseIdId: parseInt(courseId),
				studentIdId: user?.id,
				studentIdUsername: user?.username,
			};

			// Use updateSubmitReview endpoint if editing, submitReview if creating new
			const endpoint = isEditingReview
				? endpoints["updateSubmitReview"](courseId)
				: endpoints["submitReview"](courseId);

			const method = isEditingReview ? "put" : "post";

			const response = await authApis()[method](endpoint, reviewData);

			if (response.status === 200 || response.status === 201) {
				toast.success(
					isEditingReview
						? "Review updated successfully!"
						: "Review submitted successfully!"
				);
				setShowReviewModal(false);
				setUserReview({ rating: 0, comment: "" });
				setIsEditingReview(false);
				setHasUserReviewed(true);
				// Refresh course data to show the updated review
				fetchCourseData();
			} else {
				toast.error(
					`Failed to ${
						isEditingReview ? "update" : "submit"
					} review. Please try again.`
				);
			}
		} catch (error) {
			console.error(
				`Error ${isEditingReview ? "updating" : "submitting"} review:`,
				error
			);
			if (error.response?.status === 409) {
				toast.error("You have already reviewed this course.");
				setHasUserReviewed(true);
				setShowReviewModal(false);
			} else {
				toast.error(
					error.response?.data?.message ||
						`Failed to ${
							isEditingReview ? "update" : "submit"
						} review. Please try again.`
				);
			}
		} finally {
			setIsSubmittingReview(false);
		}
	};
	useEffect(() => {
		checkEnrollmentStatus();
	}, [checkEnrollmentStatus]);

	useEffect(() => {
		checkUserReview();
	}, [checkUserReview]);

	// Fetch certificates when enrollment status changes
	useEffect(() => {
		fetchCertificates();
	}, [fetchCertificates]);

	return courseData?.course && !isLoading ? (
		<>
			<Container fluid className="px-0">
				<Row className="g-0 g-lg-4 px-3 px-md-4 pt-4 pt-md-5">
					{/* Main Content */}
					<Col xs={12} lg={8} className="pe-lg-3">
						<Card className="bg-light bg-opacity-25 h-100">
							<Card.Body className="p-3 p-md-4">
								{/* Course Title and Basic Info */}
								<h1 className="h1 fw-semibold text-dark mb-3">
									{courseData.course.name}
								</h1>

								{/* Course Description */}
								<div className="py-4">
									<h3 className="h5 fw-semibold text-dark">
										About This Course
									</h3>
									<div className="pt-3">
										<p className="mb-3">{courseData.course.description}</p>
										<Alert
											variant="primary"
											className="bg-primary bg-opacity-10 border-0"
										>
											<p className="mb-2 text-dark fw-medium">
												🎯 Ready to start learning?
											</p>
											<div className="d-flex gap-2 flex-wrap">
												{!isAuthenticated ? (
													<Button
														onClick={handleEnrollment}
														variant="primary"
														size="sm"
													>
														Login & Enroll
													</Button>
												) : (
													<></>
												)}

												{!isAlreadyEnrolled &&
													(isInCartState ? (
														<Button
															onClick={handleViewCart}
															variant="outline-success"
															size="sm"
														>
															View Cart
														</Button>
													) : (
														<Button
															onClick={handleAddToCart}
															variant="outline-primary"
															size="sm"
														>
															Add to Cart
														</Button>
													))}
											</div>
										</Alert>
									</div>
								</div>

								{/* Course Stats */}
								<Stack
									direction="horizontal"
									gap={3}
									className="pt-3 pb-3 small flex-wrap"
								>
									<Stack direction="horizontal" gap={1}>
										<StarRating
											rating={calculateAverageRating(courseData.courseRates)}
										/>
										<span className="text-dark ms-1">
											{calculateAverageRating(courseData.courseRates)}
										</span>
										<span className="text-muted">
											({courseData.courseRates?.length || 0} reviews)
										</span>
									</Stack>
									<Stack direction="horizontal" gap={1}>
										<Image
											src={assets.user_icon}
											alt="students"
											width={14}
											height={14}
										/>
										<span className="text-muted">
											{courseData.course.studentCount} students
										</span>
									</Stack>
									<Stack direction="horizontal" gap={1}>
										<Badge bg="secondary">
											{courseData.course.categoryIdName}
										</Badge>
									</Stack>
								</Stack>

								{/* Course Duration */}
								<div className="pb-4 small text-muted">
									<span>
										Course Duration: {formatDate(courseData.course.dateStart)} -{" "}
										{formatDate(courseData.course.dateEnd)}
									</span>
								</div>

								{/* Instructors Section */}
								<div className="pt-3 text-dark">
									<h2 className="h5 fw-semibold">Instructors</h2>
									<div className="pt-3">
										{courseData.course.lecturers.map((lecturer, index) => (
											<Card key={index} className="mb-3 border-light">
												<Card.Body className="d-flex align-items-center gap-3 p-3">
													<Image
														src={lecturer.userIdAvatar || assets.profile_img}
														alt={`${lecturer.userIdFirstName} ${lecturer.userIdLastName}`}
														roundedCircle
														style={{
															width: "60px",
															height: "60px",
															objectFit: "cover",
														}}
														onError={(e) => {
															e.target.src = assets.profile_img;
														}}
													/>
													<div className="flex-grow-1">
														<Card.Title className="mb-1 h6 fw-semibold">
															{lecturer.userIdFirstName}{" "}
															{lecturer.userIdLastName}
														</Card.Title>
														<Card.Text className="mb-1 small text-muted">
															@{lecturer.userIdUsername}
														</Card.Text>
														<Card.Text className="mb-0 small text-primary">
															{lecturer.countCourse} courses
														</Card.Text>
													</div>
												</Card.Body>
											</Card>
										))}
									</div>
								</div>

								{/* Course Content Preview */}
								<div className="pt-4 text-dark">
									<h2 className="h5 fw-semibold">What You'll Learn</h2>
									<div className="pt-3">
										<Card className="border-light">
											<Card.Body className="p-4">
												<Row className="g-3">
													<Col md={6}>
														<Stack
															direction="horizontal"
															gap={2}
															className="align-items-start"
														>
															<span className="text-primary">📚</span>
															<span className="small">
																Comprehensive video lectures
															</span>
														</Stack>
													</Col>
													<Col md={6}>
														<Stack
															direction="horizontal"
															gap={2}
															className="align-items-start"
														>
															<span className="text-primary">💡</span>
															<span className="small">
																Hands-on practical exercises
															</span>
														</Stack>
													</Col>
													<Col md={6}>
														<Stack
															direction="horizontal"
															gap={2}
															className="align-items-start"
														>
															<span className="text-primary">📝</span>
															<span className="small">
																Assignments and projects
															</span>
														</Stack>
													</Col>
													<Col md={6}>
														<Stack
															direction="horizontal"
															gap={2}
															className="align-items-start"
														>
															<span className="text-primary">🏆</span>
															<span className="small">
																Certificate of completion
															</span>
														</Stack>
													</Col>
												</Row>
											</Card.Body>
										</Card>
									</div>
								</div>

								{/* Certificate Section - Only for Enrolled Students */}
								{isAuthenticated && isAlreadyEnrolled && (
									<div className="pt-4 text-dark">
										<h2 className="h5 fw-semibold">Your Certificate</h2>
										<div className="pt-3">
											{isLoadingCertificates ? (
												<Card className="border-light">
													<Card.Body className="p-4 text-center">
														<Spinner animation="border" className="mb-3" />
														<p className="text-muted mb-0">
															Checking for certificates...
														</p>
													</Card.Body>
												</Card>
											) : certificates.length > 0 ? (
												<Card className="border-success border-2">
													<Card.Body className="p-4">
														<div className="d-flex align-items-start">
															<div className="bg-success bg-opacity-10 rounded-circle p-3 me-3">
																<span style={{ fontSize: "2rem" }}>🏆</span>
															</div>
															<div className="flex-grow-1">
																<h5 className="text-success fw-semibold mb-2">
																	🎉 Congratulations! Certificate Available
																</h5>
																<p className="text-dark mb-3">
																	You have successfully completed this course
																	with a progress of{" "}
																	<strong>
																		{Math.round(
																			certificates[0].courseStudentIdProgress *
																				100
																		)}
																		%
																	</strong>
																	. Your certificate of completion is ready for
																	download.
																</p>
																<div className="d-flex gap-2 align-items-center">
																	<Button
																		variant="success"
																		onClick={() => {
																			const cert = certificates[0];
																			if (cert && cert.downloadLink) {
																				window.open(
																					cert.downloadLink,
																					"_blank"
																				);
																			} else {
																				toast.error(
																					"Certificate download link not available"
																				);
																			}
																		}}
																		className="fw-medium"
																	>
																		<span className="me-2">📄</span>
																		Download Certificate
																	</Button>
																	<Badge bg="success" className="px-3 py-2">
																		Course Completed
																	</Badge>
																</div>
																<div className="mt-3 pt-3 border-top border-light">
																	<small className="text-muted">
																		<strong>Course:</strong>{" "}
																		{
																			certificates[0]
																				.courseStudentIdCourseIdName
																		}
																		<br />
																		<strong>Student:</strong>{" "}
																		{
																			certificates[0]
																				.courseStudentIdStudentIdUserIdFirstName
																		}{" "}
																		{
																			certificates[0]
																				.courseStudentIdStudentIdUserIdLastName
																		}
																		<br />
																		<strong>Username:</strong> @
																		{
																			certificates[0]
																				.courseStudentIdStudentIdUserIdUsername
																		}
																	</small>
																</div>
															</div>
														</div>
													</Card.Body>
												</Card>
											) : (
												<Card className="border-light">
													<Card.Body className="p-4 text-center">
														<div
															className="bg-light rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center"
															style={{ width: "80px", height: "80px" }}
														>
															<span style={{ fontSize: "2rem" }}>🌟</span>
														</div>
														<h6 className="text-dark fw-semibold mb-2">
															Complete the Course to Earn Your Certificate
														</h6>
														<p className="text-muted mb-0">
															Finish all lessons and exercises to receive your
															certificate of completion. Your progress will be
															tracked automatically.
														</p>
													</Card.Body>
												</Card>
											)}
										</div>
									</div>
								)}

								{/* Student Reviews Section - Full Access for All Users */}
								<div className="py-4 border-top border-light">
									<div className="d-flex justify-content-between align-items-center mb-4">
										<h3 className="h5 fw-semibold text-dark mb-0">
											Student Reviews ({courseData.courseRates?.length || 0}{" "}
											reviews)
										</h3>
										{/* Add Review Button for Enrolled Students */}
										{isAuthenticated && isAlreadyEnrolled && (
											<div>
												{hasUserReviewed ? (
													<div className="d-flex gap-2 align-items-center">
														<Badge bg="success" className="px-3 py-2">
															<span className="me-2">✓</span>
															You've reviewed this course
														</Badge>
														<Button
															variant="outline-secondary"
															size="sm"
															onClick={handleEditReview}
														>
															Edit Review
														</Button>
													</div>
												) : (
													<Button
														variant="outline-primary"
														size="sm"
														onClick={handleWriteReview}
													>
														Write a Review
													</Button>
												)}
											</div>
										)}
									</div>

									{/* Message for enrolled students */}
									{isAuthenticated && isAlreadyEnrolled && !hasUserReviewed && (
										<Alert variant="info" className="mb-4">
											<div className="d-flex align-items-center">
												<span className="me-2">💭</span>
												<div>
													<strong>Share your experience!</strong>
													<br />
													<small>
														Help other students by leaving a review about this
														course.
													</small>
												</div>
											</div>
										</Alert>
									)}

									{/* Reviews List */}
									{courseData.courseRates &&
									courseData.courseRates.length > 0 ? (
										<Row className="g-3">
											{courseData.courseRates.map((review, index) => (
												<Col key={review.id} md={6}>
													<Card
														className={`shadow-sm ${
															user && review.studentIdUsername === user.username
																? "border-primary"
																: ""
														}`}
													>
														<Card.Body className="p-3">
															<Stack
																direction="horizontal"
																gap={2}
																className="align-items-center mb-2"
															>
																<StarRating rating={review.rate} />
																<small className="text-muted">
																	by @{review.studentIdUsername}
																	{user &&
																		review.studentIdUsername ===
																			user.username && (
																			<Badge
																				bg="primary"
																				className="ms-2"
																				style={{ fontSize: "0.6rem" }}
																			>
																				Your review
																			</Badge>
																		)}
																</small>
															</Stack>
															<Card.Text className="small mb-0 text-dark">
																"{review.comment}"
															</Card.Text>
														</Card.Body>
													</Card>
												</Col>
											))}
										</Row>
									) : (
										<div className="text-center py-4">
											<div className="mb-3">
												<span style={{ fontSize: "3rem" }}>📝</span>
											</div>
											<h5 className="text-muted mb-2">No reviews yet</h5>
											<p className="text-muted mb-0">
												{isAuthenticated &&
												isAlreadyEnrolled &&
												!hasUserReviewed
													? "Be the first to share your experience with this course!"
													: "Student reviews will appear here once they start sharing their experiences."}
											</p>
										</div>
									)}
								</div>
							</Card.Body>
						</Card>
					</Col>

					{/* Sidebar */}
					<Col xs={12} lg={4} className="mt-4 mt-lg-4">
						<div className="position-sticky" style={{ top: "20px" }}>
							<Card className="shadow">
								{/* Course Image */}
								<div className="position-relative">
									<Card.Img
										variant="top"
										src={courseData.course.image}
										alt={courseData.course.name}
										style={{ height: "200px", objectFit: "cover" }}
										onError={(e) => {
											e.target.src = assets.course_1; // default image
										}}
									/>
								</div>

								<Card.Body className="p-4">
									{/* Enrollment Notice */}
									<Alert variant="info" className="py-2 px-3 mb-3 border-0">
										<Stack
											direction="horizontal"
											gap={2}
											className="small align-items-center"
										>
											<span>🚀</span>
											<strong>Start Learning Today - Lifetime Access!</strong>
										</Stack>
									</Alert>

									{/* Price */}
									<div className="mb-3">
										<p className="text-dark h2 fw-semibold mb-0">
											{formatPrice(courseData.course.price)}
										</p>
										<p className="small text-muted">One-time payment</p>
									</div>

									{/* Course Stats */}
									<Stack
										direction="horizontal"
										gap={3}
										className="pt-2 text-muted mb-4 flex-wrap small"
									>
										<Stack direction="horizontal" gap={1}>
											<StarRating
												rating={calculateAverageRating(courseData.courseRates)}
											/>
											<span className="ms-1">
												{calculateAverageRating(courseData.courseRates)}
											</span>
										</Stack>
										<Stack direction="horizontal" gap={1}>
											<Image
												src={assets.user_icon}
												alt="students"
												width={16}
												height={16}
											/>
											<span>{courseData.course.studentCount} students</span>
										</Stack>
										<Stack direction="horizontal" gap={1}>
											<Image
												src={assets.lesson_icon}
												alt="lessons"
												width={16}
												height={16}
											/>
											<span>Multiple lessons</span>
										</Stack>
									</Stack>

									{/* Enrollment Button */}
									{isAlreadyEnrolled && isAlreadyEnrolled ? (
										<div className="mb-4">
											<Button
												onClick={handleEnrollment}
												variant="success"
												size="lg"
												className="w-100 py-3 fw-medium mb-3"
												style={{
													boxShadow: "0 4px 12px rgba(25, 135, 84, 0.3)",
												}}
											>
												<span className="me-2">✓</span>
												Learn Now - Enrolled
											</Button>

											{/* Certificate Download Section */}
											{certificates.length > 0 && (
												<Alert variant="success" className="py-3 px-3 border-0">
													<div className="d-flex align-items-center justify-content-between">
														<div className="d-flex align-items-center">
															<span className="me-2">🏆</span>
															<div>
																<strong>Certificate Available!</strong>
																<br />
																<small className="text-muted">
																	Congratulations! You've completed this course.
																</small>
															</div>
														</div>
														<Button
															variant="outline-success"
															size="sm"
															onClick={() => {
																const cert = certificates[0];
																if (cert && cert.downloadLink) {
																	window.open(cert.downloadLink, "_blank");
																} else {
																	toast.error(
																		"Certificate download link not available"
																	);
																}
															}}
															disabled={isLoadingCertificates}
														>
															{isLoadingCertificates ? (
																<Spinner animation="border" size="sm" />
															) : (
																<>
																	<span className="me-1">📄</span>
																	Download
																</>
															)}
														</Button>
													</div>
												</Alert>
											)}

											{/* Certificate Loading State */}
											{isLoadingCertificates && certificates.length === 0 && (
												<Alert variant="info" className="py-2 px-3 border-0">
													<div className="d-flex align-items-center">
														<Spinner
															animation="border"
															size="sm"
															className="me-2"
														/>
														<small>Checking for certificates...</small>
													</div>
												</Alert>
											)}
										</div>
									) : (
										<div className="mb-4">
											{/* Cart Actions */}
											{isInCartState ? (
												<div className="d-grid gap-2">
													<Button
														onClick={handleViewCart}
														variant="outline-success"
														size="md"
														className="fw-medium"
													>
														<span className="me-2">🛒</span>
														View Cart & Checkout
													</Button>
													<Button
														onClick={handleRemoveFromCart}
														variant="outline-secondary"
														size="sm"
													>
														Remove from Cart
													</Button>
												</div>
											) : (
												<Button
													onClick={handleAddToCart}
													variant="outline-primary"
													size="md"
													className="w-100 fw-medium"
												>
													<span className="me-2">🛒</span>
													Add to Cart
												</Button>
											)}
										</div>
									)}

									{/* What's Included */}
									<div>
										<p className="h6 fw-medium text-dark mb-3">
											What's included:
										</p>
										<ListGroup variant="flush">
											<ListGroup.Item className="px-0 py-2 border-0">
												<Stack
													direction="horizontal"
													gap={2}
													className="align-items-start"
												>
													<span
														className="text-success"
														style={{ marginTop: "2px" }}
													>
														✓
													</span>
													<span className="small">
														Video lectures and materials
													</span>
												</Stack>
											</ListGroup.Item>
											<ListGroup.Item className="px-0 py-2 border-0">
												<Stack
													direction="horizontal"
													gap={2}
													className="align-items-start"
												>
													<span
														className="text-success"
														style={{ marginTop: "2px" }}
													>
														✓
													</span>
													<span className="small">
														Hands-on exercises and assignments
													</span>
												</Stack>
											</ListGroup.Item>
											<ListGroup.Item className="px-0 py-2 border-0">
												<Stack
													direction="horizontal"
													gap={2}
													className="align-items-start"
												>
													<span
														className="text-success"
														style={{ marginTop: "2px" }}
													>
														✓
													</span>
													<span className="small">
														Direct access to instructors
													</span>
												</Stack>
											</ListGroup.Item>
											<ListGroup.Item className="px-0 py-2 border-0">
												<Stack
													direction="horizontal"
													gap={2}
													className="align-items-start"
												>
													<span
														className="text-success"
														style={{ marginTop: "2px" }}
													>
														✓
													</span>
													<span className="small">
														Certificate upon completion
													</span>
												</Stack>
											</ListGroup.Item>
											<ListGroup.Item className="px-0 py-2 mt-3 pt-2 border-top border-light">
												<Stack
													direction="horizontal"
													gap={2}
													className="align-items-start"
												>
													<span
														className="text-success"
														style={{ marginTop: "2px" }}
													>
														⭐
													</span>
													<span className="text-dark fw-medium small">
														30-day money-back guarantee
													</span>
												</Stack>
											</ListGroup.Item>
										</ListGroup>

										{/* Social Proof for All Users */}
										<Card className="mt-4 bg-light border-0">
											<Card.Body className="p-3 text-center">
												<Card.Text className="small mb-2 text-muted">
													Join {courseData.course.studentCount}+ students
													already learning
												</Card.Text>
												{!isAlreadyEnrolled && (
													<div className="d-flex gap-2 justify-content-center">
														{isInCartState ? (
															<Button
																onClick={handleViewCart}
																variant="outline-success"
																size="sm"
															>
																View Cart
															</Button>
														) : (
															<Button
																onClick={handleAddToCart}
																variant="outline-secondary"
																size="sm"
															>
																Add to Cart
															</Button>
														)}
													</div>
												)}
											</Card.Body>
										</Card>
									</div>
								</Card.Body>
							</Card>
						</div>
					</Col>
				</Row>
			</Container>

			{/* Show Add to Cart on Mobile */}
			{!isAlreadyEnrolled && (
				<div
					className="d-lg-none position-fixed bottom-0 start-0 w-100 bg-white border-top shadow"
					style={{ zIndex: 1000 }}
				>
					<Container className="p-3">
						<div className="d-flex gap-2">
							{isInCartState ? (
								<Button
									onClick={handleViewCart}
									variant="outline-primary"
									size="lg"
									className="flex-fill py-3 fw-medium"
									style={{ minWidth: "60px" }}
								>
									Go To Cart 🛒 - {formatPrice(courseData.course.price)}
								</Button>
							) : (
								<Button
									onClick={handleAddToCart}
									variant="primary"
									size="lg"
									className="flex-fill py-3 fw-medium"
									style={{ minWidth: "60px" }}
								>
									Add To Cart 🛒 - {formatPrice(courseData.course.price)}
								</Button>
							)}
						</div>
					</Container>
				</div>
			)}

			{/* Review Modal */}
			<Modal
				show={showReviewModal}
				onHide={() => setShowReviewModal(false)}
				centered
				size="lg"
			>
				<Modal.Header closeButton>
					<Modal.Title>
						{isEditingReview ? "Edit Your Review" : "Write a Review"} for "
						{courseData?.course?.name}"
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<div className="mb-4">
						<Form.Label className="fw-semibold mb-3">
							Rate this course: <span className="text-danger">*</span>
						</Form.Label>
						<div className="d-flex align-items-center gap-3">
							<Rating
								initialRating={userReview.rating}
								onRate={(rating) =>
									setUserReview((prev) => ({ ...prev, rating }))
								}
								size="32px"
							/>
							{userReview.rating > 0 && (
								<Badge bg="primary">
									{userReview.rating} star{userReview.rating !== 1 ? "s" : ""}
								</Badge>
							)}
						</div>
					</div>
					<Form.Group className="mb-3">
						<Form.Label className="fw-semibold">
							Your Review: <span className="text-danger">*</span>
						</Form.Label>
						<Form.Control
							as="textarea"
							rows={5}
							placeholder="Share your detailed thoughts about this course... What did you like? What could be improved? Would you recommend it to others?"
							value={userReview.comment}
							onChange={(e) =>
								setUserReview((prev) => ({ ...prev, comment: e.target.value }))
							}
							maxLength={65535}
							className={
								userReview.comment.trim() && userReview.comment.length >= 10
									? "border-success"
									: userReview.comment.trim() && userReview.comment.length < 10
									? "border-warning"
									: ""
							}
						/>
						<div className="d-flex justify-content-between mt-2">
							<Form.Text className="text-muted">
								{userReview.comment.length < 10 &&
									userReview.comment.length > 0 && (
										<span className="text-warning">
											Please write at least 10 characters for a meaningful
											review.
										</span>
									)}
								{userReview.comment.length >= 10 && (
									<span className="text-success">
										Great! Your review looks good.
									</span>
								)}
							</Form.Text>
							<Form.Text className="text-muted">
								{userReview.comment.length}/65535 characters
							</Form.Text>
						</div>
					</Form.Group>
					<Alert variant="info" className="d-flex align-items-start">
						<span className="me-2">💡</span>
						<div>
							<small>
								<strong>Tip:</strong> Write an honest and helpful review.
								Consider mentioning the course content, instructor quality,
								practical exercises, and overall learning experience.
							</small>
						</div>
					</Alert>
				</Modal.Body>
				<Modal.Footer>
					<Button
						variant="secondary"
						onClick={() => {
							setShowReviewModal(false);
							setUserReview({ rating: 0, comment: "" });
							setIsEditingReview(false);
						}}
						disabled={isSubmittingReview}
					>
						Cancel
					</Button>
					<Button
						variant="primary"
						onClick={handleReviewSubmit}
						disabled={
							isSubmittingReview ||
							!userReview.rating ||
							!userReview.comment.trim() ||
							userReview.comment.length < 10
						}
					>
						{isSubmittingReview ? (
							<>
								<Spinner animation="border" size="sm" className="me-2" />
								{isEditingReview ? "Updating..." : "Submitting..."}
							</>
						) : (
							<>{isEditingReview ? "Update Review" : "Submit Review"}</>
						)}
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	) : (
		<Container
			className="d-flex justify-content-center align-items-center"
			style={{ minHeight: "50vh" }}
		>
			<Spinner animation="border" role="status">
				<span className="visually-hidden">Loading...</span>
			</Spinner>
		</Container>
	);
};

export default CourseDetails;
