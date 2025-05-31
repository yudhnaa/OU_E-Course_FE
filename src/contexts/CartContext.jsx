import React, { useReducer, useEffect, useContext } from "react";
import cookie from "react-cookies";
import { toast } from "react-toastify";
import {
	cartReducer,
	initialCartState,
	CART_ACTIONS,
} from "../reducers/cartReducer";

const CartContext = React.createContext();

export const useCart = () => {
	const context = useContext(CartContext);
	if (!context) {
		throw new Error("useCart must be used within a CartProvider");
	}
	return context;
};

const CartProvider = ({ children }) => {
	const [cartState, cartDispatch] = useReducer(cartReducer, initialCartState);

	// Load cart from cookies
	useEffect(() => {
		const loadCartFromStorage = () => {
			try {
				const savedCart = cookie.load("cart");
				const savedSelectedItems = cookie.load("selectedCartItems");

				let cartItems = [];
				let selectedItems = [];

				if (savedCart) {
					cartItems =
						typeof savedCart === "string" ? JSON.parse(savedCart) : savedCart;
					cartItems = Array.isArray(cartItems) ? cartItems : [];
				}

				if (savedSelectedItems) {
					selectedItems =
						typeof savedSelectedItems === "string"
							? JSON.parse(savedSelectedItems)
							: savedSelectedItems;
					selectedItems = Array.isArray(selectedItems) ? selectedItems : [];
				}

				console.log(
					"Loading cart from storage - items:",
					cartItems,
					"selected:",
					selectedItems
				);

				cartDispatch({
					type: CART_ACTIONS.LOAD_CART,
					payload: {
						items: cartItems,
						selectedItems: selectedItems,
					},
				});
			} catch (error) {
				console.error("Error loading cart from storage:", error);
				cartDispatch({
					type: CART_ACTIONS.LOAD_CART,
					payload: {
						items: [],
						selectedItems: [],
					},
				});
			}
		};

		loadCartFromStorage();
	}, []);

	// Save cart to cookies
	useEffect(() => {
		if (cartState.isLoaded) {
			const expires = new Date();
			expires.setDate(expires.getDate() + 7);

			// Save cart items
			cookie.save("cart", JSON.stringify(cartState.items), {
				path: "/",
				expires,
			});

			// Save selected items
			cookie.save(
				"selectedCartItems",
				JSON.stringify([...cartState.selectedItems]),
				{
					path: "/",
					expires,
				}
			);
		}
	}, [cartState.items, cartState.selectedItems, cartState.isLoaded]);

	// actions
	const addCourseToCart = (course) => {
		const exists = cartState.items.find((item) => item.id === course.id);
		if (!exists) {
			cartDispatch({
				type: CART_ACTIONS.ADD_ITEM,
				payload: course,
			});
			toast.success(`${course.name} added to cart!`);
			return true;
		} else {
			toast.info("Course is already in cart");
			return false;
		}
	};

	const removeCourseFromCart = (courseId) => {
		cartDispatch({
			type: CART_ACTIONS.REMOVE_ITEM,
			payload: courseId,
		});
		toast.success("Course removed from cart");
	};

	const clearCart = () => {
		cartDispatch({
			type: CART_ACTIONS.CLEAR_CART,
		});
		toast.success("Cart cleared");
	};

	const toggleItemSelection = (courseId) => {
		cartDispatch({
			type: CART_ACTIONS.TOGGLE_SELECTION,
			payload: courseId,
		});
	};

	const selectAllItems = () => {
		cartDispatch({
			type: CART_ACTIONS.SELECT_ALL,
		});
	};

	const deselectAllItems = () => {
		cartDispatch({
			type: CART_ACTIONS.DESELECT_ALL,
		});
	};

	const cleanupAfterPayment = (paymentSessionId) => {
		let pendingPayment = sessionStorage.getItem("pendingPaymentCourses");

		if (pendingPayment) {
			try {
				pendingPayment = JSON.parse(pendingPayment);

				if (pendingPayment.paymentSessionId === paymentSessionId) {
					cartDispatch({
						type: CART_ACTIONS.CLEANUP_AFTER_PAYMENT,
						payload: pendingPayment.pendingCourseIds,
					});
					sessionStorage.removeItem("pendingPaymentCourses");
					toast.success("Cart updated after successful payment");
				} else {
					console.log("Session ID mismatch:", {
						stored: pendingPayment.paymentSessionId,
						received: paymentSessionId,
					});
				}
			} catch (error) {
				console.error("Error parsing pending payment data:", error);
				sessionStorage.removeItem("pendingPaymentCourses");
			}
		} else {
			console.log("No pending payment data found in sessionStorage");
		}
	};

	// Utility functions
	const getCartItemCount = () => cartState.items.length;

	const getSelectedItemCount = () => cartState.selectedItems.size;

	const isInCart = (courseId) =>
		cartState.items.some((item) => item.id === courseId);

	const isSelected = (courseId) => cartState.selectedItems.has(courseId);

	const getSelectedItems = () =>
		cartState.items.filter((item) => cartState.selectedItems.has(item.id));

	const getSelectedTotal = () =>
		getSelectedItems().reduce((total, item) => total + (item.price || 0), 0);

	// Context value
	const value = {
		// State
		cartItems: cartState.items,
		selectedItems: cartState.selectedItems,
		isLoaded: cartState.isLoaded,

		// Actions
		addCourseToCart,
		removeCourseFromCart,
		clearCart,
		toggleItemSelection,
		selectAllItems,
		deselectAllItems,
		cleanupAfterPayment,

		// Utilities
		getCartItemCount,
		getSelectedItemCount,
		isInCart,
		isSelected,
		getSelectedItems,
		getSelectedTotal,

		// Aliases
		addToCart: addCourseToCart,
		removeFromCart: removeCourseFromCart,
	};

	return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export { CartContext, CartProvider };
