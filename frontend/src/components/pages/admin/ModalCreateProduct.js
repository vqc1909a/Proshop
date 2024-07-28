import Message from "components/Message";

import {useEffect, useRef} from "react";
import {Button, Col, Form, Modal, Row, Spinner} from "react-bootstrap";

import {useCreateProductMutation} from "apis/productsApi";
import {useDispatch} from "react-redux";
import * as formik from "formik";
import * as yup from "yup";

//ACTIONS
import * as AUTH_ACTIONS from "redux/slices/authSlice";
import * as ERROR_ACTIONS from "redux/slices/errorSlice";

// En el código que proporcionaste, touched.name y errors.name son propiedades relacionadas con el manejo de formularios en Formik.

// * touched.name: Esta propiedad indica si un campo del formulario ha sido tocado o interactuado por el usuario. Cuando el usuario interactúa con un campo (como hacer clic en él o escribir algo), Formik establece touched.name en true. Esto es útil para saber si un usuario ha interactuado con un campo antes de mostrar errores o aplicar estilos específicos.

// * errors.name: Esta propiedad contiene los errores de validación asociados al campo name. Si has definido reglas de validación en tu formulario utilizando Formik, los errores se almacenarán en esta propiedad. Si no hay errores de validación en el campo name, errors.name será undefined o una cadena vacía.

// Si vamos a utilizar la ui de que el campo es valido entonces en cada Form.Control debes de poner isValid, ahora si quieres analizar de que el campo es invalido entonces pones isINvalid y podrás hacer uso de la UI cuando ocurre un error según el esquema. También puedes usar ambas validaciones
// noValidate es para que no me valide nada el propio navegador como el required en los campos especificados del componente <Form>

function ModalCreateProduct(props) {
	const dispatch = useDispatch();
	const {Formik} = formik;
	const schema = yup.object().shape({
		name: yup.string().required("El nombre es requerido"),
		image: yup.mixed().required("La imagen es requerido"),
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

	const [createProduct, {isError, isSuccess, isLoading, error, data, reset}] = useCreateProductMutation();
	const imagePreview = useRef();
	const formCreateProduct = useRef();

	//Clean All State of the createProduct mutation, i mean, clean the state error, data, isLoading, isSuccess, isError to its default value
	useEffect(() => {
		reset();
		//eslint-disable-next-line
	}, []);

	return (
		<Modal
			{...props}
			size="lg"
			aria-labelledby="contained-modal-title-vcenter"
			centered
		>
			<Modal.Header closeButton>
				<Modal.Title id="contained-modal-title-vcenter">
					New Product
				</Modal.Title>
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
						const token = JSON.parse(localStorage.getItem("token") ?? '""');
						try {
							let formData = new FormData(formCreateProduct.current);
							await createProduct({token, newProduct: formData}).unwrap();
							imagePreview.current.innerHTML = "";
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
					initialValues={{
						name: "",
						image: "",
						description: "",
						brand: "",
						category: "",
						price: 0,
						countInStock: 0,
					}}
				>
						{/* When noValidate is present, the browser's default validation for form inputs (like checking for required fields, correct email format in type="email" inputs, etc.) is bypassed, allowing the form to be submitted without undergoing these checks.  */}
					{({handleSubmit, handleChange, values, touched, errors}) => (
						<Form noValidate onSubmit={handleSubmit} ref={formCreateProduct}>
							<Row className="mb-3">
								<Form.Group as={Col} md="4" className="position-relative">
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
								<Form.Group className="position-relative">
									<Form.Label>Description</Form.Label>
									<Form.Control
										as="textarea"
										name="description"
										value={values.description}
										onChange={handleChange}
										// touched is an object that keeps track of all the fields that have been visited or focused on in the form. Each key in the touched object
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
								<Form.Group className="position-relative mb-3">
									<Form.Label>Image</Form.Label>
									<Form.Control
										type="file"
										name="image"
										onChange={(e) => {
											const file = e.target.files[0];
											if (file) {
												// Creamos una nueva instancia de FileReader, que nos permitirá leer el contenido del archivo seleccionado
												const reader = new FileReader();

												//Iniciamos la lectura del contenido del archivo seleccionado como una URL de datos (Data URL). Esto hace que el FileReader lea el contenido del archivo y dispare el evento "load" cuando la lectura se complete
												reader.readAsDataURL(file);

												reader.addEventListener("load", function () {
													const image = document.createElement("img");
													// reader.result contiene una URL de datos (Data URL) que representa el contenido del archivo.
													// data:image/png;base64,iVBORw0KGgoAAAANSUhEU.......
													image.src = reader.result;
													image.style.width = "100%";
													image.style.height = "300px";
													imagePreview.current.innerHTML = "";
													imagePreview.current.appendChild(image);
												});
											}
											handleChange(e);
										}}
										isValid={touched.image && !errors.image}
										isInvalid={!!errors.image}
										accept="image/*"
									/>
									<Form.Control.Feedback>Looks good!</Form.Control.Feedback>
									<Form.Control.Feedback type="invalid">
										{errors.image}
									</Form.Control.Feedback>
								</Form.Group>
								<Row>
									<Col xs={6} ref={imagePreview}></Col>
								</Row>
							</Row>

							<Row className="mb-3">
								<Form.Group className="position-relative mb-3" as={Col} md="6">
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
								<Form.Group className="position-relative mb-3" as={Col} md="6">
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
								<Form.Group as={Col} md="6" className="position-relative mb-3">
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
								<Form.Group as={Col} md="6" className="position-relative mb-3">
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
			<Modal.Footer>
				<Button onClick={props.onHide}>Close</Button>
			</Modal.Footer>
		</Modal>
	);
}

export default ModalCreateProduct;
