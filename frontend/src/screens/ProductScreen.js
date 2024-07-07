import {Link, useParams} from "react-router-dom";
import {Row} from "react-bootstrap";
import Message from "components/Message";
import Loader from "components/Loader";
import {useGetProductBySlugQuery} from "apis/productsApi";
import Reviews from "components/pages/product/Reviews";
import Meta from "components/Meta";
import { DetailsProduct } from "components/pages/product/DetailsProduct";
import { PurchaseProduct } from "components/pages/product/PurchaseProduct";


function ProductScreen() {
	let {slug} = useParams();

	const {data, isError, isLoading, error, refetch} =
		useGetProductBySlugQuery(slug);
	let selectedProduct = data?.body || {};

	const {
		id: productId,
	} = selectedProduct;

	return (
		<>
			{isLoading ? (
				<Loader></Loader>
			) : isError ? (
				<>
					<Meta title={error?.data?.message || error?.error}></Meta>
					<Message variant="danger">
						{error?.data?.message || error?.error}
					</Message>
				</>
			) : (
				<>
					<Meta
						title={selectedProduct.name}
						description={selectedProduct.description}
						keywords={`${selectedProduct.name}, ${selectedProduct.brand}, ${selectedProduct.category}`}
					></Meta>
					<Link className="btn btn-light my-3" to="/">
						Go Back
					</Link>
					<Row className="mb-3">
						<DetailsProduct selectedProduct={selectedProduct} />
						<PurchaseProduct selectedProduct={selectedProduct}  />
					</Row>
					<Reviews productId={productId} refetchProduct={refetch}></Reviews>
				</>
			)}
		</>
	);
}

export default ProductScreen;
