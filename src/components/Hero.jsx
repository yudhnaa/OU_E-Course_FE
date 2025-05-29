import React from "react";
import { assets } from "../assets/assets";
import SearchBar from "./Searchbar";

const Hero = () => {
	return (
		<div
			className="d-flex flex-column align-items-center justify-content-center w-100 text-center"
			style={{ paddingTop: "144px", paddingBottom: "28px" }}
		>
			<div className="container">
				<h1
					className="display-4 fw-bold text-dark mb-4 mx-auto position-relative"
					style={{ maxWidth: "768px" }}
				>
					Empower your future with the courses designed to
					<span className="text-primary"> fit your choice.</span>
					<img
						src={assets.sketch}
						alt="sketch"
						className="d-none d-md-block position-absolute"
						style={{ bottom: "-28px", right: "0" }}
					/>
				</h1>
				<p
					className="d-none d-md-block text-muted mx-auto mb-4"
					style={{ maxWidth: "512px" }}
				>
					We bring together world-class instructors, interactive content, and a
					supportive community to help you achieve your personal and
					professional goals.
				</p>
				<p
					className="d-md-none text-muted mx-auto mb-4"
					style={{ maxWidth: "384px" }}
				>
					We bring together world-class instructors to help you achieve your
					professional goals.
				</p>
				<SearchBar />
			</div>
		</div>
	);
};

export default Hero;
