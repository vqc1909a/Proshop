import * as AUTH_SELECTORS from "redux/selectors/authSelector";
import {useSelector} from "react-redux";
import {Navigate, Outlet, useLocation} from "react-router-dom";

const ProtectedRoutePrivate = ({children, redirectPath = "/"})  => {
    const {pathname, search} = useLocation();
    const lastPath = pathname + search;
 
    const isLogged = useSelector(AUTH_SELECTORS.selectIsLogged);
    //Outlet es el ejemplo de lo que tenemos en el mapeo de rutas
    if (isLogged){
        return children ? children : <Outlet />; 
    }
    localStorage.setItem("lastPath", lastPath);
    return <Navigate to={redirectPath} replace={true}></Navigate>
};

export default ProtectedRoutePrivate ;
