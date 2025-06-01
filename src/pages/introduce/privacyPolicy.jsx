import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import {
	FaShieldAlt,
	FaLock,
	FaUserShield,
	FaEye,
	FaCookie,
	FaEnvelope,
} from "react-icons/fa";

const PrivacyPolicy = () => {
	return (
		<div className="privacy-policy">
			{/* Hero Section */}
			<section
				className="hero-section py-5"
				style={{
					background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
					color: "white",
				}}
			>
				<Container>
					<Row className="align-items-center justify-content-center text-center">
						<Col lg={8}>
							<FaShieldAlt size={60} className="mb-3" />
							<h1 className="display-4 fw-bold mb-3">Privacy Policy</h1>
							<p className="lead mb-4">
								Your privacy is important to us. This policy explains how we
								collect, use, and protect your personal information.
							</p>
							<p className="text-light">
								<small>Last updated: December 2024</small>
							</p>
						</Col>
					</Row>
				</Container>
			</section>

			{/* Privacy Overview */}
			<section className="py-5">
				<Container>
					<Row className="mb-5">
						<Col lg={8} className="mx-auto text-center">
							<h2 className="mb-4">Our Commitment to Your Privacy</h2>
							<p className="lead text-muted">
								We are committed to protecting your privacy and ensuring the
								security of your personal information. This privacy policy
								outlines our practices regarding data collection, usage, and
								protection.
							</p>
						</Col>
					</Row>

					<Row className="g-4">
						<Col md={6} lg={4}>
							<Card className="h-100 shadow-sm border-0">
								<Card.Body className="text-center p-4">
									<FaLock size={40} className="text-primary mb-3" />
									<h5>Data Security</h5>
									<p className="text-muted mb-0">
										We use industry-standard encryption and security measures to
										protect your data.
									</p>
								</Card.Body>
							</Card>
						</Col>
						<Col md={6} lg={4}>
							<Card className="h-100 shadow-sm border-0">
								<Card.Body className="text-center p-4">
									<FaUserShield size={40} className="text-success mb-3" />
									<h5>Your Rights</h5>
									<p className="text-muted mb-0">
										You have full control over your personal data and can
										request access, updates, or deletion.
									</p>
								</Card.Body>
							</Card>
						</Col>
						<Col md={6} lg={4}>
							<Card className="h-100 shadow-sm border-0">
								<Card.Body className="text-center p-4">
									<FaEye size={40} className="text-info mb-3" />
									<h5>Transparency</h5>
									<p className="text-muted mb-0">
										We are transparent about what data we collect and how we use
										it for your benefit.
									</p>
								</Card.Body>
							</Card>
						</Col>
					</Row>
				</Container>
			</section>

			{/* Privacy Policy Content */}
			<section className="py-5 bg-light">
				<Container>
					<Row>
						<Col lg={8} className="mx-auto">
							{/* Information We Collect */}
							<Card className="mb-4 shadow-sm border-0">
								<Card.Body className="p-4">
									<h3 className="mb-3">1. Information We Collect</h3>

									<h5 className="mt-4 mb-3">Personal Information</h5>
									<ul className="text-muted">
										<li>
											Name, email address, and contact information when you
											register
										</li>
										<li>Profile information and preferences you provide</li>
										<li>
											Payment information for course purchases (processed
											securely)
										</li>
										<li>Communication preferences and course progress data</li>
									</ul>

									<h5 className="mt-4 mb-3">
										Automatically Collected Information
									</h5>
									<ul className="text-muted">
										<li>Device information, IP address, and browser type</li>
										<li>
											Usage patterns, course interactions, and learning
											analytics
										</li>
										<li>Cookies and similar tracking technologies</li>
										<li>Performance data to improve our services</li>
									</ul>
								</Card.Body>
							</Card>

							{/* How We Use Information */}
							<Card className="mb-4 shadow-sm border-0">
								<Card.Body className="p-4">
									<h3 className="mb-3">2. How We Use Your Information</h3>
									<ul className="text-muted">
										<li>
											<strong>Course Delivery:</strong> To provide access to
											courses and track your progress
										</li>
										<li>
											<strong>Communication:</strong> To send course updates,
											notifications, and support
										</li>
										<li>
											<strong>Personalization:</strong> To recommend relevant
											courses and content
										</li>
										<li>
											<strong>Platform Improvement:</strong> To enhance user
											experience and course quality
										</li>
										<li>
											<strong>Security:</strong> To protect against fraud and
											maintain platform security
										</li>
										<li>
											<strong>Legal Compliance:</strong> To comply with
											applicable laws and regulations
										</li>
									</ul>
								</Card.Body>
							</Card>

							{/* Information Sharing */}
							<Card className="mb-4 shadow-sm border-0">
								<Card.Body className="p-4">
									<h3 className="mb-3">
										3. Information Sharing and Disclosure
									</h3>
									<p className="text-muted mb-3">
										We do not sell, trade, or rent your personal information to
										third parties. We may share information in the following
										circumstances:
									</p>
									<ul className="text-muted">
										<li>
											<strong>Service Providers:</strong> With trusted partners
											who help us operate our platform
										</li>
										<li>
											<strong>Course Instructors:</strong> Limited data to help
											instructors improve their courses
										</li>
										<li>
											<strong>Legal Requirements:</strong> When required by law
											or to protect our rights
										</li>
										<li>
											<strong>Business Transfers:</strong> In case of merger,
											acquisition, or asset sale
										</li>
										<li>
											<strong>With Your Consent:</strong> When you explicitly
											agree to share information
										</li>
									</ul>
								</Card.Body>
							</Card>

							{/* Cookies and Tracking */}
							<Card className="mb-4 shadow-sm border-0">
								<Card.Body className="p-4">
									<h3 className="mb-3 d-flex align-items-center">
										<FaCookie className="me-2 text-warning" />
										4. Cookies and Tracking Technologies
									</h3>
									<p className="text-muted mb-3">
										We use cookies and similar technologies to enhance your
										experience:
									</p>
									<ul className="text-muted">
										<li>
											<strong>Essential Cookies:</strong> Required for basic
											platform functionality
										</li>
										<li>
											<strong>Analytics Cookies:</strong> To understand how you
											use our platform
										</li>
										<li>
											<strong>Preference Cookies:</strong> To remember your
											settings and preferences
										</li>
										<li>
											<strong>Marketing Cookies:</strong> To show relevant
											advertisements (with consent)
										</li>
									</ul>
									<p className="text-muted">
										You can control cookie settings through your browser
										preferences.
									</p>
								</Card.Body>
							</Card>

							{/* Data Security */}
							<Card className="mb-4 shadow-sm border-0">
								<Card.Body className="p-4">
									<h3 className="mb-3">5. Data Security</h3>
									<p className="text-muted mb-3">
										We implement robust security measures to protect your
										personal information:
									</p>
									<ul className="text-muted">
										<li>SSL/TLS encryption for data transmission</li>
										<li>Secure data storage with encryption at rest</li>
										<li>
											Regular security audits and vulnerability assessments
										</li>
										<li>Access controls and employee training</li>
										<li>Incident response procedures</li>
									</ul>
								</Card.Body>
							</Card>

							{/* Your Rights */}
							<Card className="mb-4 shadow-sm border-0">
								<Card.Body className="p-4">
									<h3 className="mb-3">6. Your Rights and Choices</h3>
									<p className="text-muted mb-3">
										You have the following rights regarding your personal data:
									</p>
									<ul className="text-muted">
										<li>
											<strong>Access:</strong> Request a copy of your personal
											information
										</li>
										<li>
											<strong>Correction:</strong> Update or correct inaccurate
											information
										</li>
										<li>
											<strong>Deletion:</strong> Request deletion of your
											personal data
										</li>
										<li>
											<strong>Portability:</strong> Receive your data in a
											portable format
										</li>
										<li>
											<strong>Opt-out:</strong> Unsubscribe from marketing
											communications
										</li>
										<li>
											<strong>Restrict Processing:</strong> Limit how we use
											your data
										</li>
									</ul>
								</Card.Body>
							</Card>

							{/* Data Retention */}
							<Card className="mb-4 shadow-sm border-0">
								<Card.Body className="p-4">
									<h3 className="mb-3">7. Data Retention</h3>
									<p className="text-muted mb-3">
										We retain your personal information for as long as necessary
										to:
									</p>
									<ul className="text-muted">
										<li>Provide our services and maintain your account</li>
										<li>Comply with legal obligations</li>
										<li>Resolve disputes and enforce agreements</li>
										<li>Improve our services (in anonymized form)</li>
									</ul>
									<p className="text-muted">
										You can request deletion of your account and associated data
										at any time.
									</p>
								</Card.Body>
							</Card>

							{/* Contact Information */}
							<Card className="mb-4 shadow-sm border-0">
								<Card.Body className="p-4">
									<h3 className="mb-3 d-flex align-items-center">
										<FaEnvelope className="me-2 text-primary" />
										8. Contact Us
									</h3>
									<p className="text-muted mb-3">
										If you have questions about this privacy policy or want to
										exercise your rights, please contact us:
									</p>
									<div className="row">
										<div className="col-md-6">
											<p className="text-muted mb-1">
												<strong>Email:</strong> privacy@ecourse.com
											</p>
											<p className="text-muted mb-1">
												<strong>Phone:</strong> +1 (555) 123-4567
											</p>
										</div>
										<div className="col-md-6">
											<p className="text-muted mb-1">
												<strong>Address:</strong> 123 Learning St
											</p>
											<p className="text-muted mb-1">
												Education City, EC 12345
											</p>
										</div>
									</div>
								</Card.Body>
							</Card>

							{/* Updates */}
							<Card className="shadow-sm border-0">
								<Card.Body className="p-4">
									<h3 className="mb-3">9. Policy Updates</h3>
									<p className="text-muted">
										We may update this privacy policy from time to time to
										reflect changes in our practices or legal requirements. We
										will notify you of significant changes via email or through
										our platform. The "Last updated" date at the top of this
										policy indicates when it was most recently revised.
									</p>
								</Card.Body>
							</Card>
						</Col>
					</Row>
				</Container>
			</section>

			{/* Contact CTA */}
			<section
				className="py-5"
				style={{
					background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
					color: "white",
				}}
			>
				<Container>
					<Row className="text-center">
						<Col lg={8} className="mx-auto">
							<h3 className="mb-3">Questions About Your Privacy?</h3>
							<p className="lead mb-4">
								Our privacy team is here to help. Contact us if you have any
								questions or concerns about how we handle your data.
							</p>
							<a href="/contact" className="btn btn-light btn-lg">
								Contact Privacy Team
							</a>
						</Col>
					</Row>
				</Container>
			</section>
		</div>
	);
};

export default PrivacyPolicy;
