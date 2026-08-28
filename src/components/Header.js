import { useContext } from "react";
import { Button } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import cookies from "react-cookies";
import { MyUserContext } from "../configs/Contexts";
import { authApis, endpoints } from "../configs/Apis";
import NotificationBell from "../screens/NotificationBell";

const Header = () => {
    const [user, dispatch] = useContext(MyUserContext);
    const nav = useNavigate();

    const logout = async () => {
        try {
            await authApis().post(endpoints.logout);
        } catch (ex) {
            console.log(ex);
        }

        cookies.remove("token");
        cookies.remove("user");
        dispatch({ type: "LOGOUT" });
        nav("/");
    };

    return (
        <header className="bg-white border-bottom shadow-sm sticky-top py-2.5 px-3 px-md-4">
            <style>{`
                .nav-btn {
                    border-radius: 50rem;
                    font-weight: 500;
                    font-size: 0.88rem;
                    padding: 0.45rem 1rem;
                    transition: all 0.2s ease-in-out;
                    white-space: nowrap;
                }
                .brand-title {
                    font-weight: 800;
                    background: linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    letter-spacing: -0.5px;
                }
                .user-chip {
                    background-color: #f8f9fa;
                    border: 1px solid #e9ecef;
                    border-radius: 50rem;
                    padding: 0.4rem 0.9rem;
                    font-size: 0.88rem;
                    white-space: nowrap;
                }
            `}</style>

            <div className="d-flex justify-content-between align-items-center max-w-7xl mx-auto">
                
                <Link to="/" className="text-decoration-none">
                    <h3 className="brand-title mb-0 fs-4">
                        Website tuyển dụng
                    </h3>
                </Link>

                
                {user && (
                    <div className="d-flex align-items-center gap-2 flex-wrap justify-content-end">
                        
                        
                        {user.role === "STUDENT" && (
                            <div className="d-flex align-items-center gap-2">
                                <Link to="/student" className="text-decoration-none">
                                    <Button variant="outline-primary" className="nav-btn">
                                        Trang chủ
                                    </Button>
                                </Link>

                                <Link to="/student/profile" className="text-decoration-none">
                                    <Button variant="outline-success" className="nav-btn">
                                        Hồ sơ
                                    </Button>
                                </Link>

                                <Link to="/student/bookmarks" className="text-decoration-none">
                                    <Button variant="outline-danger" className="nav-btn">
                                        Việc làm đã lưu
                                    </Button>
                                </Link>

                                <Link to="/student/applications" className="text-decoration-none">
                                    <Button variant="outline-warning" className="nav-btn text-dark">
                                        Việc đã ứng tuyển
                                    </Button>
                                </Link>

                                <Link to="/student/cvs/manage" className="text-decoration-none">
                                    <Button variant="dark" className="nav-btn">
                                        Quản lý CV
                                    </Button>
                                </Link>
                            </div>
                        )}

                        
                        {user.role === "EMPLOYER" && (
                            <div className="d-flex align-items-center gap-2">
                                <Link to="/employer" className="text-decoration-none">
                                    <Button variant="outline-primary" className="nav-btn">
                                        Trang chủ
                                    </Button>
                                </Link>

                                <Link to="/employer/jobs" className="text-decoration-none">
                                    <Button variant="outline-success" className="nav-btn">
                                        Quản lý việc làm
                                    </Button>
                                </Link>
                            </div>
                        )}

                        
                        <div className="d-flex align-items-center gap-3 ms-md-2 ps-md-3 border-start">
                            <NotificationBell />

                            <div className="user-chip d-flex align-items-center text-secondary">
                                <span>Xin chào</span>
                                <strong className="text-dark ms-1">{user.full_name}</strong>
                            </div>

                            <Button
                                variant="danger"
                                className="nav-btn px-3 fw-semibold shadow-sm"
                                onClick={logout}
                            >
                                Logout
                            </Button>
                        </div>

                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;