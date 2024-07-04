import Message from "components/Message";

import {Button, Col, Form, Modal, Row, Spinner} from "react-bootstrap";

import {useEditProductMutation, useGetProductByIdQuery} from "apis/productsApi";
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

function ModalEditProduct(props) {
	const token = localStorage.getItem("token")
		? JSON.parse(localStorage.getItem("token"))
		: "";

	const {idProductSelected} = props;
	const dispatch = useDispatch();
	const {Formik} = formik;
	const schema = yup.object().shape({
		name: yup.string().required("El nombre es requerido"),
		description: yup.string().required("La descripcion es requerido"),
		brand: yup.string().required("La marca es requerido"),
		category: yup.string().required("La categoría es requerido"),
		price: yup
			.number("El precio es un número")
			.positive("El precio es un número positivo")
			.required("El precio es requerido"),
		countInStock: yup
			.number("El stock es un número")
			.integer("El stock debe ser un número entero")
			.min(0, "El stock debe ser igual o mayor que 0")
			.required("El stock es requerido"),
	});

	const [editProduct, {isError, isSuccess, isLoading, error, data, reset}] =
		useEditProductMutation();

	const {
		data: dataProduct,
		isError: isErrorProduct,
		isLoading: isLoadingProduct,
		error: errorProduct,
	} = useGetProductByIdQuery({token, productId: idProductSelected});
	const product = dataProduct?.body || {};

	//Solo para peticiones get que necesiten de un token para autenticación
	if (errorProduct?.status === 401 || errorProduct?.status === 403) {
		dispatch(
			ERROR_ACTIONS.saveMessage(
				errorProduct?.data?.message || errorProduct?.error
			)
		);
		dispatch(AUTH_ACTIONS.logout());
	}

	useEffect(() => {
		reset();
		//eslint-disable-next-line
	}, [idProductSelected]);
	return (
		<Modal
			{...props}
			size="lg"
			aria-labelledby="contained-modal-title-vcenter"
			centered
		>
			<Modal.Header closeButton>
				<Modal.Title id="contained-modal-title-vcenter">
					Edit Product
				</Modal.Title>
			</Modal.Header>
			{/* Si no pones nada de estas condicionales no pasa nada pero lo hacemos mas que nada al obtener el producto y puede dar error */}
			{isLoadingProduct ? (
				<Loader />
			) : isErrorProduct ? (
				<Message variant="danger">
					{errorProduct?.data?.message || errorProduct?.error}
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
							const token = localStorage.getItem("token")
								? JSON.parse(localStorage.getItem("token"))
								: "";
							try {
								await editProduct({
									token,
									productId: values.id,
									newProduct: values,
								}).unwrap();
							} catch (err) {
								if (err.status === 401 || err.status === 403) {
									dispatch(
										ERROR_ACTIONS.saveMessage(
											err?.data?.message || err?.error || err.message
										)
									);
									dispatch(AUTH_ACTIONS.logout());
								}
							}
						}}
						initialValues={product}
						//Si el valor de initialValues cambia por algun cambio de estado, entonces con la propiedad debajo cambiara el estado del formulario
						enableReinitialize={true}
					>
						{({handleSubmit, handleChange, values, touched, errors}) => (
							<Form noValidate onSubmit={handleSubmit}>
								<Row className="mb-3">
									<Form.Group as={Col} md="4">
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
								</Row>
								<Row className="mb-3">
									<Form.Group className="position-relative mb-3">
										<Form.Label>Description</Form.Label>
										<Form.Control
											as="textarea"
											name="description"
											value={values.description}
											onChange={handleChange}
											isValid={touched.description && !errors.description}
											isInvalid={!!errors.description}
										/>
										<Form.Control.Feedback>Looks good!</Form.Control.Feedback>
										<Form.Control.Feedback type="invalid">
											{errors.description}
										</Form.Control.Feedback>
									</Form.Group>
								</Row>

								<Row className="mb-3">
									<Form.Group
										className="position-relative mb-3"
										as={Col}
										md="6"
									>
										<Form.Label>Brand</Form.Label>
										<Form.Select
											name="brand"
											onChange={handleChange}
											isValid={touched.brand && !errors.brand}
											isInvalid={!!errors.brand}
											value={values.brand}
										>
											<option value="" disabled>
												--Seleccionar--
											</option>
											<option value="Apple">Apple</option>
											<option value="Cannon">Cannon</option>
											<option value="Sony">Sony</option>
											<option value="Logitech">Logitech</option>
											<option value="Amazon">Amazon</option>
										</Form.Select>
										<Form.Control.Feedback>Looks good!</Form.Control.Feedback>
										<Form.Control.Feedback type="invalid">
											{errors.brand}
										</Form.Control.Feedback>
									</Form.Group>
									<Form.Group
										className="position-relative mb-3"
										as={Col}
										md="6"
									>
										<Form.Label>Category</Form.Label>
										<Form.Select
											name="category"
											onChange={handleChange}
											isValid={touched.category && !errors.category}
											isInvalid={!!errors.category}
											value={values.category}
										>
											<option value="" disabled>
												--Seleccionar--
											</option>
											<option value="Electronics">Electronics</option>
											<option value="Laptops">Laptops</option>
											<option value="Mouses">Mouses</option>
										</Form.Select>
										<Form.Control.Feedback>Looks good!</Form.Control.Feedback>
										<Form.Control.Feedback type="invalid">
											{errors.category}
										</Form.Control.Feedback>
									</Form.Group>
								</Row>

								<Row className="mb-3">
									<Form.Group as={Col} md="6">
										<Form.Label>Price</Form.Label>
										<Form.Control
											type="number"
											name="price"
											value={values.price}
											onChange={handleChange}
											isValid={touched.price && !errors.price}
											isInvalid={!!errors.price}
										/>
										<Form.Control.Feedback>Looks good!</Form.Control.Feedback>
										<Form.Control.Feedback type="invalid">
											{errors.price}
										</Form.Control.Feedback>
									</Form.Group>
									<Form.Group as={Col} md="6">
										<Form.Label>Count In Stock</Form.Label>
										<Form.Control
											type="number"
											name="countInStock"
											value={values.countInStock}
											onChange={handleChange}
											isValid={touched.countInStock && !errors.countInStock}
											isInvalid={!!errors.countInStock}
										/>
										<Form.Control.Feedback>Looks good!</Form.Control.Feedback>
										<Form.Control.Feedback type="invalid">
											{errors.countInStock}
										</Form.Control.Feedback>
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

export default ModalEditProduct;
