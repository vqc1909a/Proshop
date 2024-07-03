import React, {useEffect} from "react";
import {Button, Row, Col, ListGroup, Image, Card} from "react-bootstrap";
import {useSelector, useDispatch} from "react-redux";
import {useNavigate, Link, useOutletContext, Navigate} from "react-router-dom";
import Message from "components/Message";

//Selectors
import * as CART_SELECTORS from "redux/selectors/cartSelector";

//Actions
import * as AUTH_ACTIONS from "redux/slices/authSlice";
import * as CART_ACTIONS from "redux/slices/cartSlice";
import * as ERROR_ACTIONS from "redux/slices/errorSlice";

//Services
import {useSaveOrderMutation} from "apis/orderApi";

function PlaceOrder() {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const {setNumberStep} = useOutletContext();

	const [saveOrder, {isError, isLoading, error}] = useSaveOrderMutation();

	const items = useSelector(CART_SELECTORS.selectItems);
	const itemsPrice = useSelector(CART_SELECTORS.selectItemsPrice);
	const paymentMethod = useSelector(CART_SELECTORS.selectPaymentMethod);
	const qtyItems = useSelector(CART_SELECTORS.selectQtyItems);
	const shippingAddress = useSelector(CART_SELECTORS.selectShippingAddress);
	const shippingPrice = useSelector(CART_SELECTORS.selectShippingPrice);
	const taxPrice = useSelector(CART_SELECTORS.selectTaxPrice);
	const totalPrice = useSelector(CART_SELECTORS.selectTotalPrice);

	const handlePlaceOrder = async (e) => {
		e.preventDefault();
		try {
			const token = JSON.parse(localStorage.getItem("token"));
			const order = {
				items,
				itemsPrice,
				paymentMethod,
				qtyItems,
				shippingAddress,
				taxPrice,
				totalPrice,
			};
			const createdOrder = await saveOrder({token, order}).unwrap();
			navigate(`/orders/${createdOrder?.body?.id}`);
			dispatch(CART_ACTIONS.clearCart());
		} catch (err) {
			if (err.status === 401 || err.status === 403) {
				dispatch(
					ERROR_ACTIONS.saveMessage(
						err?.data?.message || err?.error || err.message
					)
				);
				dispatch(AUTH_ACTIONS.logout());
			}
		}
	};

	useEffect(() => {
		setNumberStep(3);
		//eslint-disable-next-line
	}, []);

	if (!Object.keys(shippingAddress).length) {
		return <Navigate to="shipping-address" replace={true} />;
	}
	if (!paymentMethod) {
		return <Navigate to="payment" replace={true} />;
	}
	return (
		<Row>
			<Col md={8}>
				<ListGroup variant="flush">
					<ListGroup.Item>
						<h2>Shipping</h2>
						<p>
							<strong>Address: </strong>
							{shippingAddress.address}, {shippingAddress.city}{" "}
							{shippingAddress.postalCode}, {shippingAddress.country}
						</p>
					</ListGroup.Item>

					<ListGroup.Item>
						<h2>Payment Method</h2>
						<strong>Method: </strong>
						{paymentMethod}
					</ListGroup.Item>

					<ListGroup.Item>
						<h2>Order Items ({qtyItems})</h2>
						<ListGroup variant="flush">
							{items.map((item) => (
								<ListGroup.Item key={item.id}>
									<Row>
										<Col md={2}>
											<Image src={item.image} alt={item.name} fluid rounded />
										</Col>
										<Col>
											<Link to={`/products/${item.slug}`}>{item.name}</Link>
										</Col>
										<Col md={5}>
											{item.qty} x ${item.priceIVA} = $
											{parseFloat(item.qty * item.priceIVA).toFixed(2)}
										</Col>
									</Row>
								</ListGroup.Item>
							))}
						</ListGroup>
					</ListGroup.Item>
				</ListGroup>
			</Col>
			<Col md={4}>
				<Card>
					<ListGroup variant="flush">
						<ListGroup.Item>
							<h2>Order Summary</h2>
						</ListGroup.Item>
						<ListGroup.Item>
							<Row>
								<Col>Items</Col>
								<Col>${itemsPrice.toFixed(2)}</Col>
							</Row>
						</ListGroup.Item>
						<ListGroup.Item>
							<Row>
								<Col>Tax</Col>
								<Col>${taxPrice.toFixed(2)}</Col>
							</Row>
						</ListGroup.Item>
						<ListGroup.Item>
							<Row>
								<Col>Shipping Price</Col>
								<Col>${shippingPrice.toFixed(2)}</Col>
							</Row>
						</ListGroup.Item>
						<ListGroup.Item>
							<Row>
								<Col>Total</Col>
								<Col>${totalPrice.toFixed(2)}</Col>
							</Row>
						</ListGroup.Item>
						<ListGroup.Item>
							{isError && (
								<Message variant="danger">
									{error?.data?.message || error?.error}
								</Message>
							)}
						</ListGroup.Item>
						<ListGroup.Item>
							<Button
								type="button"
								className="btn btn-block"
								onClick={handlePlaceOrder}
								disabled={isLoading ? true : false}
							>
								Place Order
							</Button>
						</ListGroup.Item>
					</ListGroup>
				</Card>
			</Col>
		</Row>
	);
}

export default PlaceOrder;
