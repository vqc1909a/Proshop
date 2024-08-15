import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom"

const SearchBox = () => { 
  const navigate = useNavigate();
  const { keyword: urlKeyword} = useLocation();

  const [keyword, setKeyword] = useState(urlKeyword || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/search/${keyword.trim()}`);
  }

  return (
    <Form onSubmit={handleSubmit} className="d-flex my-2">
        <Form.Control
            type="text"
            name="keyword"
            onChange={(e) => setKeyword(e.target.value)}
            value={keyword}
            placeholder="Search Products..."
        >
        </Form.Control>
        <Button type="submit" variant="outline-success" className="p-2 ms-2 me-lg-2">Search</Button>
    </Form>
  )
}

export default SearchBox