
import { Pagination } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Paginate = ({pathname = "/", totalPages, page}) => {
  const navigate = useNavigate();

  const handlePaginateProducts = (page) => {
    navigate(`${pathname}?page=${page}`)
  }

  return (
    <Pagination>
      {
        [...Array(totalPages).keys()].map(number => (
          <Pagination.Item key={number+1} active={(number + 1) === page} onClick={() => handlePaginateProducts(number + 1)}>
            {number + 1}
          </Pagination.Item>
        ))        
      }
    </Pagination>
  )
}

export default Paginate