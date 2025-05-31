import React, { useContext, useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { AppContext } from "../contexts/AppContext";
import { useCart } from "../contexts/CartContext";
import { formatDateRange, formatPrice } from "../utils/formatUtils";
import StarRating from "./StarRating";

const CourseCard = ({ course, showCartButton = false }) => {
	const { navigate } = useContext(AppContext);
	const { addCourseToCart, removeCourseFromCart, isInCart } = useCart();
	const [isInCartState, setIsInCartState] = useState(false);
	useEffect(() => {
		if (showCartButton && course?.id) {
			setIsInCartState(isInCart(course.id));
		}
	}, [course?.id, showCartButton, isInCart]);

	const handleAddToCart = (e) => {
		e.preventDefault();
		e.stopPropagation();

		if (!course) return;

		const courseToAdd = {
			id: course.id,
			name: course.name,
			price: course.price,
			image: course.image,
			instructor:
				course.lecturers && course.lecturers.length > 0
					? course.lecturers.length === 1
						? `${course.lecturers[0].userIdFirstName} ${course.lecturers[0].userIdLastName}`
						: `${course.lecturers[0].userIdFirstName} ${
								course.lecturers[0].userIdLastName
						  } +${course.lecturers.length - 1} more`
					: "Instructor",
		};

		if (addCourseToCart(courseToAdd)) {
			setIsInCartState(true);
		}
	};

	const handleRemoveFromCart = (e) => {
		e.preventDefault();
		e.stopPropagation();

		if (!course) return;

		removeCourseFromCart(course.id);
		setIsInCartState(false);
	};

	const handleViewCart = (e) => {
		e.preventDefault();
		e.stopPropagation();
		navigate("/cart");
	};

	const handleCourseClick = () => {
		window.scrollTo(0, 0);
		navigate("/course/" + course.id);
	};
	return (
		<div
			className="card border text-decoration-none overflow-hidden rounded h-100 d-flex flex-column position-relative"
			style={{ minHeight: "380px", cursor: "pointer" }}
			onClick={handleCourseClick}
		>
			<img
				className="card-img-top w-100"
				src={course.image}
				alt={course.name}
				style={{ height: "200px", objectFit: "cover" }}
			/>
			<div className="card-body p-3 text-start d-flex flex-column flex-grow-1">
				<h3
					className="card-title fs-6 fw-semibold mb-2"
					style={{
						height: "2.4rem",
						overflow: "hidden",
						display: "-webkit-box",
						WebkitLineClamp: 2,
						WebkitBoxOrient: "vertical",
						lineHeight: "1.2rem",
					}}
				>
					{course.name}
				</h3>
				{/* ...existing content... */}
				<p
					className="text-muted small mb-1"
					style={{ height: "1.2rem", overflow: "hidden" }}
				>
					{course.categoryIdName}
				</p>
				<p
					className="text-secondary small mb-2"
					style={{
						height: "1.2rem",
						overflow: "hidden",
						fontWeight: "500",
					}}
				>
					{course.lecturers && course.lecturers.length > 0
						? course.lecturers.length === 1
							? `${course.lecturers[0].userIdFirstName} ${course.lecturers[0].userIdLastName}`
							: `${course.lecturers[0].userIdFirstName} ${
									course.lecturers[0].userIdLastName
							  } +${course.lecturers.length - 1} more`
						: "No lecturer assigned"}
				</p>
				<div
					className="d-flex align-items-center gap-2 mb-2"
					style={{ height: "1.8rem" }}
				>
					<span className="badge bg-light text-dark">
						{course.studentCount} students
					</span>
				</div>
				{/* Rating section */}
				{course.averageRate >= 0 && (
					<div className="d-flex align-items-center gap-1 mb-2">
						<StarRating rating={course.averageRate} size={12} />
						<span className="small text-muted ms-1">
							{course.averageRate.toFixed(1)}
						</span>
					</div>
				)}
				<div style={{ minHeight: "2.4rem", marginBottom: "0.5rem" }}>
					{course.dateStart && course.dateEnd && (
						<p
							className="small text-muted mb-0"
							style={{
								wordBreak: "break-word",
								lineHeight: "1.2",
								overflow: "hidden",
								display: "-webkit-box",
								WebkitLineClamp: 2,
								WebkitBoxOrient: "vertical",
							}}
						>
							{formatDateRange(course.dateStart, course.dateEnd)}
						</p>
					)}
				</div>{" "}
				<div className="mt-auto pt-2">
					<div className="d-flex justify-content-between align-items-center">
						<p className="fs-6 fw-semibold text-dark mb-0">
							{formatPrice(course.price)}
						</p>
						{/* Cart Button - Only show if showCartButton prop is true */}
						{showCartButton &&
							(isInCartState ? (
								<div className="d-flex gap-1">
									<Button
										onClick={handleViewCart}
										variant="outline-success"
										size="sm"
										style={{ fontSize: "0.75rem", padding: "0.25rem 0.5rem" }}
									>
										View Cart
									</Button>
									<Button
										onClick={handleRemoveFromCart}
										variant="outline-secondary"
										size="sm"
										style={{ fontSize: "0.75rem", padding: "0.25rem 0.5rem" }}
									>
										Remove
									</Button>
								</div>
							) : (
								<Button
									onClick={handleAddToCart}
									variant="outline-primary"
									size="sm"
									style={{ fontSize: "0.75rem", padding: "0.25rem 0.75rem" }}
								>
									🛒 Add to Cart
								</Button>
							))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default CourseCard;
