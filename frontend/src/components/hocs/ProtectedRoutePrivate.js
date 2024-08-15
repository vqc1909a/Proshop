import {Navigate, Outlet, useLocation} from "react-router-dom";

const ProtectedRoutePrivate = ({children, redirectPath = "/"})  => {
    const {pathname, search} = useLocation();
    const lastPath = pathname + search;
 
    const token = JSON.parse(localStorage.getItem("token") ?? '""');
    //Outlet es el ejemplo de lo que tenemos en el mapeo de rutas
    if (token){
        return children ? children : <Outlet />; 
    }
    localStorage.setItem("lastPath", lastPath);
    return <Navigate to={redirectPath} replace={true}></Navigate>
};

export default ProtectedRoutePrivate ;
