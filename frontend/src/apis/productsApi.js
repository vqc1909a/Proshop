import {PRODUCTS_URL} from "utils/constants";
import apiSlice from ".";

//Builder del apiSlice: una función para inyectar los puntos finales en la API original, pero también para devolverle esa misma API con los tipos correctos para estos puntos finales.

// Utiliza builder.query cuando necesites realizar operaciones de lectura o consulta en la API, como obtener datos usando peticiones GET. Por ejemplo, obtener una lista de productos, obtener detalles de un artículo, etc.

// Utiliza builder.mutation cuando necesites realizar operaciones de escritura o mutación en la API, como agregar, actualizar o eliminar datos utilizando peticiones POST, PUT, PATCH o DELETE. Por ejemplo, agregar un nuevo producto, actualizar la información de un usuario, eliminar un registro, etc.

//El tema de los invalidatesTags, el servicio va a cancelar los servicios que se encuentran en dichos tags si o si o se lo eliminara de cache y si ese sservicio que invalido los tags se encuentran en la misma ruta o pagina como por ejemplo /admin, osea donde estan otros servicios que se encuentran vinculados a dichos tags que cancelo el servicio, entonces estos servicios se volveran a hacer un request ahi mismo pero para los otros servicios que se encuentran en otras paginas, lo cancelara su cache y cuando vayamos a dichas paginas me volvera hacer el request
const productsApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getProducts: builder.query({
			// No tenemos que hacer una solicitud de recuperación o una solicitud de Axios para hacer esto. Lo hacemos todo a través del kit de herramientas Redux, que en mi opinión es realmente genial.
			query: (page) => ({
				url: `${PRODUCTS_URL}?page=${page}`,
			}),
			// Este es el tiempo durante el cual RTK Query mantendrá sus datos en caché después de que el último componente se dé de baja o sea se desmonte. Por ejemplo, si consulta un punto final, luego desmonta el componente y luego monta otro componente que realiza la misma solicitud dentro del marco de tiempo dado, el valor más reciente se entregará desde la memoria caché.

			//No cuenta recargas de pagina, tampoco cuenta para mutations, solo cuenta para querys que puedes cancelar los tipados desde otras mutaciones o querys. Tienes sentido todo eso, las mutaciones siempre haran request del servidor pero ahi tu puedes decir a que query con tal tag va tener que obtener sus valores desde cero del servidor y ya no almacenarlo en cache

			// En RTK Query, si no especificas el valor de keepUnusedDataFor en una consulta, el valor por defecto es 60 segundos. Esto significa que los datos en caché que no han sido utilizados durante al menos 60 segundos serán automáticamente eliminados de la caché.
			keepUnusedDataFor: 60,
			//providesTags:
			// Purpose: It is used to label data returned by a query or mutation with one or more tags. These tags are then used to track and select which cached data may be affected by other operations.

			// Usage: You use providesTags in a query or mutation to define which tags are provided (or produced) by that endpoint. When the data is fetched and cached, these tags are associated with the cached data.

			// Effect: If a mutation invalidates a tag that matches a tag provided by a query, the cached data for that query will be considered stale and refetched on the next component re-render that uses that query.
			providesTags: ["Products"],
		}),
		getProductBySearch: builder.query({
			query: ({keyword, page}) => ({
				url: `${PRODUCTS_URL}/search/${keyword}?page=${page}`,
			}),
			keepUnusedDataFor: 60,
			//Aqui definimos el tag Products, y para cualquier busqueda va a cachear la respuesta de este endpoint a diferencia de lo de arriba que cachea solamente el endpoint para el producto especifico con su slug
			providesTags: ["Products"],
		}),
		getTopProducts: builder.query({
			query: () => ({
				url: `${PRODUCTS_URL}/top`,
			}),
			keepUnusedDataFor: 60,
			providesTags: ["Products"],
		}),
		getProductBySlug: builder.query({
			query: (slug) => ({
				url: `${PRODUCTS_URL}/${slug}`,
			}),
			keepUnusedDataFor: 60,
			//Aqui definimos el tag con el type Product pero con el slug del producto, y si en alugna mutacion quieres cancelar el cache de este endpoint, el objeto dentro de invalidatesTags tiene que ser este mismo objeto { type: 'Post', slug }
			providesTags: (result, error, slug) => [{type: "Product", slug}],
		}),
		// ADMIN
		getProductsAdmin: builder.query({
			query: ({token, page}) => {
				return {
					url: `${PRODUCTS_URL}/admin?page=${page}`,
					headers: {
						Authorization: `Bearer ${token}`,
					},
				};
			},
			keepUnusedDataFor: 60,
			providesTags: ["ProductsAdmin"],
		}),
		getProductById: builder.query({
			query: ({token, productId}) => {
				return {
					url: `${PRODUCTS_URL}/admin/${productId}`,
					headers: {
						Authorization: `Bearer ${token}`,
					},
				};
			},
			keepUnusedDataFor: 60,
			//Aqui definimos el tag con el type Product pero con el slug del producto, y si en alugna mutacion quieres cancelar el tag, el objeto dentro de invalidatesTags tiene que ser este mismo objeto { type: 'Post', slug }, el tag de abajo implicitamente tiene 2 tags que sería ["Product"] y a la vez [{ type: 'Product', id }]
			providesTags: (result, error, {productId}) => [
				{type: "ProductAdmin", id: productId},
			],
		}),
		createProduct: builder.mutation({
			query: ({token, newProduct}) => {
				return {
					url: `${PRODUCTS_URL}/admin`,
					method: "POST",
					body: newProduct,
					headers: {
						Authorization: `Bearer ${token}`,
						//No es necesario poner esto, basta que mandes un formData de tu formulario, este header se creara automaticamente para formData por la imagen
						// 'Content-Type': `multipart/form-data`,
					},
				};
			},
			// invalidateTags:
			// Purpose: It is used to specify which tags should be invalidated when a mutation is performed. Invalidating a tag means marking any cached data associated with that tag as stale.
			// Usage: You use invalidateTags in a mutation to specify which tags should be invalidated when the mutation is successfully executed. This typically includes tags that are related to the data being modified, added, or deleted by the mutation.
			// Effect: When a mutation invalidates a tag, any query that provides that tag will have its data refetched (if it's being used in a component) because the cached data is now considered stale.
			invalidatesTags: ["Products", "ProductsAdmin"],
		}),
		editProduct: builder.mutation({
			query: ({token, productId, newProduct}) => {
				return {
					url: `${PRODUCTS_URL}/admin/${productId}`,
					method: "PUT",
					body: newProduct,
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
					},
				};
			},
			invalidatesTags: (result, error, {productId}) => [
				"Products",
				"ProductsAdmin",
				{type: "ProductAdmin", id: productId},
			],
		}),
		editImageProduct: builder.mutation({
			query: ({token, productId, newProduct}) => {
				return {
					url: `${PRODUCTS_URL}/admin/${productId}/change-image`,
					method: "PUT",
					body: newProduct,
					headers: {
						Authorization: `Bearer ${token}`,
						//No es necesario poner esto, basta que mandes un formData de tu formulario, este header se creara automaticamente para formData por la imagen
						// 'Content-Type': `multipart/form-data`,
					},
				};
			},
			invalidatesTags: (result, error, {productId}) => [
				"Products",
				"ProductsAdmin",
				{type: "ProductAdmin", id: productId},
			],
		}),
		deleteProduct: builder.mutation({
			query: ({token, productId}) => {
				return {
					url: `${PRODUCTS_URL}/admin/${productId}`,
					method: "DELETE",
					headers: {
						Authorization: `Bearer ${token}`,
					},
				};
			},
			invalidatesTags: (result, error) => ["Products", "ProductsAdmin"],
		}),
		getReviewsByProduct: builder.query({
			query: ({productId}) => {
				return {
					url: `${PRODUCTS_URL}/${productId}/reviews`,
				};
			},
			keepUnusedDataFor: 60,
			//Aqui definimos el tag con el type Product pero con el slug del producto, y si en alugna mutacion quieres cancelar el tag, el objeto dentro de invalidatesTags tiene que ser este mismo objeto { type: 'Post', slug }, el tag de abajo implicitamente tiene 2 tags que sería ["Product"] y a la vez [{ type: 'Product', id }]
			providesTags: (result, error, {productId}) => [
				{type: "Reviews", id: productId},
			],
		}),
		createReview: builder.mutation({
			query: ({token, productId, newReview}) => {
				return {
					url: `${PRODUCTS_URL}/${productId}/reviews`,
					method: "POST",
					body: newReview,
					headers: {
						Authorization: `Bearer ${token}`,
					},
				};
			},
			invalidatesTags: (result, error, {productId}) => [
				{type: "Reviews", id: productId},
				{type: "ProductAdmin", id: productId},
			],
		}),
	}),
});

