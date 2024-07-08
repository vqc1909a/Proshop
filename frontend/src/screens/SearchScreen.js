import {Row, Col} from "react-bootstrap";
import Product from "components/pages/home/Product";
import Message from "components/Message";
// import Loader from 'components/Loader';
import ProductLoader from "components/pages/home/ProductLoader";
import {useGetProductBySearchQuery} from "apis/productsApi";
import {useLocation, useParams} from "react-router-dom";
import Paginate from "components/Paginate";
import Meta from "components/Meta";

function SearchScreen() {
	const {keyword} = useParams();
	const location = useLocation();
	const useQuery = () => new URLSearchParams(location.search);

	let query = useQuery();
	let page = Number(query.get("page")) || 1;

	const {data, isError, isLoading, error} = useGetProductBySearchQuery({
		keyword,
		page,
	});
	let products = data?.body?.products || [];
	let totalPages = data?.body?.totalPages || 0;
	let pageNow = data?.body?.page || 1;

	return (
		<>
			<Meta title={`Resultados Búsqueda: {keyword}`}></Meta>
			<h1>Resultados Búsqueda: {keyword}</h1>
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
						pathname={`/search/${keyword}`}
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

export default SearchScreen;
