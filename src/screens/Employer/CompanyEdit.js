import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Form, Button, Card } from "react-bootstrap";
import { authApis, endpoints } from "../../configs/Apis";

const CompanyEdit = () => {
    const location = useLocation();
    const nav = useNavigate();
    const company = location.state || {};

    const [data, setData] = useState({
        full_name: company.owner?.full_name || "",
        phone: company.owner?.phone || "",
        name: company.name || "",
        website: company.website || "",
        address: company.address || "",
        description: company.description || "",
        logo: company.logo || "",
    });

    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};

        if (!data.full_name.trim()) {
            newErrors.full_name = "Vui lòng nhập tên người đại diện";
        }
        if (!data.phone.trim()) {
            newErrors.phone = "Vui lòng nhập số điện thoại";
        } else if (!/^\d+$/.test(data.phone.trim())) {
            newErrors.phone = "Số điện thoại chỉ được chứa ký tự số";
        }
        if (!data.name.trim()) {
            newErrors.name = "Vui lòng nhập tên công ty";
        }
        if (!data.website.trim()) {
            newErrors.website = "Vui lòng nhập website";
        }
        if (!data.address.trim()) {
            newErrors.address = "Vui lòng nhập địa chỉ";
        }
        if (!data.description.trim()) {
            newErrors.description = "Vui lòng nhập mô tả";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const save = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        try {
            await authApis().put(
                endpoints.updateMyCompany,
                data
            );

            alert("Cập nhật thành công");
            nav("/employer/company");
        } catch (err) {
            console.log(err.response?.data);
        }
    };

    return (
        <Card className="mt-4">
            <Card.Header>
                <h3>Chỉnh sửa doanh nghiệp</h3>
            </Card.Header>
            <Card.Body>
                <Form onSubmit={save}>
                    <Form.Group className="mb-3">
                        <Form.Label>Người đại diện</Form.Label>
                        <Form.Control
                            type="text"
                            value={data.full_name}
                            isInvalid={!!errors.full_name}
                            onChange={(e) => {
                                setData({ ...data, full_name: e.target.value });
                                if (errors.full_name) setErrors({ ...errors, full_name: null });
                            }}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.full_name}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Số điện thoại</Form.Label>
                        <Form.Control
                            type="text"
                            value={data.phone}
                            isInvalid={!!errors.phone}
                            onChange={(e) => {
                                const val = e.target.value;
                                if (/^\d*$/.test(val)) {
                                    setData({ ...data, phone: val });
                                    if (errors.phone) setErrors({ ...errors, phone: null });
                                }
                            }}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.phone}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Tên công ty</Form.Label>
                        <Form.Control
                            type="text"
                            value={data.name}
                            isInvalid={!!errors.name}
                            onChange={(e) => {
                                setData({ ...data, name: e.target.value });
                                if (errors.name) setErrors({ ...errors, name: null });
                            }}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.name}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Website</Form.Label>
                        <Form.Control
                            type="text"
                            value={data.website}
                            isInvalid={!!errors.website}
                            onChange={(e) => {
                                setData({ ...data, website: e.target.value });
                                if (errors.website) setErrors({ ...errors, website: null });
                            }}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.website}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Địa chỉ</Form.Label>
                        <Form.Control
                            type="text"
                            value={data.address}
                            isInvalid={!!errors.address}
                            onChange={(e) => {
                                setData({ ...data, address: e.target.value });
                                if (errors.address) setErrors({ ...errors, address: null });
                            }}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.address}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Logo</Form.Label>
                        <Form.Control
                            type="text"
                            value={data.logo}
                            onChange={(e) => setData({ ...data, logo: e.target.value })}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Mô tả</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={5}
                            value={data.description}
                            isInvalid={!!errors.description}
                            onChange={(e) => {
                                setData({ ...data, description: e.target.value });
                                if (errors.description) setErrors({ ...errors, description: null });
                            }}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.description}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Button type="submit">Lưu</Button>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default CompanyEdit;