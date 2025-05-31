import React, { useContext, useState } from "react";
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
	Form,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaTrash, FaShoppingCart, FaCreditCard } from "react-icons/fa";
import { toast } from "react-toastify";
import { AppContext } from "../contexts/AppContext";
import { useCart } from "../contexts/CartContext";
import { assets } from "../assets/assets";
import { formatPrice } from "../utils/formatUtils";
import { authApis, endpoints } from "../configs/Apis";

const Cart = () => {
	const { user, isAuthenticated, navigate, isLoading } = useContext(AppContext);
	const {
		cartItems,
		selectedItems,
		removeCourseFromCart,
		clearCart,
		toggleItemSelection,
		selectAllItems,
		deselectAllItems,
		getSelectedTotal,
		getSelectedItemCount,
	} = useCart();
	const [processing, setProcessing] = useState(false);

	const handlePayment = async () => {
		if (!isAuthenticated) {
			toast.error("Please login to proceed with payment");
			navigate("/login");
			return;
		}

		if (getSelectedItemCount() === 0) {
			toast.error("Please select at least one course to proceed");
			return;
		}

		setProcessing(true);

		try {
			// Prepare payment data
			const selectedCourseIds = Array.from(selectedItems);
			const paymentData = {
				studentId: user.id?.toString(),
				courseIds: selectedCourseIds,
			};

			// Create payment session endpoint (you'll need to add this to your endpoints)
			const response = await authApis().post(
				endpoints.createPaymentSession,
				paymentData
			);

			if (response.status === 200 && response.data.status === "SUCCESS") {
				const { sessionUrl, sessionId } = response.data;

				// Store selected courses in session storage for post-payment cleanup
				sessionStorage.setItem(
					"pendingPaymentCourses",
					JSON.stringify({
						paymentSessionId: sessionId,
						pendingCourseIds: selectedCourseIds,
					})
				);

				// Redirect to Stripe payment page
				window.location.href = sessionUrl;
			} else {
				throw new Error(
					response.data.message || "Payment session creation failed"
				);
			}
		} catch (error) {
			console.error("Payment error:", error);
			toast.error(
				error.response?.data?.message ||
					"Failed to create payment session. Please try again."
			);
		} finally {
			setProcessing(false);
		}
	};

	if (isLoading) {
		return (
			<Container className="py-5 text-center">
				<Spinner animation="border" role="status">
					<span className="visually-hidden">Loading...</span>
				</Spinner>
			</Container>
		);
	}

	return (
		<Container className="py-4 py-md-5">
			<Row>
				<Col xs={12}>
					<div className="d-flex align-items-center justify-content-between mb-4">
						<h1 className="h2 fw-bold text-dark">
							<FaShoppingCart className="me-2 text-primary" />
							Shopping Cart
						</h1>
						{cartItems.length > 0 && (
							<Button
								variant="outline-danger"
								size="sm"
								onClick={clearCart}
								className="d-flex align-items-center"
							>
								<FaTrash className="me-2" />
								Clear Cart
							</Button>
						)}
					</div>

					{cartItems.length === 0 ? (
						<Card className="text-center py-5">
							<Card.Body>
								<FaShoppingCart size={64} className="text-muted mb-3" />
								<h3 className="h4 text-muted mb-3">Your cart is empty</h3>
								<p className="text-muted mb-4">
									Browse our courses and add them to your cart to get started!
								</p>
								<Link to="/course-list">
									<Button variant="primary" size="lg">
										Browse Courses
									</Button>
								</Link>
							</Card.Body>
						</Card>
					) : (
						<Row>
							{/* Cart Items */}
							<Col lg={8}>
								<Card className="shadow-sm">
									<Card.Header className="bg-white border-bottom">
										<div className="d-flex align-items-center justify-content-between">
											<h5 className="mb-0 fw-semibold">
												Cart Items ({cartItems.length})
											</h5>
											<Form.Check
												type="checkbox"
												id="select-all"
												label="Select All"
												checked={
													selectedItems.size === cartItems.length &&
													cartItems.length > 0
												}
												onChange={() => {
													if (selectedItems.size === cartItems.length) {
														deselectAllItems();
													} else {
														selectAllItems();
													}
												}}
												className="fw-medium"
											/>
										</div>
									</Card.Header>
									<Card.Body className="p-0">
										<ListGroup variant="flush">
											{cartItems.map((course, index) => (
												<ListGroup.Item key={course.id} className="p-3 p-md-4">
													<Row className="align-items-center">
														<Col xs={12} sm="auto" className="mb-3 mb-sm-0">
															<Form.Check
																type="checkbox"
																id={`course-${course.id}`}
																checked={selectedItems.has(course.id)}
																onChange={() => toggleItemSelection(course.id)}
																className="me-3"
															/>
														</Col>
														<Col xs={12} sm={3} className="mb-3 mb-sm-0">
															<Image
																src={course.image || assets.course_1}
																alt={course.name}
																className="w-100 rounded"
																style={{
																	height: "80px",
																	objectFit: "cover",
																	maxWidth: "120px",
																}}
															/>
														</Col>
														<Col xs={12} sm={6}>
															<h6 className="fw-semibold mb-2 text-dark">
																{course.name}
															</h6>
															<p className="text-muted small mb-2">
																{course.description ||
																	"Learn this amazing course"}
															</p>
															{course.categoryIdName && (
																<Badge bg="light" text="dark" className="me-2">
																	{course.categoryIdName}
																</Badge>
															)}
															{course.lecturers &&
																course.lecturers.length > 0 && (
																	<span className="text-muted small">
																		by {course.lecturers[0].userIdFirstName}{" "}
																		{course.lecturers[0].userIdLastName}
																	</span>
																)}
														</Col>
														<Col xs={12} sm={2} className="text-sm-end">
															<div className="d-flex align-items-center justify-content-between justify-content-sm-end">
																<h6 className="fw-bold text-primary mb-0">
																	{formatPrice(course.price)}
																</h6>
																<Button
																	variant="outline-danger"
																	size="sm"
																	onClick={() =>
																		removeCourseFromCart(course.id)
																	}
																	className="ms-2"
																	title="Remove from cart"
																>
																	<FaTrash />
																</Button>
															</div>
														</Col>
													</Row>
												</ListGroup.Item>
											))}
										</ListGroup>
									</Card.Body>
								</Card>
							</Col>

							{/* Order Summary */}
							<Col lg={4}>
								<Card
									className="shadow-sm position-sticky"
									style={{ top: "100px" }}
								>
									<Card.Header className="bg-primary text-white">
										<h5 className="mb-0 fw-semibold">Order Summary</h5>
									</Card.Header>
									<Card.Body>
										<div className="mb-3">
											<div className="d-flex justify-content-between mb-2">
												<span>Selected Items:</span>
												<span className="fw-medium">
													{getSelectedItemCount()}
												</span>
											</div>
											<div className="d-flex justify-content-between mb-2">
												<span>Subtotal:</span>
												<span className="fw-medium">
													{formatPrice(getSelectedTotal())}
												</span>
											</div>
											<hr />
											<div className="d-flex justify-content-between">
												<span className="fw-bold">Total:</span>
												<span className="fw-bold text-primary fs-5">
													{formatPrice(getSelectedTotal())}
												</span>
											</div>
										</div>

										{getSelectedItemCount() > 0 && (
											<Alert variant="info" className="small mb-3">
												<strong>Note:</strong> You will be redirected to Stripe
												for secure payment processing.
											</Alert>
										)}

										<div className="d-grid gap-2">
											<Button
												variant="primary"
												size="lg"
												onClick={handlePayment}
												disabled={getSelectedItemCount() === 0 || processing}
												className="d-flex align-items-center justify-content-center"
											>
												{processing ? (
													<>
														<Spinner
															as="span"
															animation="border"
															size="sm"
															role="status"
															aria-hidden="true"
															className="me-2"
														/>
														Processing...
													</>
												) : (
													<>
														<FaCreditCard className="me-2" />
														Proceed to Payment
													</>
												)}
											</Button>
											<Link to="/course-list">
												<Button variant="outline-secondary" className="w-100">
													Continue Shopping
												</Button>
											</Link>
										</div>
									</Card.Body>
								</Card>
							</Col>
						</Row>
					)}
				</Col>
			</Row>
		</Container>
	);
};

export default Cart;
