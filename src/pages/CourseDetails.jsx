import React, { useContext, useEffect, useState } from "react";
import Footer from "../../components/student/Footer";
import { assets } from "../../assets/assets";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";
import humanizeDuration from "humanize-duration";
import YouTube from "react-youtube";
import { useAuth } from "@clerk/clerk-react";
import Loading from "../../components/student/Loading";

const CourseDetails = () => {
	const { id } = useParams();

	const [courseData, setCourseData] = useState(null);
	const [playerData, setPlayerData] = useState(null);
	const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false);

	const {
		backendUrl,
		currency,
		userData,
		calculateChapterTime,
		calculateCourseDuration,
		calculateRating,
		calculateNoOfLectures,
	} = useContext(AppContext);
	const { getToken } = useAuth();

	const fetchCourseData = async () => {
		try {
			const { data } = await axios.get(backendUrl + "/api/course/" + id);

			if (data.success) {
				setCourseData(data.courseData);
			} else {
				toast.error(data.message);
			}
		} catch (error) {
			toast.error(error.message);
		}
	};

	const [openSections, setOpenSections] = useState({});

	const toggleSection = (index) => {
		setOpenSections((prev) => ({
			...prev,
			[index]: !prev[index],
		}));
	};

	const enrollCourse = async () => {
		try {
			if (!userData) {
				return toast.warn("Login to Enroll");
			}

			if (isAlreadyEnrolled) {
				return toast.warn("Already Enrolled");
			}

			const token = await getToken();

			const { data } = await axios.post(
				backendUrl + "/api/user/purchase",
				{ courseId: courseData._id },
				{ headers: { Authorization: `Bearer ${token}` } }
			);

			if (data.success) {
				const { session_url } = data;
				window.location.replace(session_url);
			} else {
				toast.error(data.message);
			}
		} catch (error) {
			toast.error(error.message);
		}
	};

	useEffect(() => {
		fetchCourseData();
	}, []);

	useEffect(() => {
		if (userData && courseData) {
			setIsAlreadyEnrolled(userData.enrolledCourses.includes(courseData._id));
		}
	}, [userData, courseData]);
	return courseData ? (
		<>
			<div className="d-flex flex-column flex-md-row gap-4 position-relative align-items-start justify-content-between px-3 px-md-5 pt-4 pt-md-5 text-start">
				<div
					className="position-absolute top-0 start-0 w-100 h-100 bg-info bg-opacity-10"
					style={{ zIndex: -1 }}
				></div>

				<div
					className="position-relative flex-fill"
					style={{ maxWidth: "576px", zIndex: 10 }}
				>
					<h1 className="h1 fw-semibold text-dark">{courseData.courseTitle}</h1>{" "}
					<p
						className="pt-3 text-muted"
						dangerouslySetInnerHTML={{
							__html: courseData.courseDescription.slice(0, 200),
						}}
					></p>
					<div className="d-flex align-items-center gap-2 pt-3 pb-1 small">
						<p className="text-dark">{calculateRating(courseData)}</p>
						<div className="d-flex">
							{[...Array(5)].map((_, i) => (
								<img
									key={i}
									src={
										i < Math.floor(calculateRating(courseData))
											? assets.star
											: assets.star_blank
									}
									alt=""
									style={{ width: "14px", height: "14px" }}
								/>
							))}
						</div>
						<p className="text-primary">
							({courseData.courseRatings.length}{" "}
							{courseData.courseRatings.length > 1 ? "ratings" : "rating"})
						</p>

						<p className="text-muted">
							{courseData.enrolledStudents.length}{" "}
							{courseData.enrolledStudents.length > 1 ? "students" : "student"}
						</p>
					</div>
					{/* <p className='text-sm'>Course by <span className='text-blue-600 underline'>{courseData.educator.name}</span></p> */}{" "}
					<div className="pt-4 text-dark">
						<h2 className="h5 fw-semibold">Course Structure</h2>
						<div className="pt-3">
							{courseData.courseContent.map((chapter, index) => (
								<div
									key={index}
									className="border border-light bg-white mb-2 rounded"
								>
									<div
										className="d-flex align-items-center justify-content-between px-3 py-3 cursor-pointer user-select-none"
										onClick={() => toggleSection(index)}
										style={{ cursor: "pointer" }}
									>
										<div className="d-flex align-items-center gap-2">
											<img
												src={assets.down_arrow_icon}
												alt="arrow icon"
												className={`transition ${
													openSections[index] ? "rotate-180" : ""
												}`}
												style={{
													transform: openSections[index]
														? "rotate(180deg)"
														: "rotate(0deg)",
													transition: "transform 0.3s ease",
												}}
											/>
											<p className="fw-medium mb-0">{chapter.chapterTitle}</p>
										</div>
										<p className="small mb-0">
											{chapter.chapterContent.length} lectures -{" "}
											{calculateChapterTime(chapter)}
										</p>
									</div>

									<div
										className={`overflow-hidden ${
											openSections[index] ? "" : "d-none"
										}`}
									>
										<ul className="list-unstyled ps-4 pe-3 py-2 text-muted border-top border-light mb-0">
											{chapter.chapterContent.map((lecture, i) => (
												<li
													key={i}
													className="d-flex align-items-start gap-2 py-1"
												>
													<img
														src={assets.play_icon}
														alt="bullet icon"
														style={{
															width: "16px",
															height: "16px",
															marginTop: "2px",
														}}
													/>
													<div className="d-flex align-items-center justify-content-between w-100 text-dark small">
														<p className="mb-0">{lecture.lectureTitle}</p>
														<div className="d-flex gap-2">
															{lecture.isPreviewFree && (
																<p
																	onClick={() =>
																		setPlayerData({
																			videoId: lecture.lectureUrl
																				.split("/")
																				.pop(),
																		})
																	}
																	className="text-primary mb-0"
																	style={{ cursor: "pointer" }}
																>
																	Preview
																</p>
															)}
															<p className="mb-0">
																{humanizeDuration(
																	lecture.lectureDuration * 60 * 1000,
																	{ units: ["h", "m"] }
																)}
															</p>
														</div>
													</div>
												</li>
											))}
										</ul>
									</div>
								</div>
							))}
						</div>
					</div>{" "}
					<div className="py-5">
						<h3 className="h5 fw-semibold text-dark">Course Description</h3>
						<p
							className="rich-text pt-3"
							dangerouslySetInnerHTML={{ __html: courseData.courseDescription }}
						></p>
					</div>
				</div>

				<div
					className="position-relative shadow rounded bg-white"
					style={{ minWidth: "300px", maxWidth: "420px", zIndex: 10 }}
				>
					{playerData ? (
						<YouTube
							videoId={playerData.videoId}
							opts={{ playerVars: { autoplay: 1 } }}
							iframeClassName="w-100"
							style={{ aspectRatio: "16/9" }}
						/>
					) : (
						<img
							src={courseData.courseThumbnail}
							alt=""
							className="w-100 rounded-top"
						/>
					)}
					<div className="p-4">
						<div className="d-flex align-items-center gap-2">
							<img
								style={{ width: "14px" }}
								src={assets.time_left_clock_icon}
								alt="time left clock icon"
							/>
							<p className="text-danger mb-0">
								<span className="fw-medium">5 days</span> left at this price!
							</p>
						</div>
						<div className="d-flex gap-3 align-items-center pt-2">
							<p className="text-dark h2 fw-semibold mb-0">
								{currency}
								{(
									courseData.coursePrice -
									(courseData.discount * courseData.coursePrice) / 100
								).toFixed(2)}
							</p>
							<p className="h5 text-muted text-decoration-line-through mb-0">
								{currency}
								{courseData.coursePrice}
							</p>
							<p className="h5 text-muted mb-0">{courseData.discount}% off</p>
						</div>
						<div className="d-flex align-items-center small gap-3 pt-2 pt-md-3 text-muted">
							<div className="d-flex align-items-center gap-1">
								<img
									src={assets.star}
									alt="star icon"
									style={{ width: "16px" }}
								/>
								<p className="mb-0">{calculateRating(courseData)}</p>
							</div>
							<div
								style={{
									height: "16px",
									width: "1px",
									backgroundColor: "rgba(108, 117, 125, 0.4)",
								}}
							></div>
							<div className="d-flex align-items-center gap-1">
								<img
									src={assets.time_clock_icon}
									alt="clock icon"
									style={{ width: "16px" }}
								/>
								<p className="mb-0">{calculateCourseDuration(courseData)}</p>
							</div>
							<div
								style={{
									height: "16px",
									width: "1px",
									backgroundColor: "rgba(108, 117, 125, 0.4)",
								}}
							></div>
							<div className="d-flex align-items-center gap-1">
								<img
									src={assets.lesson_icon}
									alt="clock icon"
									style={{ width: "16px" }}
								/>
								<p className="mb-0">
									{calculateNoOfLectures(courseData)} lessons
								</p>
							</div>
						</div>
						<button
							onClick={enrollCourse}
							className="btn btn-primary w-100 py-3 fw-medium mt-3 mt-md-4"
						>
							{isAlreadyEnrolled ? "Already Enrolled" : "Enroll Now"}
						</button>
						<div className="pt-4">
							<p className="h5 fw-medium text-dark">What's in the course?</p>
							<ul className="ms-3 pt-2 small text-muted">
								<li>Lifetime access with free updates.</li>
								<li>Step-by-step, hands-on project guidance.</li>
								<li>Downloadable resources and source code.</li>
								<li>Quizzes to test your knowledge.</li>
								<li>Certificate of completion.</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
			<Footer />
		</>
	) : (
		<Loading />
	);
};

export default CourseDetails;
