import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { useCart } from "../contexts/CartContext";
import { FaCheckCircle, FaArrowRight } from "react-icons/fa";

const PaymentSuccess = () => {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const { cleanupAfterPayment, isLoaded } = useCart();
	const sessionId = searchParams.get("session_id");

	useEffect(() => {
		if (sessionId && isLoaded) {
			cleanupAfterPayment(sessionId);
		}
	}, [sessionId, isLoaded, cleanupAfterPayment]);

	useEffect(() => {
		// Show success message
		toast.success("Payment successful! Welcome to your new courses!");

		// Redirect to my-enrollments after 3 seconds
		const redirectTimer = setTimeout(() => {
			navigate("/my-enrollments");
		}, 3000);

		return () => clearTimeout(redirectTimer);
	}, [navigate]);

	const handleViewEnrollments = () => {
		navigate("/my-enrollments");
	};

	const handleContinueShopping = () => {
		navigate("/course-list");
	};

	return (
		<Container className="py-5">
			<Row className="justify-content-center">
				<Col xs={12} md={8} lg={6}>
					<Card className="text-center shadow border-0">
						<Card.Body className="p-5">
							{/* Success Icon */}
							<div className="mb-4">
								<FaCheckCircle size={80} className="text-success" />
							</div>

							{/* Success Message */}
							<h1 className="h2 fw-bold text-success mb-3">
								Payment Successful!
							</h1>

							<p className="text-muted mb-4 lead">
								Thank you for your purchase! Your courses have been added to
								your account.
							</p>

							{/* Session Info (if available) */}
							{sessionId && (
								<div className="bg-light rounded p-3 mb-4">
									<p className="small text-muted mb-1">Transaction ID:</p>
									<p className="small fw-medium mb-0">{sessionId}</p>
								</div>
							)}

							{/* Action Buttons */}
							<div className="d-grid gap-3">
								<Button
									onClick={handleViewEnrollments}
									variant="primary"
									size="lg"
									className="py-3 fw-medium"
								>
									<span className="me-2">📚</span>
									View My Enrollments
									<FaArrowRight className="ms-2" size={16} />
								</Button>

								<Button
									onClick={handleContinueShopping}
									variant="outline-secondary"
									size="md"
								>
									Continue Shopping
								</Button>
							</div>

							{/* Auto Redirect Notice */}
							<div className="mt-4 pt-3 border-top">
								<small className="text-muted mb-0">
									<Spinner animation="border" size="sm" className="me-2" />
									You'll be automatically redirected to your enrollments in a
									few seconds...
								</small>
							</div>
						</Card.Body>
					</Card>
				</Col>
			</Row>

			{/* Additional Info */}
			<Row className="justify-content-center mt-5">
				<Col xs={12} md={10} lg={8}>
					<Card className="bg-light border-0">
						<Card.Body className="p-4">
							<h3 className="h5 fw-semibold mb-3">What's Next?</h3>
							<Row>
								<Col md={4} className="mb-3">
									<div className="text-center">
										<div
											className="bg-primary bg-opacity-10 rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center"
											style={{ width: "60px", height: "60px" }}
										>
											<span className="fs-4">🎓</span>
										</div>
										<h6 className="fw-semibold">Start Learning</h6>
										<p className="small text-muted">
											Access your courses immediately from your enrollments page
										</p>
									</div>
								</Col>
								<Col md={4} className="mb-3">
									<div className="text-center">
										<div
											className="bg-success bg-opacity-10 rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center"
											style={{ width: "60px", height: "60px" }}
										>
											<span className="fs-4">📧</span>
										</div>
										<h6 className="fw-semibold">Check Your Email</h6>
										<p className="small text-muted">
											You'll receive a confirmation email with course details
										</p>
									</div>
								</Col>
								<Col md={4} className="mb-3">
									<div className="text-center">
										<div
											className="bg-info bg-opacity-10 rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center"
											style={{ width: "60px", height: "60px" }}
										>
											<span className="fs-4">🏆</span>
										</div>
										<h6 className="fw-semibold">Earn Certificates</h6>
										<p className="small text-muted">
											Complete courses to earn certificates of completion
										</p>
									</div>
								</Col>
							</Row>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</Container>
	);
};

export default PaymentSuccess;
