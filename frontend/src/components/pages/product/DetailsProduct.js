import RatingProduct from 'components/RatingProduct'
import React from 'react'
import { Col, Image, ListGroup } from 'react-bootstrap'
import PropTypes from 'prop-types'

export const DetailsProduct = ({selectedProduct}) => {
  const {
		id: productId,
		image,
		name,
		priceIVA,
		description,
	} = selectedProduct;

	return (
		<>
			<Col md={6}>
				<Image src={image} alt={name} fluid />
			</Col>
			<Col md={3}>
				<ListGroup variant="flush">
					<ListGroup.Item>
						<h3>{name}</h3>
					</ListGroup.Item>
					<ListGroup.Item>
						<RatingProduct productId={productId}></RatingProduct>
					</ListGroup.Item>
					<ListGroup.Item>Price: ${priceIVA}</ListGroup.Item>
					<ListGroup.Item>Description: {description}</ListGroup.Item>
				</ListGroup>
			</Col>
		</>
	);
};

DetailsProduct.propTypes = {
  selectedProduct: PropTypes.object.isRequired,
};

