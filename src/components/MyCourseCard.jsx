import React, { useContext } from "react";
import { Button } from "react-bootstrap";
import { AppContext } from "../contexts/AppContext";
import { formatDateRange } from "../utils/formatUtils";
import StarRating from "./StarRating";

const MyCourseCard = ({ course }) => {
	const { navigate } = useContext(AppContext);
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
			{/* Completion badge for fully completed courses */}
			{course.progress === 1 && (
				<div
					className="position-absolute top-0 end-0 m-2 bg-success text-white px-2 py-1 rounded-pill"
					style={{ fontSize: "0.7rem", zIndex: 1 }}
				>
					✓ Completed
				</div>
			)}
			<img
				className="card-img-top w-100"
				src={course.image}
				alt={course.name}
				style={{ height: "200px", objectFit: "cover" }}
			/>{" "}
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
				</div>{" "}
				{/* Rating section */}
				{course.averageRate >= 0 && (
					<div className="d-flex align-items-center gap-1 mb-2">
						<StarRating rating={course.averageRate} size={12} />
						<span className="small text-muted ms-1">
							{course.averageRate.toFixed(1)}
						</span>
					</div>
				)}
				{/* Progress section for enrolled courses */}
				{typeof course.progress !== "undefined" && (
					<div className="mb-2">
						<div className="d-flex justify-content-between align-items-center mb-1">
							<span className="small text-muted">Progress</span>
							<span className="small fw-semibold">
								{Math.round(course.progress * 100)}%
							</span>
						</div>
						<div className="progress" style={{ height: "6px" }}>
							<div
								className="progress-bar bg-success"
								role="progressbar"
								style={{ width: `${course.progress * 100}%` }}
								aria-valuenow={course.progress * 100}
								aria-valuemin="0"
								aria-valuemax="100"
							></div>
						</div>
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
					<div className="d-flex justify-content-center">
						<Button
							onClick={(e) => {
								e.preventDefault();
								e.stopPropagation();
								navigate("/course/" + course.id + "/learn");
							}}
							variant="primary"
							size="sm"
							className="w-100"
							style={{ fontSize: "0.875rem", padding: "0.5rem" }}
						>
							{course.progress > 0 ? "Continue Learning" : "Start Learning"}
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default MyCourseCard;
