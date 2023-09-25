import ContentLoader from "react-content-loader"

// Calculas el ancho y el alto y de ahi vas calculando los gráficos, lo unico que vas hacerlo dinamio es el anhco, pero si quieres también puedes optar por la altura
const ProductLoader = (props) => (
  <ContentLoader 
    speed={2}
    width={"100%"}
    height={386}
    viewBox="0 0 100% 386"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    {...props}
  >
    {/* Altura 386
    Anchura 260 */}
    <rect x="0" y="0" rx="3" ry="3" width="100%" height="4" /> 
    <rect x="0" y="382" rx="3" ry="3" width="100%" height="4" />
    <rect x="0" y="0" rx="3" ry="3" width="4" height="386" /> 
    <rect x="calc(100% - 4px)" y="0" rx="3" ry="3" width="4" height="386" /> 

    <rect x="16" y="16" rx="3" ry="3" width="calc(100% - 32px)" height="180" /> 

    <rect x="32" y="212" rx="3" ry="3" width="calc(100% - 64px)" height="48" /> 

    <rect x="32" y="268" rx="3" ry="3" width="calc(100% - 64px)" height="24" /> 

    <rect x="32" y="308" rx="3" ry="3" width="calc(100% - 64px)" height="30" /> 
  </ContentLoader>
)

export default ProductLoader