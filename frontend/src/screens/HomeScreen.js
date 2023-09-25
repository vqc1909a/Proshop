import {Row, Col} from "react-bootstrap";
import Product from 'components/pages/home/Product';
import Message from 'components/Message';
// import Loader from 'components/Loader';
import ProductLoader from "components/pages/home/ProductLoader";
import { useGetProductsQuery } from 'redux/slices/productsApiSlice';
import {useLocation} from "react-router-dom";
import Paginate from "components/Paginate";
import ProductCarousel from "components/pages/home/ProductCarousel";
import Meta from "components/Meta";



function HomeScreen() {
  const location = useLocation();
  const useQuery = () => new URLSearchParams(location.search);

  let query = useQuery();  
  let page = Number(query.get('page')) || 1;

  // Format error

  //   {
  //     "status": 401,
  //     "data": {
  //         "status": 401,
  //         "message": "NOT AUTHORIZED",
  //         "stack": "Error: NOT AUTHORIZED\n    at file:///home/rosec/PROGRAMACION/cursos/react/Ecommerce-Brad-Traversy/backend/controllers/productsController.js:11:11\n    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)"
  //     }
  // }

  const { data, isError, isLoading, error} = useGetProductsQuery(page);
  let products = data?.body?.products || [];
  let totalPages = data?.body?.totalPages || 0;
  let pageNow = data?.body?.page || 1;

  return (
    <>
        <Meta></Meta>
        <ProductCarousel />          
        <h1>Latest Products</h1>
        <Row>
            {
              isLoading
              ?
              /* <Loader /> */
              [...Array(8).keys()].map(key => (
                <Col sm={12} md={6} lg={4} xl={3} key={key}>
                  <ProductLoader className="my-3" />
                </Col>
              ))
              :
              isError
              ?
              <Message variant="danger">{error?.data?.message || error?.error}</Message>
              :
              products.length
              ?
              <>
                {
                  products.map(product => (
                    <Col sm={12} md={6} lg={4} xl={3} key={product.id}>
                        <Product product={product}></Product>
                    </Col>
                  ))
                }
              </>
              :
              <h3>Sin Productos</h3>
            }
        </Row>
        {
          products.length > 0 && (
            <Paginate pathname="/" totalPages={totalPages} page={pageNow}></Paginate>
          )
        }
    </>
  )
}

export default HomeScreen