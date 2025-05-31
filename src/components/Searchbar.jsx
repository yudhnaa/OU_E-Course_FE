import React, { useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const SearchBar = ({ data, searchHandler, setSearch }) => {
	const navigate = useNavigate();

	const onSearchHandler = (e) => {
		e.preventDefault();

		if (searchHandler) {
			searchHandler({
				search: data.search.trim(),
				filter: data?.filter || [],
				page: 1,
			});
		}
	};

	useEffect(() => {
		// debounce - only trigger on search changes, not initial render
		if (data.search === undefined || data.search === null) return;

		const handler = setTimeout(() => {
			if (searchHandler) {
				searchHandler({
					search: data.search.trim(),
					filter: data?.filter || [],
					page: 1, // Reset to first page when searching
				});
			}
		}, 1000);

		return () => {
			clearTimeout(handler);
		};
	}, [data.search]); // Keep minimal dependencies to avoid unnecessary calls

	return (
		<form
			onSubmit={onSearchHandler}
			className="w-100 d-flex align-items-center bg-white rounded mx-auto border border-black"
			style={{ maxWidth: "576px", height: "56px" }}
		>
			<div className="px-3 d-flex align-items-center">
				<img
					className="img-fluid"
					style={{ width: "20px", height: "20px" }}
					src={assets.search_icon}
					alt="search_icon"
				/>
			</div>
			<input
				onChange={(e) => setSearch(e.target.value)}
				value={data.search}
				type="text"
				className="form-control border-0 text-muted"
				style={{ outline: "none", boxShadow: "none" }}
				placeholder="Search courses, instructors, topics, or keywords..."
			/>
			<button type="submit" className="btn btn-primary mx-1 px-3 px-md-4 py-2">
				Search
			</button>
		</form>
	);
};

export default SearchBar;