// QUESTION: Invalidating a tag through a mutation that is used in another mutation as a providesTags has the following effects:

// Trigger Data Refetching: If there's a query or another mutation that provides the same tag which you've invalidated, it will trigger a refetching of the data for those queries or mutations. This ensures that the data remains fresh and consistent across different parts of your application.

// Stale Data Marking: The cached data associated with the invalidated tag is marked as stale. This means that the next time a component or hook tries to access data associated with this tag, it will be forced to fetch fresh data instead of relying on the potentially outdated cached data.

// Consistency Maintenance: This mechanism helps in maintaining consistency across your application. For example, if you have a mutation that updates a product and another query that fetches product details, invalidating the product tag in the update mutation ensures that the query fetching product details will get the latest data.

// No Direct Impact on Other Mutations: If another mutation provides the same tag, invalidating the tag does not directly affect the execution or behavior of that mutation. Instead, it affects how the data provided by that mutation is cached and when it is considered stale.

// In summary, invalidating a tag through a mutation ensures that any data associated with that tag across your application is kept up to date by marking cached data as stale and triggering refetching where necessary. This is crucial for maintaining data consistency and ensuring that your application reacts correctly to changes in data.

export const {
	useGetProductsQuery,
	useGetProductBySlugQuery,
	useGetProductByIdQuery,
	useCreateProductMutation,
	useEditProductMutation,
	useEditImageProductMutation,
	useDeleteProductMutation,
	useGetProductsAdminQuery,
	useCreateReviewMutation,
	useGetReviewsByProductQuery,
	useGetProductBySearchQuery,
	useGetTopProductsQuery,
} = productsApiSlice;
export default productsApiSlice;
