import cookie from "react-cookies";

// User action types
export const USER_ACTIONS = {
	LOGIN: "LOGIN",
	LOGOUT: "LOGOUT",
};

// Initial user state
export const initialUserState = {
	user: null,
	isAuthenticated: false,
	token: null,
};

// User reducer
export const userReducer = (state, action) => {
	switch (action.type) {
		case USER_ACTIONS.LOGIN:
			return {
				...state,
				user: action.payload.user,
				token: action.payload.token,
				isAuthenticated: true,
			};

		case USER_ACTIONS.LOGOUT:
			return {
				...state,
				user: null,
				token: null,
				isAuthenticated: false,
			};

		default:
			return state;
	}
};
