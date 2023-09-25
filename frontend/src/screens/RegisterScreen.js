import React from 'react'
import {Link, useNavigate} from "react-router-dom";
import {Form, Button, Row, Col, Spinner} from "react-bootstrap";
import {useDispatch, useSelector} from "react-redux";
import Message from "components/Message";
// import Loader from "components/Loader";
import FormContainer from "components/hocs/FormContainer";

//Actions
import * as AUTH_ACTIONS from "../redux/slices/authSlice";


//Selectors
import * as AUTH_SELECTORS from "../redux/selectors/authSelector";

//Services
import { useRegisterMutation } from 'redux/slices/authApiSlice';

import useForm from "../utils/hooks/useForm";
import Meta from 'components/Meta';

function RegisterScreen() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [register, {isError, isLoading, error}] = useRegisterMutation();
  
  let redirectTo = useSelector(AUTH_SELECTORS.selectRedirectTo);
  
  const {name, email, password, confirm_password, form: user, handleChange} = useForm({
    name: "",
    email: "",
    password: "",
    confirm_password: ""
  })

  const handleSubmit = async (e, user) => {
    e.preventDefault();
    try{
        const token = await register(user).unwrap();
        dispatch(AUTH_ACTIONS.registerSuccess(token.body));
        navigate(redirectTo);
        //Reseteamos la redirección a la ruta por defecto
        dispatch(AUTH_ACTIONS.saveRedirectTo("/"));
    }catch(err){
        dispatch(AUTH_ACTIONS.logout());
    }
  }

  return (
    <>
        <Meta title={`Regístrate, es gratis`}></Meta>
        <FormContainer>
            <h1>Sign Up</h1>
            {isError && <Message variant="danger">{error?.data?.message || error?.error}</Message>}
            <Form onSubmit={(e) => handleSubmit(e, user)}>
                <Form.Group controlId="name" className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" name="name" placeholder="Enter name" value={name} onChange={handleChange}></Form.Control>
                </Form.Group>

                <Form.Group controlId="email" className="mb-3">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control type="email" name="email" placeholder="Enter email" value={email} onChange={handleChange}></Form.Control>
                </Form.Group>

                <Form.Group controlId="password" className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" name="password" placeholder="Enter password" value={password} onChange={handleChange}></Form.Control>
                </Form.Group>

                <Form.Group controlId="confirm_password" className="mb-3">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control type="password" name="confirm_password" placeholder="Enter password again" value={confirm_password} onChange={handleChange}></Form.Control>
                </Form.Group>

                {
                    isLoading 
                    ?
                    <Button variant="primary" disabled>
                        <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            className='me-2'
                        />
                        Loading...
                    </Button>
                    :
                    <Button type="submit" variant="primary">
                        Register
                    </Button>
                }        
            </Form>
            <Row className="py-3">
                <Col>
                    Have an Account? <Link to={"/auth/login"}>Login</Link>
                </Col>
            </Row>
        
        </FormContainer>
    </>
  )
}

export default RegisterScreen