import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Line } from "rc-progress";
import { AppContext } from "../contexts/AppContext";
import { toast } from "react-toastify";

const MyEnrollments = () => {
	const {
		userData,
		fetchUserEnrolledCourses,
		navigate,
		backendUrl,
		getToken,
		calculateNoOfLectures,
	} = useContext(AppContext);

	const enrolledCourses = [
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

	const calculateCourseDuration = (course) => {
		if (!course.courseChapters || course.courseChapters.length === 0)
			return "0 min";
	};
	const [progressArray, setProgressData] = useState([]);

	const getCourseProgress = async () => {
		try {
			const token = await getToken();

			// Use Promise.all to handle multiple async operations
			const tempProgressArray = await Promise.all(
				enrolledCourses.map(async (course) => {
					const { data } = await axios.post(
						`${backendUrl}/api/user/get-course-progress`,
						{ courseId: course._id },
						{ headers: { Authorization: `Bearer ${token}` } }
					);

					// Calculate total lectures
					let totalLectures = calculateNoOfLectures(course);

					const lectureCompleted = data.progressData
						? data.progressData.lectureCompleted.length
						: 0;
					return { totalLectures, lectureCompleted };
				})
			);

			setProgressData(tempProgressArray);
		} catch (error) {
			toast.error(error.message);
		}
	};

	useEffect(() => {
		if (userData) {
			fetchUserEnrolledCourses();
		}
	}, [userData]);

	useEffect(() => {
		if (enrolledCourses.length > 0) {
			getCourseProgress();
		}
	}, [enrolledCourses]);
	return (
		<>
			<div
				className="px-4 px-md-5 pt-4"
				style={{ paddingLeft: "144px", paddingRight: "144px" }}
			>
				<h1 className="fs-2 fw-semibold">My Enrollments</h1>{" "}
				<div className="table-responsive mt-4">
					<table className="table table-bordered">
						<thead className="table-light">
							<tr className="d-none d-sm-table-row">
								<th className="px-3 py-3 fw-semibold">Course</th>
								<th className="px-3 py-3 fw-semibold d-none d-sm-table-cell">
									Duration
								</th>
								<th className="px-3 py-3 fw-semibold d-none d-sm-table-cell">
									Completed
								</th>
								<th className="px-3 py-3 fw-semibold">Status</th>
							</tr>
						</thead>
						<tbody>
							{enrolledCourses.map((course, index) => (
								<tr key={index}>
									<td className="px-2 px-md-3 py-3">
										<div className="d-flex align-items-center gap-3">
											<img
												src={course.courseThumbnail}
												alt=""
												className="img-fluid"
												style={{ width: "56px", height: "auto" }}
											/>
											<div className="flex-fill">
												<p className="mb-1 small">{course.courseTitle}</p>
												<Line
													className="bg-light rounded"
													strokeWidth={2}
													percent={
														progressArray[index]
															? (progressArray[index].lectureCompleted * 100) /
															  progressArray[index].totalLectures
															: 0
													}
												/>
											</div>
										</div>
									</td>
									<td className="px-3 py-3 d-none d-sm-table-cell">
										{calculateCourseDuration(course)}
									</td>
									<td className="px-3 py-3 d-none d-sm-table-cell">
										{progressArray[index] &&
											`${progressArray[index].lectureCompleted} / ${progressArray[index].totalLectures}`}
										<span className="small ms-2">Lectures</span>
									</td>
									<td className="px-3 py-3">
										<button
											onClick={() => navigate("/player/" + course._id)}
											className="btn btn-primary btn-sm"
										>
											{progressArray[index] &&
											progressArray[index].lectureCompleted /
												progressArray[index].totalLectures ===
												1
												? "Completed"
												: "On Going"}
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</>
	);
};

export default MyEnrollments;
