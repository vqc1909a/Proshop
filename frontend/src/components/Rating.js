import React from "react";
import {OverlayTrigger, Tooltip} from "react-bootstrap";
import PropTypes from "prop-types";

export const Rating = ({rating, color = "#f8e825"}) => {
	
	return (
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
	);
};

Rating.propTypes = {
	rating: PropTypes.number.isRequired,
	color: PropTypes.string,
};
