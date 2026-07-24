import { useContext } from "react";
import { MyUserContext } from "../../configs/Contexts";
import { Link } from "react-router-dom";

const EmployerHome = () => {

    const [user] = useContext(MyUserContext);

    return (

        <div className="mt-5 text-center">

            <h2>

                Trang Doanh nghiệp

            </h2>

            <h4>

                Xin chào {user?.full_name}

            </h4>

            <div className="mt-4 d-flex justify-content-center gap-3">

                <Link
                    to="/employer/company"
                    className="btn btn-primary"
                >
                    Thông tin doanh nghiệp
                </Link>

                <Link
                    to="/employer/jobs"
                    className="btn btn-success"
                >
                    Quản lý tuyển dụng
                </Link>

            </div>

        </div>

    )

}

export default EmployerHome;