import React from "react";
import { assets } from "../assets/assets";

const Footer = () => {
	return (
		<footer
			className="bg-dark text-start w-100"
			style={{ paddingLeft: "144px", paddingRight: "144px" }}
		>
			<div className="d-flex flex-column flex-md-row align-items-start px-4 px-md-0 justify-content-center gap-4 gap-md-5 py-5 border-bottom border-light border-opacity-25">
				<div className="d-flex flex-column align-items-center align-items-md-start w-100">
					<img src={assets.logo_dark} alt="logo" />
					<p className="mt-4 text-center text-md-start small text-light text-opacity-75">
						Lorem Ipsum is simply dummy text of the printing and typesetting
						industry. Lorem Ipsum has been the industry's standard dummy text.
					</p>
				</div>

				<div className="d-flex flex-column align-items-center align-items-md-start w-100">
					<h2 className="fw-semibold text-light mb-3">Company</h2>
					<ul className="d-flex d-md-flex flex-md-column w-100 justify-content-between small text-light text-opacity-75 list-unstyled gap-md-2">
						<li>
							<a
								href="#"
								className="text-decoration-none text-light text-opacity-75"
							>
								Home
							</a>
						</li>
						<li>
							<a
								href="#"
								className="text-decoration-none text-light text-opacity-75"
							>
								About us
							</a>
						</li>
						<li>
							<a
								href="#"
								className="text-decoration-none text-light text-opacity-75"
							>
								Contact us
							</a>
						</li>
						<li>
							<a
								href="#"
								className="text-decoration-none text-light text-opacity-75"
							>
								Privacy policy
							</a>
						</li>
					</ul>
				</div>

				<div className="d-none d-md-flex flex-column align-items-start w-100">
					<h2 className="fw-semibold text-light mb-3">
						Subscribe to our newsletter
					</h2>
					<p className="small text-light text-opacity-75">
						The latest news, articles, and resources, sent to your inbox weekly.
					</p>
					<div className="d-flex align-items-center gap-2 pt-3">
						<input
							className="form-control border-secondary bg-secondary text-muted bg-white"
							style={{ width: "256px", height: "36px" }}
							type="email"
							placeholder="Enter your email"
						/>
						<button
							className="btn btn-primary"
							style={{ width: "96px", height: "36px" }}
						>
							Subscribe
						</button>
					</div>
				</div>
			</div>
			<p className="py-3 text-center small text-light text-opacity-50">
				Copyright 2024 © Company. All Right Reserved.
			</p>
		</footer>
	);
};

export default Footer;
