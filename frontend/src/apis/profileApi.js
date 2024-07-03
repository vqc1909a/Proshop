import {PROFILE_URL} from "utils/constants";
import apiSlice from ".";

const profileApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		//Esto debería ser un query pero la consulta de getProfile lo usamos de forma condicional cuando el usuario este logueado y no lo traemos así por traer como hacemos con los products
		getProfile: builder.mutation({
			query: (token) => ({
				url: `${PROFILE_URL}`,
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			}),
		}),
		updateProfile: builder.mutation({
			query: ({token, profile}) => ({
				url: `${PROFILE_URL}`,
				method: "PUT",
				body: profile,
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			}),
		}),
		updatePassword: builder.mutation({
			query: ({token, passwords}) => ({
				url: `${PROFILE_URL}/change-password`,
				method: "PATCH",
				body: passwords,
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			}),
		}),
		addShippingAddress: builder.mutation({
			query: ({token, shippingAddress}) => ({
				url: `${PROFILE_URL}/add-shipping-address`,
				method: "POST",
				body: shippingAddress,
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			}),
		}),
		changeSelectedShippingAddress: builder.mutation({
			query: ({token, idSelectedShippingAddress}) => ({
				url: `${PROFILE_URL}/change-selected-shipping-address`,
				method: "POST",
				body: {idSelectedShippingAddress},
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			}),
		}),
	}),
});

export const {
	useGetProfileMutation,
	useUpdateProfileMutation,
	useUpdatePasswordMutation,
	useAddShippingAddressMutation,
	useChangeSelectedShippingAddressMutation,
} = profileApiSlice;
export default profileApiSlice;
