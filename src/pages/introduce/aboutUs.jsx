import React from "react";
import { Container, Row, Col, Card, Button, Badge } from "react-bootstrap";
import { assets } from "../../assets/assets";
import {
	FaGraduationCap,
	FaUsers,
	FaAward,
	FaGlobe,
	FaHeart,
	FaLightbulb,
	FaRocket,
	FaShieldAlt,
} from "react-icons/fa";

const AboutUs = () => {
	const stats = [
		{ number: "10,000+", label: "Active Students", icon: FaUsers },
		{ number: "500+", label: "Expert Instructors", icon: FaGraduationCap },
		{ number: "1,000+", label: "Courses Available", icon: FaLightbulb },
		{ number: "50+", label: "Countries Served", icon: FaGlobe },
	];

	const values = [
		{
			icon: FaAward,
			title: "Excellence in Education",
			description:
				"We are committed to providing world-class educational content that meets the highest standards of quality and relevance.",
		},
		{
			icon: FaHeart,
			title: "Student-Centric Approach",
			description:
				"Our students are at the heart of everything we do. We design our courses to meet their learning needs and career aspirations.",
		},
		{
			icon: FaRocket,
			title: "Innovation & Technology",
			description:
				"We leverage cutting-edge technology to create engaging, interactive learning experiences that make education accessible to everyone.",
		},
		{
			icon: FaShieldAlt,
			title: "Trust & Reliability",
			description:
				"We build lasting relationships with our students based on trust, transparency, and consistent delivery of exceptional value.",
		},
	];

	const team = [
		{
			name: "Sarah Johnson",
			role: "CEO & Founder",
			image: assets.profile_img,
			description:
				"Former education executive with 15+ years of experience in transforming learning experiences.",
		},
		{
			name: "Michael Chen",
			role: "Chief Technology Officer",
			image: assets.profile_img2,
			description:
				"Tech innovator passionate about building scalable educational platforms that reach millions of learners.",
		},
		{
			name: "Emily Rodriguez",
			role: "Head of Content",
			image: assets.profile_img3,
			description:
				"Curriculum design expert dedicated to creating engaging and effective learning pathways for diverse audiences.",
		},
	];

	return (
		<div className="min-vh-100" style={{ backgroundColor: "#f8f9fa" }}>
			{/* Hero Section */}
			<div
				className="position-relative text-white py-5"
				style={{
					background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
					minHeight: "400px",
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
								About E-Course
							</Badge>
							<h1 className="display-4 fw-bold mb-4">
								Empowering Learners Worldwide
							</h1>
							<p className="lead mb-4" style={{ fontSize: "1.25rem" }}>
								We're on a mission to make quality education accessible to
								everyone, everywhere. Join millions of learners who are
								transforming their careers and lives through our platform.
							</p>
							<Button
								variant="light"
								size="lg"
								className="px-4 py-3 fw-semibold shadow"
								style={{ borderRadius: "50px" }}
							>
								Join Our Community
							</Button>
						</Col>
					</Row>
				</Container>
			</div>

			<Container className="py-5">
				{/* Stats Section */}
				<Row className="mb-5">
					<Col lg={10} className="mx-auto">
						<Row className="g-4">
							{stats.map((stat, index) => (
								<Col md={6} lg={3} key={index}>
									<Card className="h-100 border-0 shadow-sm text-center">
										<Card.Body className="p-4">
											<stat.icon size={48} className="text-primary mb-3" />
											<h3 className="h2 fw-bold text-dark mb-2">
												{stat.number}
											</h3>
											<p className="text-muted mb-0">{stat.label}</p>
										</Card.Body>
									</Card>
								</Col>
							))}
						</Row>
					</Col>
				</Row>

				{/* Mission Section */}
				<Row className="mb-5">
					<Col lg={10} className="mx-auto">
						<Card className="border-0 shadow-sm">
							<Card.Body className="p-5">
								<Row className="align-items-center">
									<Col lg={6}>
										<Badge bg="primary" className="mb-3 px-3 py-2 fw-normal">
											Our Mission
										</Badge>
										<h2 className="h1 fw-bold text-dark mb-4">
											Democratizing Quality Education
										</h2>
										<p
											className="text-muted mb-4"
											style={{ fontSize: "1.1rem" }}
										>
											At E-Course, we believe that everyone deserves access to
											high-quality education that can transform their career and
											life. We're committed to breaking down barriers and making
											learning accessible, affordable, and engaging for learners
											worldwide.
										</p>
										<p className="text-muted" style={{ fontSize: "1.1rem" }}>
											Our platform brings together world-class instructors,
											cutting-edge technology, and a supportive community to
											create an unparalleled learning experience that adapts to
											your schedule and learning style.
										</p>
									</Col>
									<Col lg={6} className="text-center">
										<img
											src={assets.course_1}
											alt="Our Mission"
											className="img-fluid rounded-3 shadow"
											style={{ maxHeight: "400px", objectFit: "cover" }}
										/>
									</Col>
								</Row>
							</Card.Body>
						</Card>
					</Col>
				</Row>

				{/* Values Section */}
				<Row className="mb-5">
					<Col lg={10} className="mx-auto">
						<div className="text-center mb-5">
							<Badge bg="success" className="mb-3 px-3 py-2 fw-normal">
								Our Values
							</Badge>
							<h2 className="h1 fw-bold text-dark mb-3">
								What Drives Us Forward
							</h2>
							<p className="text-muted" style={{ fontSize: "1.1rem" }}>
								Our core values guide everything we do and shape the experience
								we create for our learners.
							</p>
						</div>

						<Row className="g-4">
							{values.map((value, index) => (
								<Col md={6} key={index}>
									<Card className="h-100 border-0 shadow-sm">
										<Card.Body className="p-4">
											<div className="d-flex align-items-start">
												<div
													className="bg-primary bg-opacity-10 rounded-3 p-3 me-3 flex-shrink-0"
													style={{ width: "60px", height: "60px" }}
												>
													<value.icon size={24} className="text-primary" />
												</div>
												<div>
													<h5 className="fw-semibold text-dark mb-3">
														{value.title}
													</h5>
													<p className="text-muted mb-0">{value.description}</p>
												</div>
											</div>
										</Card.Body>
									</Card>
								</Col>
							))}
						</Row>
					</Col>
				</Row>

				{/* Team Section */}
				<Row className="mb-5">
					<Col lg={10} className="mx-auto">
						<div className="text-center mb-5">
							<Badge bg="warning" className="mb-3 px-3 py-2 fw-normal">
								Our Team
							</Badge>
							<h2 className="h1 fw-bold text-dark mb-3">
								Meet the Visionaries
							</h2>
							<p className="text-muted" style={{ fontSize: "1.1rem" }}>
								Our diverse team of educators, technologists, and innovators
								work tirelessly to create the best learning experience for you.
							</p>
						</div>

						<Row className="g-4">
							{team.map((member, index) => (
								<Col lg={4} md={6} key={index}>
									<Card className="border-0 shadow-sm text-center h-100">
										<Card.Body className="p-4">
											<img
												src={member.image}
												alt={member.name}
												className="rounded-circle mb-3 border border-3 border-light shadow"
												style={{
													width: "120px",
													height: "120px",
													objectFit: "cover",
												}}
											/>
											<h5 className="fw-semibold text-dark mb-1">
												{member.name}
											</h5>
											<p className="text-primary fw-medium mb-3">
												{member.role}
											</p>
											<p className="text-muted small">{member.description}</p>
										</Card.Body>
									</Card>
								</Col>
							))}
						</Row>
					</Col>
				</Row>

				{/* Call to Action */}
				<Row>
					<Col lg={8} className="mx-auto">
						<Card
							className="border-0 shadow-lg text-white text-center"
							style={{
								background: "linear-gradient(135deg, #16a085, #27ae60)",
							}}
						>
							<Card.Body className="p-5">
								<h3 className="h2 fw-bold mb-3">
									Ready to Start Your Learning Journey?
								</h3>
								<p className="mb-4" style={{ fontSize: "1.1rem" }}>
									Join thousands of learners who are already transforming their
									careers with our expert-led courses and personalized learning
									paths.
								</p>
								<div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
									<Button
										variant="light"
										size="lg"
										className="px-4 py-3 fw-semibold"
										style={{ borderRadius: "50px" }}
									>
										Browse Courses
									</Button>
									<Button
										variant="outline-light"
										size="lg"
										className="px-4 py-3 fw-semibold"
										style={{ borderRadius: "50px" }}
									>
										Contact Us
									</Button>
								</div>
							</Card.Body>
						</Card>
					</Col>
				</Row>
			</Container>
		</div>
	);
};

export default AboutUs;
