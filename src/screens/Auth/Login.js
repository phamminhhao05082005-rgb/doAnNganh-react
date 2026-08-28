import { useContext, useState } from "react";
import { Alert, Button, Form, Container, Row, Col, Card } from "react-bootstrap";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import cookies from "react-cookies";
import Apis, { authApis, endpoints } from "../../configs/Apis";
import { MyUserContext } from "../../configs/Contexts";
import MySpinner from "../../components/MySpinner";

const Login = () => {
    const fields = [
        {
            field: "email",
            label: "Địa chỉ Email",
            type: "email",
            placeholder: "nhapemail@domain.com"
        },
        {
            field: "password",
            label: "Mật khẩu",
            type: "password",
            placeholder: "••••••••"
        }
    ];

    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState("");

    const [, dispatch] = useContext(MyUserContext);
    const nav = useNavigate();

    const redirectByRole = (user) => {
        switch (user.role) {
            case "EMPLOYER":
                nav("/employer");
                break;
            case "STUDENT":
                nav("/student");
                break;
            default:
                nav("/");
        }
    };

    const saveLogin = async (token) => {
        cookies.save("token", token);
        const me = await authApis().get(endpoints.me);
        cookies.save("user", me.data.data);
        dispatch({
            type: "LOGIN",
            payload: me.data.data
        });
        redirectByRole(me.data.data);
    };

    const login = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setErr("");
            const res = await Apis.post(endpoints.login, user);
            await saveLogin(res.data.data.token);
        } catch (ex) {
            console.log(ex);
            setErr("Email hoặc mật khẩu không đúng");
        } finally {
            setLoading(false);
        }
    };

    const googleLogin = async (credentialResponse) => {
        try {
            setLoading(true);
            setErr("");
            const res = await Apis.post(
                endpoints.googleLogin,
                { token: credentialResponse.credential }
            );
            await saveLogin(res.data.data.token);
        } catch (ex) {
            console.log(ex);
            setErr("Đăng nhập Google thất bại");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div 
            className="min-vh-100 d-flex align-items-center justify-content-center py-5"
            style={{
                background: "linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)",
                fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
            }}
        >
            <Container>
                <Row className="justify-content-center align-items-center">
                    <Col xs={12} lg={10} xl={9}>
                        <Card className="border-0 shadow-lg overflow-hidden rounded-4">
                            <Row className="g-0">
                                
                                <Col 
                                    lg={5} 
                                    className="d-none d-lg-flex flex-column justify-content-between p-5 text-white position-relative"
                                    style={{
                                        background: "linear-gradient(135deg, #0052D4 0%, #4364F7 50%, #6FB1FC 100%)"
                                    }}
                                >
                                    <div>
                                        <div className="d-flex align-items-center gap-2 mb-4">
                                            <div 
                                                className="bg-white rounded-3 p-2 d-flex align-items-center justify-content-center fw-black text-primary shadow-sm"
                                                style={{ width: 38, height: 38, fontSize: "1.2rem" }}
                                            >
                                                🚀
                                            </div>
                                            <span className="fw-bold fs-4 tracking-tight">CareerPortal</span>
                                        </div>
                                        
                                        <h2 className="fw-bold mb-3 display-6" style={{ lineHeight: 1.25 }}>
                                            Khám phá cơ hội việc làm bán thời gian
                                        </h2>
                                        <p className="opacity-75 fs-6 fw-normal">
                                            Kết nối hàng ngàn sinh viên tài năng với các doanh nghiệp hàng đầu trong hệ thống.
                                        </p>
                                    </div>

                                    <div className="pt-4 border-top border-white border-opacity-25">
                                        <div className="d-flex align-items-center gap-3">
                                            <div className="rounded-circle bg-white bg-opacity-25 p-2 d-flex align-items-center justify-content-center" style={{ width: 42, height: 42 }}>
                                                💼
                                            </div>
                                            <div>
                                                <div className="fw-semibold small">Cổng thông tin tuyển dụng</div>
                                                <div className="small opacity-75">Dành cho Sinh viên & Nhà tuyển dụng</div>
                                            </div>
                                        </div>
                                    </div>
                                </Col>

                                
                                <Col lg={7} className="p-4 p-md-5 bg-white">
                                    <div className="mb-4">
                                        <h3 className="fw-bold text-dark mb-1">Doanh nghiệp đăng nhập bằng tài khoản được cấp</h3>
                                        <p className="text-muted small">
                                            Chào mừng bạn quay trở lại! Vui lòng nhập thông tin bên dưới.
                                        </p>
                                    </div>

                                    {err && (
                                        <Alert variant="danger" className="rounded-3 border-0 shadow-sm py-2 px-3 mb-4 small">
                                            ⚠️ {err}
                                        </Alert>
                                    )}

                                    <Form onSubmit={login}>
                                        {fields.map((f) => (
                                            <Form.Group key={f.field} className="mb-3">
                                                <Form.Label className="small fw-semibold text-secondary mb-1">
                                                    {f.label}
                                                </Form.Label>
                                                <Form.Control
                                                    type={f.type}
                                                    placeholder={f.placeholder}
                                                    value={user[f.field] || ""}
                                                    onChange={(e) =>
                                                        setUser({
                                                            ...user,
                                                            [f.field]: e.target.value
                                                        })
                                                    }
                                                    className="py-2 px-3 rounded-3 border-light-subtle shadow-none"
                                                    style={{ fontSize: "0.95rem" }}
                                                    required
                                                />
                                            </Form.Group>
                                        ))}

                                        {loading ? (
                                            <div className="text-center py-3">
                                                <MySpinner />
                                            </div>
                                        ) : (
                                            <Button
                                                type="submit"
                                                className="w-100 py-2.5 border-0 fw-semibold shadow-sm rounded-3 mt-2"
                                                style={{
                                                    background: "linear-gradient(90deg, #0052D4 0%, #4364F7 100%)",
                                                    fontSize: "0.95rem"
                                                }}
                                            >
                                                Đăng nhập
                                            </Button>
                                        )}
                                    </Form>

                                    <div className="position-relative my-4 text-center">
                                        <hr className="text-muted opacity-25" />
                                        <span className="position-absolute top-50 start-50 translate-middle bg-white px-3 text-muted small fw-medium">
                                            hoặc
                                        </span>
                                    </div>

                                    <div className="text-center">
                                        <p className="small text-muted mb-3">
                                            Đăng nhập qua tài khoản Google dành cho <strong>Sinh viên</strong> 
                                        </p>
                                        <div className="d-flex justify-content-center">
                                            <GoogleLogin
                                                onSuccess={googleLogin}
                                                onError={() => setErr("Google Login Error")}
                                                theme="outline"
                                                shape="pill"
                                                width="100%"
                                            />
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Login;