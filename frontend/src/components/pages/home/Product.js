import {Card, OverlayTrigger, Tooltip} from "react-bootstrap";
import RatingProduct from "components/RatingProduct";
import {Link} from "react-router-dom";
import PropTypes from "prop-types";

//Helpers
// import * as HELPERS from "utils/helpers"

function Product({product}) {

	const {id: productId, slug, image, name, priceIVA} = product;

	// let imgBase64 = HELPERS.ImageToBase64Converter2(image);

	return (
		<Card className="my-3 p-3 rounded">
			<Link to={`/products/${slug}`}>
				{/* <Card.Img src={image} variant="top" loading="lazy"></Card.Img> */}
				<Card.Img
					src={image}
					variant="top"
					loading="lazy"
					height={180}
				></Card.Img>
			</Link>

			<Card.Body>
				<Link
					style={
						{
							// display: "inline-block",
							// height: "50px",
						}
					}
					to={`/products/${slug}`}
				>
					<OverlayTrigger
						key={"top"}
						placement={"top"}
						overlay={
							<Tooltip id={`tooltip-top`}>
								<strong>{name}</strong>
							</Tooltip>
						}
					>
						<Card.Title as="div" className="product-title">
							<strong>{name}</strong>
						</Card.Title>
					</OverlayTrigger>
				</Link>
				<Card.Text as="div" className="my-1">
					<RatingProduct productId={productId}></RatingProduct>
				</Card.Text>
				<Card.Text as="h3">${priceIVA}</Card.Text>
			</Card.Body>
		</Card>
	);
}

Product.propTypes = {
	product: PropTypes.object.isRequired,
};
export default Product;
