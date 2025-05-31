import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { Link, useLocation } from "react-router-dom";
import { AppContext } from "../contexts/AppContext";
import { useCart } from "../contexts/CartContext";
import { FaUserCircle, FaShoppingCart } from "react-icons/fa";
import { Dropdown, Badge } from "react-bootstrap";

// import { useClerk, UserButton, useUser } from '@clerk/clerk-react';

const Navbar = () => {
	const location = useLocation();
	const isCoursesListPage = location.pathname.includes("/course-list");

	const { navigate, isAuthenticated, user, logout } = useContext(AppContext);
	const { getCartItemCount } = useCart();

	return (
		<div
			className={`d-flex align-items-center justify-content-between px-4 px-sm-5 px-md-5 px-lg-5 px-xl-6 border-bottom border-dark py-4 ${
				isCoursesListPage ? "bg-white" : "bg-info bg-opacity-25"
			}`}
		>
			<img
				onClick={() => navigate("/")}
				src={assets.logo}
				alt="Logo"
				className="cursor-pointer"
				style={{ width: "112px" }}
			/>
			<div className="d-none d-md-flex align-items-center gap-4 text-secondary">
				<div className="d-flex align-items-center gap-4">
					<Link
						className=""
						to="/"
						style={{ textDecoration: "none", color: "inherit" }}
					>
						Home
					</Link>

					<Link
						to="/course-list"
						style={{ textDecoration: "none", color: "inherit" }}
					>
						Courses
					</Link>

					<Link
						to="/about"
						style={{ textDecoration: "none", color: "inherit" }}
					>
						About Us
					</Link>

					<Link
						to="/contact"
						style={{ textDecoration: "none", color: "inherit" }}
					>
						Contact Us
					</Link>

					<Link
						to="/privacy-policy"
						style={{ textDecoration: "none", color: "inherit" }}
					>
						Privacy Policy
					</Link>

					{/* Cart Icon */}
					<Link
						to="/cart"
						className="position-relative d-flex align-items-center text-decoration-none"
						style={{ color: "inherit" }}
						title="Shopping Cart"
					>
						<FaShoppingCart size={20} />
						{getCartItemCount() > 0 && (
							<Badge
								bg="danger"
								className="position-absolute top-0 start-100 translate-middle rounded-pill"
								style={{ fontSize: "0.75rem", minWidth: "1.5rem" }}
							>
								{getCartItemCount() > 99 ? "99+" : getCartItemCount()}
							</Badge>
						)}
					</Link>

					{isAuthenticated ? (
						<>
							{/* Profile Dropdown */}
							<Dropdown>
								<Dropdown.Toggle
									variant="link"
									id="dropdown-basic"
									className="text-primary d-flex align-items-center gap-1 border-0 p-0 shadow-none text-decoration-none"
									style={{ boxShadow: "none" }}
								>
									{user.userIdAvatar ? (
										<img
											src={user.userIdAvatar}
											className="rounded-circle"
											style={{ width: "24px", height: "24px" }}
											alt="Profile"
										/>
									) : (
										<FaUserCircle />
									)}
									<span className="ms-1">
										{user ? user.userIdUsername : "Profile"}
									</span>
								</Dropdown.Toggle>

								<Dropdown.Menu className="mt-2 shadow border-secondary">
									<Dropdown.Item
										as={Link}
										to="/my-enrollments"
										className="d-flex align-items-center gap-2 px-4 py-2 text-dark"
									>
										My Enrollments
									</Dropdown.Item>
									<Dropdown.Item
										as={Link}
										to="/profile"
										className="d-flex align-items-center gap-2 px-4 py-2 text-dark"
									>
										Profile Settings
									</Dropdown.Item>
									<Dropdown.Divider />
									<Dropdown.Item
										onClick={logout}
										className="d-flex align-items-center gap-2 px-4 py-2 text-danger"
									>
										Logout
									</Dropdown.Item>
								</Dropdown.Menu>
							</Dropdown>
						</>
					) : (
						<Link
							to="/login"
							style={{ textDecoration: "none", color: "inherit" }}
						>
							Login
						</Link>
					)}
				</div>
			</div>
			{/* For Phone Screens */}
			<div className="d-flex d-md-none align-items-center gap-2 text-secondary">
				<div className="d-flex align-items-center gap-2 small">
					{user && (
						<Link
							to="/my-enrollments"
							style={{ textDecoration: "none", color: "inherit" }}
						>
							My Enrollments
						</Link>
					)}
				</div>
			</div>
		</div>
	);
};

export default Navbar;
