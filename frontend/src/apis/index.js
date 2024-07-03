import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";
import * as CONSTANTS from "utils/constants"


const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({baseUrl: CONSTANTS.BASE_URL}),
    // tag types are used to define the types of data that will be fetching from our API.
    // tagTypes: ['Product', 'Order', 'User'],
    // Entonces, esto es lo que es realmente bueno: no tenemos que buscar manualmente nuestros datos como si no tuviéramos que hacer nuestro. intente capturar con la API de recuperación dentro de él y maneje nuestro, ya sabe, manejo de errores y todo eso. Podemos hacerlo todo a través de este constructor.
    endpoints: (builder) => ({})
})
export default apiSlice;
