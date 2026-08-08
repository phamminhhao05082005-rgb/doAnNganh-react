import { useContext, useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";
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
            label: "Email",
            type: "email"
        },
        {
            field: "password",
            label: "Mật khẩu",
            type: "password"
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

    }

    const saveLogin = async (token) => {

        cookies.save("token", token);

        const me = await authApis().get(endpoints.me);

        cookies.save("user", me.data.data);

        dispatch({
            type: "LOGIN",
            payload: me.data.data
        });

        redirectByRole(me.data.data);
    }

    const login = async (e) => {

        e.preventDefault();

        try {

            setLoading(true);
            setErr("");
            const res = await Apis.post(endpoints.login, user);
            await saveLogin(res.data.data.token);

        }

        catch (ex) {
            console.log(ex);
            setErr("Email hoặc mật khẩu không đúng");

        }

        finally {
            setLoading(false);
        }

    }

    const googleLogin = async (credentialResponse) => {

        try {

            setLoading(true);
            setErr("");
            const res = await Apis.post(
                endpoints.googleLogin,
                {
                    token: credentialResponse.credential
                });

            await saveLogin(
                res.data.data.token
            );

        }

        catch (ex) {
            console.log(ex);
            setErr("Đăng nhập Google thất bại");
        }

        finally {
            setLoading(false);
        }

    }

    return (

        <div
            className="d-flex justify-content-center align-items-center vh-100"
        >

            <div
                className="shadow p-4 rounded bg-white"
                style={{ width: 400 }}
            >

                <h3 className="text-center">

                    Đăng nhập

                </h3>

                {
                    err &&
                    <Alert variant="danger">

                        {err}

                    </Alert>
                }

                <Form onSubmit={login}>

                    {
                        fields.map(f =>

                            <Form.Group
                                key={f.field}
                                className="mb-3"
                            >

                                <Form.Label>
                                    {f.label}
                                </Form.Label>

                                <Form.Control

                                    type={f.type}
                                    value={user[f.field] || ""}
                                    onChange={(e) =>
                                        setUser({
                                            ...user,
                                            [f.field]: e.target.value

                                        })
                                    }

                                />

                            </Form.Group>

                        )
                    }

                    {

                        loading

                            ?

                            <MySpinner />

                            :

                            <Button
                                className="w-100"
                                type="submit"
                            >

                                Đăng nhập

                            </Button>

                    }

                </Form>

                <hr />

                <div className="text-center mb-3">

                    Sinh viên đăng nhập bằng Google

                </div>

                <div className="d-flex justify-content-center">

                    <GoogleLogin

                        onSuccess={googleLogin}

                        onError={() => setErr("Google Login Error")}

                    />

                </div>

            </div>

        </div>

    )

}

export default Login;