import {Col, ListGroup, Row} from "react-bootstrap";
import {useGetReviewsQuery} from "apis/productsApi";
import Loader from "components/Loader";
import Message from "components/Message";
import Rating from "components/Rating";
import FormReview from "./FormReview";

const Reviews = ({selectedProduct, refetchProduct}) => {
	const {
		data: dataReviews,
		isError: isErrorReviews,
		isLoading: isLoadingReviews,
		error: errorReviews,
	} = useGetReviewsQuery({productId: selectedProduct.id});
	const reviews = dataReviews?.body || [];

	return (
		<Row className="review">
			<Col md={6}>
				<h2>Reviews</h2>
				{isLoadingReviews ? (
					<Loader></Loader>
				) : isErrorReviews ? (
					<Message variant="danger">
						{errorReviews?.data?.message || errorReviews.error}
					</Message>
				) : !reviews.length ? (
					<Message>No Reviews</Message>
				) : (
					<ListGroup variant="flush">
						{reviews.map((review) => (
							<ListGroup.Item
								key={review.id}
								style={{paddingLeft: 0, paddingRight: 0}}
							>
								<strong>{review.userId.name}</strong>
								<Rating rating={review.rating}></Rating>
								<p>{review.createdAt.substring(0, 10)}</p>
								<p>{review.comment}</p>
							</ListGroup.Item>
						))}
					</ListGroup>
				)}
				<FormReview
					selectedProduct={selectedProduct}
					refetchProduct={refetchProduct}
				></FormReview>
			</Col>
		</Row>
	);
};

export default Reviews;
