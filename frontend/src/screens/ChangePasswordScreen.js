import React from "react";
import {useNavigate} from "react-router-dom";
import {Form, Button, Spinner} from "react-bootstrap";
import {useDispatch} from "react-redux";
import Message from "components/Message";

//Actions
import * as AUTH_ACTIONS from "../redux/slices/authSlice";
import * as ERROR_ACTIONS from "redux/slices/errorSlice";

//Services
import {useUpdatePasswordMutation} from "apis/profileApi";

import useForm from "../utils/hooks/useForm";
import FormContainer from "components/hocs/FormContainer";
import Meta from "components/Meta";

const PASSWORD_DEFAULT = {
	current_password: "",
	new_password: "",
	confirm_new_password: "",
};
function ChangePasswordScreen() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [updatePassword, {isError, isSuccess, isLoading, data, error}] =
		useUpdatePasswordMutation();

	const {
		current_password,
		new_password,
		confirm_new_password,
		form: passwords,
		setForm,
		handleChange,
	} = useForm(PASSWORD_DEFAULT);

	const submitUpdatePassword = async ({
		event,
		passwords,
	}) => {
		event.preventDefault();
		try {
			const token = JSON.parse(localStorage.getItem("token"));
			//unwrap es para obtener la respuesta directamente o en caso de error err tome el valor de error
			await updatePassword({token, passwords}).unwrap();
			setForm(PASSWORD_DEFAULT);
		} catch (err) {
			const message = err?.data?.message || err?.error || err.message;
			if (err.status === 401 || err.status === 403) {
				dispatch(AUTH_ACTIONS.logout(message));
			} else {
				dispatch(ERROR_ACTIONS.saveMessage(message));
			}
		}
	};

	const handleButtonGoBack = () => {
		navigate("/account/profile");
	};

	return (
		<>
			<Meta title={`Cambia tu password`}></Meta>
			<FormContainer>
				<h1>Change Password</h1>
				{isError && (
					<Message variant="danger">
						{error?.data?.message || error?.error}
					</Message>
				)}
				{isSuccess && <Message variant="success">{data?.message}</Message>}
				<Form
					onSubmit={(event) =>
						submitUpdatePassword({
							event,
							passwords,
						})
					}
				>
					<Form.Group controlId="current_password" className="mb-3">
						<Form.Label>Current Password</Form.Label>
						<Form.Control
							type="password"
							name="current_password"
							placeholder="Enter current password"
							value={current_password}
							onChange={handleChange}
						></Form.Control>
					</Form.Group>

					<Form.Group controlId="new_password" className="mb-3">
						<Form.Label>New Password</Form.Label>
						<Form.Control
							type="password"
							name="new_password"
							placeholder="Enter new password"
							value={new_password}
							onChange={handleChange}
						></Form.Control>
					</Form.Group>

					<Form.Group controlId="confirm_new_password" className="mb-3">
						<Form.Label>Confirm New Password</Form.Label>
						<Form.Control
							type="password"
							name="confirm_new_password"
							placeholder="Confirm new password"
							value={confirm_new_password}
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
							Update Password
						</Button>
					)}
					<Button
						variant="link"
						className="ms-3"
						onClick={() => handleButtonGoBack()}
					>
						Go Back
					</Button>
				</Form>
			</FormContainer>
		</>
	);
}

export default ChangePasswordScreen;
