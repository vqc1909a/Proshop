import { ORDERS_URL, PAYPAL_URL } from "utils/constants"
import apiSlice  from "./apiSlice";

// En RTK Query, las mutaciones por defecto no tienen tiempo de caché. Esto significa que cuando ejecutas una mutación, los datos no se almacenan en caché y, por lo tanto, no estarán disponibles para futuras consultas, hacen una consulta del servidor cada vez que lo llamamos.
const orderApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        //Consulta de administrador
        getAllOrders: builder.query({
            query: ({token, page}) => ({
                url: `${ORDERS_URL}/admin?page=${page}`,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            }),
            keepUnusedDataFor: 0,
            providesTags: ['OrdersAdmin']  
        }),
        getMyOrders: builder.query({
            query: ({token, page}) => ({
                url: `${ORDERS_URL}?page=${page}`,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            }),
            keepUnusedDataFor: 5,
            providesTags: ['Orders'] 
        }),
        getOrderById: builder.query({
            query: ({token, orderId}) => ({
                url: `${ORDERS_URL}/${orderId}`,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            }),
            keepUnusedDataFor: 5,
            //Aqui definimos el tag con el type Order pero con el id del order, y si en alguna mutacion quieres cancelar el tag, el objeto dentro de invalidatesTags tiene que ser este mismo objeto { type: 'Order', orderId }
            providesTags: (result, error, {orderId}) => [{ type: 'Order', orderId }],
        }),
        getPayPalClientId: builder.query({
            query: () => ({
                url: PAYPAL_URL,
            }),
            keepUnusedDataFor: 5
        }),
        saveOrder: builder.mutation({
            query: ({token, order}) => ({
                url: ORDERS_URL,
                method: 'POST',
                body: {...order},
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            }),
            invalidatesTags: ['Orders']
        }),
        //Accion de administrador
        deliverOrder: builder.mutation({
            query: ({token, orderId}) => ({
                url: `${ORDERS_URL}/${orderId}/deliver`,
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            }),
            invalidatesTags: (result, error, {orderId}) => ['OrdersAdmin', { type: 'Order', orderId }]
        }),
        payOrder: builder.mutation({
            query: ({token, orderId, orderDetails}) => ({
                url: `${ORDERS_URL}/${orderId}/pay`,
                method: 'PUT',
                body: {...orderDetails},
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            }),
            invalidatesTags: (result, error, {orderId}) => ['Orders', { type: 'Order', orderId }]
        })
    })
})

export const { useSaveOrderMutation, useGetOrderByIdQuery, useGetPayPalClientIdQuery, usePayOrderMutation, useGetMyOrdersQuery, useGetAllOrdersQuery, useDeliverOrderMutation } = orderApiSlice;
export default orderApiSlice;
