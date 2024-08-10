import {Col, ListGroup, Row} from "react-bootstrap";
import {useGetReviewsByProductQuery} from "apis/productsApi";
import Loader from "components/Loader";
import Message from "components/Message";
import FormReview from "./FormReview";
import {RatingUser} from "components/RatingUser";

const Reviews = ({productId, refetchProduct}) => {
	const {
		data: dataReviews,
		isError: isErrorReviews,
		isLoading: isLoadingReviews,
		error: errorReviews,
	} = useGetReviewsByProductQuery({productId});
	const reviews = dataReviews?.body?.reviews || [];
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
								<RatingUser rating={review.rating} date={review.createdAt} />
								<p>{review.comment}</p>
							</ListGroup.Item>
						))}
					</ListGroup>
				)}
				<FormReview
					productId={productId}
					refetchProduct={refetchProduct}
				></FormReview>
			</Col>
		</Row>
	);
};

export default Reviews;
