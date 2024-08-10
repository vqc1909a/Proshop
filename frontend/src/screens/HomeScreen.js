import {Row, Col} from "react-bootstrap";
import Product from "components/pages/home/Product";
import Message from "components/Message";
// import Loader from 'components/Loader';
import ProductLoader from "components/pages/home/ProductLoader";
import {useGetProductsQuery} from "apis/productsApi";
import {useLocation} from "react-router-dom";
import Paginate from "components/Paginate";
import ProductCarousel from "components/pages/home/ProductCarousel";
import Meta from "components/Meta";

function HomeScreen() {
	const location = useLocation();
	const useQuery = () => new URLSearchParams(location.search);

	let query = useQuery();
	let page = Number(query.get("page")) || 1;

	// Format error

	//   {
	//     "status": 401,
	//     "data": {
	//         "status": 401,
	//         "message": "NOT AUTHORIZED",
	//         "stack": "Error: NOT AUTHORIZED\n    at file:///home/rosec/PROGRAMACION/cursos/react/Ecommerce-Brad-Traversy/backend/controllers/productsController.js:11:11\n    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)"
	//     }
	// }

	const {data, isError, isLoading, error} = useGetProductsQuery(page);
	let products = data?.body?.products || [];
	let totalPages = data?.body?.totalPages || 0;
	let pageNow = data?.body?.page || 1;

	return (
		<>
			<Meta></Meta>
			<ProductCarousel />
			<h1>Latest Products</h1>

			{isLoading ? (
				/* <Loader /> */
				<Row>
					{[...Array(4).keys()].map((key) => (
						<Col sm={12} md={6} lg={4} xl={3} key={key}>
							<ProductLoader className="my-3" />
						</Col>
					))}
				</Row>
			) : isError ? (
				<Message variant="danger">
					{error?.data?.message || error?.error}
				</Message>
			) : products.length ? (
				<>
					<Row>
						{products.map((product) => (
							<Col sm={12} md={6} lg={4} xl={3} key={product.id}>
								<Product product={product}></Product>
							</Col>
						))}
					</Row>
					<Paginate
						pathname="/"
						totalPages={totalPages}
						page={pageNow}
					></Paginate>
				</>
			) : (
				<h3>Sin Productos</h3>
			)}
		</>
	);
}

export default HomeScreen;
