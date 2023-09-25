import { PRODUCTS_URL } from "utils/constants"
import apiSlice  from "./apiSlice";


//Para usar el builder del apiSlice, una función para inyectar los puntos finales en la API original, pero también para devolverle esa misma API con los tipos correctos para estos puntos finales. 

// Utiliza builder.query cuando necesites realizar operaciones de lectura o consulta en la API, como obtener datos usando peticiones GET. Por ejemplo, obtener una lista de productos, obtener detalles de un artículo, etc.

// Utiliza builder.mutation cuando necesites realizar operaciones de escritura o mutación en la API, como agregar, actualizar o eliminar datos utilizando peticiones POST, PUT, PATCH o DELETE. Por ejemplo, agregar un nuevo producto, actualizar la información de un usuario, eliminar un registro, etc.

//El tema de los invalidatesTags, el servicio va a cancelar los servicios que se encuentran en dichos tags si o si o se lo eliminara de cache y si ese sservicio que invalido los tags se encuentran en la misma ruta o pagina como por ejemplo /admin, osea donde estan otros servicios que se encuentran vinculados a dichos tags que cancelo el servicio, entonces estos servicios se volveran a hacer un request ahi mismo pero para los otros servicios que se encuentran en otras paginas, lo cancelara su cache y cuando vayamos a dichas paginas me volvera hacer el request
const productsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProducts: builder.query({
            // No tenemos que hacer una solicitud de recuperación o una solicitud de Axios para hacer esto. Lo hacemos todo a través del kit de herramientas Redux, que en mi opinión es realmente genial.
            query: (page) => ({
                url: `${PRODUCTS_URL}?page=${page}`
            }),
            // Este es el tiempo durante el cual RTK Query mantendrá sus datos en caché después de que el último componente se dé de baja. Por ejemplo, si consulta un punto final, luego desmonta el componente y luego monta otro componente que realiza la misma solicitud dentro del marco de tiempo dado, el valor más reciente se entregará desde la memoria caché.

            //No cuenta recargas de pagina, tampoco cuenta para mutations, solo cuenta para querys pero puede cancelar los tipados desde las mutaciones o querys. Tienes sentido todo eso, las mutaciones siempre haran request del servidor pero ahi tu puedes decir a que query con tal tag va tener que obtener sus valores desde cero del servidor y ya no almacenarlo en cache

            // En RTK Query, si no especificas el valor de keepUnusedDataFor en una consulta, el valor por defecto es 60 segundos. Esto significa que los datos en caché que no han sido utilizados durante al menos 60 segundos serán automáticamente eliminados de la caché.
            keepUnusedDataFor: 5,
            providesTags: ['Products']
        }),
        getProductBySlug: builder.query({
            query: (slug) => ({
                url: `${PRODUCTS_URL}/${slug}`
            }),
            keepUnusedDataFor: 5,
            //Aqui definimos el tag con el type Product pero con el slug del producto, y si en alugna mutacion quieres cancelar el tag, el objeto dentro de invalidatesTags tiene que ser este mismo objeto { type: 'Post', slug }
            providesTags: (result, error, slug) => [{ type: 'Product', slug }],
        }),
        getProductBySearch: builder.query({
            query: ({keyword, page}) => ({
                url: `${PRODUCTS_URL}/search/${keyword}?page=${page}`
            }),
            keepUnusedDataFor: 5,
            //Aqui definimos el tag con el type Product pero con el slug del producto, y si en alugna mutacion quieres cancelar el tag, el objeto dentro de invalidatesTags tiene que ser este mismo objeto { type: 'Post', slug }
            providesTags: ['Products'],
        }),
        getTopProducts: builder.query({
            query: () => ({
                url: `${PRODUCTS_URL}/top`
            }),
            keepUnusedDataFor: 5,
            providesTags: ['Products']
        }),
        getMyProducts: builder.query({
            query: ({token, page}) => {
                return {
                    url: `${PRODUCTS_URL}/admin?page=${page}`,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            },
            // Este es el tiempo durante el cual RTK Query mantendrá sus datos en caché después de que el último componente se dé de baja. Por ejemplo, si consulta un punto final, luego desmonta el componente y luego monta otro componente que realiza la misma solicitud dentro del marco de tiempo dado, el valor más reciente se entregará desde la memoria caché.

            //No cuenta recargas de pagina, tampoco cuenta para mutations, solo cuenta para querys pero puede cancelar los tipados desde las mutaciones o querys. Tienes sentido todo eso, las mutaciones siempre haran request del servidor pero ahi tu puedes decir a que query con tal tag va tener que obtener sus valores desde cero del servidor y ya no almacenarlo en cache

            // En RTK Query, si no especificas el valor de keepUnusedDataFor en una consulta, el valor por defecto es 60 segundos. Esto significa que los datos en caché que no han sido utilizados durante al menos 60 segundos serán automáticamente eliminados de la caché.
            keepUnusedDataFor: 5,
            providesTags: ['ProductsAdmin']
        }),
        getProductById: builder.query({
            query: ({token, idProduct}) => {
                return {
                    url: `${PRODUCTS_URL}/admin/${idProduct}`,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            },
            keepUnusedDataFor: 5,
            //Aqui definimos el tag con el type Product pero con el slug del producto, y si en alugna mutacion quieres cancelar el tag, el objeto dentro de invalidatesTags tiene que ser este mismo objeto { type: 'Post', slug }, el tag de abajo implicitamente tiene 2 tags que sería ["Product"] y a la vez [{ type: 'Product', id }]
            providesTags: (result, error, { idProduct }) => [{ type: 'ProductAdmin', id: idProduct }],
        }),
        createProduct: builder.mutation({
            query: ({token, newProduct}) => {
                return {
                    url: `${PRODUCTS_URL}/admin`,
                    method: "POST",
                    body: newProduct,
                    headers: {
                        Authorization: `Bearer ${token}`,
                        //No es necesario poner esto, basta que mandes un formData de tu formulario, este header se creara automaticamente
                        // 'Content-Type': `multipart/form-data`,
                    }
                }
            },
            //El invalidatesTags también significa que a parte de cancelar la querys y que obtenga desde cero sus peticiones, también hara que lo querys con dicho tag realizan una petición despues de esta mutación, o sea que en este caso despues de crear le product me hara una petición para obtener todos los productos inmediatamente 
            invalidatesTags: ["Products", 'ProductsAdmin']
        }),
        editProduct: builder.mutation({
            query: ({token, idProduct, newProduct}) => {
                return {
                    url: `${PRODUCTS_URL}/admin/${idProduct}`,
                    method: "PUT",
                    body: newProduct,
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    }
                }
            },
            invalidatesTags: (result, error, {idProduct}) => ["Products", "ProductsAdmin", { type: 'ProductAdmin', id: idProduct }],
        }),
        editImageProduct: builder.mutation({
            query: ({token, idProduct, newProduct}) => {
                return {
                    url: `${PRODUCTS_URL}/admin/${idProduct}/change-image`,
                    method: "PUT",
                    body: newProduct,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            },
            invalidatesTags: (result, error, { idProduct }) => ["Products", 'ProductsAdmin', { type: 'ProductAdmin', id: idProduct }]
        }),
        deleteProduct: builder.mutation({
            query: ({token, idProduct}) => {
                return {
                    url: `${PRODUCTS_URL}/admin/${idProduct}`,
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            },
            invalidatesTags: (result, error) => ["Products", "ProductsAdmin"]
        }),
        getReviews: builder.query({
            query: ({idProduct}) => {
                return {
                    url: `${PRODUCTS_URL}/${idProduct}/reviews`,
                }
            },
            keepUnusedDataFor: 5,
            //Aqui definimos el tag con el type Product pero con el slug del producto, y si en alugna mutacion quieres cancelar el tag, el objeto dentro de invalidatesTags tiene que ser este mismo objeto { type: 'Post', slug }, el tag de abajo implicitamente tiene 2 tags que sería ["Product"] y a la vez [{ type: 'Product', id }]
            providesTags: (result, error, { idProduct }) => [{ type: 'Reviews', id: idProduct }],
        }),
        createReview: builder.mutation({
            query: ({token, idProduct, newReview}) => {
                return {
                    url: `${PRODUCTS_URL}/${idProduct}/reviews`,
                    method: "POST",
                    body: newReview,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            },
            invalidatesTags: (result, error, { idProduct }) => [{ type: 'Reviews', id: idProduct }],
        }),
    })
})

export const { useGetProductsQuery, useGetProductBySlugQuery, useGetProductByIdQuery,useCreateProductMutation, useEditProductMutation, useEditImageProductMutation, useDeleteProductMutation, useGetMyProductsQuery, useCreateReviewMutation, useGetReviewsQuery, useGetProductBySearchQuery, useGetTopProductsQuery} = productsApiSlice;
export default productsApiSlice;
