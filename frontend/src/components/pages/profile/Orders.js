import { useGetMyOrdersQuery } from "redux/slices/orderApiSlice"
import Message from "components/Message";
import Loader from "components/Loader";
import { Row, Table } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import * as ERROR_ACTIONS from "redux/slices/errorSlice";
import * as AUTH_ACTIONS from "redux/slices/authSlice";
import Paginate from "components/Paginate";

function Orders() {
  const location = useLocation();
  const useQuery = () => new URLSearchParams(location.search);

  let query = useQuery();  
  let page = Number(query.get('page')) || 1;

  const dispatch = useDispatch();
  const token = JSON.parse(localStorage.getItem("token"));
  const { isError, data, isLoading, error } = useGetMyOrdersQuery({token, page});
  let orders = data?.body?.orders || []
  let totalPages = data?.body?.totalPages || 0;
  let pageNow = data?.body?.page || 1;
   
  //Solo para peticiones get que necesiten de un token para autenticación
  if(error?.status === 401 || error?.status === 403){
    dispatch(ERROR_ACTIONS.saveMessage(error?.data?.message || error?.error))
    dispatch(AUTH_ACTIONS.logout());
  }
  
  return (
    <div>
        <h2>My Orders</h2>
        <Row>
            {
                isLoading
                ?
                <Loader></Loader>
                :
                isError
                ?
                <Message variant="danger">{error?.data?.message || error?.error}</Message>
                :
                orders.length
                ?
                (
                    <Table striped hover responsive className="table-sm">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>DATE</th>
                                <th>TOTAL</th>
                                <th>PAID</th>
                                <th>DELIVERED</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order.id}>
                                    <td><Link to={`/orders/${order.id}`}>{order.id}</Link></td>
                                    {/* Cuando ha sido creado el order, no me interesea cuando ha sido actualizado */}
                                    <td>{order.createdAt.substring(0, 10)}</td>
                                    <td>${order.totalPrice}</td>
                                    <td>
                                        {order.isPaid 
                                            ? 
                                            order.paidAt.substring(0, 10)
                                            : 
                                            <span style={{display: "flex", justifyContent: "center", alignItems: "center"}}><i className="fas fa-times" style={{color: "red"}}></i></span>
                                        }
                                    </td>
                                    <td>
                                        {order.isDelivered 
                                            ? 
                                            order.deliveredAt.substring(0, 10)
                                            : 
                                            <span style={{display: "flex", justifyContent: "center", alignItems: "center"}}><i className="fas fa-times" style={{color: "red"}}></i></span>
                                        }
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )
                :
                <h3>Not Orders</h3>
            } 
        </Row>
        {
            orders.length > 0 && (
                <Paginate page={pageNow} totalPages={totalPages} pathname="/account/profile" ></Paginate>
            )
        }               
    </div>
  )
}

export default Orders