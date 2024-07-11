import * as AUTH_SELECTORS from "redux/selectors/authSelector";
import {useSelector} from "react-redux";
import {Navigate, Outlet, useLocation} from "react-router-dom";

const ProtectedRouteAdmin = ({children, redirectPath = "/"})  => {
    const {pathname, search} = useLocation();
    const lastPath = pathname + search;

    const isLogged = useSelector(AUTH_SELECTORS.selectIsLogged);
    const isAdmin = useSelector(AUTH_SELECTORS.selectIsAdmin);
    
    console.log({
        lastPath,
        isLogged,
        isAdmin
    })
    if(isLogged && isAdmin){
        return children ? children : <Outlet />; 
    }
    localStorage.setItem("lastPath", lastPath);
    return <Navigate to={redirectPath} replace={true}></Navigate>
};

export default ProtectedRouteAdmin ;
