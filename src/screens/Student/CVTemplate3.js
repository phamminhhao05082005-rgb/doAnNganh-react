import { useEffect, useState } from "react";
import {
    Card,
    Row,
    Col,
    Image,
    Badge,
    Spinner,
    Button,
    Form
} from "react-bootstrap";
import { authApis, endpoints } from "../../configs/Apis";
import dayjs from "dayjs";

const CVTemplate3 = () => {
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    const [profile, setProfile] = useState(null);
    const [educations, setEducations] = useState([]);
    const [experiences, setExperiences] = useState([]);

    const loadData = async () => {
        try {
            const [profileRes, educationRes, experienceRes] = await Promise.all([
                authApis().get(endpoints.studentProfile),
                authApis().get(endpoints.educations),
                authApis().get(endpoints.experiences)
            ]);

            setProfile(profileRes.data.data);
            setEducations(educationRes.data.data || []);
            setExperiences(experienceRes.data.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleProfileChange = (field, value) => {
        setProfile((prev) => ({ ...prev, [field]: value }));
    };

    const handleEducationChange = (index, field, value) => {
        const updated = [...educations];
        updated[index][field] = value;
        setEducations(updated);
    };

    const addEducation = () => {
        setEducations([
            ...educations,
            { id: Date.now(), school: "", major: "", start_year: "2020", end_year: "2024" }
        ]);
    };

    const removeEducation = (index) => {
        setEducations(educations.filter((_, i) => i !== index));
    };

    const handleExperienceChange = (index, field, value) => {
        const updated = [...experiences];
        updated[index][field] = value;
        setExperiences(updated);
    };

    const addExperience = () => {
        setExperiences([
            ...experiences,
            {
                id: Date.now(),
                company_name: "",
                position: "",
                start_date: dayjs().format("YYYY-MM-DD"),
                end_date: "",
                description: ""
            }
        ]);
    };

    const removeExperience = (index) => {
        setExperiences(experiences.filter((_, i) => i !== index));
    };

    const handlePrint = () => {
        window.print();
    };

    if (loading) {
        return (
            <div className="text-center my-5 d-print-none">
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="text-center my-5 text-muted d-print-none">
                Không tìm thấy thông tin hồ sơ.
            </div>
        );
    }

    return (
        <div className="cv-template-wrapper my-4">
            <style>
                {`
                    @media print {
                        .d-print-none {
                            display: none !important;
                        }
                        body {
                            background-color: #fff !important;
                        }
                        .cv-card {
                            box-shadow: none !important;
                            border: none !important;
                            margin: 0 !important;
                        }
                        .cv-header {
                            -webkit-print-color-adjust: exact !important;
                            print-color-adjust: exact !important;
                        }
                    }
                `}
            </style>

            <div className="d-flex justify-content-between align-items-center mb-3 d-print-none">
                <Button
                    variant={isEditing ? "success" : "warning"}
                    onClick={() => setIsEditing(!isEditing)}
                >
                    {isEditing ? "✓ Chấp nhận & Xem trước" : "✏️ Chỉnh sửa CV"}
                </Button>
                <Button variant="primary" onClick={handlePrint}>
                    🖨️ Xuất File CV (PDF)
                </Button>
            </div>

            <Card className="shadow-lg border-0 cv-card mb-5">
                <div
                    className="cv-header text-white text-center p-5"
                    style={{
                        background: "linear-gradient(90deg, #2193b0, #6dd5ed)"
                    }}
                >
                    <Image
                        roundedCircle
                        src={profile.avatar || "https://via.placeholder.com/180"}
                        style={{
                            width: 170,
                            height: 170,
                            objectFit: "cover",
                            border: "6px solid white"
                        }}
                    />

                    {isEditing ? (
                        <div className="mt-3 col-md-8 mx-auto">
                            <Form.Control
                                type="text"
                                className="form-control-lg text-center fw-bold mb-2"
                                value={profile.full_name || ""}
                                onChange={(e) => handleProfileChange("full_name", e.target.value)}
                                placeholder="Họ và tên"
                            />
                            <Form.Control
                                type="text"
                                className="text-center mb-2"
                                value={profile.title || ""}
                                onChange={(e) => handleProfileChange("title", e.target.value)}
                                placeholder="Chức danh (VD: Full Stack Developer)"
                            />
                            <Row>
                                <Col md={6}>
                                    <Form.Control
                                        type="email"
                                        className="text-center mb-2"
                                        value={profile.email || ""}
                                        onChange={(e) => handleProfileChange("email", e.target.value)}
                                        placeholder="Email"
                                    />
                                </Col>
                                <Col md={6}>
                                    <Form.Control
                                        type="text"
                                        className="text-center mb-2"
                                        value={profile.phone || ""}
                                        onChange={(e) => handleProfileChange("phone", e.target.value)}
                                        placeholder="Số điện thoại"
                                    />
                                </Col>
                            </Row>
                        </div>
                    ) : (
                        <>
                            <h1 className="mt-3 fw-bold">{profile.full_name}</h1>
                            <h4>{profile.title || "Full Stack Developer"}</h4>
                            <div>
                                {profile.email}
                                {" | "}
                                {profile.phone || "Chưa cập nhật"}
                            </div>
                        </>
                    )}
                </div>

                <Card.Body className="p-5">
                    <Row>
                        <Col md={6}>
                            <Card className="border-0 shadow-sm mb-4">
                                <Card.Body>
                                    <h4 className="text-primary">Giới thiệu</h4>
                                    <hr />
                                    {isEditing ? (
                                        <Form.Control
                                            as="textarea"
                                            rows={4}
                                            value={profile.summary || ""}
                                            onChange={(e) =>
                                                handleProfileChange("summary", e.target.value)
                                            }
                                            placeholder="Nhập tóm tắt giới thiệu bản thân..."
                                        />
                                    ) : (
                                        <p style={{ whiteSpace: "pre-line" }}>
                                            {profile.summary || "Chưa cập nhật"}
                                        </p>
                                    )}
                                </Card.Body>
                            </Card>

                            <Card className="border-0 shadow-sm mb-4">
                                <Card.Body>
                                    <h4 className="text-primary">Thông tin</h4>
                                    <hr />
                                    {isEditing ? (
                                        <>
                                            <Form.Group className="mb-3">
                                                <Form.Label className="fw-bold">
                                                    Số năm kinh nghiệm
                                                </Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    value={profile.experience_year ?? 0}
                                                    onChange={(e) =>
                                                        handleProfileChange(
                                                            "experience_year",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </Form.Group>
                                            <Form.Group className="mb-3">
                                                <Form.Label className="fw-bold">
                                                    Mức lương mong muốn (VNĐ)
                                                </Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    value={profile.expected_salary ?? 0}
                                                    onChange={(e) =>
                                                        handleProfileChange(
                                                            "expected_salary",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </Form.Group>
                                        </>
                                    ) : (
                                        <>
                                            <p className="mb-3">
                                                <b>Kinh nghiệm</b>
                                                <br />
                                                {profile.experience_year ?? 0} năm
                                            </p>
                                            <p className="mb-0">
                                                <b>Mức lương mong muốn</b>
                                                <br />
                                                {profile.expected_salary
                                                    ? Number(
                                                          profile.expected_salary
                                                      ).toLocaleString("vi-VN")
                                                    : 0}{" "}
                                                VNĐ
                                            </p>
                                        </>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col md={6}>
                            <Card className="border-0 shadow-sm mb-4">
                                <Card.Body>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <h4 className="text-primary m-0">Học vấn</h4>
                                        {isEditing && (
                                            <Button
                                                variant="outline-primary"
                                                size="sm"
                                                onClick={addEducation}
                                            >
                                                + Thêm học vấn
                                            </Button>
                                        )}
                                    </div>
                                    <hr />
                                    {educations.length > 0 ? (
                                        educations.map((edu, index) => (
                                            <div key={edu.id || index} className="mb-4">
                                                {isEditing ? (
                                                    <div className="p-3 border rounded mb-2 position-relative bg-light">
                                                        <Button
                                                            variant="danger"
                                                            size="sm"
                                                            className="position-absolute top-0 end-0 m-2"
                                                            onClick={() => removeEducation(index)}
                                                        >
                                                            ✕
                                                        </Button>
                                                        <Row className="g-2">
                                                            <Col md={6}>
                                                                <Form.Control
                                                                    placeholder="Năm bắt đầu"
                                                                    value={edu.start_year || ""}
                                                                    onChange={(e) =>
                                                                        handleEducationChange(
                                                                            index,
                                                                            "start_year",
                                                                            e.target.value
                                                                        )
                                                                    }
                                                                />
                                                            </Col>
                                                            <Col md={6}>
                                                                <Form.Control
                                                                    placeholder="Năm kết thúc"
                                                                    value={edu.end_year || ""}
                                                                    onChange={(e) =>
                                                                        handleEducationChange(
                                                                            index,
                                                                            "end_year",
                                                                            e.target.value
                                                                        )
                                                                    }
                                                                />
                                                            </Col>
                                                            <Col md={12}>
                                                                <Form.Control
                                                                    placeholder="Tên trường học"
                                                                    value={edu.school || ""}
                                                                    onChange={(e) =>
                                                                        handleEducationChange(
                                                                            index,
                                                                            "school",
                                                                            e.target.value
                                                                        )
                                                                    }
                                                                />
                                                            </Col>
                                                            <Col md={12}>
                                                                <Form.Control
                                                                    placeholder="Chuyên ngành"
                                                                    value={edu.major || ""}
                                                                    onChange={(e) =>
                                                                        handleEducationChange(
                                                                            index,
                                                                            "major",
                                                                            e.target.value
                                                                        )
                                                                    }
                                                                />
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <Badge bg="primary">
                                                            {edu.start_year} -{" "}
                                                            {edu.end_year || "Hiện tại"}
                                                        </Badge>
                                                        <h5 className="mt-2 mb-1">{edu.school}</h5>
                                                        <div className="text-muted">{edu.major}</div>
                                                    </>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-muted">Chưa có thông tin học vấn.</p>
                                    )}
                                </Card.Body>
                            </Card>

                            <Card className="border-0 shadow-sm">
                                <Card.Body>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <h4 className="text-primary m-0">Kinh nghiệm</h4>
                                        {isEditing && (
                                            <Button
                                                variant="outline-success"
                                                size="sm"
                                                onClick={addExperience}
                                            >
                                                + Thêm kinh nghiệm
                                            </Button>
                                        )}
                                    </div>
                                    <hr />
                                    {experiences.length > 0 ? (
                                        experiences.map((exp, index) => (
                                            <div key={exp.id || index} className="mb-4">
                                                {isEditing ? (
                                                    <div className="p-3 border rounded mb-2 position-relative bg-light">
                                                        <Button
                                                            variant="danger"
                                                            size="sm"
                                                            className="position-absolute top-0 end-0 m-2"
                                                            onClick={() => removeExperience(index)}
                                                        >
                                                            ✕
                                                        </Button>
                                                        <Row className="g-2">
                                                            <Col md={6}>
                                                                <Form.Control
                                                                    type="date"
                                                                    value={exp.start_date || ""}
                                                                    onChange={(e) => handleExperienceChange(index, "start_date", e.target.value)}
                                                                />
                                                            </Col>
                                                            <Col md={6}>
                                                                <Form.Control
                                                                    type="date"
                                                                    value={exp.end_date || ""}
                                                                    onChange={(e) => handleExperienceChange(index, "end_date", e.target.value)}
                                                                />
                                                            </Col>
                                                            <Col md={12}>
                                                                <Form.Control
                                                                    placeholder="Tên công ty"
                                                                    value={exp.company_name || ""}
                                                                    onChange={(e) => handleExperienceChange(index, "company_name", e.target.value)}
                                                                />
                                                            </Col>
                                                            <Col md={12}>
                                                                <Form.Control
                                                                    placeholder="Vị trí / Chức vụ"
                                                                    value={exp.position || ""}
                                                                    onChange={(e) => handleExperienceChange(index, "position", e.target.value)}
                                                                />
                                                            </Col>
                                                            <Col md={12}>
                                                                <Form.Control
                                                                    as="textarea"
                                                                    rows={3}
                                                                    placeholder="Mô tả công việc"
                                                                    value={exp.description || ""}
                                                                    onChange={(e) => handleExperienceChange(index, "description", e.target.value)}
                                                                />
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <Badge bg="success">
                                                            {exp.start_date ? dayjs(exp.start_date).format("MM/YYYY") : ""} - {exp.end_date ? dayjs(exp.end_date).format("MM/YYYY") : "Hiện tại"}
                                                        </Badge>
                                                        <h5 className="mt-2 mb-1">{exp.position}</h5>
                                                        <div className="fw-bold text-muted">{exp.company_name}</div>
                                                        <p className="mt-2" style={{ whiteSpace: "pre-line" }}>{exp.description}</p>
                                                    </>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-muted">Chưa có kinh nghiệm làm việc.</p>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </div>
    );
};

export default CVTemplate3;