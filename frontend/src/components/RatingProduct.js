import React from "react";
import PropTypes from "prop-types";
import {useGetReviewsByProductQuery} from "apis/productsApi";
import Loader from "./Loader";
import Message from "./Message";
import {Rating} from "./Rating";

function RatingProduct({productId}) {
	const {
		data: dataReviews,
		isError: isErrorReviews,
		isLoading: isLoadingReviews,
		error: errorReviews,
	} = useGetReviewsByProductQuery({productId: productId});

	const rating = dataReviews?.body?.rating || 0;
	const countReviews = dataReviews?.body?.countReviews || 0;

	return (
		<div className="rating">
			{isLoadingReviews ? (
				<Loader></Loader>
			) : isErrorReviews ? (
				<Message variant="danger">
					{errorReviews?.data?.message || errorReviews.error}
				</Message>
			) : (
				<>
					<Rating rating={rating} />
					<div>{`${countReviews} reviews`}</div>
				</>
			)}
		</div>
	);
}

RatingProduct.propTypes = {
	productId: PropTypes.string.isRequired,
	color: PropTypes.string,
};

export default RatingProduct;
