import Message from "components/Message";

import {Button, Col, Form, Image, Modal, Row, Spinner} from "react-bootstrap";

import {
	useEditImageProductMutation,
	useGetProductByIdQuery,
} from "apis/productsApi";
import {useDispatch} from "react-redux";
import * as formik from "formik";
import * as yup from "yup";

//ACTIONS
import * as ERROR_ACTIONS from "redux/slices/errorSlice";
import * as AUTH_ACTIONS from "redux/slices/authSlice";
import {useEffect, useRef} from "react";
import Loader from "components/Loader";

// En el código que proporcionaste, touched.name y errors.name son propiedades relacionadas con el manejo de formularios en Formik.

// * touched.name: Esta propiedad indica si un campo del formulario ha sido tocado o interactuado por el usuario. Cuando el usuario interactúa con un campo (como hacer clic en él o escribir algo), Formik establece touched.name en true. Esto es útil para saber si un usuario ha interactuado con un campo antes de mostrar errores o aplicar estilos específicos.

// * errors.name: Esta propiedad contiene los errores de validación asociados al campo name. Si has definido reglas de validación en tu formulario utilizando Formik, los errores se almacenarán en esta propiedad. Si no hay errores de validación en el campo name, errors.name será undefined o una cadena vacía.

// Si vamos a utilizar la ui de que el campo es valido entonces en cada Form.Control debes de poner isValid, ahora si quieres analizar de que el campo es invalido entonces pones isINvalid y podrás hacer uso de la UI cuando ocurre un error según el esquema. También puedes usar ambas validaciones
// noValidate es para que no me valide nada el propio navegador como el required en los campos especificados del componente <Form>

function ModalEditImageProduct(props) {
	const token = JSON.parse(localStorage.getItem("token") || '""');
	const {productIdSelected} = props;
	const dispatch = useDispatch();
	const {Formik} = formik;
	const schema = yup.object().shape({
		newImage: yup.mixed().required("La nueva imagen es requerido"),
	});

	const [
		editImageProduct,
		{isError, isSuccess, isLoading, error, data, reset},
	] = useEditImageProductMutation();

	const {
		data: dataProduct,
		isError: isErrorProduct,
		isLoading: isLoadingProduct,
		error: errorProduct,
	} = useGetProductByIdQuery({token, productId: productIdSelected});
	const product = dataProduct?.body || {};

	//Solo para peticiones get que necesiten de un token para autenticación
	const messageProduct = errorProduct?.data?.message || errorProduct?.error || errorProduct?.message;
	if (errorProduct?.status === 401 || errorProduct?.status === 403) {
		dispatch(AUTH_ACTIONS.logout(messageProduct));
	} else {
		dispatch(ERROR_ACTIONS.saveMessage(messageProduct));
	}

	const newImagePreview = useRef();
	const formEditImageProduct = useRef();

	useEffect(() => {
		reset();
		//eslint-disable-next-line
	}, [productIdSelected]);

	return (
		<Modal
			{...props}
			size="lg"
			aria-labelledby="contained-modal-title-vcenter"
			centered
		>
			<Modal.Header closeButton>
				<Modal.Title id="contained-modal-title-vcenter">
					Edit Image Product
				</Modal.Title>
			</Modal.Header>
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
							const token = JSON.parse(localStorage.getItem("token") ?? '""');
							try {
								//Un input type file al enviarlo mediante una petición se resetea su valor a su valor inical o sea a nada pero el nombre seguira plasmado en el input type file pero el valor no
								let formData = new FormData(formEditImageProduct.current);
								await editImageProduct({
									token,
									productId: values.id,
									newProduct: formData,
								}).unwrap();
								newImagePreview.current.innerHTML = "";
							} catch (err) {
								const message = err?.data?.message || err?.error || err.message;
								if (err.status === 401 || err.status === 403) {
									dispatch(AUTH_ACTIONS.logout(message));
								} else {
									dispatch(ERROR_ACTIONS.saveMessage(message));		
								}
							}
						}}
						//AQui le pasamos todo y al darle onSUbmit y el valor de values será todo este objeto incluyendo los nuevos campos de este formulario
						initialValues={product}
						enableReinitialize={true}
					>
						{({handleSubmit, handleChange, values, touched, errors}) => (
							<Form
								noValidate
								onSubmit={handleSubmit}
								ref={formEditImageProduct}
							>
								<Row className="mb-3">
									<Form.Group className="position-relative mb-3">
										<Form.Label>Current Image</Form.Label>
									</Form.Group>
									<Row>
										<Col xs={6}>
											<Image
												src={values.image}
												width={"100%"}
												height={"300"}
											></Image>
										</Col>
									</Row>
								</Row>

								<Row className="mb-3">
									<Form.Group className="position-relative mb-3">
										<Form.Label>New Image</Form.Label>
										<Form.Control
											type="file"
											name="newImage"
											onChange={(e) => {
												const file = e.target.files[0];
												if (file) {
													// Creamos una nueva instancia de FileReader, que nos permitirá leer el contenido del archivo seleccionado
													const reader = new FileReader();

													reader.addEventListener("load", function () {
														const image = document.createElement("img");
														// reader.result contiene una URL de datos (Data URL) que representa el contenido del archivo.
														// data:image/png;base64,iVBORw0KGgoAAAANSUhEU.......
														image.src = reader.result;
														image.style.width = "100%";
														image.style.height = "300px";
														newImagePreview.current.innerHTML = "";
														newImagePreview.current.appendChild(image);
													});

													//Iniciamos la lectura del contenido del archivo seleccionado como una URL de datos (Data URL). Esto hace que el FileReader lea el contenido del archivo y dispare el evento "load" cuando la lectura se complete
													reader.readAsDataURL(file);
												}
												handleChange(e);
											}}
											isValid={touched.newImage && !errors.newImage}
											isInvalid={!!errors.newImage}
											accept="image/*"
										/>
										<Form.Control.Feedback>Looks good!</Form.Control.Feedback>
										<Form.Control.Feedback type="invalid">
											{errors.newImage}
										</Form.Control.Feedback>
									</Form.Group>
									<Row>
										<Col xs={6} ref={newImagePreview}></Col>
									</Row>
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

export default ModalEditImageProduct;
