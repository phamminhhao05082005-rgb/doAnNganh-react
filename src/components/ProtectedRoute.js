import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { MyUserContext } from "../configs/Contexts";

const ProtectedRoute = ({children,roles})=>{

    const [user]=useContext(MyUserContext);

    console.log("User:", user);
    console.log("Role:", user?.role);
    console.log("Allowed:", roles);

    if(!user)
        return <Navigate to="/"/>;

    if(!roles.includes(user?.role))
        return <Navigate to="/"/>;

    return children;

}

export default ProtectedRoute;