import * as AUTH_SELECTORS from "redux/selectors/authSelector";
import {useSelector} from "react-redux";
import {Navigate, Outlet, useLocation} from "react-router-dom";
import {useDispatch} from "react-redux";
import * as AUTH_ACTIONS from "redux/slices/authSlice";

const ProtectedRoutePrivate = ({children, redirectPath = "/"})  => {
    let dispatch = useDispatch();
    let location = useLocation();
    const isLogged = useSelector(AUTH_SELECTORS.selectIsLogged);

    //Outlet es el ejemplo de lo que tenemos en el mapeo de rutas
    if (isLogged){
        return children ? children : <Outlet />; 
    }
    dispatch(AUTH_ACTIONS.saveRedirectTo(location.pathname));
    return <Navigate to={redirectPath} replace={true}></Navigate>
};

export default ProtectedRoutePrivate ;
