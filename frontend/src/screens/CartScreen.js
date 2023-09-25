import React from "react";
import {Row, Col, ListGroup, Image, Form, Button, Card} from "react-bootstrap";
import Message from "components/Message";

//React Redux
import {useDispatch, useSelector} from "react-redux";

//Selectors
import * as CART_SELECTORS from "redux/selectors/cartSelector";


//Actions
import * as CART_ACTIONS from "redux/slices/cartSlice";

//React Router dom
import {Link, useNavigate} from "react-router-dom";
import Meta from "components/Meta";

function CartScreen() {
    let navigate = useNavigate();
	let dispatch = useDispatch();

    let items = useSelector(CART_SELECTORS.selectItems);
    let qtyItems = useSelector(CART_SELECTORS.selectQtyItems);
    let itemsPrice = useSelector(CART_SELECTORS.selectItemsPrice);
    let taxPrice = useSelector(CART_SELECTORS.selectTaxPrice);
    let totalPrice = useSelector(CART_SELECTORS.selectTotalPrice);
    let shippingPrice = useSelector(CART_SELECTORS.selectShippingPrice);

    
    const handleUpdateProduct = (id, e) => {
        let qty = parseInt(e.target.value)
        //A partir de dos parametros a mas lo pasamos como objeto para que tome todo el valor el payload
        dispatch(CART_ACTIONS.updateItem({id, qty}))
    }

    const handleRemoveProduct = (id) => {
        dispatch(CART_ACTIONS.removeItem(id))
    }

    const handleCheckout = () => {
        navigate("/checkout/shipping-address");
    }
	return (
        <>
            <Meta title={`Carrito de compras`}></Meta>
            <Row>
                <Col md={8}>
                    <h1>Shopping Cart</h1>
                    {items.length === 0 ? <Message>Your cart is empty <Link to="/">Go back</Link></Message> : (
                        <ListGroup variant="flush">
                            {items.map(item => (
                                <ListGroup.Item key={item.id}>
                                    <Row>
                                        <Col md={2}>
                                            <Image src={item.image} alt={item.name} fluid rounded></Image>
                                        </Col>
                                        <Col md={3}>
                                            <Link to={`/products/${item.slug}`}>{item.name}</Link>
                                        </Col>
                                        <Col md={2}>
                                            ${item.priceIVA}
                                        </Col>
                                        <Col md={3}>
                                            <Form.Select aria-label="Default select example" value={item.qty} onChange={(e) => handleUpdateProduct(item.id, e)}>
                                            {
                                                [...Array(item.countInStock).keys()].map((x) => (
                                                    <option key={x + 1} value={x + 1}>
                                                        {x + 1}
                                                    </option>
                                                ))
                                            }
                                            </Form.Select>
                                        </Col>
                                        <Col md={2}>
                                            <Button type="button" variant="light" onClick={() => handleRemoveProduct(item.id)}>
                                                <i className="fas fa-trash"></i>
                                            </Button>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    )}
                </Col>
                <Col md={4}>
                    <Card>
                        <ListGroup variant="flush">
                            <ListGroup.Item>
                                <h2>ITEMS ({qtyItems})</h2>
                                <h5>SUBTOTAL: ${itemsPrice}</h5>
                                <h5>Tax: ${taxPrice}</h5>
                                <h5>Shipping: ${shippingPrice}</h5>
                                <h2>TOTAL: ${totalPrice}</h2>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Button type="button" className="btn-block" disabled={!items.length} onClick={handleCheckout}>
                                    Proceed To Checkout
                                </Button>
                            </ListGroup.Item>
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </>
    );
}

export default CartScreen;
