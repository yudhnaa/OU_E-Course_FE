import React, { useContext, useState, useRef, useEffect } from "react";
import {
	Container,
	Row,
	Col,
	Card,
	Nav,
	Form,
	Button,
	Alert,
	Modal,
} from "react-bootstrap";
import { AppContext } from "../contexts/AppContext";
import { assets } from "../assets/assets";
import { FaCamera, FaUser, FaLock } from "react-icons/fa";
import { toast } from "react-toastify";
import Apis, { authApis, endpoints } from "../configs/Apis";

const ProfilePage = () => {
	const { user, getUserProfile } = useContext(AppContext);
	const [activeTab, setActiveTab] = useState("personal");
	const [showAlert, setShowAlert] = useState({
		show: false,
		type: "",
		message: "",
	});
	const [isLoading, setIsLoading] = useState(false);
	const [showConfirmModal, setShowConfirmModal] = useState(false);
	const fileInputRef = useRef(null);

	// Form states
	const [personalData, setPersonalData] = useState({
		firstName: user?.userIdFirstName || "",
		lastName: user?.userIdLastName || "",
		email: user?.userIdEmail || "",
		birthday: user?.userIdBirthday || "",
	});

	const [passwordData, setPasswordData] = useState({
		newPassword: "",
		confirmPassword: "",
	});

	const [profileImage, setProfileImage] = useState(
		user?.userIdAvatar || assets.profile_img
	);
	const [profileImageFile, setProfileImageFile] = useState(null);

	const handlePersonalDataChange = (e) => {
		const { name, value } = e.target;
		setPersonalData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handlePasswordChange = (e) => {
		const { name, value } = e.target;
		setPasswordData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleImageUpload = (e) => {
		const file = e.target.files[0];
		if (file) {
			setProfileImageFile(file);

			// Create preview URL for display
			const reader = new FileReader();
			reader.onload = (e) => {
				setProfileImage(e.target.result);
			};
			reader.readAsDataURL(file);
		}
	};

	const updatePersonalDetail = async (data) => {
		let formData = new FormData();
		for (const key in data) {
			formData.append(key, data[key]);
		}

		const res = await authApis().post(endpoints["updateProfile"], formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});

		if (res.status === 200) {
			getUserProfile();
			return {
				success: true,
				message: "Profile updated successfully!",
			};
		} else {
			return {
				success: false,
				message: res.data.message || "Failed to update profile.",
			};
		}
	};

	const handlePersonalSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			const result = await updatePersonalDetail({
				userIdFirstName: personalData.firstName,
				userIdLastName: personalData.lastName,
				userIdEmail: personalData.email,
				userIdBirthday: personalData.birthday,
				avatarFile: profileImageFile,
			});

			if (result.success) {
				toast.success(result.message, {
					position: "top-right",
					autoClose: 3000,
					pauseOnHover: true,
				});

				// setPersonalData({
				// 	firstName: personalData.firstName,
				// 	lastName: personalData.lastName,
				// 	email: personalData.email,
				// 	birthday: personalData.birthday,
				// 	avatar: profileImage,
				// });

				setProfileImageFile(null);
			} else {
				setShowAlert({
					show: true,
					type: "danger",
					message: result.message,
				});
			}
		} catch (error) {
			setShowAlert({
				show: true,
				type: "danger",
				message: "Failed to update profile. Please try again.",
			});
		} finally {
			setIsLoading(false);
		}
	};

	const changePassword = async (data) => {
		const res = await authApis().post(endpoints["changePassword"], {
			newPassword: data.newPassword,
		});
		if (res.status === 200) {
			return {
				success: true,
				message: "Password changed successfully!",
			};
		} else {
			return {
				success: false,
				message: res.data.message || "Failed to change password.",
			};
		}
	};

	const handlePasswordSubmit = async (e) => {
		e.preventDefault();

		if (passwordData.newPassword !== passwordData.confirmPassword) {
			setShowAlert({
				show: true,
				type: "danger",
				message: "Passwords do not match!",
			});
			return;
		}

		if (passwordData.newPassword.length < 3) {
			setShowAlert({
				show: true,
				type: "danger",
				message: "Password must be at least 3 characters long!",
			});
			return;
		}

		setIsLoading(true);

		try {
			const result = await changePassword({
				newPassword: passwordData.newPassword,
			});

			setShowAlert({
				show: true,
				type: "success",
				message: "Password changed successfully!",
			});

			setPasswordData({ newPassword: "", confirmPassword: "" });
			setTimeout(
				() => setShowAlert({ show: false, type: "", message: "" }),
				5000
			);
		} catch (error) {
			setShowAlert({
				show: true,
				type: "danger",
				message: "Failed to change password. Please try again.",
			});
		} finally {
			setIsLoading(false);
		}
	};

	// Load user data when component mounts
	useEffect(() => {
		if (user) {
			setPersonalData({
				firstName: user.userIdFirstName || "",
				lastName: user.userIdLastName || "",
				email: user.userIdEmail || "",
				birthday: user.userIdBirthday || "",
			});
			setProfileImage(user.userIdAvatar || assets.profile_img);
			setProfileImageFile(null);
		}
	}, [user]);

	return (
		<div className="profile-page">
			{/* Profile Header Background */}
			<div
				className="position-relative profile-header-bg"
				style={{ height: "200px" }}
			>
				<div className="position-absolute w-100 h-100"></div>
			</div>

			<Container className="position-relative" style={{ marginTop: "-100px" }}>
				<Row>
					{/* Left Sidebar */}
					<Col xxl={3} lg={4} md={12}>
						<Card className="profile-card shadow-sm border-0 mb-4">
							<Card.Body className="p-4 text-center">
								<div className="profile-avatar-container position-relative d-inline-block mb-4">
									<img
										src={profileImage}
										alt="Profile"
										className="rounded-circle border border-white border-4 shadow"
										style={{
											width: "120px",
											height: "120px",
											objectFit: "cover",
										}}
									/>
									<div
										className="profile-edit-btn position-absolute bottom-0 end-0 bg-light rounded-circle p-2 shadow-sm"
										style={{ cursor: "pointer" }}
										onClick={() => fileInputRef.current?.click()}
									>
										<FaCamera className="text-secondary" />
									</div>
									<input
										ref={fileInputRef}
										type="file"
										accept="image/*"
										onChange={handleImageUpload}
										className="d-none"
									/>
								</div>
								<h5 className="mb-1 fw-bold">
									{user?.firstName} {user?.lastName}
								</h5>
								<p className="text-muted mb-0">{user?.role || "Student"}</p>
							</Card.Body>
						</Card>
					</Col>

					{/* Main Content */}
					<Col xxl={9} lg={8} md={12}>
						<Card className="profile-card shadow-sm border-0">
							<Card.Header className="bg-white border-bottom">
								<Nav variant="tabs" className="nav-tabs-custom border-bottom-0">
									<Nav.Item>
										<Nav.Link
											active={activeTab === "personal"}
											onClick={() => setActiveTab("personal")}
											className="d-flex align-items-center"
										>
											<FaUser className="me-2" />
											Personal Details
										</Nav.Link>
									</Nav.Item>
									<Nav.Item>
										<Nav.Link
											active={activeTab === "password"}
											onClick={() => setActiveTab("password")}
											className="d-flex align-items-center"
										>
											<FaLock className="me-2" />
											Change Password
										</Nav.Link>
									</Nav.Item>
								</Nav>
							</Card.Header>

							<Card.Body className="p-4">
								{/* Alert Messages */}
								{showAlert.show && (
									<Alert
										variant={showAlert.type}
										dismissible
										onClose={() =>
											setShowAlert({ show: false, type: "", message: "" })
										}
										className="mb-4"
									>
										{showAlert.message}
									</Alert>
								)}

								{/* Personal Details Tab */}
								{activeTab === "personal" && (
									<div>
										<Form onSubmit={handlePersonalSubmit}>
											<Row>
												<Col lg={6}>
													<Form.Group className="mb-3">
														<Form.Label className="fw-semibold">
															First Name
														</Form.Label>
														<Form.Control
															type="text"
															name="firstName"
															value={personalData.firstName}
															onChange={handlePersonalDataChange}
															placeholder="Enter your first name"
															required
														/>
													</Form.Group>
												</Col>
												<Col lg={6}>
													<Form.Group className="mb-3">
														<Form.Label className="fw-semibold">
															Last Name
														</Form.Label>
														<Form.Control
															type="text"
															name="lastName"
															value={personalData.lastName}
															onChange={handlePersonalDataChange}
															placeholder="Enter your last name"
															required
														/>
													</Form.Group>
												</Col>
												<Col lg={6}>
													<Form.Group className="mb-3">
														<Form.Label className="fw-semibold">
															Username
														</Form.Label>
														<Form.Control
															type="text"
															value={user?.userIdUsername || ""}
															placeholder="Username"
															readOnly
															className="bg-light"
														/>
													</Form.Group>
												</Col>
												<Col lg={6}>
													<Form.Group className="mb-3">
														<Form.Label className="fw-semibold">
															Email Address
														</Form.Label>
														<Form.Control
															type="email"
															name="email"
															value={personalData.email}
															onChange={handlePersonalDataChange}
															placeholder="Enter your email"
															required
														/>
													</Form.Group>
												</Col>
												<Col lg={6}>
													<Form.Group className="mb-3">
														<Form.Label className="fw-semibold">
															Birthday
														</Form.Label>
														<Form.Control
															type="date"
															name="birthday"
															value={personalData.birthday}
															onChange={handlePersonalDataChange}
														/>
													</Form.Group>
												</Col>
												<Col lg={12}>
													<div className="d-flex gap-2 justify-content-end">
														<Button
															variant="primary"
															type="submit"
															disabled={isLoading}
														>
															{isLoading ? "Updating..." : "Update Profile"}
														</Button>
														<Button
															variant="outline-secondary"
															type="button"
															onClick={() => window.history.back()}
														>
															Cancel
														</Button>
													</div>
												</Col>
											</Row>
										</Form>
									</div>
								)}

								{/* Change Password Tab */}
								{activeTab === "password" && (
									<div>
										<Form onSubmit={handlePasswordSubmit}>
											<Row>
												<Col lg={6}>
													<Form.Group className="mb-3">
														<Form.Label className="fw-semibold">
															New Password *
														</Form.Label>
														<Form.Control
															type="password"
															name="newPassword"
															value={passwordData.newPassword}
															onChange={handlePasswordChange}
															placeholder="Enter new password"
															required
															minLength={3}
														/>
													</Form.Group>
												</Col>
												<Col lg={6}>
													<Form.Group className="mb-3">
														<Form.Label className="fw-semibold">
															Confirm Password *
														</Form.Label>
														<Form.Control
															type="password"
															name="confirmPassword"
															value={passwordData.confirmPassword}
															onChange={handlePasswordChange}
															placeholder="Confirm password"
															required
															minLength={3}
														/>
													</Form.Group>
												</Col>
												<Col lg={12}>
													<div className="text-end">
														<Button
															variant="primary"
															type="submit"
															disabled={isLoading}
														>
															{isLoading ? "Changing..." : "Change Password"}
														</Button>
													</div>
												</Col>
											</Row>
										</Form>
									</div>
								)}
							</Card.Body>
						</Card>
					</Col>
				</Row>
			</Container>

			{/* Confirmation Modal */}
			<Modal
				show={showConfirmModal}
				onHide={() => setShowConfirmModal(false)}
				centered
			>
				<Modal.Header closeButton>
					<Modal.Title>Confirm Changes</Modal.Title>
				</Modal.Header>
				<Modal.Body>Are you sure you want to save these changes?</Modal.Body>
				<Modal.Footer>
					<Button
						variant="outline-secondary"
						onClick={() => setShowConfirmModal(false)}
					>
						Cancel
					</Button>
					<Button variant="primary">Save Changes</Button>
				</Modal.Footer>
			</Modal>
		</div>
	);
};

export default ProfilePage;
