import Loader from "components/Loader";
import Message from "components/Message";
import {Carousel, Image} from "react-bootstrap";
import {Link} from "react-router-dom";
import {useGetTopProductsQuery} from "apis/productsApi";

const ProductCarousel = () => {
	const {data, isError, isLoading, error} = useGetTopProductsQuery();
	const products = data?.body || [];

	return (
		<>
			{isLoading ? (
				<Loader></Loader>
			) : isError ? (
				<Message variant="danger">
					{error?.data?.message || error?.error}
				</Message>
			) : (
				<Carousel pause="hover" className="bg-primary mb-4">
					{products.map((product) => (
						<Carousel.Item
							key={product.id}
							style={{textAlign: "center", height: "500px"}}
						>
							<Link to={`/products/${product.slug}`}>
								<Image
									src={product.image}
									alt={product.name}
									style={{height: "100%"}}
								></Image>
								<Carousel.Caption>
									<h2>
										{product.name} (${product.price})
									</h2>
								</Carousel.Caption>
							</Link>
						</Carousel.Item>
					))}
				</Carousel>
			)}
		</>
	);
};

export default ProductCarousel;
