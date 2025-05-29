import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets";
import { AppContext } from "../contexts/AppContext";

const CourseCard = ({ course }) => {
	// const { currency, calculateRating } = useContext(AppContext);
	const currency = "$";
	const calculateRating = (course) => {
		if (!course.courseRatings || course.courseRatings.length === 0) return 0;
		const totalRating = course.courseRatings.reduce(
			(acc, rating) => acc + rating.rating,
			0
		);
		return totalRating / course.courseRatings.length;
	};
	return (
		<Link
			onClick={() => window.scrollTo(0, 0)}
			to={"/course/" + course._id}
			className="card border text-decoration-none overflow-hidden rounded"
			style={{ paddingBottom: "24px" }}
		>
			<img className="card-img-top w-100" src={course.courseThumbnail} alt="" />
			<div className="card-body p-3 text-start">
				<h3 className="card-title fs-6 fw-semibold">{course.courseTitle}</h3>
				{/* <p className="text-muted">{course.educator.name}</p> */}
				<div className="d-flex align-items-center gap-2">
					<span>{calculateRating(course)}</span>
					<div className="d-flex">
						{[...Array(5)].map((_, i) => (
							<img
								key={i}
								style={{ width: "14px", height: "14px" }}
								src={
									i < Math.floor(calculateRating(course))
										? assets.star
										: assets.star_blank
								}
								alt=""
							/>
						))}
					</div>
					<span className="text-muted">({course.courseRatings.length})</span>
				</div>
				<p className="fs-6 fw-semibold text-dark">
					{currency}
					{(
						course.coursePrice -
						(course.discount * course.coursePrice) / 100
					).toFixed(2)}
				</p>
			</div>
		</Link>
	);
};

export default CourseCard;
