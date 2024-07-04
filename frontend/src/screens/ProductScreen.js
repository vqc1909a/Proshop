import {useState} from "react";
import {Link, useParams, useNavigate} from "react-router-dom";
import {Row, Col, Image, ListGroup, Card, Button, Form} from "react-bootstrap";
import Rating from "../components/Rating";
import {useDispatch} from "react-redux";
import Message from "components/Message";
import Loader from "components/Loader";
import {useGetProductBySlugQuery} from "apis/productsApi";
import Reviews from "components/pages/product/Reviews";
import Meta from "components/Meta";

//ACTIONS
import * as CART_ACTIONS from "redux/slices/cartSlice";

function ProductScreen() {
	let {slug} = useParams();
	const [qty, setQty] = useState(1);

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const {data, isError, isLoading, error, refetch} =
		useGetProductBySlugQuery(slug);
	let selectedProduct = data?.body || {};

	const {id: productId, image, name, priceIVA, description, countInStock} =
		selectedProduct;

	const handleAddToCart = (product, qty) => {
		//ESTO HACEMOS PARA QUE SOLAMENTE EN EL CARRITO ESTE LOS DATOS NECESARIOS
		let {
			userId,
			description,
			createdAt,
			updatedAt,
			...restProduct
		} = product;
		let newProduct = {
			...restProduct,
			qty,
		};
		dispatch(CART_ACTIONS.addItem(newProduct));
		navigate("/cart");
	};

	return (
		<>
			{isLoading ? (
				<Loader></Loader>
			) : isError ? (
				<>
					<Meta title={error?.data?.message || error?.error}></Meta>
					<Message variant="danger">
						{error?.data?.message || error?.error}
					</Message>
				</>
			) : (
				<>
					<Meta
						title={selectedProduct.name}
						description={selectedProduct.description}
						keywords={`${selectedProduct.name}, ${selectedProduct.brand}, ${selectedProduct.category}`}
					></Meta>
					<Link className="btn btn-light my-3" to="/">
						Go Back
					</Link>
					<Row className="mb-3">
						<Col md={6}>
							<Image src={image} alt={name} fluid />
						</Col>
						<Col md={3}>
							<ListGroup variant="flush">
								<ListGroup.Item>
									<h3>{name}</h3>
								</ListGroup.Item>
								<ListGroup.Item>
									<Rating productId={productId}></Rating>
								</ListGroup.Item>
								<ListGroup.Item>Price: ${priceIVA}</ListGroup.Item>
								<ListGroup.Item>Description: {description}</ListGroup.Item>
							</ListGroup>
						</Col>
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
											<Col>
												{countInStock > 0 ? "In Stock" : "Out Of Stock"}
											</Col>
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
					</Row>
					<Reviews
						productId={productId}
						refetchProduct={refetch}
					></Reviews>
				</>
			)}
		</>
	);
}

export default ProductScreen;
