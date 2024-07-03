import {USERS_URL} from "utils/constants";
import apiSlice from ".";

const usersApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getUsers: builder.query({
			query: ({token, page}) => ({
				url: `${USERS_URL}/admin?page=${page}`,
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}),
			keepUnusedDataFor: 5,
			providesTags: ["UsersAdmin"],
		}),
		getUserById: builder.query({
			query: ({token, userId}) => {
				return {
					url: `${USERS_URL}/admin/${userId}`,
					headers: {
						Authorization: `Bearer ${token}`,
					},
				};
			},
			keepUnusedDataFor: 5,
			providesTags: (result, error, {userId}) => [
				{type: "UserAdmin", id: userId},
			],
		}),
		createUser: builder.mutation({
			query: ({token, newUser}) => {
				return {
					url: `${USERS_URL}/admin`,
					method: "POST",
					body: newUser,
					headers: {
						Authorization: `Bearer ${token}`,
						//No es necesario poner esto, basta que mandes un formData de tu formulario, este header se creara automaticamente
						// 'Content-Type': `multipart/form-data`,
					},
				};
			},
			//El invalidatesTags también significa que a parte de cancelar la querys y que obtenga desde cero sus peticiones, también hara que lo querys con dicho tag realizan una petición despues de esta mutación, o sea que en este caso despues de crear le product me hara una petición para obtener todos los productos inmediatamente
			invalidatesTags: ["UsersAdmin"],
		}),
		editUser: builder.mutation({
			query: ({token, userId, newUser}) => {
				return {
					url: `${USERS_URL}/admin/${userId}`,
					method: "PUT",
					body: newUser,
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				};
			},
			invalidatesTags: (result, error, {userId}) => [
				"UsersAdmin",
				{type: "UserAdmin", id: userId},
			],
		}),
		editImageUser: builder.mutation({
			query: ({token, userId, newUser}) => {
				return {
					url: `${USERS_URL}/admin/${userId}/change-image`,
					method: "PUT",
					body: newUser,
					headers: {
						Authorization: `Bearer ${token}`,
					},
				};
			},
			invalidatesTags: (result, error, {userId}) => [
				"UsersAdmin",
				{type: "UserAdmin", id: userId},
			],
		}),
		deleteUser: builder.mutation({
			query: ({token, userId}) => {
				return {
					url: `${USERS_URL}/admin/${userId}`,
					method: "DELETE",
					headers: {
						Authorization: `Bearer ${token}`,
					},
				};
			},
			invalidatesTags: (result, error) => ["UsersAdmin"],
		}),
	}),
});

export const {
	useGetUsersQuery,
	useGetUserByIdQuery,
	useCreateUserMutation,
	useEditUserMutation,
	useEditImageUserMutation,
	useDeleteUserMutation,
} = usersApiSlice;
export default usersApiSlice;
