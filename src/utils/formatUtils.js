import { CURRENCY } from "../configs/AppConfig";

export const formatDate = (dateArray) => {
	if (!dateArray || dateArray.length < 3) return "N/A";
	const [year, month, day] = dateArray;
	return new Date(year, month - 1, day).toLocaleDateString();
};

export const arrayToDate = (dateArray) => {
	if (!dateArray) return new Date();
	if (Array.isArray(dateArray) && dateArray.length >= 3) {
		return new Date(
			dateArray[0],
			dateArray[1] - 1,
			dateArray[2],
			dateArray[3] || 0,
			dateArray[4] || 0
		);
	}
	return new Date(dateArray); // Fallback for other formats
};

export const formatPrice = (price) => {
	if (!price || isNaN(price)) return "Free";
	return new Intl.NumberFormat(CURRENCY.locale, {
		style: "currency",
		currency: CURRENCY.code,
	}).format(price);
};

export const calculateAverageRating = (courseRates) => {
	if (!courseRates || courseRates.length === 0) return 0;
	const totalRating = courseRates.reduce((sum, rate) => sum + rate.rate, 0);
	return (totalRating / courseRates.length).toFixed(1);
};

export const formatDateRange = (startDate, endDate) => {
	if (!startDate || !endDate) return "";
	const start = new Date(startDate[0], startDate[1] - 1, startDate[2]);
	const end = new Date(endDate[0], endDate[1] - 1, endDate[2]);

	const options = {
		month: "short",
		day: "numeric",
		year: "numeric",
	};

	return `${start.toLocaleDateString(
		"en-US",
		options
	)} - ${end.toLocaleDateString("en-US", options)}`;
};
