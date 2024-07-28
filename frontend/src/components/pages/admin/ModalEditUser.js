import Message from "components/Message";

import {Button, Col, Form, Modal, Row, Spinner} from "react-bootstrap";

import {useEditUserMutation, useGetUserByIdQuery} from "apis/usersApi";
import {useDispatch} from "react-redux";
import * as formik from "formik";
import * as yup from "yup";

//ACTIONS
import * as ERROR_ACTIONS from "redux/slices/errorSlice";
import * as AUTH_ACTIONS from "redux/slices/authSlice";
import {useEffect} from "react";
import Loader from "components/Loader";

// En el código que proporcionaste, touched.name y errors.name son propiedades relacionadas con el manejo de formularios en Formik.

// * touched.name: Esta propiedad indica si un campo del formulario ha sido tocado o interactuado por el usuario. Cuando el usuario interactúa con un campo (como hacer clic en él o escribir algo), Formik establece touched.name en true. Esto es útil para saber si un usuario ha interactuado con un campo antes de mostrar errores o aplicar estilos específicos.

// * errors.name: Esta propiedad contiene los errores de validación asociados al campo name. Si has definido reglas de validación en tu formulario utilizando Formik, los errores se almacenarán en esta propiedad. Si no hay errores de validación en el campo name, errors.name será undefined o una cadena vacía.

// Si vamos a utilizar la ui de que el campo es valido entonces en cada Form.Control debes de poner isValid, ahora si quieres analizar de que el campo es invalido entonces pones isINvalid y podrás hacer uso de la UI cuando ocurre un error según el esquema. También puedes usar ambas validaciones
// noValidate es para que no me valide nada el propio navegador como el required en los campos especificados del componente <Form>

function ModalEditUser(props) {
	const token = JSON.parse(localStorage.getItem("token") ?? '""');
	const {userIdSelected} = props;
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
	});

	const [editUser, {isError, isSuccess, isLoading, error, data, reset}] =
		useEditUserMutation();

	const {
		data: dataUser,
		isError: isErrorUser,
		isLoading: isLoadingUser,
		error: errorUser,
	} = useGetUserByIdQuery({token, userId: userIdSelected});
	const user = dataUser?.body || {};

	//Solo para peticiones get que necesiten de un token para autenticación
	if (errorUser?.status === 401 || errorUser?.status === 403) {
		dispatch(AUTH_ACTIONS.logout(errorUser?.data?.message || errorUser?.error));
	}

	useEffect(() => {
		reset();
		//eslint-disable-next-line
	}, [userIdSelected]);
	return (
		<Modal
			{...props}
			size="lg"
			aria-labelledby="contained-modal-title-vcenter"
			centered
		>
			<Modal.Header closeButton>
				<Modal.Title id="contained-modal-title-vcenter">Edit User</Modal.Title>
			</Modal.Header>
			{/* Si no pones nada de estas condicionales no pasa nada pero lo hacemos mas que nada al obtener el producto y puede dar error */}
			{isLoadingUser ? (
				<Loader />
			) : isErrorUser ? (
				<Message variant="danger">
					{errorUser?.data?.message || errorUser?.error}
				</Message>
			) : (
				<Modal.Body>
					{isError && (
						<Message variant="danger">
							{error?.data?.message || error?.error}
						</Message>
					)}
					{isSuccess && <Message variant="success">{data?.message}</Message>}
					<Formik
						validationSchema={schema}
						onSubmit={async (values) => {
							const token = JSON.parse(localStorage.getItem("token") ?? '""');
							try {
								await editUser({
									token,
									userId: values.id,
									newUser: values,
								}).unwrap();
							} catch (err) {
								const message = err?.data?.message || err?.error || err.message;
								if (err.status === 401 || err.status === 403) {
									dispatch(AUTH_ACTIONS.logout(message));
								} else {
									dispatch(ERROR_ACTIONS.saveMessage(message));
								}
							}
						}}
						initialValues={user}
						//Si el valor de initialValues cambia por algun cambio de estado, entonces con la propiedad debajo cambiara el estado del formulario
						enableReinitialize={true}
					>
						{({handleSubmit, handleChange, values, touched, errors}) => (
							<Form noValidate onSubmit={handleSubmit}>
								<Row className="mb-3">
									<Form.Group
										as={Col}
										md="4"
										className="position-relative mb-3"
									>
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

									<Form.Group
										as={Col}
										md="8"
										className="position-relative mb-3"
									>
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
									<Form.Group
										as={Col}
										md="6"
										className="position-relative mb-3"
									>
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
											checked={values.isAdmin}
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
			)}
			<Modal.Footer>
				<Button onClick={props.onHide}>Close</Button>
			</Modal.Footer>
		</Modal>
	);
}

export default ModalEditUser;
