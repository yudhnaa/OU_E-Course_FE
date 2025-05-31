import React, { useState, useEffect } from "react";
import { assets } from "../assets/assets";

const Rating = ({
	initialRating = 0,
	onRate,
	disabled = false,
	size = "24px",
}) => {
	const [rating, setRating] = useState(initialRating);
	const [hoverRating, setHoverRating] = useState(0);

	useEffect(() => {
		setRating(initialRating);
	}, [initialRating]);

	const handleClick = (selectedRating) => {
		if (disabled) return;

		setRating(selectedRating);
		if (onRate) {
			onRate(selectedRating);
		}
	};

	const handleMouseEnter = (selectedRating) => {
		if (disabled) return;
		setHoverRating(selectedRating);
	};

	const handleMouseLeave = () => {
		if (disabled) return;
		setHoverRating(0);
	};

	return (
		<div className="d-flex gap-1 align-items-center">
			{[1, 2, 3, 4, 5].map((star) => {
				const isFilled = star <= (hoverRating || rating);
				return (
					<img
						key={star}
						src={isFilled ? assets.star : assets.star_blank}
						alt={`${star} star`}
						style={{
							height: size,
							width: size,
							cursor: disabled ? "default" : "pointer",
							transition: "all 0.2s ease",
							opacity: disabled ? 0.6 : 1,
						}}
						onClick={() => handleClick(star)}
						onMouseEnter={() => handleMouseEnter(star)}
						onMouseLeave={handleMouseLeave}
						className={disabled ? "" : "rating-star"}
					/>
				);
			})}
		</div>
	);
};

export default Rating;
