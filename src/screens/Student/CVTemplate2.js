import { useEffect, useState, useRef } from "react";
import {
    Card,
    Row,
    Col,
    Image,
    Badge,
    Form,
    Button,
    Spinner
} from "react-bootstrap";
import { authApis, endpoints } from "../../configs/Apis";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import dayjs from "dayjs";

const CVTemplate2 = ({ cv, onSave }) => {
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({});
    const [educations, setEducations] = useState([]);
    const [experiences, setExperiences] = useState([]);
    const [deletedEducationIds, setDeletedEducationIds] = useState([]);
    const [deletedExperienceIds, setDeletedExperienceIds] = useState([]);
    const [isExporting, setIsExporting] = useState(false);

    const cvRef = useRef(null);

    const loadData = async () => {
        try {
            if (cv) {
                setForm(cv);
                setEducations(cv.educations ? [...cv.educations] : []);
                setExperiences(cv.experiences ? [...cv.experiences] : []);
            } else {
                const [
                    profileRes,
                    educationRes,
                    experienceRes
                ] = await Promise.all([
                    authApis().get(endpoints.studentProfile),
                    authApis().get(endpoints.educations),
                    authApis().get(endpoints.experiences)
                ]);

                setForm(profileRes.data.data || {});
                setEducations(educationRes.data.data || []);
                setExperiences(experienceRes.data.data || []);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [cv]);

    const change = (field, value) => {
        setForm(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const save = () => {
        if (onSave) {
            onSave({
                ...form,
                educations,
                experiences,
                deletedEducationIds,
                deletedExperienceIds
            });
        }
    };

    const exportPDF = async () => {
        setIsExporting(true);
        setTimeout(async () => {
            const element = cvRef.current;
            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                backgroundColor: "#ffffff"
            });

            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "a4");
            const pdfWidth = 210;
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            let heightLeft = pdfHeight;
            let position = 0;

            pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
            heightLeft -= 297;

            while (heightLeft > 0) {
                position = heightLeft - pdfHeight;
                pdf.addPage();
                pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
                heightLeft -= 297;
            }

            pdf.save(`${form.full_name || "CV"}_Template2.pdf`);
            setIsExporting(false);
        }, 100);
    };

    // Quản lý Học vấn
    const changeEducation = (index, field, value) => {
        setEducations(prev => {
            const list = [...prev];
            list[index] = { ...list[index], [field]: value };
            return list;
        });
    };

    const addEducation = () => {
        setEducations(prev => [
            ...prev,
            {
                id: null,
                school_name: "",
                school: "",
                major: "",
                degree: "",
                gpa: "",
                start_date: "",
                end_date: "",
                start_year: "",
                end_year: ""
            }
        ]);
    };

    const removeEducation = (index) => {
        const item = educations[index];
        if (item.id) {
            setDeletedEducationIds(prev => [...prev, item.id]);
        }
        setEducations(prev => prev.filter((_, i) => i !== index));
    };

    // Quản lý Kinh nghiệm
    const changeExperience = (index, field, value) => {
        setExperiences(prev => {
            const list = [...prev];
            list[index] = { ...list[index], [field]: value };
            return list;
        });
    };

    const addExperience = () => {
        setExperiences(prev => [
            ...prev,
            {
                id: null,
                company_name: "",
                position: "",
                description: "",
                start_date: "",
                end_date: ""
            }
        ]);
    };

    const removeExperience = (index) => {
        const item = experiences[index];
        if (item.id) {
            setDeletedExperienceIds(prev => [...prev, item.id]);
        }
        setExperiences(prev => prev.filter((_, i) => i !== index));
    };

    const formatDate = (dateStr) => {
        return dateStr ? dayjs(dateStr).format("MM/YYYY") : "";
    };

    if (loading) {
        return (
            <div className="text-center my-5">
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    return (
        <div style={{ maxWidth: "950px", margin: "auto" }}>
            {/* Các nút hành động */}
            {!isExporting && (
                <div className="d-flex justify-content-end mb-3 gap-2">
                    <Button variant="primary" onClick={exportPDF}>
                        Xuất PDF
                    </Button>
                    {onSave && (
                        <Button variant="success" onClick={save}>
                            Lưu CV
                        </Button>
                    )}
                </div>
            )}

            {/* Vùng nội dung CV */}
            <div ref={cvRef} style={{ background: "#ffffff", padding: isExporting ? "20px" : "0" }}>
                <Card className="shadow-lg border-0 mb-5">
                    <Card.Body className="p-5">
                        {/* Header Profile - Bố cục căn giữa hiện đại */}
                        <div className="text-center mb-4">
                            <Image
                                roundedCircle
                                src={form.avatar || "https://via.placeholder.com/160"}
                                style={{
                                    width: 140,
                                    height: 140,
                                    objectFit: "cover",
                                    border: "3px solid #0d6efd",
                                    padding: "3px"
                                }}
                            />

                            {isExporting ? (
                                <div className="mt-3">
                                    <h1 className="fw-bold text-dark mb-1">{form.full_name || "Họ và tên"}</h1>
                                    <Badge bg="dark" className="fs-6 px-3 py-2 mb-2">
                                        {form.title || form.job_title || "Chưa cập nhật vị trí"}
                                    </Badge>
                                    <div className="text-muted fs-6">
                                        {form.email} {form.email && form.phone && " | "} {form.phone}
                                    </div>
                                </div>
                            ) : (
                                <Row className="justify-content-center mt-3 g-2">
                                    <Col md={6}>
                                        <Form.Control
                                            className="text-center fw-bold fs-5"
                                            placeholder="Họ và tên"
                                            value={form.full_name || ""}
                                            onChange={(e) => change("full_name", e.target.value)}
                                        />
                                    </Col>
                                    <Col md={6}>
                                        <Form.Control
                                            className="text-center"
                                            placeholder="Vị trí ứng tuyển / Tiêu đề CV"
                                            value={form.title || form.job_title || ""}
                                            onChange={(e) => change("title", e.target.value)}
                                        />
                                    </Col>
                                    <Col md={4}>
                                        <Form.Control
                                            size="sm"
                                            className="text-center"
                                            placeholder="Email"
                                            value={form.email || ""}
                                            onChange={(e) => change("email", e.target.value)}
                                        />
                                    </Col>
                                    <Col md={4}>
                                        <Form.Control
                                            size="sm"
                                            className="text-center"
                                            placeholder="Số điện thoại"
                                            value={form.phone || ""}
                                            onChange={(e) => change("phone", e.target.value)}
                                        />
                                    </Col>
                                    <Col md={4}>
                                        <Form.Control
                                            size="sm"
                                            className="text-center"
                                            placeholder="Link Avatar"
                                            value={form.avatar || ""}
                                            onChange={(e) => change("avatar", e.target.value)}
                                        />
                                    </Col>
                                </Row>
                            )}
                        </div>

                        <hr className="my-4" />

                        {/* Phần Giới thiệu */}
                        <div className="mb-4">
                            <h4 className="fw-bold text-primary border-bottom border-2 border-primary pb-1 d-inline-block">
                                GIỚI THIỆU
                            </h4>
                            {isExporting ? (
                                <p style={{ whiteSpace: "pre-line" }} className="mt-2 text-dark fs-6 lh-base">
                                    {form.summary || "Chưa cập nhật phần giới thiệu bản thân."}
                                </p>
                            ) : (
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    className="mt-2"
                                    placeholder="Tóm tắt về bản thân, mục tiêu nghề nghiệp..."
                                    value={form.summary || ""}
                                    onChange={(e) => change("summary", e.target.value)}
                                />
                            )}
                        </div>

                        {/* Phần Học vấn */}
                        <div className="mb-4">
                            <h4 className="fw-bold text-primary border-bottom border-2 border-primary pb-1 d-inline-block">
                                HỌC VẤN
                            </h4>

                            {isExporting ? (
                                educations.length === 0 ? (
                                    <p className="text-muted mt-2">Chưa có thông tin học vấn.</p>
                                ) : (
                                    educations.map((edu, index) => (
                                        <div key={index} className="mt-3">
                                            <div className="d-flex justify-content-between align-items-baseline">
                                                <h5 className="fw-bold text-dark mb-0">
                                                    {edu.school_name || edu.school || "Chưa nhập tên trường"}
                                                </h5>
                                                <small className="text-muted fw-bold">
                                                    {edu.start_date ? formatDate(edu.start_date) : edu.start_year || ""}
                                                    {" - "}
                                                    {edu.end_date ? formatDate(edu.end_date) : edu.end_year || "Hiện tại"}
                                                </small>
                                            </div>
                                            <div className="text-secondary fw-semibold">
                                                {edu.major && <span>Chuyên ngành: {edu.major}</span>}
                                                {edu.degree && <span> | Bằng cấp: {edu.degree}</span>}
                                                {edu.gpa && <span> | GPA: {edu.gpa}</span>}
                                            </div>
                                        </div>
                                    ))
                                )
                            ) : (
                                <>
                                    {educations.map((edu, index) => (
                                        <Card key={edu.id ?? index} className="my-3 border shadow-sm">
                                            <Card.Body>
                                                <Row className="g-2">
                                                    <Col md={6}>
                                                        <Form.Group>
                                                            <Form.Label className="small mb-1">Trường/Đại học</Form.Label>
                                                            <Form.Control
                                                                size="sm"
                                                                value={edu.school_name || edu.school || ""}
                                                                onChange={(e) => changeEducation(index, "school_name", e.target.value)}
                                                            />
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md={6}>
                                                        <Form.Group>
                                                            <Form.Label className="small mb-1">Chuyên ngành</Form.Label>
                                                            <Form.Control
                                                                size="sm"
                                                                value={edu.major || ""}
                                                                onChange={(e) => changeEducation(index, "major", e.target.value)}
                                                            />
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md={3}>
                                                        <Form.Group>
                                                            <Form.Label className="small mb-1">Bằng cấp</Form.Label>
                                                            <Form.Control
                                                                size="sm"
                                                                value={edu.degree || ""}
                                                                onChange={(e) => changeEducation(index, "degree", e.target.value)}
                                                            />
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md={3}>
                                                        <Form.Group>
                                                            <Form.Label className="small mb-1">GPA</Form.Label>
                                                            <Form.Control
                                                                size="sm"
                                                                value={edu.gpa || ""}
                                                                onChange={(e) => changeEducation(index, "gpa", e.target.value)}
                                                            />
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md={3}>
                                                        <Form.Group>
                                                            <Form.Label className="small mb-1">Ngày bắt đầu</Form.Label>
                                                            <Form.Control
                                                                size="sm"
                                                                type="date"
                                                                value={edu.start_date || ""}
                                                                onChange={(e) => changeEducation(index, "start_date", e.target.value)}
                                                            />
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md={3}>
                                                        <Form.Group>
                                                            <Form.Label className="small mb-1">Ngày kết thúc</Form.Label>
                                                            <Form.Control
                                                                size="sm"
                                                                type="date"
                                                                value={edu.end_date || ""}
                                                                onChange={(e) => changeEducation(index, "end_date", e.target.value)}
                                                            />
                                                        </Form.Group>
                                                    </Col>
                                                </Row>
                                                <div className="text-end mt-2">
                                                    <Button variant="outline-danger" size="sm" onClick={() => removeEducation(index)}>
                                                        Xóa
                                                    </Button>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    ))}
                                    <Button variant="outline-primary" size="sm" className="mt-2" onClick={addEducation}>
                                        + Thêm học vấn
                                    </Button>
                                </>
                            )}
                        </div>

                        {/* Phần Kinh nghiệm */}
                        <div className="mb-4">
                            <h4 className="fw-bold text-primary border-bottom border-2 border-primary pb-1 d-inline-block">
                                KINH NGHIỆM LÀM VIỆC
                            </h4>

                            {isExporting ? (
                                experiences.length === 0 ? (
                                    <p className="text-muted mt-2">Chưa có thông tin kinh nghiệm.</p>
                                ) : (
                                    experiences.map((exp, index) => (
                                        <div key={index} className="mt-3">
                                            <div className="d-flex justify-content-between align-items-baseline">
                                                <h5 className="fw-bold text-dark mb-0">{exp.company_name}</h5>
                                                <small className="text-muted fw-bold">
                                                    {formatDate(exp.start_date)} - {exp.end_date ? formatDate(exp.end_date) : "Hiện tại"}
                                                </small>
                                            </div>
                                            <div className="text-primary fw-bold fs-6">{exp.position}</div>
                                            <p style={{ whiteSpace: "pre-line" }} className="mt-2 text-secondary fs-6">
                                                {exp.description}
                                            </p>
                                        </div>
                                    ))
                                )
                            ) : (
                                <>
                                    {experiences.map((exp, index) => (
                                        <Card key={exp.id ?? index} className="my-3 border shadow-sm">
                                            <Card.Body>
                                                <Row className="g-2">
                                                    <Col md={6}>
                                                        <Form.Group>
                                                            <Form.Label className="small mb-1">Công ty</Form.Label>
                                                            <Form.Control
                                                                size="sm"
                                                                value={exp.company_name || ""}
                                                                onChange={(e) => changeExperience(index, "company_name", e.target.value)}
                                                            />
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md={6}>
                                                        <Form.Group>
                                                            <Form.Label className="small mb-1">Vị trí</Form.Label>
                                                            <Form.Control
                                                                size="sm"
                                                                value={exp.position || ""}
                                                                onChange={(e) => changeExperience(index, "position", e.target.value)}
                                                            />
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md={6}>
                                                        <Form.Group>
                                                            <Form.Label className="small mb-1">Ngày bắt đầu</Form.Label>
                                                            <Form.Control
                                                                size="sm"
                                                                type="date"
                                                                value={exp.start_date || ""}
                                                                onChange={(e) => changeExperience(index, "start_date", e.target.value)}
                                                            />
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md={6}>
                                                        <Form.Group>
                                                            <Form.Label className="small mb-1">Ngày kết thúc</Form.Label>
                                                            <Form.Control
                                                                size="sm"
                                                                type="date"
                                                                value={exp.end_date || ""}
                                                                onChange={(e) => changeExperience(index, "end_date", e.target.value)}
                                                            />
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md={12}>
                                                        <Form.Group>
                                                            <Form.Label className="small mb-1">Mô tả công việc</Form.Label>
                                                            <Form.Control
                                                                as="textarea"
                                                                rows={3}
                                                                size="sm"
                                                                value={exp.description || ""}
                                                                onChange={(e) => changeExperience(index, "description", e.target.value)}
                                                            />
                                                        </Form.Group>
                                                    </Col>
                                                </Row>
                                                <div className="text-end mt-2">
                                                    <Button variant="outline-danger" size="sm" onClick={() => removeExperience(index)}>
                                                        Xóa
                                                    </Button>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    ))}
                                    <Button variant="outline-primary" size="sm" className="mt-2" onClick={addExperience}>
                                        + Thêm kinh nghiệm
                                    </Button>
                                </>
                            )}
                        </div>

                        {/* Phần Thông tin bổ sung */}
                        <div className="mb-2">
                            <h4 className="fw-bold text-primary border-bottom border-2 border-primary pb-1 d-inline-block">
                                THÔNG TIN BỔ SUNG
                            </h4>
                            {isExporting ? (
                                <Row className="mt-2">
                                    <Col md={6}>
                                        <p className="mb-1">
                                            <b>Số năm kinh nghiệm:</b> {form.experience_year || 0} năm
                                        </p>
                                    </Col>
                                    <Col md={6}>
                                        <p className="mb-1">
                                            <b>Mức lương mong muốn:</b> {form.expected_salary ? Number(form.expected_salary).toLocaleString() : 0} VNĐ
                                        </p>
                                    </Col>
                                </Row>
                            ) : (
                                <Row className="mt-2 g-2">
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label className="small mb-1">Số năm kinh nghiệm</Form.Label>
                                            <Form.Control
                                                type="number"
                                                size="sm"
                                                value={form.experience_year || 0}
                                                onChange={(e) => change("experience_year", e.target.value)}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label className="small mb-1">Mức lương mong muốn (VNĐ)</Form.Label>
                                            <Form.Control
                                                type="number"
                                                size="sm"
                                                value={form.expected_salary || 0}
                                                onChange={(e) => change("expected_salary", e.target.value)}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                            )}
                        </div>
                    </Card.Body>
                </Card>
            </div>
        </div>
    );
};

export default CVTemplate2;