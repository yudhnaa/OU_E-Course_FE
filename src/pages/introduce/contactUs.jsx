import React, { useState } from "react";
import {
	Container,
	Row,
	Col,
	Card,
	Form,
	Button,
	Alert,
	Badge,
} from "react-bootstrap";
import {
	FaEnvelope,
	FaPhone,
	FaMapMarkerAlt,
	FaClock,
	FaFacebookF,
	FaTwitter,
	FaLinkedinIn,
	FaInstagram,
	FaPaperPlane,
} from "react-icons/fa";

const ContactUs = () => {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		subject: "",
		message: "",
	});
	const [showAlert, setShowAlert] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsSubmitting(true);

		// Simulate form submission
		setTimeout(() => {
			setShowAlert(true);
			setIsSubmitting(false);
			setFormData({ name: "", email: "", subject: "", message: "" });
			setTimeout(() => setShowAlert(false), 5000);
		}, 2000);
	};

	const contactInfo = [
		{
			icon: FaEnvelope,
			title: "Email Us",
			primary: "support@e-course.com",
			secondary: "Available 24/7 for assistance",
			color: "primary",
		},
		{
			icon: FaPhone,
			title: "Call Us",
			primary: "+1 (555) 123-4567",
			secondary: "Mon-Fri: 9:00 AM - 6:00 PM EST",
			color: "success",
		},
		{
			icon: FaMapMarkerAlt,
			title: "Visit Us",
			primary: "123 Education Street",
			secondary: "New York, NY 10001, USA",
			color: "warning",
		},
		{
			icon: FaClock,
			title: "Business Hours",
			primary: "Monday - Friday",
			secondary: "9:00 AM - 6:00 PM EST",
			color: "info",
		},
	];

	const departments = [
		{ value: "general", label: "General Inquiry" },
		{ value: "technical", label: "Technical Support" },
		{ value: "billing", label: "Billing & Payments" },
		{ value: "partnerships", label: "Business Partnerships" },
		{ value: "careers", label: "Careers" },
		{ value: "press", label: "Press & Media" },
	];

	return (
		<div className="min-vh-100" style={{ backgroundColor: "#f8f9fa" }}>
			{/* Hero Section */}
			<div
				className="position-relative text-white py-5"
				style={{
					background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
					minHeight: "350px",
				}}
			>
				<div
					className="position-absolute w-100 h-100"
					style={{
						background:
							'url(\'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="white" fill-opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>\')',
						opacity: 0.3,
					}}
				></div>

				<Container className="position-relative h-100 d-flex align-items-center">
					<Row className="w-100">
						<Col lg={8} className="mx-auto text-center">
							<Badge
								bg="light"
								text="dark"
								className="mb-3 px-3 py-2 fw-normal"
							>
								Get In Touch
							</Badge>
							<h1 className="display-4 fw-bold mb-4">Contact Us</h1>
							<p className="lead mb-0" style={{ fontSize: "1.25rem" }}>
								Have questions, feedback, or need support? We're here to help!
								Reach out to us and we'll get back to you as soon as possible.
							</p>
						</Col>
					</Row>
				</Container>
			</div>

			<Container className="py-5">
				{/* Contact Info Cards */}
				<Row className="mb-5">
					<Col lg={10} className="mx-auto">
						<Row className="g-4">
							{contactInfo.map((info, index) => (
								<Col md={6} lg={3} key={index}>
									<Card className="h-100 border-0 shadow-sm text-center">
										<Card.Body className="p-4">
											<div
												className={`bg-${info.color} bg-opacity-10 rounded-3 d-inline-flex align-items-center justify-content-center mb-3`}
												style={{ width: "60px", height: "60px" }}
											>
												<info.icon size={24} className={`text-${info.color}`} />
											</div>
											<h5 className="fw-semibold text-dark mb-3">
												{info.title}
											</h5>
											<p className="fw-medium text-dark mb-1">{info.primary}</p>
											<p className="text-muted small mb-0">{info.secondary}</p>
										</Card.Body>
									</Card>
								</Col>
							))}
						</Row>
					</Col>
				</Row>

				{/* Contact Form and Map */}
				<Row className="mb-5">
					<Col lg={10} className="mx-auto">
						<Row className="g-5">
							{/* Contact Form */}
							<Col lg={8}>
								<Card className="border-0 shadow-sm">
									<Card.Body className="p-5">
										<div className="mb-4">
											<h2 className="h3 fw-bold text-dark mb-3">
												Send us a Message
											</h2>
											<p className="text-muted">
												Fill out the form below and we'll get back to you within
												24 hours.
											</p>
										</div>

										{showAlert && (
											<Alert variant="success" className="mb-4">
												<strong>Thank you!</strong> Your message has been sent
												successfully. We'll get back to you soon.
											</Alert>
										)}

										<Form onSubmit={handleSubmit}>
											<Row className="g-3">
												<Col md={6}>
													<Form.Group>
														<Form.Label className="fw-medium">
															Full Name *
														</Form.Label>
														<Form.Control
															type="text"
															name="name"
															value={formData.name}
															onChange={handleChange}
															placeholder="Enter your full name"
															required
															className="py-3"
														/>
													</Form.Group>
												</Col>
												<Col md={6}>
													<Form.Group>
														<Form.Label className="fw-medium">
															Email Address *
														</Form.Label>
														<Form.Control
															type="email"
															name="email"
															value={formData.email}
															onChange={handleChange}
															placeholder="Enter your email"
															required
															className="py-3"
														/>
													</Form.Group>
												</Col>
												<Col xs={12}>
													<Form.Group>
														<Form.Label className="fw-medium">
															Subject/Department *
														</Form.Label>
														<Form.Select
															name="subject"
															value={formData.subject}
															onChange={handleChange}
															required
															className="py-3"
														>
															<option value="">Select a department</option>
															{departments.map((dept, index) => (
																<option key={index} value={dept.value}>
																	{dept.label}
																</option>
															))}
														</Form.Select>
													</Form.Group>
												</Col>
												<Col xs={12}>
													<Form.Group>
														<Form.Label className="fw-medium">
															Message *
														</Form.Label>
														<Form.Control
															as="textarea"
															rows={5}
															name="message"
															value={formData.message}
															onChange={handleChange}
															placeholder="Tell us how we can help you..."
															required
														/>
													</Form.Group>
												</Col>
											</Row>

											<div className="mt-4">
												<Button
													type="submit"
													variant="primary"
													size="lg"
													disabled={isSubmitting}
													className="px-4 py-3 fw-semibold d-flex align-items-center"
													style={{ borderRadius: "50px" }}
												>
													{isSubmitting ? (
														<>
															<div
																className="spinner-border spinner-border-sm me-2"
																role="status"
															>
																<span className="visually-hidden">
																	Loading...
																</span>
															</div>
															Sending...
														</>
													) : (
														<>
															<FaPaperPlane className="me-2" />
															Send Message
														</>
													)}
												</Button>
											</div>
										</Form>
									</Card.Body>
								</Card>
							</Col>

							{/* Additional Info */}
							<Col lg={4}>
								<Card className="border-0 shadow-sm h-100">
									<Card.Body className="p-4">
										<h5 className="fw-semibold text-dark mb-4">
											Other Ways to Connect
										</h5>

										<div className="mb-4">
											<h6 className="fw-medium text-dark mb-2">
												Follow Us on Social Media
											</h6>
											<div className="d-flex gap-2">
												<Button
													variant="outline-primary"
													size="sm"
													className="rounded-circle"
													style={{ width: "40px", height: "40px" }}
												>
													<FaFacebookF size={16} />
												</Button>
												<Button
													variant="outline-info"
													size="sm"
													className="rounded-circle"
													style={{ width: "40px", height: "40px" }}
												>
													<FaTwitter size={16} />
												</Button>
												<Button
													variant="outline-primary"
													size="sm"
													className="rounded-circle"
													style={{ width: "40px", height: "40px" }}
												>
													<FaLinkedinIn size={16} />
												</Button>
												<Button
													variant="outline-danger"
													size="sm"
													className="rounded-circle"
													style={{ width: "40px", height: "40px" }}
												>
													<FaInstagram size={16} />
												</Button>
											</div>
										</div>

										<div className="mb-4">
											<h6 className="fw-medium text-dark mb-2">
												Frequently Asked Questions
											</h6>
											<p className="text-muted small">
												Check our FAQ section for quick answers to common
												questions about courses, payments, and platform
												features.
											</p>
											<Button variant="outline-secondary" size="sm">
												View FAQ
											</Button>
										</div>

										<div className="mb-4">
											<h6 className="fw-medium text-dark mb-2">
												Live Chat Support
											</h6>
											<p className="text-muted small">
												For immediate assistance, use our live chat feature
												available on the bottom right of any page.
											</p>
											<Badge bg="success" className="px-2 py-1">
												● Online Now
											</Badge>
										</div>

										<div>
											<h6 className="fw-medium text-dark mb-2">
												Community Forum
											</h6>
											<p className="text-muted small">
												Join our community forum to connect with other learners
												and get help from our community moderators.
											</p>
											<Button variant="outline-primary" size="sm">
												Join Forum
											</Button>
										</div>
									</Card.Body>
								</Card>
							</Col>
						</Row>
					</Col>
				</Row>

				{/* Location Map */}
				<Row>
					<Col lg={10} className="mx-auto">
						<Card className="border-0 shadow-sm">
							<Card.Body className="p-0">
								<div
									className="bg-light d-flex align-items-center justify-content-center"
									style={{ height: "400px" }}
								>
									<div className="text-center">
										<FaMapMarkerAlt size={48} className="text-muted mb-3" />
										<h5 className="text-muted">Interactive Map</h5>
										<p className="text-muted">
											Our headquarters location would be displayed here
										</p>
									</div>
								</div>
							</Card.Body>
						</Card>
					</Col>
				</Row>
			</Container>
		</div>
	);
};

export default ContactUs;
