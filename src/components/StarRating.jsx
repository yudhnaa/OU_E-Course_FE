import React from "react";
import { Image } from "react-bootstrap";
import { assets } from "../assets/assets";

const StarRating = ({ rating, size = 14, className = "" }) => {
	const fullStars = Math.floor(rating);
	const hasHalfStar = rating % 1 >= 0.5;
	const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

	return (
		<div className={`d-flex align-items-center ${className}`}>
			{/* Full stars */}
			{[...Array(fullStars)].map((_, i) => (
				<Image
					key={`full-${i}`}
					src={assets.star}
					alt="star"
					width={size}
					height={size}
				/>
			))}
			{/* Half star */}
			{hasHalfStar && (
				<Image
					src={assets.star}
					alt="star"
					width={size}
					height={size}
					style={{ opacity: 0.5 }}
				/>
			)}
			{/* Empty stars */}
			{[...Array(emptyStars)].map((_, i) => (
				<Image
					key={`empty-${i}`}
					src={assets.star_blank}
					alt="star"
					width={size}
					height={size}
				/>
			))}
		</div>
	);
};

export default StarRating;
