import React from "react";
import { assets } from "../assets/assets";

const Companies = () => {
	return (
		<div className="pt-5">
			<p className="text-muted text-center mb-4">Trusted by learners from</p>
			<div className="d-flex flex-wrap align-items-center justify-content-center gap-4 gap-md-5">
				<img
					className="img-fluid"
					style={{ width: "80px", maxWidth: "112px" }}
					src={assets.microsoft_logo}
					alt="Microsoft"
				/>
				<img
					className="img-fluid"
					style={{ width: "80px", maxWidth: "112px" }}
					src={assets.walmart_logo}
					alt="Walmart"
				/>
				<img
					className="img-fluid"
					style={{ width: "80px", maxWidth: "96px" }}
					src={assets.accenture_logo}
					alt="Accenture"
				/>
				<img
					className="img-fluid"
					style={{ width: "80px", maxWidth: "96px" }}
					src={assets.adobe_logo}
					alt="Adobe"
				/>
				<img
					className="img-fluid"
					style={{ width: "80px", maxWidth: "96px" }}
					src={assets.paypal_logo}
					alt="Paypal"
				/>
			</div>
		</div>
	);
};

export default Companies;
