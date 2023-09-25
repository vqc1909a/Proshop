import React from 'react'
import { Nav } from 'react-bootstrap';
import {LinkContainer} from "react-router-bootstrap";


function CheckoutSteps({numberStep}) {

    let steps = [
        {
            id: 1,
            isDisabled: false,
            label: "Shipping",
            path: "/checkout/shipping-address"
        },
        {
            id: 2,
            isDisabled: false,
            label: "Payment",
            path: "/checkout/payment"
        },
        {
            id: 3,
            isDisabled: false,
            label: "Place Order",
            path: "/checkout/placeorder"
        }
    ]

    const disabledSteps = (step, index) => {
        if( index + 1 > numberStep ){
            step.isDisabled = true;
        }
        return step
    }
    let newSteps = steps.map(disabledSteps);

    return (
        <Nav className="justify-content-center mb-4">
            {
                newSteps.map(({isDisabled, label, path, id}) => (
                    <Nav.Item key={id}>
                        {!isDisabled 
                        ? 
                        (
                            <LinkContainer to={path}>
                                <Nav.Link>{label}</Nav.Link>
                            </LinkContainer>
                        )
                        :
                        <Nav.Link disabled>{label}</Nav.Link>}
                    </Nav.Item>
                ))
            }
        </Nav>
    )
}

export default CheckoutSteps