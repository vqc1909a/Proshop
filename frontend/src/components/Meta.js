import { Helmet } from "react-helmet"
const Meta = ({title, description, keywords}) => {
  return (
    <Helmet>
        <title>{title} | Proshop</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
    </Helmet>
  )
}

Meta.defaultProps = {
    title: "Welcome to Proshop | Proshop",
    description: "We sell the best products for cheap",
    keywords: "electronics, buy electronics, cheap electronics"
}

export default Meta