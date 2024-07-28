import Loader from "components/Loader";
import Message from "components/Message";
import ModalCreateProduct from "components/pages/admin/ModalCreateProduct";
import ModalEditImageProduct from "components/pages/admin/ModalEditImageProduct";
import ModalEditProduct from "components/pages/admin/ModalEditProduct";
import {useState} from "react";
import Swal from "sweetalert2";
import {
	Button,
	Col,
	Image,
	OverlayTrigger,
	Row,
	Table,
	Tooltip,
} from "react-bootstrap";
import {Link, useLocation} from "react-router-dom";
import {
	useDeleteProductMutation,
	useGetProductsAdminQuery,
} from "apis/productsApi";
import {useDispatch, useSelector} from "react-redux";

//Selectors
import * as AUTH_SELECTORS from "redux/selectors/authSelector";

//Actions
import * as ERROR_ACTIONS from "redux/slices/errorSlice";
import * as AUTH_ACTIONS from "redux/slices/authSlice";
import Paginate from "components/Paginate";
import Meta from "components/Meta";

function ProductAdminScreen() {
	const dispatch = useDispatch();
	const location = useLocation();
	const useQuery = () => new URLSearchParams(location.search);
	let query = useQuery();
	let page = Number(query.get("page")) || 1;

	const token = JSON.parse(localStorage.getItem("token") || '""');
	const {isError, isLoading, data, error /* refetch */} = useGetProductsAdminQuery({token, page});
	let products = data?.body?.products || [];
	let totalPages = data?.body?.totalPages || 0;
	let pageNow = data?.body?.page || 1;

	//Solo para peticiones get que necesiten de un token para autenticación
	if (error?.status === 401 || error?.status === 403) {
		dispatch(AUTH_ACTIONS.logout(error?.data?.message || error?.error));
	}

	const [modalCreateProduct, setModalCreateProduct] = useState(false);
	const [modalEditProduct, setModalEditProduct] = useState(false);
	const [modalEditImageProduct, setModalEditImageProduct] = useState(false);
	const [productIdSelected, setIdProductSelected] = useState("");
	const [deleteProduct] = useDeleteProductMutation();

	const isSuperAdmin = useSelector(AUTH_SELECTORS.selectIsSuperAdmin);

	const TooltipButton = ({id, children, title}) => (
		<OverlayTrigger overlay={<Tooltip id={id}>{title}</Tooltip>}>
			{children}
		</OverlayTrigger>
	);

	const handleAddProduct = () => {
		setModalCreateProduct(true);
	};
	const handleDeleteProduct = (productId) => {
		Swal.fire({
			title:
				"Estás seguro de eliminar este producto y los comentarios recibidos?",
			text: "No podras revertir esta acción!",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Si, eliminar!",
		}).then(async (result) => {
			if (result.isConfirmed) {
				const token = JSON.parse(localStorage.getItem("token") ?? '""');
				try {
					const data = await deleteProduct({token, productId}).unwrap();
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

	const handleEditProduct = (productId) => {
		setIdProductSelected(productId);
		setModalEditProduct(true);
	};

	const handleEditImageProduct = (productId) => {
		setIdProductSelected(productId);
		setModalEditImageProduct(true);
	};
	return (
		<>
			{/* Cuando llamas a estos componentes ya esta llamando todo lo que esta dentro de ello incluyendo el useEffect, el tema de montaje o desmontaje es cuando desaparrece el dom pero aqui el show y el onHide simplemente lo oculta, no desaparece el DOM. Esto ya es parte del modal de react-bootstrap */}
			<ModalCreateProduct
				show={modalCreateProduct}
				onHide={() => setModalCreateProduct(false)}
			/>
			<ModalEditProduct
				show={modalEditProduct}
				onHide={() => setModalEditProduct(false)}
				productIdSelected={productIdSelected}
			/>
			<ModalEditImageProduct
				show={modalEditImageProduct}
				onHide={() => setModalEditImageProduct(false)}
				productIdSelected={productIdSelected}
			/>
			<Row className="align-items-center">
				<Col>
					<h1>{isSuperAdmin ? "All Products" : "My Products"}</h1>
				</Col>
				<Col className="text-end">
					<Button className="btn-sm m-3" onClick={handleAddProduct}>
						<i className="fas fa-plus"></i> Create Product
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
			) : products.length ? (
				<>
					<Meta title={`Productos Admin`}></Meta>
					<Table striped hover responsive className="table-sm">
						<thead>
							<tr>
								<th>ID</th>
								<th>NAME</th>
								<th>IMAGE</th>
								<th>PRICE</th>
								<th>CATEGORY</th>
								<th>BRAND</th>
								{isSuperAdmin && <th>OWNER</th>}
								<th>ACTIONS</th>
							</tr>
						</thead>
						<tbody>
							{products.map((product) => (
								<tr key={product.id}>
									<td>
										<Link
											to={`/products/${product.slug}`}
											target="_blank"
											// Always apply “noopener noreferrer” to any links that lead to websites you don't own or control
											// rel="noopener noreferrer"
										>
											{product.id}
										</Link>
									</td>
									<td>{product.name}</td>
									<td>
										<Image src={product.image} height={"100"}></Image>
									</td>
									<td>{product.price}</td>
									<td>{product.category}</td>
									<td>{product.brand}</td>
									{isSuperAdmin && <td>{product.userId.name}</td>}
									<td>
										<div className="d-flex justify-content-between">
											<TooltipButton title="Editar Producto" id="t-1">
												<Button
													variant="info"
													className="btn-sm"
													onClick={() => handleEditProduct(product.id)}
												>
													<i className="fas fa-pencil"></i>
												</Button>
											</TooltipButton>
											<TooltipButton title="Editar Imagen" id="t-2">
												<Button
													variant="success"
													className="btn-sm"
													onClick={() => handleEditImageProduct(product.id)}
												>
													<i className="fas fa-image"></i>
												</Button>
											</TooltipButton>
											<TooltipButton title="Eliminar Producto" id="t-2">
												<Button
													variant="danger"
													className="btn-sm"
													onClick={() => handleDeleteProduct(product.id)}
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
					<Paginate
						pathname="/admin/products"
						totalPages={totalPages}
						page={pageNow}
					></Paginate>
				</>
			) : (
				<h3>No Products</h3>
			)}
		</>
	);
}

export default ProductAdminScreen;
