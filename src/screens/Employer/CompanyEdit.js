import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Form, Button, Card } from "react-bootstrap";
import { authApis, endpoints } from "../../configs/Apis";

const CompanyEdit = () => {

    const location = useLocation();

    const nav = useNavigate();

    const company = location.state;

    const [data, setData] = useState({

        full_name: company.owner.full_name,

        phone: company.owner.phone,

        name: company.name,

        website: company.website || "",

        address: company.address || "",

        description: company.description || "",

        logo: company.logo || "",

    });

    const save = async (e) => {
        e.preventDefault();

        try {
            await authApis().put(
                endpoints.updateMyCompany,
                data
            );

            alert("Cập nhật thành công");
            nav("/employer/company");

        } catch (err) {
            console.log(err.response.data);
        }
    }

    // const save = async (e) => {

    //     e.preventDefault();

    //     await authApis().put(

    //         endpoints["updateMyCompany"],

    //         data

    //     );

    //     alert("Cập nhật thành công");

    //     nav("/employer/company");

    // }

    return (

        <Card className="mt-4">

            <Card.Header>

                <h3>

                    Chỉnh sửa doanh nghiệp

                </h3>

            </Card.Header>

            <Card.Body>

                <Form onSubmit={save}>

                    <Form.Group className="mb-3">

                        <Form.Label>

                            Người đại diện

                        </Form.Label>

                        <Form.Control

                            value={data.full_name}

                            onChange={(e) =>

                                setData({

                                    ...data,

                                    full_name: e.target.value

                                })

                            }

                        />

                    </Form.Group>

                    <Form.Group className="mb-3">

                        <Form.Label>

                            Số điện thoại

                        </Form.Label>

                        <Form.Control

                            value={data.phone}

                            onChange={(e) =>

                                setData({

                                    ...data,

                                    phone: e.target.value

                                })

                            }

                        />

                    </Form.Group>

                    <Form.Group className="mb-3">

                        <Form.Label>

                            Tên công ty

                        </Form.Label>

                        <Form.Control

                            value={data.name}

                            onChange={(e) =>

                                setData({

                                    ...data,

                                    name: e.target.value

                                })

                            }

                        />

                    </Form.Group>

                    <Form.Group className="mb-3">

                        <Form.Label>

                            Website

                        </Form.Label>

                        <Form.Control

                            value={data.website}

                            onChange={(e) =>

                                setData({

                                    ...data,

                                    website: e.target.value

                                })

                            }

                        />

                    </Form.Group>

                    <Form.Group className="mb-3">

                        <Form.Label>

                            Địa chỉ

                        </Form.Label>

                        <Form.Control

                            value={data.address}

                            onChange={(e) =>

                                setData({

                                    ...data,

                                    address: e.target.value

                                })

                            }

                        />

                    </Form.Group>

                    <Form.Group className="mb-3">

                        <Form.Label>

                            Logo

                        </Form.Label>

                        <Form.Control

                            value={data.logo}

                            onChange={(e) =>

                                setData({

                                    ...data,

                                    logo: e.target.value

                                })

                            }

                        />

                    </Form.Group>

                    <Form.Group className="mb-3">

                        <Form.Label>

                            Mô tả

                        </Form.Label>

                        <Form.Control

                            as="textarea"

                            rows={5}

                            value={data.description}

                            onChange={(e) =>

                                setData({

                                    ...data,

                                    description: e.target.value

                                })

                            }

                        />

                    </Form.Group>

                    <Button type="submit">

                        Lưu

                    </Button>

                </Form>

            </Card.Body>

        </Card>

    )

}

export default CompanyEdit;