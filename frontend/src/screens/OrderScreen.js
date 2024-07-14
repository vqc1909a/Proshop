import {useEffect} from "react";
import {
	useGetOrderByIdQuery,
	usePayOrderMutation,
	useGetPayPalClientIdQuery,
	useDeliverOrderMutation,
} from "apis/orderApi";
import {Button, Card, Col, Image, ListGroup, Row} from "react-bootstrap";
import {PayPalButtons, usePayPalScriptReducer} from "@paypal/react-paypal-js";
import {Link, useParams} from "react-router-dom";
import {useSelector, useDispatch} from "react-redux";
import Loader from "components/Loader";
import Message from "components/Message";

//Selectors
import * as AUTH_SELECTORS from "redux/selectors/authSelector";

//Actions
import * as ERROR_ACTIONS from "redux/slices/errorSlice";
import * as AUTH_ACTIONS from "redux/slices/authSlice";
import Meta from "components/Meta";

function OrderScreen() {
	const dispatch = useDispatch();
	const token = localStorage.getItem("token")
		? JSON.parse(localStorage.getItem("token"))
		: "";
	const {id: orderId} = useParams();

	const isAdmin = useSelector(AUTH_SELECTORS.selectIsAdmin);
	//Querys
	//El refetch hara que el data se actualice automaticamente luego de hacer la mutación en otros hooks, solo el valor de data , este refetch lo podemos omitir gracias a los tags definidaos en los apiSlice, basicamente el reftch hace otra petición para en este caso obtener el order
	const {
		isError: isErrorGetOrder,
		isLoading: isLoadingGetOrder,
		data: dataGetOrder,
		error: errorGetOrder /* refetch */,
	} = useGetOrderByIdQuery({token, orderId});
	const order = dataGetOrder?.body || {};

	//Solo para peticiones get que necesiten de un token para autenticación
	if (errorGetOrder?.status === 401 || errorGetOrder?.status === 403) {
		dispatch(
			ERROR_ACTIONS.saveMessage(
				errorGetOrder?.data?.message || errorGetOrder?.error
			)
		);
		dispatch(AUTH_ACTIONS.logout());
	}

	const {
		data: payPalClientId,
		isError: isErrorClientId,
		error: errorClientId,
	} = useGetPayPalClientIdQuery();
	const clientId = payPalClientId?.clientId;
	const [
		deliverOrder,
		{
			isError: isErrorDeliver,
			isSuccess: isSuccessDeliver,
			isLoading: isLoadingDeliver,
			data: dataDeliver,
			error: errorDeliver,
		},
	] = useDeliverOrderMutation();

	//Mutations
	const [
		payOrder,
		{
			isLoading: isLoadingPayOrder,
			isError: isErrorPayOrder,
			isSuccess: isSuccessPayOrder,
			data: dataPayed,
			error: errorPayOrder,
		},
	] = usePayOrderMutation();

	//El dispatch me sirve para cargar el SDK de Paypal y meter las propiedades que queramos, cuando ejecutamos el dispatch en sus diferentes acciones me va a cambiar los estados de options
	const [{isPending /* isInitial, isRejected, isResolved */}, paypalDispatch] =
		usePayPalScriptReducer();

	//Ocurre cuando le das click al boton de pagar con PayPal y ahi mismo te ejeucta lo del then si esta todo bien o del catch si es que ocurrio algun error, depende también del método que has usado
	function createOrder(data, actions) {
		// const itemsPaypal = order.items.map(({productId, qty}) => ({
		//     name: productId.name,
		//     quantity: qty,
		//     description: productId.description,
		//     sku: productId.id,
		//     unit_amount: {
		//         value: productId.price
		//     },
		//     tax: {
		//         value: parseFloat(productId.priceIVA - productId.price).toFixed(2)
		//     }
		// }))
		// Este objeto tiene un montón de métodos que tienen que ver con nuestro pedido.
		return actions.order
			.create({
				purchase_units: [
					// Amount será el objeto que contenga el valor a pagar, aqui podemos pasara mas valores para la creación dle order, pero la mayoría de los otros valores viene de la configuración de tu cuenta de paypal con la que estas pagando o del formulario de tu tarjeta de debito o credito, al final lo que importa es que el order se haya procesado y te haya devuelto el id del order
					{
						// items: itemsPaypal,
						amount: {
							value: order.totalPrice,
							// breakdown: {
							//     item_total: {
							//         value: order.itemsPrice,
							//     },
							//     shipping: {
							//         value: order.shippingPrice
							//     },
							//     tax_total: {
							//         value: order.taxPrice,
							//     }
							//     // shipping_discount: {
							//     //     value: order.shipping_discount
							//     // },
							//     // discount: {
							//     //     value: order.discount
							//     // }
							// }
						},
						// shipping: {
						//     //Por ahora es solo envio, pero peudes hacerlo dinamico y aumentarlo esta opcion en tu order y pasarlo aqui tambien para reflejarlo en la factura de paypal
						//     type: 'SHIPPING',
						//     name: {
						//         full_name: order.userId.name,
						//         given_name: order.userId.name,
						//         surname: order.userId.name
						//     },
						//     address: {
						//         address_line_1: order.shippingAddress.address,
						//         // address_line_2: order.shippingAddress.address,
						//         admin_area_1: order.shippingAddress.country,
						//         admin_area_2: order.shippingAddress.city,
						//         postal_code: order.shippingAddress.postalCode
						//         // country_code: "PE"
						//     }
						// }
					},
				],
			})
			.then((orderId) => {
				//Este es el id del orden creado a partir del darle a pagar con Paypal ya sea con tu cuenta de Paypal o con la Tarjeta de débito o crédito, me sirve para generar facturas
				console.log({
					orderId: orderId,
				});
				return orderId;
			})
			.catch((err) => {
				console.log({
					createOrder: err,
				});
				dispatch(ERROR_ACTIONS.saveMessage(err.message));
			});
	}

	//Cuando todo salio bien en el flujo de hacer el pago con paypal o sea el boton final de pagar de la UI de paypal
	function onApprove(data, actions) {
		return (
			actions.order
				.capture()
				//DETAILS VIENEEN DE PAYPAL CUANDO EL ORDER HA SIDO CREADO, BASCIAMENTE LOS DATOS DE AQUI SON LOS QUE TENGAS CONFIGURADO EN TU CUENTA DE PAYPAL, INCLUYE TARJETA CON LA QUE PAGASTE DENTRO DE PAYPAL, SHIPPING PRINCIPAL, PRECIO TOTAL, ETC
				.then(async (orderDetails) => {
					console.log({
						orderDetails,
					});
					//Ya sea que hayas pagado con tu cuenta de paypal o con una tarjeta de debiot o credito, este objeto te creara con los datos brindados ya sea de la primera o segunda forma

					// {
					//     "id": "5E116064HJ739660U",
					//     "intent": "CAPTURE",
					//     "status": "COMPLETED",
					//     "purchase_units": [
					//         {
					//             "reference_id": "default",
					//             "amount": {
					//                 "currency_code": "USD",
					//                 "value": "571.99"
					//             },
					//             "shipping": {
					//                 "name": {
					//                     "full_name": "John Doe"
					//                 },
					//                 "address": {
					//                     "address_line_1": "Free Trade Zone",
					//                     "admin_area_2": "Lima",
					//                     "admin_area_1": "Lima",
					//                     "postal_code": "07001",
					//                     "country_code": "PE"
					//                 }
					//             },
					//             "payments": {
					//                 "captures": [
					//                     {
					//                         "id": "4WL32502J72816338",
					//                         "status": "PENDING",
					//                         "status_details": {
					//                             "reason": "UNILATERAL"
					//                         },
					//                         "amount": {
					//                             "currency_code": "USD",
					//                             "value": "571.99"
					//                         },
					//                         "final_capture": true,
					//                         "seller_protection": {
					//                             "status": "NOT_ELIGIBLE"
					//                         },
					//                         "create_time": "2023-08-26T06:29:52Z",
					//                         "update_time": "2023-08-26T06:29:52Z"
					//                     }
					//                 ]
					//             }
					//         }
					//     ],
					//     "payer": {
					//         "name": {
					//             "given_name": "John",
					//             "surname": "Doe"
					//         },
					//         "email_address": "sb-k0zf32873041@personal.example.com",
					//         "payer_id": "A6JR6A7JEX9PY",
					//         "address": {
					//             "country_code": "PE"
					//         }
					//     },
					//     "create_time": "2023-08-26T06:29:42Z",
					//     "update_time": "2023-08-26T06:29:52Z",
					//     "links": [
					//         {
					//             "href": "https://api.sandbox.paypal.com/v2/checkout/orders/5E116064HJ739660U",
					//             "rel": "self",
					//             "method": "GET"
					//         }
					//     ]
					// }
					try {
						await payOrder({token, orderId, orderDetails}).unwrap();
						//Se vuelve a refrescar la petición del order para tener la data actualizada para visualizar que ahora si esta pagado el order
						// refetch();
					} catch (err) {
						const message = err?.data?.message || err?.error || err.message;
						if (err.status === 401 || err.status === 403) {
							dispatch(AUTH_ACTIONS.logout(message));
						} else {
							dispatch(ERROR_ACTIONS.saveMessage(message));
						}
					}
				})
		);
	}
	//Cuando ocurrio algun error en el flujo de hacer el pago con paypal o sea el boton final de pagar de la UI de paypal
	function onError(err) {
		dispatch(ERROR_ACTIONS.saveMessage(err.message));
	}
	//Esto es solo un test para pagar el orden una vez que paypal me aprobo el pago
	// async function onApproveTest(){
	//     try{
	//         await payOrder({token, orderId, orderDetails: {
	//             payer: {}
	//         }}).unwrap();
	//         //Se vuelve a refrescar la petición del order para tener la data actualizada para visualizar que ahora si esta pagado el order
	//         refetch();
	//     }catch(err){
	//         console.log({
	//             err: err?.data?.message || err?.error || err.message
	//         })
	//     }
	// }

	const handleDeliverOrder = async () => {
		try {
			await deliverOrder({token, orderId}).unwrap();
			//Se vuelve a refrescar la petición del order para tener la data actualizada para visualizar que ahora si esta pagado el order
			// refetch();
		} catch (err) {
			const message = err?.data?.message || err?.error || err.message;
			if (err.status === 401 || err.status === 403) {
				dispatch(AUTH_ACTIONS.logout(message));
			} else {
				dispatch(ERROR_ACTIONS.saveMessage(message));
			}
		}
	};
	useEffect(() => {
		//Verificamos que tanto el order como el clientId existan
		if (!Object.keys(order).length || !clientId) return;
		const loadPayPalScript = async () => {
			console.log("Cargando el SDK de Paypal");
			//Cargamos el SDK de Paypal
			paypalDispatch({
				type: "resetOptions",
				value: {
					//Sin el client Id no te cargara tu sdk o sea no te cargara ninguna UI, el id test es lo mismo que tu id de la aplicación en tu cuenta de desarrollador, para pasar a producción ahi mismo te da las indicaciones para pasr tu cuenta a cuenta comercial
					"client-id": clientId,
					currency: "USD",
				},
			});
			//Cambiamos el estado de isPending a pending
			// dispatch({
			//     type: "setLoadingStatus",
			//     value: "pending"
			// })
		};
		//Vamos a cargar el SDK de paypal siempre y cuando el order no este pagado y la ventana window tampoco lo tenga cargado previamente
		if (!order.isPaid /* && !window.paypal */) {
			loadPayPalScript();
		}

		//eslint-disable-next-line
	}, [order, clientId]);

	return isLoadingGetOrder ? (
		<Loader />
	) : isErrorGetOrder ? (
		<>
			<Meta title={errorGetOrder?.data?.message || errorGetOrder?.error}></Meta>
			<Message variant="danger">
				{errorGetOrder?.data?.message || errorGetOrder?.error}
			</Message>
		</>
	) : (
		<>
			<Meta title={`Mi orden N° ${order.id}`}></Meta>
			<h1>Order {order.id}</h1>
			<Row>
				<Col md={8}>
					<ListGroup variant="flush">
						<ListGroup.Item>
							<h2>Shipping</h2>
							<p>
								<strong>Name: </strong> {order?.userId?.name}
							</p>
							<p>
								<strong>Email: </strong> {order?.userId?.email}
							</p>
							<p>
								<strong>Address: </strong> {order?.shippingAddress?.address},{" "}
								{order?.shippingAddress?.city}{" "}
								{order?.shippingAddress?.postalCode},{" "}
								{order?.shippingAddress?.country}
							</p>
							{order.isDelivered ? (
								<Message variant="success">
									Delivered on {order?.deliveredAt}
								</Message>
							) : (
								<Message variant="danger">Not Delivered</Message>
							)}
						</ListGroup.Item>

						<ListGroup.Item>
							<h2>Payment Method</h2>
							<p>
								<strong>Method: </strong>
								{order.paymentMethod}
							</p>
							{order.isPaid ? (
								<Message variant="success">Paid on {order?.paidAt}</Message>
							) : (
								<Message variant="danger">Not Paid</Message>
							)}
						</ListGroup.Item>

						<ListGroup.Item>
							<h2>Order Items</h2>
							{order.items.map(({productId, qty}, index) => (
								<ListGroup.Item key={index}>
									<Row>
										<Col md={1}>
											<Image
												src={productId?.image}
												alt={productId?.name}
												fluid
												rounded
											></Image>
										</Col>
										<Col>
											<Link to={`/products/${productId?.slug}`}>
												{productId?.name}
											</Link>
										</Col>
										<Col md={4}>
											{qty} * ${productId?.priceIVA || 0} = $
											{qty * productId.priceIVA}
										</Col>
									</Row>
								</ListGroup.Item>
							))}
						</ListGroup.Item>
					</ListGroup>
				</Col>
				<Col md={4}>
					<Card>
						{isErrorDeliver && (
							<Message variant="danger">
								{errorDeliver?.data?.message || errorDeliver?.error}
							</Message>
						)}
						{isErrorClientId && (
							<Message variant="danger">
								{errorClientId?.data?.message || errorClientId?.error}
							</Message>
						)}
						{isErrorPayOrder && (
							<Message variant="danger">
								{errorPayOrder?.data?.message || errorPayOrder?.error}
							</Message>
						)}
						{isSuccessPayOrder && (
							<Message variant="success">{dataPayed?.message}</Message>
						)}
						{isSuccessDeliver && (
							<Message variant="success">{dataDeliver?.message}</Message>
						)}

						<ListGroup variant="flush">
							<ListGroup.Item>
								<h2>Order Summary</h2>
							</ListGroup.Item>
							<ListGroup.Item>
								<Row>
									<Col>Items</Col>
									<Col>${order?.itemsPrice || 0}</Col>
								</Row>
								<Row>
									<Col>Tax</Col>
									<Col>${order?.taxPrice || 0}</Col>
								</Row>
								<Row>
									<Col>Shipping</Col>
									<Col>${order?.shippingPrice || 0}</Col>
								</Row>
								<Row>
									<Col>Total</Col>
									<Col>${order?.totalPrice || 0}</Col>
								</Row>
							</ListGroup.Item>
							{/* Vamos a mostrar los botones de paypal solamente si la orden no esta pagado */}
							{!order.isPaid && (
								<ListGroup.Item>
									{/* Me muestra el simbolo de carga mientras hago el pago */}
									{isLoadingPayOrder && <Loader />}

									{/* Me muestra el simbolo de carga mientras me carga el SDK de paypal */}
									{isPending ? (
										<Loader />
									) : (
										<div>
											{/* <Button className="mb-3" onClick={onApproveTest}>Test Pay Order</Button> */}
											<div>
												{/* 
                                                createBillingAgreement: Called on button click. Often used for Braintree vault integrations.
                                                createSubscription: Se llama al hacer clic en el botón para configurar un pago recurrente. o bien pasas createSubscription o createOrder pero no ambos
                                                createOrder: Called on button click to set up a one-time payment. 
                                                onApprove: Called when finalizing the transaction. Often used to inform the buyer that the transaction is complete.  
                                                onCancel: Called when the buyer cancels the transaction. Often used to show the buyer a cancellation page. Ocurre cuando cancelamos la transaccion en la UI de Paypal
                                                onClick: Called when the button is clicked. Often used for validation.
                                                onInit: Called when the buttons are initialized. The component is initialized after the iframe has successfully loaded.
                                                onShippingChange: Called when the buyer changes their shipping address on PayPal, se ejcuta cuando cambias la direccion en la UI de Paypal en vivo
                                                */}
												<PayPalButtons
													//Ocurre cuando en la UI de Paypal le das al boton de pagar luego de elegir tu metodo de pago en el mismo paypal (VISA O SALDO DEL MIMSO PAYLPAL)PalButtons
													//Ocurre cuando en la UI de Paypal le das al boton de pagar luego de elegir tu metodo de pago en el mismo paypal (VISA O SALDO DEL MIMSO PAYLPAL)
													createOrder={createOrder}
													onApprove={onApprove}
													onError={onError}
													onClick={() => console.log("Abriendo UI de Paypal")}
													onCancel={() =>
														console.log("Cancelamos la transaccion")
													}
													onShippingChange={() =>
														console.log("Cambiando dirección de envío")
													}
													// className = ""
													// style={{}}
													// disabled
													// forceReRender=[]
												></PayPalButtons>
											</div>
										</div>
									)}
								</ListGroup.Item>
							)}
							{/* Vamos a mostrar el boton de deliver si la orden ya esta pagado y si solo eres admin */}
							{isLoadingDeliver && <Loader />}
							{isAdmin && order.isPaid && !order.isDelivered && (
								<ListGroup.Item>
									<Button
										type="button"
										className="btn btn-block"
										onClick={handleDeliverOrder}
									>
										Mark As Delivered
									</Button>
								</ListGroup.Item>
							)}
						</ListGroup>
					</Card>
				</Col>
			</Row>
		</>
	);
}

export default OrderScreen;
