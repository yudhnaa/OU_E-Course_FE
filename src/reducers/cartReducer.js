export const CART_ACTIONS = {
	LOAD_CART: "LOAD_CART",
	ADD_ITEM: "ADD_ITEM",
	REMOVE_ITEM: "REMOVE_ITEM",
	UPDATE_QUANTITY: "UPDATE_QUANTITY",
	CLEAR_CART: "CLEAR_CART",
	TOGGLE_SELECTION: "TOGGLE_SELECTION",
	SELECT_ALL: "SELECT_ALL",
	DESELECT_ALL: "DESELECT_ALL",
	CLEANUP_AFTER_PAYMENT: "CLEANUP_AFTER_PAYMENT",
};

export const initialCartState = {
	items: [],
	selectedItems: new Set(),
	isLoaded: false,
};

export const cartReducer = (state, action) => {
	switch (action.type) {
		case CART_ACTIONS.LOAD_CART:
			return {
				...state,
				items: action.payload.items || [],
				selectedItems: new Set(action.payload.selectedItems || []),
				isLoaded: true,
			};

		case CART_ACTIONS.ADD_ITEM:
			// Check if item already exists
			const existingItem = state.items.find(
				(item) => item.id === action.payload.id
			);
			if (existingItem) {
				return state; // Item already exists, no change
			}

			const newItems = [...state.items, action.payload];
			return {
				...state,
				items: newItems,
				selectedItems: new Set([...state.selectedItems, action.payload.id]),
			};

		case CART_ACTIONS.REMOVE_ITEM:
			const filteredItems = state.items.filter(
				(item) => item.id !== action.payload
			);
			const newSelectedItems = new Set(state.selectedItems);
			newSelectedItems.delete(action.payload);

			return {
				...state,
				items: filteredItems,
				selectedItems: newSelectedItems,
			};

		case CART_ACTIONS.CLEAR_CART:
			return {
				...state,
				items: [],
				selectedItems: new Set(),
			};

		case CART_ACTIONS.TOGGLE_SELECTION:
			const updatedSelectedItems = new Set(state.selectedItems);
			if (updatedSelectedItems.has(action.payload)) {
				updatedSelectedItems.delete(action.payload);
			} else {
				updatedSelectedItems.add(action.payload);
			}

			return {
				...state,
				selectedItems: updatedSelectedItems,
			};

		case CART_ACTIONS.SELECT_ALL:
			return {
				...state,
				selectedItems: new Set(state.items.map((item) => item.id)),
			};

		case CART_ACTIONS.DESELECT_ALL:
			return {
				...state,
				selectedItems: new Set(),
			};
		case CART_ACTIONS.CLEANUP_AFTER_PAYMENT:
			const remainingItems = state.items.filter(
				(item) => !action.payload.includes(item.id)
			);
			return {
				...state,
				items: remainingItems,
				selectedItems: new Set(),
				// Keep isLoaded as true to prevent reloading from cookies
				isLoaded: true,
			};

		default:
			return state;
	}
};
