import React from 'react'
import PropTypes from 'prop-types';
import { Rating } from './Rating';
import { DateTime } from 'luxon';

export const RatingUser = ({rating, date}) => {
	return (
		<div className="rating">
			<Rating rating={rating} />
			<small className="text-muted">
				{DateTime.fromISO(date)
					.setLocale(navigator.language || "en") // Fallback to 'en' if navigator.language is not available
					.toLocal()
					.toFormat("dd/MM/yyyy")}
			</small>
		</div>
	);
};

RatingUser.propTypes = {
  rating: PropTypes.number.isRequired,
	date: PropTypes.string.isRequired,
};
