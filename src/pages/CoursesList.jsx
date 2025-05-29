import { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../contexts/AppContext";
import { useParams } from "react-router-dom";
import SearchBar from "../components/Searchbar";
import CourseCard from "../components/CourseCard";

const CoursesList = () => {
	const { input } = useParams();

	const { navigate } = useContext(AppContext);

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

	const [filteredCourse, setFilteredCourse] = useState([]);

	useEffect(() => {
		if (allCourses && allCourses.length > 0) {
			const tempCourses = allCourses.slice();

			input
				? setFilteredCourse(
						tempCourses.filter((item) =>
							item.courseTitle.toLowerCase().includes(input.toLowerCase())
						)
				  )
				: setFilteredCourse(tempCourses);
		}
	}, [allCourses, input]);
	return (
		<>
			<div
				className="position-relative px-4 px-md-5 pt-5 text-start"
				style={{ paddingLeft: "144px", paddingRight: "144px" }}
			>
				<div className="d-flex flex-column flex-md-row gap-4 align-items-start justify-content-between w-100">
					<div>
						<h1 className="display-5 fw-semibold text-dark">Course List</h1>
						<p className="text-muted">
							<span
								onClick={() => navigate("/")}
								className="text-primary cursor-pointer text-decoration-none"
							>
								Home
							</span>{" "}
							/ <span>Course List</span>
						</p>
					</div>
					<SearchBar data={input} />
				</div>
				{input && (
					<div className="d-inline-flex align-items-center gap-3 px-3 py-2 border mt-4 mb-n4 text-muted">
						<p className="mb-0">{input}</p>
						<img
							onClick={() => navigate("/course-list")}
							className="cursor-pointer"
							src={assets.cross_icon}
							alt=""
						/>
					</div>
				)}
				<div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 my-5 g-3 px-2 px-md-0">
					{filteredCourse.map((course, index) => (
						<div key={index} className="col">
							<CourseCard course={course} />
						</div>
					))}
				</div>
			</div>
		</>
	);
};

export default CoursesList;
