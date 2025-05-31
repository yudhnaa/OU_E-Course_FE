import React, { useContext, useEffect, useState } from "react";
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
} from "react-bootstrap";
import Apis, { authApis, endpoints } from "../configs/Apis";
import StarRating from "../components/StarRating";
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
	const { user, isAuthenticated, isLoading, setIsLoading, navigate } =
		useContext(AppContext);

	const fetchCourseData = async () => {
		try {
			setIsLoading(true);

			let response = await Apis.get(endpoints["courseDetails"](courseId)).then(
				(res) => {
					if (res.status === 200) {
						setCourseData(res.data);
						setIsLoading(false);
					} else {
						throw new Error("Failed to fetch course data");
					}
				}
			);
		} catch (error) {
			toast.error("Failed to load course details. Please try again later.");
			setCourseData(null);
			setIsLoading(false);
			console.error("Error fetching course data:", error);
		}
	};

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

	const handleEnrollment = () => {
		if (!isAuthenticated) {
			toast.info("Please login to enroll in this course");
			navigate("/login");
			return;
		}

		if (isAlreadyEnrolled) {
			// Navigate to course content or player
			navigate(`/my-enrollments/${courseId}`);
			return;
		}
	};

	useEffect(() => {
		fetchCourseData();
	}, [courseId, isAuthenticated]);

	// Check cart status when course data changes
	useEffect(() => {
		if (courseData?.course) {
			setIsInCartState(isInCart(courseData.course.id));
		}
	}, [courseData, isInCart]);

	// Check if user is enrolled - this would typically come from API
	const checkEnrollmentStatus = async () => {
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
	};
	useEffect(() => {
		checkEnrollmentStatus();
	}, [user, courseData, isAuthenticated, courseId]);

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

								{/* Student Reviews Section - Full Access for All Users */}
								{courseData.courseRates &&
									courseData.courseRates.length > 0 && (
										<div className="py-4 border-top border-light">
											<h3 className="h5 fw-semibold text-dark mb-4">
												What Students Are Saying (
												{courseData.courseRates.length} reviews)
											</h3>
											<Row className="g-3">
												{courseData.courseRates.map((review, index) => (
													<Col key={review.id} md={6}>
														<Card className="shadow-sm">
															<Card.Body className="p-3">
																<Stack
																	direction="horizontal"
																	gap={2}
																	className="align-items-center mb-2"
																>
																	<StarRating rating={review.rate} />
																	<small className="text-muted">
																		by @{review.studentIdUsername}
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
										</div>
									)}

								{/* Fallback Reviews for when no reviews exist */}
								{(!courseData.courseRates ||
									courseData.courseRates.length === 0) && (
									<div className="py-4 border-top border-light">
										<h3 className="h5 fw-semibold text-dark mb-4">
											Student Reviews
										</h3>
										<div className="text-center py-4">
											<p className="text-muted">
												No reviews yet. Be the first to review this course!
											</p>
										</div>
									</div>
								)}
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
									{isAlreadyEnrolled ? (
										<Button
											onClick={handleEnrollment}
											variant="success"
											size="lg"
											className="w-100 py-3 fw-medium mb-4"
											style={{
												boxShadow: "0 4px 12px rgba(25, 135, 84, 0.3)",
											}}
										>
											<span className="me-2">✓</span>
											Enrolled - Access Course
										</Button>
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

			{/* Floating CTA for Mobile - Always Visible for Purchase */}
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
