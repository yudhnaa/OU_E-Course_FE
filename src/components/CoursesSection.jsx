import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AppContext, AppContextProvider } from "../contexts/AppContext";
import CourseCard from "./CourseCard";

const CoursesSection = () => {
	// const { allCourses } = useContext(AppContext);
	const allCourses = [
		{
			_id: "1",
			courseThumbnail:
				"https://via.placeholder.com/400x200.png?text=React+Basics",
			courseTitle: "React Basics for Beginners",
			courseRatings: [5, 4, 5, 5, 4],
			coursePrice: 120,
			discount: 15,
		},
		{
			_id: "1",
			courseThumbnail:
				"https://via.placeholder.com/400x200.png?text=Advanced+React",
			courseTitle: "Advanced React Patterns",
			courseRatings: [4, 4, 3, 5, 4, 4],
			coursePrice: 150,
			discount: 10,
		},
		{
			_id: "1",
			courseThumbnail:
				"https://via.placeholder.com/400x200.png?text=JavaScript+Mastery",
			courseTitle: "JavaScript Mastery",
			courseRatings: [5, 5, 5, 4, 5, 5, 5],
			coursePrice: 200,
			discount: 25,
		},
		{
			_id: "1",
			courseThumbnail:
				"https://via.placeholder.com/400x200.png?text=CSS+Fundamentals",
			courseTitle: "CSS Fundamentals",
			courseRatings: [3, 4, 3, 3, 4],
			coursePrice: 80,
			discount: 5,
		},
	];
	return (
		<div className="py-5 px-3 px-md-5">
			<h2 className="h2 fw-medium text-dark">Learn from the best</h2>
			<p className="text-muted mt-3">
				Discover our top-rated courses across various categories. From coding
				and design to business and wellness, our courses are crafted to deliver
				results.
			</p>
			<div className="row g-4 my-4 my-md-5">
				{allCourses.slice(0, 4).map((course, index) => (
					<div key={index} className="col-12 col-sm-6 col-md-4 col-lg-3">
						<CourseCard course={course} />
					</div>
				))}
			</div>
			<Link
				to={"/course-list"}
				onClick={() => window.scrollTo(0, 0)}
				className="btn btn-outline-secondary px-4 py-2"
			>
				Show all courses
			</Link>
		</div>
	);
};

export default CoursesSection;
