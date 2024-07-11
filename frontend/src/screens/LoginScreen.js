import React from "react";
import {Link, useNavigate /* useSearchParams */} from "react-router-dom";
import {Form, Button, Row, Col, Spinner} from "react-bootstrap";
import {useDispatch} from "react-redux";
import Message from "components/Message";
// import Loader from "components/Loader";
import FormContainer from "components/hocs/FormContainer";

//Actions
import * as AUTH_ACTIONS from "redux/slices/authSlice";

//Services
import {useLoginMutation} from "apis/authApi";

import useForm from "utils/hooks/useForm";
import Meta from "components/Meta";

function LoginScreen() {
	const dispatch = useDispatch();
	const navigate = useNavigate();


	//Este data al igual que la respuesta del await te traera la respuesta que definiste en tu servicio luego de que se ejecute login, caso contrario sera undefined por el momento
	const [login, {isLoading, isError, error}] = useLoginMutation();
	const {
		email,
		password,
		form: user,
		handleChange,
	} = useForm({
		email: "",
		password: "",
	});

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const token = await login(user).unwrap();
			dispatch(AUTH_ACTIONS.loginSuccess(token.body));
			const lastPath = localStorage.getItem("lastPath") || "/";
			navigate(lastPath, {replace: true});
		} catch (err) {
			//El error de aqui es mas tema de sintaxis del try, el error del servicio ya esta reflejado arriba, ahi se obtiene el error del servicio
			dispatch(AUTH_ACTIONS.logout());
		}
	};

	return (
		<>
			<Meta title={`Logueate, es gratis`}></Meta>
			<FormContainer>
				<h1>Sign In</h1>
				{isError && (
					<Message variant="danger">
						{error?.data?.message || error?.error}
					</Message>
				)}
				<Form onSubmit={handleSubmit}>
					<Form.Group controlId="email" className="mb-3">
						<Form.Label>Email Address</Form.Label>
						<Form.Control
							type="email"
							name="email"
							placeholder="Enter email"
							value={email}
							onChange={handleChange}
						></Form.Control>
					</Form.Group>

					<Form.Group controlId="password" className="mb-3">
						<Form.Label>Password</Form.Label>
						<Form.Control
							type="password"
							name="password"
							placeholder="Enter password"
							value={password}
							onChange={handleChange}
						></Form.Control>
					</Form.Group>

					{isLoading ? (
						<Button variant="primary" disabled>
							<Spinner
								as="span"
								animation="border"
								size="sm"
								role="status"
								aria-hidden="true"
								className="me-2"
							/>
							Loading...
						</Button>
					) : (
						<Button type="submit" variant="primary">
							Sign In
						</Button>
					)}
				</Form>
				<Row className="py-3">
					<Col>
						New Customer? <Link to={"/auth/register"}>Register</Link>
					</Col>
				</Row>
			</FormContainer>
		</>
	);
}

export default LoginScreen;
