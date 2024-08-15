import React from "react";
import {OverlayTrigger, Tooltip} from "react-bootstrap";
import {FaStar, FaStarHalfAlt, FaRegStar} from "react-icons/fa";
import PropTypes from "prop-types";

export const Rating = ({rating, text}) => {
	console.log({
		text
	})
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
			<div className="rating">
				<span>
					{rating >= 1 ? (
						<FaStar />
					) : rating >= 0.5 ? (
						<FaStarHalfAlt />
					) : (
						<FaRegStar />
					)}
				</span>
				<span>
					{rating >= 2 ? (
						<FaStar />
					) : rating >= 1.5 ? (
						<FaStarHalfAlt />
					) : (
						<FaRegStar />
					)}
				</span>
				<span>
					{rating >= 3 ? (
						<FaStar />
					) : rating >= 2.5 ? (
						<FaStarHalfAlt />
					) : (
						<FaRegStar />
					)}
				</span>
				<span>
					{rating >= 4 ? (
						<FaStar />
					) : rating >= 3.5 ? (
						<FaStarHalfAlt />
					) : (
						<FaRegStar />
					)}
				</span>
				<span>
					{rating >= 5 ? (
						<FaStar />
					) : rating >= 4.5 ? (
						<FaStarHalfAlt />
					) : (
						<FaRegStar />
					)}
				</span>
				<span className="rating-text">{text && text}</span>
			</div>
		</OverlayTrigger>
	);
};

Rating.propTypes = {
	rating: PropTypes.number.isRequired,
	text: PropTypes.string,
};
