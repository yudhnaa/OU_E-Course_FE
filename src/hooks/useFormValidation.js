import { useState, useCallback } from "react";

// Validation rules
const validationRules = {
	username: {
		required: true,
		minLength: 3,
		message: "Username must be at least 3 characters long",
	},
	password: {
		required: true,
		minLength: 3,
		message: "Password must be at least 3 characters long",
	},
};

const useFormValidation = (initialValues = {}) => {
	const [values, setValues] = useState(initialValues);
	const [errors, setErrors] = useState({});
	const [touched, setTouched] = useState({});

	const validateField = useCallback((name, value) => {
		const rule = validationRules[name];
		if (!rule) return "";

		if (rule.required && (!value || value.trim() === "")) {
			return `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
		}

		if (rule.minLength && value.length < rule.minLength) {
			return rule.message;
		}

		return "";
	}, []);

	const handleChange = useCallback(
		(e) => {
			const { name, value } = e.target;
			setValues((prev) => ({ ...prev, [name]: value }));

			// Clear error when user starts typing
			if (errors[name]) {
				setErrors((prev) => ({ ...prev, [name]: "" }));
			}
		},
		[errors]
	);

	const handleBlur = useCallback(
		(e) => {
			const { name, value } = e.target;
			setTouched((prev) => ({ ...prev, [name]: true }));

			const error = validateField(name, value);
			setErrors((prev) => ({ ...prev, [name]: error }));
		},
		[validateField]
	);

	const validateForm = useCallback(() => {
		const newErrors = {};
		let isValid = true;

		Object.keys(values).forEach((name) => {
			const error = validateField(name, values[name]);
			if (error) {
				newErrors[name] = error;
				isValid = false;
			}
		});

		setErrors(newErrors);
		setTouched(
			Object.keys(values).reduce((acc, key) => ({ ...acc, [key]: true }), {})
		);

		return isValid;
	}, [values, validateField]);

	const reset = useCallback(() => {
		setValues(initialValues);
		setErrors({});
		setTouched({});
	}, [initialValues]);

	return {
		values,
		errors,
		touched,
		handleChange,
		handleBlur,
		validateForm,
		reset,
		setValues,
	};
};

export default useFormValidation;
