import React, { useState } from 'react'
import { Button, Card, Col, Form, ListGroup, Row } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// ACTIONS
import * as CART_ACTIONS from "redux/slices/cartSlice";

export const PurchaseProduct = ({selectedProduct}) => {
  const dispatch = useDispatch();
	const navigate = useNavigate();

  const {priceIVA, countInStock} = selectedProduct;

	const [qty, setQty] = useState(1);

  const handleAddToCart = (product, qty) => {
		//ESTO HACEMOS PARA QUE SOLAMENTE EN EL CARRITO ESTE LOS DATOS NECESARIOS
		let {userId, description, createdAt, updatedAt, ...restProduct} = product;
		let newProduct = {
			...restProduct,
			qty,
		};
		dispatch(CART_ACTIONS.addItem(newProduct));
		navigate("/cart");
	};

	return (
		<Col md={3}>
			<Card>
				<ListGroup variant="flush">
					<ListGroup.Item>
						<Row>
							<Col>Price:</Col>
							<Col>
								<strong>${priceIVA}</strong>
							</Col>
						</Row>
					</ListGroup.Item>
					<ListGroup.Item>
						<Row>
							<Col>Status:</Col>
							<Col>{countInStock > 0 ? "In Stock" : "Out Of Stock"}</Col>
						</Row>
					</ListGroup.Item>

					{countInStock > 0 && (
						<ListGroup.Item>
							<Row>
								<Col xs={4}>Qty</Col>
								<Col xs={8}>
									<Form.Select
										aria-label="Default select example"
										value={qty}
										onChange={(e) => setQty(parseInt(e.target.value))}
									>
										{
											//Aqui me crear un array de "countInStock" valores vacios (emptys), pero con la desestructuración y el rest tendríamos un array de puros undefineds =>  [ undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined ], péro si le aplicamos el keys tendriamos sus indices dentro del array => [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11 ]
											[...Array(countInStock).keys()].map((x) => (
												<option key={x + 1} value={x + 1}>
													{x + 1}
												</option>
											))
										}
									</Form.Select>
								</Col>
							</Row>
						</ListGroup.Item>
					)}
					<ListGroup.Item>
						<Button
							onClick={() => handleAddToCart(selectedProduct, qty)}
							className="btn btn-block w-100"
							disabled={countInStock === 0}
							type="button"
						>
							Add To Cart
						</Button>
					</ListGroup.Item>
				</ListGroup>
			</Card>
		</Col>
	);
};
