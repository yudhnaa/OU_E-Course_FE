import { useContext, useEffect, useState, useCallback, useRef } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { assets } from "../assets/assets";
import { AppContext } from "../contexts/AppContext";
import SearchBar from "../components/Searchbar";
import CourseCard from "../components/CourseCard";
import CourseFilters from "../components/CourseFilters";
import Pagination from "../components/Pagination";
import Apis, { authApis, endpoints } from "../configs/Apis";
import { toast } from "react-toastify";
import { PAGE_SIZE } from "../configs/AppConfig";
import { arrayToDate } from "../utils/formatUtils";
import MyCourseCard from "../components/MyCourseCard";

const defaultFilters = {
	category: {
		filterType: "category",
		filterValue: "all",
	},
	lecturer: {
		filterType: "lecturer",
		filterValue: "",
	},
	sortBy: {
		filterType: "sortBy",
		filterValue: "participants",
	},
};

const CoursesList = () => {
	const [allCourses, setAllCourses] = useState([]);
	const [search, setSearch] = useState("");
	const [filter, setFilter] = useState(defaultFilters);
	const [loading, setLoading] = useState(false);
	const [pagination, setPagination] = useState({
		currentPage: 1,
		totalPages: 1,
		totalItems: 0,
		itemsPerPage: PAGE_SIZE,
	});
	const { navigate } = useContext(AppContext);
	const initialLoadRef = useRef(false);

	// sort courses helper function
	const sortCourses = (courses, sortValue) => {
		if (!courses || courses.length === 0) {
			return courses;
		}

		if (!sortValue || sortValue === "participants") {
			return [...courses].sort((a, b) => b.studentCount - a.studentCount);
		}

		switch (sortValue) {
			case "date-newest":
				return [...courses].sort((a, b) => {
					const dateA = arrayToDate(a.dateStart);
					const dateB = arrayToDate(b.dateStart);
					return dateB - dateA;
				});
			case "date-oldest":
				return [...courses].sort((a, b) => {
					const dateA = arrayToDate(a.dateStart);
					const dateB = arrayToDate(b.dateStart);
					return dateA - dateB;
				});
			case "rating":
				return [...courses].sort((a, b) => b.averageRate - a.averageRate);
			default:
				return [...courses];
		}
	};
	const getCourses = useCallback(
		async (data) => {
			setLoading(true);
			try {
				const params = {
					search: data.search || "",
					page: data.page || 1,
					limit: PAGE_SIZE,
				};
				if (data.filter) {
					if (
						data.filter.category &&
						data.filter.category.filterValue !== "all"
					) {
						params.category = data.filter.category.filterValue;
					}
					if (data.filter.lecturer && data.filter.lecturer.filterValue) {
						params.lecturer = data.filter.lecturer.filterValue;
					}
				}

				const res = await authApis().get(endpoints["enrolledCourses"], {
					params: params,
				});

				if (res.status === 200) {
					// Get the courses data
					let courses = res.data.courses;
					console.log("Courses fetched:", res.data);

					// Always apply client-side sorting based on current filter
					const sortValue =
						data.filter?.sortBy?.filterValue || filter.sortBy.filterValue;
					if (sortValue) {
						courses = sortCourses(courses, sortValue);
					}

					setAllCourses(courses);

					// Update pagination state if API provides pagination info
					if (res.data.pagination) {
						setPagination({
							currentPage: res.data.pagination.currentPage,
							totalPages: Math.ceil(res.data.pagination.totalItems / PAGE_SIZE),
							totalItems: res.data.pagination.totalItems,
							itemsPerPage: pagination.itemsPerPage,
						});
					} else {
						// if APIs that don't provide pagination info
						const courses = res.data.courses || res.data;
						setPagination({
							currentPage: data.page || 1,
							totalPages: Math.ceil(courses.length / PAGE_SIZE),
							totalItems: courses.length,
							itemsPerPage: pagination.itemsPerPage,
						});
					}

					return {
						success: true,
						message: "Courses fetched successfully",
					};
				} else {
					return {
						success: false,
						message: "Failed to fetch courses",
					};
				}
			} catch (error) {
				console.error("Error fetching courses:", error);
				return {
					success: false,
					message: error.response?.data?.message || "Failed to fetch courses",
				};
			} finally {
				setLoading(false);
			}
		},
		[filter.sortBy.filterValue, pagination.itemsPerPage]
	);
	const handleSearch = useCallback(
		async (params) => {
			const res = await getCourses({
				search: params.search,
				filter: params.filter,
				page: params.page || 1,
				limit: pagination.itemsPerPage,
			});

			if (res.success) {
				// toast.success(res.message);
			} else {
				toast.error(res.message);
			}
		},
		[getCourses, pagination.itemsPerPage]
	);
	const updateFilter = useCallback(
		(filterType, filterValue) => {
			const newFilter = {
				...filter,
				[filterType]: {
					filterType,
					filterValue,
				},
			};
			setFilter(newFilter);

			if (filterType === "sortBy") {
				const sortedCourses = sortCourses(allCourses, filterValue);
				setAllCourses(sortedCourses);
			} else {
				handleSearch({
					search: search || "",
					filter: newFilter,
					page: 1, // Reset to first page when filters change
				});
			}
		},
		[filter, allCourses, handleSearch, search]
	);
	const clearAllFilters = useCallback(() => {
		setFilter(defaultFilters);
		handleSearch({
			search: search || "",
			filter: defaultFilters,
			page: 1,
		});
	}, [handleSearch, search]);
	const handlePageChange = (page) => {
		handleSearch({
			search: search || "",
			filter: filter,
			page: page,
		});
		// Scroll to top when page changes
		window.scrollTo({ top: 0, behavior: "smooth" });
	};
	useEffect(() => {
		// Prevent multiple initial loads
		if (initialLoadRef.current) return;

		initialLoadRef.current = true;
		// Load courses when component mounts
		handleSearch({
			search: search || "",
			filter: filter,
			page: 1,
		});
	}, []); // Empty dependency array is intentional for initial load only

	return (
		<Container fluid className="px-4 px-md-5 pt-5">
			<Row>
				<Col xl={9} lg={8} className="mb-4">
					{/* header */}
					<div className="d-flex flex-column flex-md-row gap-4 align-items-start justify-content-between w-100 mb-4">
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
						<SearchBar
							data={{ search, filter }}
							searchHandler={handleSearch}
							setSearch={setSearch}
						/>
					</div>
					{/* mobile */}
					<div className="d-lg-none mb-4">
						<CourseFilters
							filter={filter}
							updateFilter={updateFilter}
							onClearFilters={clearAllFilters}
						/>
					</div>
					{/* Search Results Info */}
					{search && (
						<div className="d-inline-flex align-items-center gap-3 px-3 py-2 border mb-4 text-muted">
							<p className="mb-0">Search: "{search}"</p>
							<img
								onClick={() => navigate("/course-list")}
								className="cursor-pointer"
								src={assets.cross_icon}
								alt=""
							/>
						</div>
					)}{" "}
					{/* Results count and loading */}
					<div className="d-flex justify-content-between align-items-center mb-3">
						<p className="text-muted mb-0">
							{loading
								? "Loading..."
								: pagination.totalItems > 0
								? `Showing ${
										(pagination.currentPage - 1) * pagination.itemsPerPage + 1
								  } to ${Math.min(
										pagination.currentPage * pagination.itemsPerPage,
										pagination.totalItems
								  )} of ${pagination.totalItems} courses`
								: "No courses found"}
						</p>
					</div>
					{/* Course Content */}
					{loading ? (
						<div className="d-flex justify-content-center py-5">
							<div className="spinner-border text-primary" role="status">
								<span className="visually-hidden">Loading...</span>
							</div>
						</div>
					) : allCourses.length === 0 ? (
						<div className="text-center py-5" style={{ minHeight: "400px" }}>
							<h4>No courses found</h4>
							<p className="text-muted">Try adjusting your search or filters</p>
						</div>
					) : (
						<>
							{" "}
							<div className="row row-cols-1 row-cols-sm-2 row-cols-md-2 row-cols-lg-4 row-cols-xl-5 g-3">
								{allCourses.map((course, index) => (
									<div key={course.id} className="col">
										<MyCourseCard course={course} />
									</div>
								))}
							</div>
							{/* Pagination Component */}
							<div className="mt-4">
								<Pagination
									currentPage={pagination.currentPage}
									totalPages={pagination.totalPages}
									totalItems={pagination.totalItems}
									itemsPerPage={pagination.itemsPerPage}
									onPageChange={handlePageChange}
									loading={loading}
								/>
							</div>
						</>
					)}
				</Col>

				{/* Desktop Filters Sidebar - Show only on large screens */}
				<Col xl={3} lg={4} className="d-none d-lg-block">
					<div className="position-sticky" style={{ top: "100px" }}>
						<CourseFilters
							filter={filter}
							updateFilter={updateFilter}
							onClearFilters={clearAllFilters}
						/>
					</div>
				</Col>
			</Row>
		</Container>
	);
};

export default CoursesList;
