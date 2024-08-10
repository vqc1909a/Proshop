import {Navigate, Outlet, useLocation} from "react-router-dom";

const ProtectedRouteAdmin = ({children, redirectPath = "/"})  => {
    const {pathname, search} = useLocation();
    const lastPath = pathname + search;

    const token = JSON.parse(localStorage.getItem("token") ?? '""');
    const isAdmin = Boolean(JSON.parse(localStorage.getItem("isAdmin") ?? "false"))

    console.log({
        lastPath,
        token,
        isAdmin
    })
    if(token && isAdmin){
        return children ? children : <Outlet />; 
    }
    localStorage.setItem("lastPath", lastPath);
    return <Navigate to={redirectPath} replace={true}></Navigate>
};

export default ProtectedRouteAdmin ;
