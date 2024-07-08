import { configureStore} from "@reduxjs/toolkit";
import { setupListeners } from '@reduxjs/toolkit/query'
import apiSlice from "apis";
import { updateCartMiddleware } from "redux/middlewares/updateCartMiddleware";
import rootReducer from "redux/slices";

export const store = configureStore({
	reducer: {
		...rootReducer,

		//This reducerPath is the key that the API reducer will be mounted to in the Redux store
		[apiSlice.reducerPath]: apiSlice.reducer,
	},
	// Adding the api middleware enables caching, invalidation, polling,
	// and other useful features of `rtk-query`.

	//This middleware is a function that takes a getDefaultMiddleware function as an argument and returns an array of middleware that includes the default middleware and the middleware for the API
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(apiSlice.middleware).concat(updateCartMiddleware),
});

//This function will set up the listeners for the API endpoints that we define in the API slice
setupListeners(store.dispatch);

