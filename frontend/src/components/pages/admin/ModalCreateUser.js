import Message from "components/Message";

import {useEffect} from "react";
import {Button, Col, Form, Modal, Row, Spinner} from "react-bootstrap";

import {useCreateUserMutation} from "apis/usersApi";
import {useDispatch} from "react-redux";
import * as formik from "formik";
import * as yup from "yup";

//ACTIONS
import * as ERROR_ACTIONS from "redux/slices/errorSlice";
import * as AUTH_ACTIONS from "redux/slices/authSlice";

function ModalCreateUser(props) {
	const {keynewmodal} = props;
	const dispatch = useDispatch();
	const {Formik} = formik;
	const schema = yup.object().shape({
		name: yup.string().required("El nombre es requerido"),
		email: yup
			.string()
			.email("Ingrese un email válido")
			.required("El email es requerido"),
		password: yup
			.string()
			.min(6, "La cantidad mínima de carácteres es 6")
			.required("El password es requerido"),
		// isAdmin: yup.string().optional()
	});

	const [createUser, {isError, isSuccess, isLoading, error, data, reset}] =
		useCreateUserMutation();

	useEffect(() => {
		reset();
		//eslint-disable-next-line
	}, [keynewmodal]);

	return (
		<Modal
			{...props}
			size="lg"
			aria-labelledby="contained-modal-title-vcenter"
			centered
		>
			<Modal.Header closeButton>
				<Modal.Title id="contained-modal-title-vcenter">New User</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				{isError && (
					<Message variant="danger">
						{error?.data?.message || error?.error}
					</Message>
				)}
				{isSuccess && <Message variant="success">{data?.message}</Message>}
				<Formik
					validationSchema={schema}
					onSubmit={async (values, {resetForm}) => {
						// {
						//     "values": {
						//         "name": "dsa",
						//         "email": "asdas@gmail.com",
						//         "password": "123456",
						//         "isAdmin": [
						//             "on"
						//         ]
						//     }
						// }
						let newValues = Object.assign({}, values);
						if (values.isAdmin.length) {
							newValues["isAdmin"] = true;
						} else {
							newValues["isAdmin"] = false;
						}
						const token = JSON.parse(localStorage.getItem("token") ?? '""');
						try {
							await createUser({token, newUser: newValues}).unwrap();
							resetForm();
						} catch (err) {
							const message = err?.data?.message || err?.error || err.message;
							if (err.status === 401 || err.status === 403) {
								dispatch(AUTH_ACTIONS.logout(message));
							} else {
								dispatch(ERROR_ACTIONS.saveMessage(message));
							}
						}
					}}
					// No es necesario crea un objet values xq con el reset te resetea a su valor inicial
					initialValues={{
						name: "",
						email: "",
						isAdmin: "",
						password: "",
					}}
				>
					{({handleSubmit, handleChange, values, touched, errors}) => (
						<Form noValidate onSubmit={handleSubmit}>
							<Row className="mb-3">
								<Form.Group as={Col} md="4" className="position-relative mb-3">
									<Form.Label>Name</Form.Label>
									<Form.Control
										type="text"
										name="name"
										value={values.name}
										onChange={handleChange}
										isValid={touched.name && !errors.name}
										isInvalid={!!errors.name}
									/>
									<Form.Control.Feedback>Looks good!</Form.Control.Feedback>
									<Form.Control.Feedback type="invalid">
										{errors.name}
									</Form.Control.Feedback>
								</Form.Group>

								<Form.Group as={Col} md="8" className="position-relative mb-3">
									<Form.Label>Email</Form.Label>
									<Form.Control
										type="email"
										name="email"
										value={values.email}
										onChange={handleChange}
										isValid={touched.email && !errors.email}
										isInvalid={!!errors.email}
									/>
									<Form.Control.Feedback>Looks good!</Form.Control.Feedback>
									<Form.Control.Feedback type="invalid">
										{errors.email}
									</Form.Control.Feedback>
								</Form.Group>
							</Row>

							<Row className="mb-3">
								<Form.Group as={Col} md="6" className="position-relative mb-3">
									<Form.Label>Password</Form.Label>
									<Form.Control
										type="password"
										name="password"
										value={values.password}
										onChange={handleChange}
										isValid={touched.password && !errors.password}
										isInvalid={!!errors.password}
									/>
									<Form.Control.Feedback>Looks good!</Form.Control.Feedback>
									<Form.Control.Feedback type="invalid">
										{errors.password}
									</Form.Control.Feedback>
								</Form.Group>

								<Form.Group as={Col} md="6" className="position-relative">
									<Form.Label>Roles</Form.Label>
									<Form.Check
										name="isAdmin"
										label="Admin"
										onChange={handleChange}
										//Valido solo cuando hacemos validación del campo
										// isValid={touched.isAdmin && !errors.isAdmin}
										// isInvalid={!!errors.isAdmin}
										// feedback={errors.isAdmin}
										// feedbackType="invalid"

										//El id siempre inputs tipo radio o check
										id={`check-api-check`}
									/>

									{/* <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                  <Form.Control.Feedback type="invalid">
                    {errors.isAdmin}
                  </Form.Control.Feedback> */}
								</Form.Group>
							</Row>

							<Button type="submit" disabled={isLoading ? true : false}>
								{isLoading ? (
									<>
										<Spinner
											as="span"
											animation="border"
											size="sm"
											role="status"
											aria-hidden="true"
											className="me-2"
										/>
										Loading...
									</>
								) : (
									"Submit form"
								)}
							</Button>
						</Form>
					)}
				</Formik>
			</Modal.Body>
			<Modal.Footer>
				<Button onClick={props.onHide}>Close</Button>
			</Modal.Footer>
		</Modal>
	);
}

export default ModalCreateUser;
