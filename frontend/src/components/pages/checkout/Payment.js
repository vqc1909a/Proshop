import React, {useState, useEffect} from 'react';
import { Button, Form, Col} from 'react-bootstrap'
// import useForm from 'utils/hooks/useForm'
import {useDispatch} from "react-redux";
import { useNavigate, Navigate, useOutletContext} from 'react-router-dom';

//Actions
import * as CART_ACTIONS from "redux/slices/cartSlice";

const itemsStorage = JSON.parse(localStorage.getItem("cartItems") ?? "[]");
const shippingAddressStorage = JSON.parse(localStorage.getItem("shippingAddress") ?? "{}");

function Payment() { 
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [methodPayment, setMethodPayment] = useState("Paypal");
  const { setNumberStep  } = useOutletContext();

  //SELECTORS

  const handleSubmit = (e) => {
    e.preventDefault();
    //Igualmente aqui en tu proyecto real de ecommerce, tendrías varios metodos de pago, y si el metodo de pago es tarjeta de crédito o débito | Visa, MASTERCARD, ETC, LE DARÍAS LA OPCIÓN AL USUARIO DE GUARDAR LA TARJETA DIGITADA O NO PARA POSTERIORES COMPRAS, PERO SI YA TIENE VARIAS TARJETAS GUARDADAS EN EL BACK, SIEMPRE SELECCIONA LA PRIMERA TARJETA DEL USUARIO
    dispatch(CART_ACTIONS.savePaymentMethod(methodPayment));
    setNumberStep(3); 
    navigate("/checkout/placeorder");
  }

  useEffect(() => {
    setNumberStep(2); 
    //eslint-disable-next-line
  },[])

  if (!itemsStorage.length) {
		return <Navigate to="/cart" replace={true}></Navigate>;
	}
  if (!Object.keys(shippingAddressStorage).length) {
		return <Navigate to="shipping-address" replace={true} />;
	}
  return (
    <>
        <h1>Payment Method</h1>
        <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
                <Form.Label as="legend">Select Method </Form.Label>
                <Col>
                  <Form.Check
                      type="radio"
                      label="Paypal"
                      id="Paypal"
                      name="paymentMethod"
                      value="Paypal"
                      checked={methodPayment === "Paypal"}
                      onChange={(e) => setMethodPayment(e.target.value)}
                  ></Form.Check>
                  <Form.Check
                      type="radio"
                      label="Mercado Pago"
                      id="Mercado Pago"
                      name="paymentMethod"
                      value="Mercado Pago"
                      checked={methodPayment === "Mercado Pago"}
                      onChange={(e) => setMethodPayment(e.target.value)}
                  ></Form.Check>
                </Col>
            </Form.Group>
            <Button type="submit" variant="primary">Continue</Button>
        </Form>
    </>
  )
}

export default Payment