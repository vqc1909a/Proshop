import Loader from "components/Loader";
import Message from "components/Message";
import ModalCreateUser from "components/pages/admin/ModalCreateUser";
import ModalEditUser from "components/pages/admin/ModalEditUser";
import {useState} from "react";
import Swal from "sweetalert2";
import {
	Button,
	Col,
	OverlayTrigger,
	Row,
	Table,
	Tooltip,
} from "react-bootstrap";
import {useDeleteUserMutation, useGetUsersQuery} from "apis/usersApi";
import {useDispatch} from "react-redux";
import {nanoid} from "nanoid";

//Actions
import * as ERROR_ACTIONS from "redux/slices/errorSlice";
import * as AUTH_ACTIONS from "redux/slices/authSlice";
import {useLocation} from "react-router-dom";
import Paginate from "components/Paginate";
import Meta from "components/Meta";

function UserAdminScreen() {
	const dispatch = useDispatch();
	const location = useLocation();
	const useQuery = () => new URLSearchParams(location.search);
	let query = useQuery();
	let page = Number(query.get("page")) || 1;

	const token = JSON.parse(localStorage.getItem("token") ?? "''");
	const {isError, isLoading, data, error /* refetch */} = useGetUsersQuery({
		token,
		page,
	});

	//Solo para peticiones get que necesiten de un token para autenticación
	if (error?.status === 401 || error?.status === 403) {
		dispatch(AUTH_ACTIONS.logout(error?.data?.message || error?.error));
	}else{
		dispatch(ERROR_ACTIONS.saveMessage(error?.data?.message || error?.error));
	}

	let users = data?.body.users || [];
	let totalPages = data?.body?.totalPages || 0;
	let pageNow = data?.body?.page || 1;

	const [modalCreateUser, setModalCreateUser] = useState(false);
	const [modalEditUser, setModalEditUser] = useState(false);
	const [userIdSelected, setUserIdSelected] = useState("");
	const [keynewmodal, setkeynewmodal] = useState(nanoid());
	const [deleteUser] = useDeleteUserMutation();

	const TooltipButton = ({id, children, title}) => (
		<OverlayTrigger overlay={<Tooltip id={id}>{title}</Tooltip>}>
			{children}
		</OverlayTrigger>
	);

	const handleAddUser = () => {
		setkeynewmodal(nanoid());
		setModalCreateUser(true);
	};
	const handleDeleteUser = (userId) => {
		Swal.fire({
			title: "Estás seguro de eliminar este usuario?",
			text: "No podras revertir esta acción!",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Si, eliminar!",
		}).then(async (result) => {
			if (result.isConfirmed) {
				const token = JSON.parse(localStorage.getItem("token") ?? "''");
				try {
					const data = await deleteUser({token, userId}).unwrap();
					Swal.fire("Eliminado!", data.message, "success");
				} catch (err) {
					Swal.fire({
						icon: "error",
						title: "Oops...",
						text: err?.data?.message || err?.error || err.message,
					});
					const message = err?.data?.message || err?.error || err.message;
					if (err.status === 401 || err.status === 403) {
						dispatch(AUTH_ACTIONS.logout(message));
					} else {
						dispatch(ERROR_ACTIONS.saveMessage(message));
					}
				}
			}
		});
	};

	const handleEditUser = (userId) => {
		setUserIdSelected(userId);
		setModalEditUser(true);
	};

	return (
		<>
			{/* Cuando llamas a estos componentes ya esta llamando todo lo que esta dentro de ello incluyendo le useEffect, el tema de montaje o desmontaje es cuando desaparrece el dom pero qui el show y el onHide simplemente lo oculta y lo hace desaparecer, no desaparece el DOM. ESto ya esta del modal de react-bootstrap */}
			<ModalCreateUser
				show={modalCreateUser}
				onHide={() => setModalCreateUser(false)}
				keynewmodal={keynewmodal}
			/>
			<ModalEditUser
				show={modalEditUser}
				onHide={() => setModalEditUser(false)}
				userIdSelected={userIdSelected}
			/>
			<Row className="align-items-center">
				<Col>
					<h1>All Users</h1>
				</Col>
				<Col className="text-end">
					<Button className="btn-sm m-3" onClick={handleAddUser}>
						<i className="fas fa-plus"></i> Create User
					</Button>
				</Col>
			</Row>
			{isLoading ? (
				<Loader />
			) : isError ? (
				<>
					<Meta title={error?.data?.message || error?.error}></Meta>
					<Message variant="danger">
						{error?.data?.message || error?.error}
					</Message>
				</>
			) : users.length ? (
				<>
					<Meta title={`Usuarios Admin`}></Meta>
					<Table striped hover responsive className="table-sm">
						<thead>
							<tr>
								<th>ID</th>
								<th>NAME</th>
								<th>EMAIL</th>
								<th>ADMIN</th>
								<th>ACTIONS</th>
							</tr>
						</thead>
						<tbody>
							{users.map((user) => (
								<tr key={user.id}>
									<td>{user.id}</td>
									<td>{user.name}</td>
									<td>
										<a href={`mailto:${user.email}`}>{user.email}</a>
									</td>
									<td>
										<span
											style={{
												display: "flex",
												justifyContent: "center",
												alignItems: "center",
											}}
										>
											<i
												className={`fas fa-${user.isAdmin ? "check" : "times"}`}
												style={{color: `${user.isAdmin ? "green" : "red"}`}}
											></i>
										</span>
									</td>
									<td>
										<div className="d-flex justify-content-around">
											<TooltipButton title="Editar Usuario" id="t-1">
												<Button
													variant="info"
													className="btn-sm"
													onClick={() => handleEditUser(user.id)}
												>
													<i className="fas fa-pencil"></i>
												</Button>
											</TooltipButton>
											<TooltipButton title="Eliminar Usuario" id="t-2">
												<Button
													variant="danger"
													className="btn-sm"
													onClick={() => handleDeleteUser(user.id)}
												>
													<i className="fas fa-trash"></i>
												</Button>
											</TooltipButton>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</Table>
				</>
			) : (
				<h3>No Users</h3>
			)}
			{users.length > 0 && (
				<Paginate
					totalPages={totalPages}
					page={pageNow}
					pathname="/admin/users"
				></Paginate>
			)}
		</>
	);
}

export default UserAdminScreen;
