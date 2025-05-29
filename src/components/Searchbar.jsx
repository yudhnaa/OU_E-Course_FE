import React, { useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const SearchBar = ({ data }) => {
	const navigate = useNavigate();

	const [input, setInput] = useState(data ? data : "");

	const onSearchHandler = (e) => {
		e.preventDefault();

		navigate("/course-list/" + input);
	};

	return (
		<form
			onSubmit={onSearchHandler}
			className="w-100 d-flex align-items-center bg-white border border-light rounded mx-auto"
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
				onChange={(e) => setInput(e.target.value)}
				value={input}
				type="text"
				className="form-control border-0 text-muted"
				style={{ outline: "none", boxShadow: "none" }}
				placeholder="Search for courses"
			/>
			<button type="submit" className="btn btn-primary mx-1 px-3 px-md-4 py-2">
				Search
			</button>
		</form>
	);
};

export default SearchBar;
