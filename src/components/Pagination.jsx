import React from "react";
import { Pagination as BSPagination } from "react-bootstrap";

const Pagination = ({
	currentPage,
	totalPages,
	totalItems,
	itemsPerPage,
	onPageChange,
	loading = false,
}) => {
	if (loading || totalItems === 0 || totalPages <= 1) return null;

	const startIndex = (currentPage - 1) * itemsPerPage + 1;
	const endIndex = Math.min(currentPage * itemsPerPage, totalItems);

	const getPageNumbers = () => {
		const pages = [];
		const maxVisiblePages = 5;

		if (totalPages <= maxVisiblePages) {
			// Show all pages if total pages is less than max visible
			for (let i = 1; i <= totalPages; i++) {
				pages.push(i);
			}
		} else {
			const startPage = Math.max(
				1,
				currentPage - Math.floor(maxVisiblePages / 2)
			);
			const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

			// Adjust start page if near the end
			const adjustedStartPage = Math.max(1, endPage - maxVisiblePages + 1);

			for (let i = adjustedStartPage; i <= endPage; i++) {
				pages.push(i);
			}
		}

		return pages;
	};

	const pageNumbers = getPageNumbers();

	return (
		<div className="d-flex justify-content-between align-items-center">
			{/* Results count */}
			<div>
				<p className="text-muted mb-0">
					Showing {startIndex} to {endIndex} of {totalItems} courses
				</p>
			</div>

			{/* Pagination controls */}
			<div>
				<BSPagination className="mb-0">
					{/* Previous Button */}
					<BSPagination.Prev
						disabled={currentPage <= 1}
						onClick={() => {
							if (currentPage > 1) {
								onPageChange(currentPage - 1);
								// Scroll to top when page changes
								window.scrollTo({ top: 0, behavior: "smooth" });
							}
						}}
					/>

					{/* Page Numbers */}
					{pageNumbers.map((page) => (
						<BSPagination.Item
							key={page}
							active={page === currentPage}
							onClick={() => {
								onPageChange(page);
								// Scroll to top when page changes
								window.scrollTo({ top: 0, behavior: "smooth" });
							}}
						>
							{page}
						</BSPagination.Item>
					))}

					{/* Next Button */}
					<BSPagination.Next
						disabled={currentPage >= totalPages}
						onClick={() => {
							if (currentPage < totalPages) {
								onPageChange(currentPage + 1);
								// Scroll to top when page changes
								window.scrollTo({ top: 0, behavior: "smooth" });
							}
						}}
					/>
				</BSPagination>
			</div>
		</div>
	);
};

export default Pagination;
