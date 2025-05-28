import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AppContext, AppContextProvider } from "../contexts/AppContext";
import CourseCard from "./CourseCard";

const CoursesSection = () => {
	// const { allCourses } = useContext(AppContext);
	const allCourses = [
		{
			_id: "course001",
			courseThumbnail:
				"https://via.placeholder.com/400x200.png?text=React+Basics",
			courseTitle: "React Basics for Beginners",
			courseRatings: [5, 4, 5, 5, 4],
			coursePrice: 120,
			discount: 15,
		},
		{
			_id: "course002",
			courseThumbnail:
				"https://via.placeholder.com/400x200.png?text=Advanced+React",
			courseTitle: "Advanced React Patterns",
			courseRatings: [4, 4, 3, 5, 4, 4],
			coursePrice: 150,
			discount: 10,
		},
		{
			_id: "course003",
			courseThumbnail:
				"https://via.placeholder.com/400x200.png?text=JavaScript+Mastery",
			courseTitle: "JavaScript Mastery",
			courseRatings: [5, 5, 5, 4, 5, 5, 5],
			coursePrice: 200,
			discount: 25,
		},
		{
			_id: "course004",
			courseThumbnail:
				"https://via.placeholder.com/400x200.png?text=CSS+Fundamentals",
			courseTitle: "CSS Fundamentals",
			courseRatings: [3, 4, 3, 3, 4],
			coursePrice: 80,
			discount: 5,
		},
	];

	return (
		<div className="py-16 md:px-40 px-8">
			<h2 className="text-3xl font-medium text-gray-800">
				Learn from the best
			</h2>
			<p className="md:text-base text-sm text-gray-500 mt-3">
				Discover our top-rated courses across various categories. From coding
				and design to business and wellness, our courses are crafted to deliver
				results.
			</p>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 px-4 md:px-0 md:my-16 my-10 gap-4">
				{allCourses.slice(0, 4).map((course, index) => (
					<CourseCard key={index} course={course} />
				))}
			</div>
			<Link
				to={"/course-list"}
				onClick={() => window.scrollTo(0, 0)}
				className="text-gray-500 border border-gray-500/30 px-10 py-3 rounded"
			>
				Show all courses
			</Link>
		</div>
	);
};

export default CoursesSection;
