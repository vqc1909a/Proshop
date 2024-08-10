import React, {useState} from 'react'
import {Outlet} from "react-router-dom"
import FormContainer from 'components/hocs/FormContainer'
import CheckoutSteps from 'components/CheckoutSteps'

//Selectors
import Meta from 'components/Meta';

function CheckoutScreen() {
  const [numberStep, setNumberStep] = useState(1);

  //Aqui no debe ir ninguna redirección porque abarca varias paginas del checkout
  // if(!items.length){
  //   return <Navigate to="/cart" replace={true}></Navigate>
  // }
  return (
    <>
      <Meta title={`Checkout`}></Meta>

      <FormContainer>
        <CheckoutSteps numberStep={numberStep}></CheckoutSteps>
        
        <Outlet context={{setNumberStep}}></Outlet>

        {/* Un problema de hacerlo de esta manera es que no vamos a poder utilizar el useState para el Outlet y demás características que podemos aprovechar */}
        
        {/* <Suspense fallback="Cargando Componente Checkout...">
          <Routes>
              <Route path="shipping-address" element={<Shipping />}></Route>
              <Route path="payment" element={<Payment/>}></Route>
              <Route path="placeorder" element={<PlaceOrder />}></Route>
              <Route path="*" element={<Navigate to="shipping-address" replace></Navigate>}></Route>
          </Routes>
        </Suspense> */}
      </FormContainer>
    </>
  )
}

export default CheckoutScreen