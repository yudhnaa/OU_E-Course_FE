import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import YouTube from "react-youtube";
import { assets } from "../../assets/assets";
import { useParams } from "react-router-dom";
import humanizeDuration from "humanize-duration";
import axios from "axios";
import { toast } from "react-toastify";
import Rating from "../../components/Rating";
import Footer from "../../components/student/Footer";
import Loading from "../../components/student/Loading";

const Player = ({}) => {
	const {
		enrolledCourses,
		backendUrl,
		getToken,
		calculateChapterTime,
		userData,
		fetchUserEnrolledCourses,
	} = useContext(AppContext);

	const { courseId } = useParams();
	const [courseData, setCourseData] = useState(null);
	const [progressData, setProgressData] = useState(null);
	const [openSections, setOpenSections] = useState({});
	const [playerData, setPlayerData] = useState(null);
	const [initialRating, setInitialRating] = useState(0);

	const getCourseData = () => {
		enrolledCourses.map((course) => {
			if (course._id === courseId) {
				setCourseData(course);
				course.courseRatings.map((item) => {
					if (item.userId === userData._id) {
						setInitialRating(item.rating);
					}
				});
			}
		});
	};

	const toggleSection = (index) => {
		setOpenSections((prev) => ({
			...prev,
			[index]: !prev[index],
		}));
	};

	useEffect(() => {
		if (enrolledCourses.length > 0) {
			getCourseData();
		}
	}, [enrolledCourses]);

	const markLectureAsCompleted = async (lectureId) => {
		try {
			const token = await getToken();

			const { data } = await axios.post(
				backendUrl + "/api/user/update-course-progress",
				{ courseId, lectureId },
				{ headers: { Authorization: `Bearer ${token}` } }
			);

			if (data.success) {
				toast.success(data.message);
				getCourseProgress();
			} else {
				toast.error(data.message);
			}
		} catch (error) {
			toast.error(error.message);
		}
	};

	const getCourseProgress = async () => {
		try {
			const token = await getToken();

			const { data } = await axios.post(
				backendUrl + "/api/user/get-course-progress",
				{ courseId },
				{ headers: { Authorization: `Bearer ${token}` } }
			);

			if (data.success) {
				setProgressData(data.progressData);
			} else {
				toast.error(data.message);
			}
		} catch (error) {
			toast.error(error.message);
		}
	};

	const handleRate = async (rating) => {
		try {
			const token = await getToken();

			const { data } = await axios.post(
				backendUrl + "/api/user/add-rating",
				{ courseId, rating },
				{ headers: { Authorization: `Bearer ${token}` } }
			);

			if (data.success) {
				toast.success(data.message);
				fetchUserEnrolledCourses();
			} else {
				toast.error(data.message);
			}
		} catch (error) {
			toast.error(error.message);
		}
	};

	useEffect(() => {
		getCourseProgress();
	}, []);
	return courseData ? (
		<>
			<div className="p-3 p-sm-4 d-flex flex-column flex-md-row gap-4 px-md-5">
				<div className="text-dark flex-fill">
					<h2 className="h5 fw-semibold">Course Structure</h2>
					<div className="pt-3">
						{courseData &&
							courseData.courseContent.map((chapter, index) => (
								<div
									key={index}
									className="border border-light bg-white mb-2 rounded"
								>
									<div
										className="d-flex align-items-center justify-content-between px-3 py-3 user-select-none"
										onClick={() => toggleSection(index)}
										style={{ cursor: "pointer" }}
									>
										<div className="d-flex align-items-center gap-2">
											<img
												src={assets.down_arrow_icon}
												alt="arrow icon"
												className="transition"
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
														src={
															progressData &&
															progressData.lectureCompleted.includes(
																lecture.lectureId
															)
																? assets.blue_tick_icon
																: assets.play_icon
														}
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
															{lecture.lectureUrl && (
																<p
																	onClick={() =>
																		setPlayerData({
																			...lecture,
																			chapter: index + 1,
																			lecture: i + 1,
																		})
																	}
																	className="text-primary mb-0"
																	style={{ cursor: "pointer" }}
																>
																	Watch
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

					<div className="d-flex align-items-center gap-2 py-3 mt-4">
						<h1 className="h5 fw-bold mb-0">Rate this Course:</h1>
						<Rating initialRating={initialRating} onRate={handleRate} />
					</div>
				</div>

				<div className="mt-3 mt-md-4 flex-fill">
					{playerData ? (
						<div>
							<YouTube
								iframeClassName="w-100"
								style={{ aspectRatio: "16/9" }}
								videoId={playerData.lectureUrl.split("/").pop()}
							/>
							<div className="d-flex justify-content-between align-items-center mt-2">
								<p className="h5 mb-0">
									{playerData.chapter}.{playerData.lecture}{" "}
									{playerData.lectureTitle}
								</p>
								<button
									onClick={() => markLectureAsCompleted(playerData.lectureId)}
									className="btn btn-link text-primary p-0"
								>
									{progressData &&
									progressData.lectureCompleted.includes(playerData.lectureId)
										? "Completed"
										: "Mark Complete"}
								</button>
							</div>
						</div>
					) : (
						<img
							src={courseData ? courseData.courseThumbnail : ""}
							alt=""
							className="w-100 rounded"
						/>
					)}
				</div>
			</div>
		</>
	) : (
		<Loading />
	);
};

export default Player;
