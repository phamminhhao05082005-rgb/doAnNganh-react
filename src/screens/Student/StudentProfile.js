import { useEffect, useState } from "react";
import { Card, Form, Button, Spinner, Row, Col, InputGroup, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import { authApis, endpoints } from "../../configs/Apis";
import { 
    FiUser, FiPhone, FiCamera, FiBriefcase, 
    FiFileText, FiStar, FiDollarSign, FiSave, 
    FiBook, FiAward, FiUploadCloud
} from "react-icons/fi";

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

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
                <Spinner animation="border" variant="primary" />
                <span className="ms-3 text-primary fw-medium">Đang tải hồ sơ...</span>
            </div>
        );
    }

    return (
        <div className="container mt-4 mb-5 max-w-4xl">
            <style>
                {`
                    .profile-card { border-radius: 1.2rem; border: none; }
                    .form-control, .form-select { border-radius: 0.6rem; padding: 0.6rem 1rem; border-color: #dee2e6; }
                    .form-control:focus { box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.15); border-color: #86b7fe; }
                    .avatar-wrapper { position: relative; width: 160px; height: 160px; border-radius: 50%; overflow: hidden; border: 4px solid #fff; box-shadow: 0 4px 12px rgba(0,0,0,0.1); transition: all 0.3s; }
                    .avatar-wrapper:hover { box-shadow: 0 6px 16px rgba(0,0,0,0.15); transform: translateY(-2px); }
                    .avatar-img { width: 100%; height: 100%; object-fit: cover; }
                    .upload-btn-wrapper { position: relative; overflow: hidden; display: inline-block; }
                    .upload-btn-wrapper input[type=file] { position: absolute; left: 0; top: 0; opacity: 0; cursor: pointer; height: 100%; }
                    .section-title { font-size: 1.1rem; font-weight: 700; color: #2b3445; margin-bottom: 1.5rem; position: relative; padding-bottom: 0.5rem; }
                    .section-title::after { content: ''; position: absolute; left: 0; bottom: 0; width: 50px; height: 3px; background: #0d6efd; border-radius: 2px; }
                `}
            </style>

            <Card className="profile-card shadow-sm">
                <div className="bg-primary bg-gradient p-4 p-md-5 rounded-top" style={{ borderTopLeftRadius: '1.2rem', borderTopRightRadius: '1.2rem' }}>
                    <h3 className="text-white fw-bold mb-0 d-flex align-items-center">
                        <FiUser className="me-2" /> Quản Lý Hồ Sơ Cá Nhân
                    </h3>
                    <p className="text-white-50 mb-0 mt-2">Cập nhật thông tin để thu hút nhà tuyển dụng tốt hơn</p>
                </div>

                <Card.Body className="p-4 p-md-5">
                   
                    <div className="d-flex flex-column flex-md-row align-items-center gap-4 p-4 bg-light rounded-4 mb-5 border">
                        <div className="avatar-wrapper flex-shrink-0">
                            <img
                                src={form.avatar || "https://via.placeholder.com/160x160?text=Avatar"}
                                alt="Avatar"
                                className="avatar-img"
                            />
                        </div>
                        <div className="text-center text-md-start">
                            <h5 className="fw-bold mb-2">Ảnh Đại Diện</h5>
                            <p className="text-muted small mb-3">Định dạng hỗ trợ: JPG, PNG, WEBP. Kích thước tối ưu 160x160px.</p>
                            
                            <div className="upload-btn-wrapper">
                                <Button variant="outline-primary" className="rounded-pill px-4 fw-medium d-flex align-items-center gap-2">
                                    <FiUploadCloud /> Tải ảnh lên
                                </Button>
                                <input type="file" accept="image/*" onChange={handleAvatarChange} />
                            </div>
                        </div>
                    </div>

                    
                    <h5 className="section-title"><FiUser className="me-2 text-primary"/>Thông tin cơ bản</h5>
                    <Row className="mb-4 g-4">
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label className="fw-semibold text-muted small">Họ và tên <span className="text-danger">*</span></Form.Label>
                                <Form.Control
                                    placeholder="Nhập họ và tên của bạn"
                                    value={form.full_name}
                                    onChange={e => setForm({ ...form, full_name: e.target.value })}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label className="fw-semibold text-muted small">Số điện thoại <span className="text-danger">*</span></Form.Label>
                                <InputGroup>
                                    <InputGroup.Text className="bg-white"><FiPhone className="text-muted"/></InputGroup.Text>
                                    <Form.Control
                                        className="border-start-0"
                                        placeholder="Nhập số điện thoại"
                                        value={form.phone}
                                        onChange={e => setForm({ ...form, phone: e.target.value })}
                                    />
                                </InputGroup>
                            </Form.Group>
                        </Col>
                    </Row>

                   
                    <h5 className="section-title mt-5"><FiBriefcase className="me-2 text-primary"/>Hồ sơ nghề nghiệp</h5>
                    <Row className="mb-4 g-4">
                        <Col md={12}>
                            <Form.Group>
                                <Form.Label className="fw-semibold text-muted small">Vị trí / Chức danh mong muốn <span className="text-danger">*</span></Form.Label>
                                <Form.Control
                                    placeholder="VD: Thực tập sinh Frontend, Chuyên viên Marketing..."
                                    value={form.title}
                                    onChange={e => setForm({ ...form, title: e.target.value })}
                                />
                            </Form.Group>
                        </Col>
                        
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label className="fw-semibold text-muted small">Số năm kinh nghiệm <span className="text-danger">*</span></Form.Label>
                                <InputGroup>
                                    <InputGroup.Text className="bg-white"><FiStar className="text-warning"/></InputGroup.Text>
                                    <Form.Control
                                        className="border-start-0"
                                        type="text"
                                        placeholder="VD: 0, 1, 2..."
                                        value={form.experience_year}
                                        onChange={e => {
                                            const value = e.target.value;
                                            if (/^\d*$/.test(value)) {
                                                setForm({ ...form, experience_year: value });
                                            }
                                        }}
                                    />
                                    <InputGroup.Text className="bg-light fw-medium">Năm</InputGroup.Text>
                                </InputGroup>
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group>
                                <Form.Label className="fw-semibold text-muted small">Mức lương mong muốn <span className="text-danger">*</span></Form.Label>
                                <InputGroup>
                                    <InputGroup.Text className="bg-white"><FiDollarSign className="text-success"/></InputGroup.Text>
                                    <Form.Control
                                        className="border-start-0"
                                        type="text"
                                        placeholder="VD: 5000000"
                                        value={form.expected_salary}
                                        onChange={e => {
                                            const value = e.target.value;
                                            if (/^\d*$/.test(value)) {
                                                setForm({ ...form, expected_salary: value });
                                            }
                                        }}
                                    />
                                    <InputGroup.Text className="bg-light fw-medium">VNĐ</InputGroup.Text>
                                </InputGroup>
                                {form.expected_salary && (
                                    <Form.Text className="text-success fw-medium">
                                        ≈ {Number(form.expected_salary).toLocaleString('vi-VN')} VNĐ
                                    </Form.Text>
                                )}
                            </Form.Group>
                        </Col>

                        <Col md={12}>
                            <Form.Group>
                                <Form.Label className="fw-semibold text-muted small d-flex align-items-center gap-2">
                                    Giới thiệu bản thân <span className="text-danger">*</span>
                                </Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={5}
                                    placeholder="Viết một đoạn ngắn giới thiệu về kỹ năng, mục tiêu nghề nghiệp và điểm mạnh của bạn..."
                                    value={form.summary}
                                    onChange={e => setForm({ ...form, summary: e.target.value })}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                   
                    <div className="d-flex flex-wrap align-items-center gap-3 mt-5 pt-4 border-top">
                        <Button 
                            variant="primary" 
                            onClick={save} 
                            className="px-4 py-2 fw-bold d-flex align-items-center gap-2 shadow-sm rounded-pill"
                        >
                            <FiSave size={18} /> Lưu Hồ Sơ
                        </Button>

                        <div className="ms-auto d-flex gap-2">
                            <Button 
                                as={Link} 
                                to="/student/educations" 
                                variant="outline-success" 
                                className="px-3 py-2 fw-medium d-flex align-items-center gap-2 rounded-pill"
                            >
                                <FiBook /> Học vấn
                            </Button>
                            
                            <Button 
                                as={Link} 
                                to="/student/experiences" 
                                variant="outline-warning" 
                                className="px-3 py-2 fw-medium d-flex align-items-center gap-2 rounded-pill text-dark border-warning"
                            >
                                <FiAward /> Kinh nghiệm
                            </Button>
                        </div>
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
};

export default StudentProfile;