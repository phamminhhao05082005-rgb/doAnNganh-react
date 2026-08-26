import { useEffect, useState } from "react";
import { Card, Form, Button, Spinner, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { authApis, endpoints } from "../../configs/Apis";

const StudentProfile = () => {
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({
        full_name: "",
        phone: "",
        avatar: "",
        title: "",
        summary: "",
        experience_year: 0,
        expected_salary: ""
    });
    const [avatarFile, setAvatarFile] = useState(null);

    const loadProfile = async () => {
        try {
            const res = await authApis().get(endpoints.studentProfile);
            const data = res.data.data;
            setForm({
                full_name: data.full_name || "",
                phone: data.phone || "",
                avatar: data.avatar || "",
                title: data.title || "",
                summary: data.summary || "",
                experience_year: data.experience_year || 0,
                expected_salary: data.expected_salary || ""
            });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProfile();
    }, []);

    const save = async () => {
        if (
            !form.full_name.trim() ||
            !form.phone.trim() ||
            !form.title.trim() ||
            !form.summary.trim() ||
            form.experience_year === "" ||
            form.expected_salary === ""
        ) {
            alert("Vui lòng điền đầy đủ thông tin, không được để trống bất kỳ trường nào!");
            return;
        }

        try {
            const data = new FormData();
            data.append("full_name", form.full_name);
            data.append("phone", form.phone);
            data.append("title", form.title);
            data.append("summary", form.summary);
            data.append("experience_year", form.experience_year);
            data.append("expected_salary", form.expected_salary);

            if (avatarFile) {
                data.append("avatar", avatarFile);
            }

            await authApis().post(
                endpoints.studentProfile,
                data,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        "X-HTTP-Method-Override": "PUT"
                    }
                }
            );

            alert("Cập nhật thành công");
            loadProfile();
        } catch (err) {
            console.error(err);
            alert("Có lỗi xảy ra");
        }
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setAvatarFile(file);
        setForm(prev => ({
            ...prev,
            avatar: URL.createObjectURL(file)
        }));
    };

    if (loading) return <Spinner className="mt-5" />;

    return (
        <Card className="mt-4 shadow">
            <Card.Header>
                <h3>Quản lý hồ sơ cá nhân</h3>
            </Card.Header>
            <Card.Body>
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Họ tên</Form.Label>
                            <Form.Control
                                value={form.full_name}
                                onChange={e => setForm({ ...form, full_name: e.target.value })}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Số điện thoại</Form.Label>
                            <Form.Control
                                value={form.phone}
                                onChange={e => setForm({ ...form, phone: e.target.value })}
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Form.Group className="mb-4">
                    <Form.Label>Ảnh đại diện</Form.Label>
                    <Row className="align-items-center">
                        <Col md={3} className="text-center">
                            <img
                                src={
                                    form.avatar
                                        ? form.avatar
                                        : "https://via.placeholder.com/180x180?text=Avatar"
                                }
                                alt="Avatar"
                                className="img-thumbnail rounded-circle"
                                style={{ width: 170, height: 170, objectFit: "cover" }}
                            />
                        </Col>
                        <Col md={9}>
                            <Form.Control
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarChange}
                            />
                            <Form.Text className="text-muted">
                                Chọn ảnh JPG, PNG hoặc WEBP.
                            </Form.Text>
                        </Col>
                    </Row>
                </Form.Group>

                <hr />
                <h5>Hồ sơ ứng viên</h5>

                <Form.Group className="mb-3">
                    <Form.Label>Tiêu đề nghề nghiệp</Form.Label>
                    <Form.Control
                        value={form.title}
                        onChange={e => setForm({ ...form, title: e.target.value })}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Giới thiệu</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={5}
                        value={form.summary}
                        onChange={e => setForm({ ...form, summary: e.target.value })}
                    />
                </Form.Group>

                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Số năm kinh nghiệm</Form.Label>
                            <Form.Control
                                type="text"
                                value={form.experience_year}
                                onChange={e => {
                                    // Chỉ cho phép nhập số
                                    const value = e.target.value;
                                    if (/^\d*$/.test(value)) {
                                        setForm({ ...form, experience_year: value });
                                    }
                                }}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Mức lương mong muốn</Form.Label>
                            <Form.Control
                                type="text"
                                value={form.expected_salary}
                                onChange={e => {
                                    // Chỉ cho phép nhập số
                                    const value = e.target.value;
                                    if (/^\d*$/.test(value)) {
                                        setForm({ ...form, expected_salary: value });
                                    }
                                }}
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <div className="d-flex gap-2 mt-4">
                    <Button variant="primary" onClick={save}>
                        Cập nhật
                    </Button>
                    <Link to="/student/educations">
                        <Button variant="success">Quản lý học vấn</Button>
                    </Link>
                    <Link to="/student/experiences">
                        <Button variant="warning">Quản lý kinh nghiệm</Button>
                    </Link>
                </div>
            </Card.Body>
        </Card>
    );
};

export default StudentProfile;