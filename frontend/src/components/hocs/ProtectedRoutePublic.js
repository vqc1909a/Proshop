import {Navigate, Outlet} from "react-router-dom";

// Outlet cuando aplicamos el renderizado anidado, caso contrario vendría siendo el children normal que envuelve el HOC
const ProtectedRoutePublic = ({children, redirectPath = "/"}) => {
    const token = JSON.parse(localStorage.getItem("token") ?? '""');
    if (token) {
        return <Navigate to={redirectPath} replace={true}></Navigate>;
    }
    //Outlet es el ejemplo de lo que tenemos en el mapeo de rutas
    return children ? children : <Outlet />;
};

export default ProtectedRoutePublic ;
