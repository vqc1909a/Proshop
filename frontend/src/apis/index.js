import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";
import * as CONSTANTS from "utils/constants"


const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({baseUrl: CONSTANTS.BASE_URL}),
    // tag types are used to define the types of data that will be fetching from our API.
    // tagTypes: ['Product', 'Order', 'User'],
    endpoints: (builder) => ({})
})
export default apiSlice;


