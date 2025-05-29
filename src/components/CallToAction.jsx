import React from "react";
import { assets } from "../assets/assets";

const CallToAction = () => {
	return (
		<div className="d-flex flex-column align-items-center gap-4 pt-4 pb-5 px-3 px-md-0">
			<h1 className="h1 text-dark fw-semibold text-center">
				Learn anything, anytime, anywhere
			</h1>
			<p className="text-muted text-center">
				Incididunt sint fugiat pariatur cupidatat consectetur sit cillum anim id
				veniam aliqua proident excepteur commodo do ea.
			</p>
			<div className="d-flex align-items-center fw-medium gap-3 mt-3">
				<button className="btn btn-primary px-4 py-2">Get started</button>
				<button className="btn btn-link d-flex align-items-center gap-2 text-decoration-none">
					Learn more
					<img
						src={assets.arrow_icon}
						alt="arrow_icon"
						style={{ width: "16px", height: "16px" }}
					/>
				</button>
			</div>
		</div>
	);
};

export default CallToAction;
