import React, {useEffect} from "react";
import {/* Link, */ useNavigate} from "react-router-dom";
import {Form, Button, Spinner} from "react-bootstrap";
import {useDispatch, useSelector} from "react-redux";
import Message from "components/Message";
import useForm from "utils/hooks/useForm";

//Selectors
import * as AUTH_SELECTORS from "redux/selectors/authSelector";

//Actions
import * as AUTH_ACTIONS from "redux/slices/authSlice";
import * as ERROR_ACTIONS from "redux/slices/errorSlice";

//Services
import {useUpdateProfileMutation} from "apis/profileApi";

function PersonalInformation() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	//Mutations
	//EL status de aqui es el estado del request => "fullfilled, reject, etc"
	const [updateProfile, {isError, isLoading, data, error, isSuccess}] =
		useUpdateProfileMutation();

	//Selectors
	let userInfo = useSelector(AUTH_SELECTORS.selectUserInfo);

	const {name, email, form: profile, setForm, handleChange} = useForm(userInfo);

	const handleSubmitUpdateProfile = async (e) => {
		e.preventDefault();
		try {
			const token = JSON.parse(localStorage.getItem("token"));
			const userInfo = await updateProfile({token, profile}).unwrap();
			dispatch(AUTH_ACTIONS.updateProfileSuccess(userInfo.body));
		} catch (err) {
			const message = err?.data?.message || err?.error || err.message;
			if (err.status === 401 || err.status === 403) {
				dispatch(AUTH_ACTIONS.logout(message));
			} else {
				dispatch(ERROR_ACTIONS.saveMessage(message));
			}
		}
	};

	const handleChangePassword = () => {
		navigate("/account/profile/change-password");
	};

	//EStablecer datos del usuario logueado
	useEffect(() => {
		setForm(userInfo);
		//eslint-disable-next-line
	}, [userInfo]);

	return (
		<div>
			<h2>My Personal Information</h2>
			{isError && (
				<Message variant="danger">
					{error?.data?.message || error?.error}
				</Message>
			)}
			{isSuccess && <Message variant="success">{data?.message}</Message>}

			<Form
				onSubmit={handleSubmitUpdateProfile}
				className="mb-5"
			>
				<Form.Group controlId="name" className="mb-3">
					<Form.Label>Name</Form.Label>
					<Form.Control
						type="name"
						name="name"
						placeholder="Enter name"
						value={name}
						onChange={handleChange}
					></Form.Control>
				</Form.Group>

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
						Update
					</Button>
				)}
			</Form>

			<Button
				type="button"
				variant="info"
				onClick={() => handleChangePassword()}
			>
				Change Password
			</Button>
		</div>
	);
}

export default PersonalInformation;
