import * as AUTH_SELECTORS from "redux/selectors/authSelector";
import {useSelector} from "react-redux";
import {Navigate, Outlet, useLocation} from "react-router-dom";
import {useDispatch} from "react-redux";
import * as AUTH_ACTIONS from "redux/slices/authSlice";

const ProtectedRouteAdmin = ({children, redirectPath = "/"})  => {
    let dispatch = useDispatch();
    let location = useLocation();
    const isLogged = useSelector(AUTH_SELECTORS.selectIsLogged);
    const isAdmin = localStorage.getItem("isAdmin") ? Boolean(JSON.parse(localStorage.getItem("isAdmin"))) : false;

    if(isLogged && isAdmin){
        return children ? children : <Outlet />; 
    }
    dispatch(AUTH_ACTIONS.saveRedirectTo(location.pathname));
    return <Navigate to={redirectPath} replace={true}></Navigate>
};

export default ProtectedRouteAdmin ;
