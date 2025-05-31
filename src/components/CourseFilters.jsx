import React, { use, useContext, useEffect, useState } from "react";
import {
	Card,
	Form,
	Button,
	Badge,
	InputGroup,
	Collapse,
} from "react-bootstrap";

const CourseFilters = ({ filter, updateFilter, onClearFilters }) => {
	const [lecturer, setLecturer] = useState("");
	const [isExpanded, setIsExpanded] = useState(true);

	const filterOptions = {
		category: [
			{ value: "all", label: "All Categories" },
			{ value: "programming", label: "Programming" },
			{ value: "mathematics", label: "Mathematics" },
			{ value: "science", label: "Science" },
			{ value: "history", label: "History" },
			{ value: "literature", label: "Literature" },
			{ value: "art", label: "Art" },
			{ value: "music", label: "Music" },
			{ value: "physical-education", label: "Physical Education" },
			{ value: "health", label: "Health" },
			{ value: "business", label: "Business" },
		],
		sortBy: [
			{ value: "participants", label: "Most Popular (Participants)" },
			{ value: "date-newest", label: "Newest Courses" },
			{ value: "date-oldest", label: "Oldest Courses" },
			{ value: "rating", label: "Highest Rated" },
		],
	};

	const getFilterValue = (filterType) => {
		if (filter[filterType]) {
			return filter[filterType].filterValue;
		}
		return filterType === "sortBy" ? "participants" : "all";
	};

	const getActiveFiltersCount = () => {
		let count = 0;
		for (let key in filter) {
			if (filter[key].filterValue !== "all" && filter[key].filterValue) {
				count++;
			}
		}
		return count;
	};

	useEffect(() => {
		// Only trigger search if lecturer has actually been typed by user
		if (lecturer === "") return;

		const timer = setTimeout(() => {
			updateFilter("lecturer", lecturer);
		}, 1000);
		return () => clearTimeout(timer);
	}, [lecturer]);

	const clearAllFilters = () => {
		setLecturer("");
		onClearFilters();
	};

	return (
		<Card className="shadow-sm border-0">
			<Card.Header
				className="bg-primary text-white cursor-pointer"
				onClick={() => setIsExpanded(!isExpanded)}
				style={{ cursor: "pointer" }}
			>
				<div className="d-flex align-items-center justify-content-between">
					<h5 className="mb-0 d-flex align-items-center">
						<i className="fas fa-filter me-2"></i>
						Filter & Sort Courses
						{getActiveFiltersCount() > 0 && (
							<Badge bg="light" text="primary" className="ms-2">
								{getActiveFiltersCount()}
							</Badge>
						)}
					</h5>
					<i
						className={`fas fa-chevron-${isExpanded ? "up" : "down"} d-lg-none`}
					></i>
				</div>
			</Card.Header>
			<Collapse in={isExpanded}>
				<Card.Body className="p-4">
					{/* Category Filter */}
					<div className="mb-4">
						<Form.Label className="fw-semibold text-dark d-flex align-items-center">
							<i className="fas fa-folder me-2 text-primary"></i>Category
						</Form.Label>
						<Form.Select
							value={getFilterValue("category")}
							onChange={(e) => updateFilter("category", e.target.value)}
						>
							{filterOptions.category.map((option) => (
								<option key={option.value} value={option.value}>
									{option.label}
								</option>
							))}
						</Form.Select>
					</div>

					{/* Lecturer Filter */}
					<div className="mb-4">
						<Form.Label className="fw-semibold text-dark d-flex align-items-center">
							<i className="fas fa-user-tie me-2 text-primary"></i>Lecturer
						</Form.Label>
						<InputGroup>
							<Form.Control
								type="text"
								placeholder="Search by lecturer name..."
								value={lecturer}
								onChange={(e) => setLecturer(e.target.value)}
							/>
						</InputGroup>
					</div>

					{/* Sort By */}
					<div className="mb-4">
						<Form.Label className="fw-semibold text-dark d-flex align-items-center">
							<i className="fas fa-sort me-2 text-primary"></i>Sort by
						</Form.Label>
						<Form.Select
							value={getFilterValue("sortBy")}
							onChange={(e) => updateFilter("sortBy", e.target.value)}
						>
							{filterOptions.sortBy.map((option) => (
								<option key={option.value} value={option.value}>
									{option.label}
								</option>
							))}
						</Form.Select>
					</div>

					{/* Active Filters Summary */}
					{getActiveFiltersCount() > 0 && (
						<div className="border-top pt-3 mb-3">
							<small className="text-muted fw-semibold">
								Active Filters ({getActiveFiltersCount()})
							</small>
							<div className="d-flex flex-wrap gap-1 mt-2">
								{Object.keys(filter).map((key) => {
									const f = filter[key];
									if (f.filterValue !== "all" && f.filterValue) {
										const optionLabel =
											filterOptions[f.filterType]?.find(
												(opt) => opt.value === f.filterValue
											)?.label || f.filterValue;
										return (
											<Badge
												key={key}
												bg="primary"
												className="d-flex align-items-center gap-1 px-2 py-1"
												style={{ fontSize: "0.75rem" }}
											>
												{f.filterType}: {optionLabel}
											</Badge>
										);
									}
									return null;
								})}
							</div>
						</div>
					)}

					{/* Clear All Button */}
					{getActiveFiltersCount() > 0 && (
						<Button
							variant="outline-danger"
							size="sm"
							className="w-100 d-flex align-items-center justify-content-center gap-2"
							onClick={clearAllFilters}
						>
							<i className="fas fa-times"></i>
							Clear All Filters ({getActiveFiltersCount()})
						</Button>
					)}
				</Card.Body>
			</Collapse>
		</Card>
	);
};

export default CourseFilters;
