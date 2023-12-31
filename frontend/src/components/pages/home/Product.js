import {Card} from "react-bootstrap";
import Rating from "components/Rating";
import {useNavigate} from "react-router-dom";
import PropTypes from "prop-types";


//Helpers
// import * as HELPERS from "utils/helpers"

function Product({product}) {
  let navigate = useNavigate();
    
  const {/* id: idProduct, */ slug, image, name, rating, numReviews, priceIVA} = product; 
 
  // let imgBase64 = HELPERS.ImageToBase64Converter2(image);

  return (
    <Card className="my-3 p-3 rounded">
        <div style={{cursor: "pointer"}} onClick={() =>  navigate(`/products/${slug}`)}>
            {/* <Card.Img src={image} variant="top" loading="lazy"></Card.Img> */}
            {/* Mucho mejor loa opcion de base64 para varias imagenes que se muestran en una misma pantalla para optimizar la carga*/}
            <Card.Img src={image} variant="top" loading="lazy" height={180}></Card.Img>
        </div>

        <Card.Body>
            <div style={{ cursor: "pointer", textDecoration: "underline", height: "50px"}} onClick={() =>  navigate(`/products/${slug}`)}>
                <Card.Title as="div">
                    <strong>{name}</strong>
                </Card.Title>
            </div>
            <Card.Text as="div">
                <Rating rating={rating} numReviews={`${numReviews}`}></Rating>
            </Card.Text>

            <Card.Text as="h3">${priceIVA}</Card.Text>
        </Card.Body>
    </Card>
  )
}

Product.propTypes = {
    product: PropTypes.object.isRequired,
}
export default Product