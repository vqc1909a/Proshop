import React, {memo, useEffect, useState} from "react";
import {Button, Card, Form, Spinner} from "react-bootstrap";
import debounce from "just-debounce-it";
import useForm from "utils/hooks/useForm";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate, useOutletContext} from "react-router-dom";
import Loader from "components/Loader";

//Actions
import * as ERROR_ACTIONS from "redux/slices/errorSlice";

//Slices
import * as AUTH_ACTIONS from "redux/slices/authSlice";
import * as CART_ACTIONS from "redux/slices/cartSlice";

//Selectors
import * as AUTH_SELECTORS from "redux/selectors/authSelector";

//Services
import {
	useAddShippingAddressMutation,
	useChangeSelectedShippingAddressMutation,
} from "apis/profileApi";
import Message from "components/Message";

const SHIPPING_ADDRESS_DEFAULT = {
	address: "",
	city: "",
	postalCode: "",
	country: "",
};
function Shipping() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [isFormShipping, setIsFormShipping] = useState(false);
	const [idSelectedShipping, setIdSelectedShipping] = useState("");
	const {setNumberStep} = useOutletContext();

	const shippingAddresses = useSelector(AUTH_SELECTORS.selectShippingAdresses);

	const [
		addShippingAddress,
		{
			isError: isErrorAdd,
			isSuccess: isSuccessAdd,
			data: dataAdd,
			error: errorAdd,
			isLoading: isLoadingAdd,
		},
	] = useAddShippingAddressMutation();
	const [
		changeSelectedShippingAddress,
		{
			isError: isErrorChange,
			isSuccess: isSuccessChange,
			data: dataChange,
			error: errorChange,
			isLoading: isLoadingChange,
		},
	] = useChangeSelectedShippingAddressMutation();

	const {
		form: shippingAddress,
		address,
		city,
		postalCode,
		country,
		handleChange,
		setForm,
	} = useForm(SHIPPING_ADDRESS_DEFAULT);

	const handleSubmitAddShippingAddress = async (e, shippingAddress) => {
		e.preventDefault();
		const token = JSON.parse(localStorage.getItem("token") ?? '""');
		try {
			const shippingAddresses = await addShippingAddress({
				token,
				shippingAddress,
			}).unwrap();
			dispatch(AUTH_ACTIONS.addShippingAddressSuccess(shippingAddresses.body));
			setForm(SHIPPING_ADDRESS_DEFAULT);
		} catch (err) {
			const message = err?.data?.message || err?.error || err.message;
			if (err.status === 401 || err.status === 403) {
				dispatch(AUTH_ACTIONS.logout(message));
			} else {
				dispatch(ERROR_ACTIONS.saveMessage(message));
			}
		}
	};

	//El tiempo del debounce es que ejeuctara la funcion que envuelve despues de 500ms desde su ultimo llamado
	const handleChangeSelectedShippingAddress = debounce(
		async (e, idSelectedShipping) => {
			e.preventDefault();
			const token = JSON.parse(localStorage.getItem("token"));
			try {
				const shippingAddresses = await changeSelectedShippingAddress({
					token,
					idSelectedShippingAddress: idSelectedShipping,
				}).unwrap();
				dispatch(
					AUTH_ACTIONS.changeSelectedShippingAddressSuccess(
						shippingAddresses.body
					)
				);
			} catch (err) {
				const message = err?.data?.message || err?.error || err.message;
				if (err.status === 401 || err.status === 403) {
					dispatch(AUTH_ACTIONS.logout(message));
				} else {
					dispatch(ERROR_ACTIONS.saveMessage(message));
				}
			}
		},
		500
	);

	const handleContinuePage = async () => {
		setNumberStep(2);
		navigate("/checkout/payment");
	};

	// Asignar el shippingAddress con estado true al cart y cada vez que cargamos la página asignar el id del shipping seleccionado en DB
	useEffect(() => {
		if (!shippingAddresses.length) return;

		let selectedShippingAddress = shippingAddresses.find(
			(shipping) => shipping.isSelected
		);
		if (selectedShippingAddress) {
			setIdSelectedShipping(selectedShippingAddress.id);
			//Aqui de pasada seleccionamos el shipping address para el cart
			dispatch(CART_ACTIONS.saveShippingAddress(selectedShippingAddress));
		}
		//eslint-disable-next-line
	}, [shippingAddresses]);

	return (
		<>
			{isErrorChange && (
				<Message variant="danger">
					{errorChange?.data?.message || errorChange?.error}
				</Message>
			)}
			{isSuccessChange && (
				<Message variant="success">{dataChange?.message}</Message>
			)}
			<h1>Shipping Addresses</h1>
			{
				//ESto para que no me muestre momentaneamente el "No tienes direcciones...", tenemos que esperar que cargue la petición para mostgrar ese mensjae
				!shippingAddresses.length ? (
					<Card.Title>No tienes direcciones de envío registradas</Card.Title>
				) : (
					<div key={`default-radio`} className="mb-5">
						{isLoadingChange ? (
							<Loader />
						) : (
							<>
								{shippingAddresses.map((shipping) => (
									<Form.Check // prettier-ignore
										type={"radio"}
										key={shipping.id}
										id={shipping.id}
										value={shipping.id}
										label={shipping.address}
										checked={idSelectedShipping === shipping.id}
										onChange={(e) => setIdSelectedShipping(shipping.id)}
									/>
								))}
							</>
						)}
						<Button
							variant="success mt-3"
							onClick={(e) =>
								handleChangeSelectedShippingAddress(e, idSelectedShipping)
							}
						>
							Seleccionar
						</Button>
					</div>
				)
			}

			<div className="d-flex justify-content-center">
				<Button variant="link" onClick={() => setIsFormShipping(true)}>
					Agregar Nueva Dirección
				</Button>
				<Button variant="link" onClick={() => setIsFormShipping(false)}>
					Cerrar
				</Button>
			</div>
			{isFormShipping && (
				<>
					{isErrorAdd && (
						<Message variant="danger">
							{errorAdd?.data?.message || errorAdd?.error}
						</Message>
					)}
					{isSuccessAdd && (
						<Message variant="success">{dataAdd?.message}</Message>
					)}
					<Form
						onSubmit={(e) => handleSubmitAddShippingAddress(e, shippingAddress)}
						className="mb-5"
					>
						<Form.Group controlId="address" className="mb-3">
							<Form.Label>Address</Form.Label>
							<Form.Control
								type="text"
								name="address"
								placeholder="Enter address"
								value={address}
								onChange={handleChange}
							></Form.Control>
						</Form.Group>

						<Form.Group controlId="city" className="mb-3">
							<Form.Label>City</Form.Label>
							<Form.Control
								type="text"
								name="city"
								placeholder="Enter city"
								value={city}
								onChange={handleChange}
							></Form.Control>
						</Form.Group>

						<Form.Group controlId="postalCode" className="mb-3">
							<Form.Label>Postal Code</Form.Label>
							<Form.Control
								type="text"
								name="postalCode"
								placeholder="Enter Postal Code"
								value={postalCode}
								onChange={handleChange}
							></Form.Control>
						</Form.Group>

						<Form.Group controlId="country" className="mb-3">
							<Form.Label>Country</Form.Label>
							<Form.Control
								type="text"
								name="country"
								placeholder="Enter Country"
								value={country}
								onChange={handleChange}
							></Form.Control>
						</Form.Group>
						{isLoadingAdd ? (
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
								Add Shipping Address
							</Button>
						)}
					</Form>
				</>
			)}
			<div className="d-flex justify-content-center mt-3">
				<Button
					type="button"
					variant="success"
					disabled={!shippingAddresses.length || !idSelectedShipping}
					onClick={handleContinuePage}
				>
					Continue
				</Button>
			</div>
		</>
	);
}

export default memo(Shipping);
