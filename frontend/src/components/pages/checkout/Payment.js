import React, {useState, useEffect} from 'react';
import { Button, Form, Col} from 'react-bootstrap'
// import useForm from 'utils/hooks/useForm'
import {useDispatch, useSelector} from "react-redux";
import { useNavigate, Navigate, useOutletContext} from 'react-router-dom';

//Actions
import * as CART_ACTIONS from "redux/slices/cartSlice";

//Selectors
import * as CART_SELECTORS from "redux/selectors/cartSelector";


function Payment() { 
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  //Este selector lo pongo aqui por el hecho de que estamos manejando el guardado del payemnt solo en memoria, si fuera de base de datos iria debajo como normalmente hariamos
  const paymentMethod = useSelector(CART_SELECTORS.selectPaymentMethod);  
  const [methodPayment, setMethodPayment] = useState(paymentMethod);
  const { setNumberStep  } = useOutletContext();

  //SELECTORS
  const shippingAddress = useSelector(CART_SELECTORS.selectShippingAddress);

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

  if(!Object.keys(shippingAddress).length){
    return <Navigate to="shipping-address" replace={true} />
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
                  {/* <Form.Check
                      type="radio"
                      label="Mercado Pago"
                      id="Mercado Pago"
                      name="paymentMethod"
                      value="Mercado Pago"
                      checked={methodPayment === "Mercado Pago"}
                      onChange={(e) => setMethodPayment(e.target.value)}
                  ></Form.Check> */}
                </Col>
            </Form.Group>
            <Button type="submit" variant="primary">Continue</Button>
        </Form>
    </>
  )
}

export default Payment