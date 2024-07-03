import { configureStore} from "@reduxjs/toolkit";
import { setupListeners } from '@reduxjs/toolkit/query'
import apiSlice from "apis";
import rootReducer from "redux/slices";

const store = configureStore({
	reducer: {
		...rootReducer,

		//This reducerPath is the key that the API reducer will be mounted to in the Redux store
		[apiSlice.reducerPath]: apiSlice.reducer,
	},
	// Adding the api middleware enables caching, invalidation, polling,
	// and other useful features of `rtk-query`.
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(apiSlice.middleware),
});
setupListeners(store.dispatch);


export default store;