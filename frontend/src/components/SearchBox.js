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
    <Form onSubmit={handleSubmit} className="d-flex">
        <Form.Control
            type="text"
            name="keyword"
            onChange={(e) => setKeyword(e.target.value)}
            value={keyword}
            placeholder="Search Products..."
            className="mr-sm-2 ml-sm-5"
        >
        </Form.Control>
        <Button type="submit" variant="outline-success" className="p-2 mx-2">Search</Button>
    </Form>
  )
}

export default SearchBox