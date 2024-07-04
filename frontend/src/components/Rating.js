import React from "react";
import PropTypes from "prop-types";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useGetReviewsQuery } from "apis/productsApi";

function Rating({productId, color = "#f8e825"}) {
	const {
		data: dataReviews,
		// isError: isErrorReviews,
		// isLoading: isLoadingReviews,
		// error: errorReviews,
	} = useGetReviewsQuery({productId: productId});

	const rating = dataReviews?.body?.rating || 0;
	const countReviews = dataReviews?.body?.countReviews || 0;
	
	return (
		<div className="rating">
			<OverlayTrigger
				key={"top"}
				placement={"top"}
				overlay={
					<Tooltip id={`tooltip-top`}>
						<strong>{rating}</strong>
					</Tooltip>
				}
			>
				<div>
					<span>
						<i
							style={{color}}
							className={
								rating >= 1
									? "fas fa-star"
									: rating >= 0.5
									? "fas fa-star-half-alt"
									: "far fa-star"
							}
						></i>
					</span>
					<span>
						<i
							style={{color}}
							className={
								rating >= 2
									? "fas fa-star"
									: rating >= 1.5
									? "fas fa-star-half-alt"
									: "far fa-star"
							}
						></i>
					</span>
					<span>
						<i
							style={{color}}
							className={
								rating >= 3
									? "fas fa-star"
									: rating >= 2.5
									? "fas fa-star-half-alt"
									: "far fa-star"
							}
						></i>
					</span>
					<span>
						<i
							style={{color}}
							className={
								rating >= 4
									? "fas fa-star"
									: rating >= 3.5
									? "fas fa-star-half-alt"
									: "far fa-star"
							}
						></i>
					</span>
					<span>
						<i
							style={{color}}
							className={
								rating >= 5
									? "fas fa-star"
									: rating >= 4.5
									? "fas fa-star-half-alt"
									: "far fa-star"
							}
						></i>
					</span>
				</div>
			</OverlayTrigger>
			<div>{countReviews && `${countReviews} reviews`}</div>
		</div>
	);
}

Rating.propTypes = {
		productId: PropTypes.string.isRequired,
		color: PropTypes.string
}


export default Rating;
