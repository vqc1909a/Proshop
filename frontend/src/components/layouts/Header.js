import React, {useState} from "react";
import {
	Navbar,
	Nav,
	Container,
	Toast,
	NavDropdown,
	Badge,
} from "react-bootstrap";
import {useSelector, useDispatch} from "react-redux";
import {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {LinkContainer} from "react-router-bootstrap";
import SearchBox from "components/SearchBox";
import logo from "assets/logo.png";

//Selectors
import * as AUTH_SELECTORS from "redux/selectors/authSelector";
import * as CART_SELECTORS from "redux/selectors/cartSelector";
import * as ERROR_SELECTORS from "redux/selectors/errorSelector";

//Acciones
import * as AUTH_ACTIONS from "redux/slices/authSlice";
// import * as ERROR_ACTIONS from "redux/slices/errorSlice";

//SERVICES
import {useGetProfileMutation} from "apis/profileApi";

function Header() {
	let navigate = useNavigate();
	let dispatch = useDispatch();

	//SELECTORS
	const message = useSelector(ERROR_SELECTORS.selectMessage);
	const isLogged = useSelector(AUTH_SELECTORS.selectIsLogged);
	const userInfo = useSelector(AUTH_SELECTORS.selectUserInfo);
	const qtyItems = useSelector(CART_SELECTORS.selectQtyItems);
	const isAdmin = Boolean(JSON.parse(localStorage.getItem("isAdmin") ?? "false"))
	const [showToastError, setShowToastError] = useState(false);
	const [showToastIsLogged, setShowToastIsLogged] = useState(false);

	const [getProfile, {isLoading /* error */}] = useGetProfileMutation();

	const handleLogout = () => {
		dispatch(AUTH_ACTIONS.logout("Te acabas de desloguear"));
		navigate("/");
	};

	useEffect(() => {
		if (!isLogged) return;
		//Si hay token entonces convierteme isLogged a true según el slice de auth
		const token = JSON.parse(localStorage.getItem("token"));
		const getLoggedUser = async (token) => {
			try {
				//Con el unwrap(), obtengo defrente la respuesta  sin la necesidad de respuesta del hook y si hay algun error el error sera el catch "err" y es lo mismo de arriba
				const userInfo = await getProfile(token).unwrap();
				//Establecemos si el usuario es admin o no, xq con el useEffect no lo vamos a poder obtener a tiempo el valor de userInfo en los hocs
				localStorage.setItem("isAdmin", userInfo.body.isAdmin);
				dispatch(AUTH_ACTIONS.getProfileSuccess(userInfo.body));
			} catch (err) {
				//El formato de error es lo mismo que RTK Query
				dispatch(AUTH_ACTIONS.logout(err?.data?.message || err?.error || err.message));
			}
		};
		getLoggedUser(token);
		// eslint-disable-next-line
	}, [isLogged]);

	useEffect(() => {
		if (isLogged) {
			setShowToastIsLogged(true);
		} else {
			setShowToastIsLogged(false);
		}
	}, [isLogged]);

	useEffect(() => {
		if (message) {
			setShowToastError(true);
		} else {
			setShowToastError(false);
		}
	}, [message]);

	return (
		<header style={{position: "relative"}}>
			{/* Mostrar errores de cualquier slice que queramos mostrarlo de forma global */}
			<Toast
				show={showToastError}
				onClose={() => {
					setShowToastError(false);
				}}
				position={"top-center"}
				bg={"danger"}
				delay={3000}
				autohide
				className="m-3"
				style={{
					position: "absolute",
					zIndex: 1,
					bottom: 0,
					left: "50%",
					transform: "translate(-50%, 100%)",
				}}
			>
				<Toast.Body className={"text-white"}>{message}</Toast.Body>
			</Toast>

			{/* Para que me diga que estoy logueado */}
			<Toast
				show={showToastIsLogged}
				onClose={() => {
					setShowToastIsLogged(false);
				}}
				position={"top-center"}
				bg={"success"}
				delay={3000}
				autohide
				className="m-3"
				style={{
					position: "absolute",
					zIndex: 1,
					bottom: 0,
					left: "50%",
					transform: "translate(-50%, 100%)",
				}}
			>
				<Toast.Body className={"text-white"}>
					Bienvenido {userInfo.name}!
				</Toast.Body>
			</Toast>

			<Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
				<Container>
					<LinkContainer to="/">
						<Navbar.Brand>
							<img src={logo} alt="ProShop" />
							ProShop
						</Navbar.Brand>
					</LinkContainer>
					<Navbar.Toggle aria-controls="navbarScroll" />
					<Navbar.Collapse id="navbarScroll">
						<Nav
							className="ms-auto d-flex align-items-center"
							navbarScroll
						>
							<SearchBox></SearchBox>
							<LinkContainer to="/cart">
								<Nav.Link>
									<i className="fas fa-shopping-cart"></i> Cart
									{qtyItems > 0 && (
										<Badge pill bg="success" style={{marginLeft: ".5rem"}}>
											{qtyItems}
										</Badge>
									)}
								</Nav.Link>
							</LinkContainer>
							{isLogged ? (
								<NavDropdown
									title={isLoading ? "Cargando..." : `${userInfo.name}`}
									id="username"
								>
									<NavDropdown.Item
										onClick={() => navigate("/account/profile")}
									>
										Profile
									</NavDropdown.Item>
									<NavDropdown.Item onClick={handleLogout}>
										Logout
									</NavDropdown.Item>
									{isLogged && isAdmin && (
										<>
											<NavDropdown.Divider />
											<NavDropdown.Item title="Admin" id="admin">
												<LinkContainer to="/admin/orders">
													<NavDropdown.Item>Orders</NavDropdown.Item>
												</LinkContainer>
												<LinkContainer to="/admin/products">
													<NavDropdown.Item>Products</NavDropdown.Item>
												</LinkContainer>
												<LinkContainer to="/admin/users">
													<NavDropdown.Item>Users</NavDropdown.Item>
												</LinkContainer>
											</NavDropdown.Item>
										</>
									)}
								</NavDropdown>
							) : (
								<LinkContainer to="/auth/login">
									<Nav.Link>
										<i className="fas fa-user"></i> Sign In
									</Nav.Link>
								</LinkContainer>
							)}
						</Nav>
					</Navbar.Collapse>
				</Container>
			</Navbar>
		</header>
	);
}

export default Header;
