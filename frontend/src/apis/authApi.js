import {AUTH_URL} from "utils/constants";
import apiSlice from ".";

// En RTK Query, las mutaciones por defecto no tienen tiempo de caché. Esto significa que cuando ejecutas una mutación, los datos no se almacenan en caché y, por lo tanto, no estarán disponibles para futuras consultas.
const authApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		login: builder.mutation({
			// No tenemos que hacer una solicitud de recuperación o una solicitud de Axios para hacer esto. Lo hacemos todo a través del kit de herramientas Redux, que en mi opinión es realmente genial.
			query: (data) => ({
				url: `${AUTH_URL}/login`,
				method: "POST",
				body: data,
			}),
			//INVALIDAR EL CACHE PARA ESTE TIPO DE CONSULTA => "posts", O SEA QUE DEBERA DE RETORNAR NUEVOS VALORES DEL CACHE PARA POSTS Y NO CUMPLIR EL TIEMPO ESTABLECIDO
			//  invalidatesTags: ['Posts']
		}),
		register: builder.mutation({
			query: (data) => ({
				url: `${AUTH_URL}/register`,
				method: "POST",
				body: data,
			}),
		}),
	}),
});

export const {useLoginMutation, useRegisterMutation} = authApiSlice;
export default authApiSlice;
