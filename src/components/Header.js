import { useContext } from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import cookies from "react-cookies";
import { MyUserContext } from "../configs/Contexts";
import { Link } from "react-router-dom";
import { authApis, endpoints } from "../configs/Apis";

const Header = () => {

    const [user, dispatch] = useContext(MyUserContext);

    const nav = useNavigate();

    const logout = async () => {

        try {
            await authApis().post(endpoints.logout);
        }
        catch (ex) {
            console.log(ex);
        }

        cookies.remove("token");
        cookies.remove("user");
        dispatch({ type: "LOGOUT" });
        nav("/");

    }

    return (

        <div className="d-flex justify-content-between align-items-center p-3 shadow">

            <h3>

                Website tuyển dụng

            </h3>

            {

                user &&

                <div className="d-flex align-items-center">

                    {

                        user.role === "STUDENT" &&

                        <>

                            <Link
                                to="/student"
                                className="me-2"
                            >

                                <Button
                                    variant="outline-primary"
                                >

                                    Trang chủ

                                </Button>

                            </Link>

                            <Link
                                to="/student/profile"
                                className="me-3"
                            >

                                <Button
                                    variant="outline-success"
                                >

                                    Hồ sơ

                                </Button>

                            </Link>

                            <Link
                                to="/student/bookmarks"
                                className="me-3"
                            >

                                <Button
                                    variant="outline-danger"
                                >

                                    Việc làm đã lưu

                                </Button>

                            </Link>

                            <Link to="/student/cvs/manage">
                                <Button variant="dark">
                                    Quản lý CV
                                </Button>
                            </Link>

                        </>

                    }

                    {

                        user.role === "EMPLOYER" &&

                        <>

                            <Link
                                to="/employer"
                                className="me-2"
                            >

                                <Button
                                    variant="outline-primary"
                                >

                                    Trang chủ

                                </Button>

                            </Link>

                            <Link
                                to="/employer/jobs"
                                className="me-3"
                            >

                                <Button
                                    variant="outline-success"
                                >

                                    Quản lý việc làm

                                </Button>

                            </Link>

                        </>

                    }

                    <span>

                        Xin chào

                        <b>

                            {" "}

                            {user.full_name}

                        </b>

                    </span>

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

    );

}

export default Header;