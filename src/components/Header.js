import { useContext } from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import cookies from "react-cookies";

import { MyUserContext } from "../configs/Contexts";

import { authApis, endpoints } from "../configs/Apis";

const Header=()=>{

    const [user,dispatch]=useContext(MyUserContext);

    const nav=useNavigate();

    const logout=async()=>{

        try{

            await authApis().post(

                endpoints.logout

            );

        }

        catch(ex){

            console.log(ex);

        }

        cookies.remove("token");

        cookies.remove("user");

        dispatch({

            type:"LOGOUT"

        });

        nav("/");

    }

    return(

        <div className="d-flex justify-content-between p-3 shadow">

            <h3>

                Website tuyển dụng

            </h3>

            {

                user &&

                <div>

                    Xin chào

                    <b>

                        {" "}

                        {user.full_name}

                    </b>

                    <Button

                        className="ms-3"

                        variant="danger"

                        onClick={logout}

                    >

                        Logout

                    </Button>

                </div>

            }

        </div>

    )

}

export default Header;