import {
    Card,
    Row,
    Col,
    Image,
    Form,
    Button
} from "react-bootstrap";
import { useEffect, useState, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import dayjs from "dayjs";

const CVTemplate3 = ({ cv, onSave }) => {
    const [form, setForm] = useState({});
    const [educations, setEducations] = useState([]);
    const [experiences, setExperiences] = useState([]);
    const [deletedEducationIds, setDeletedEducationIds] = useState([]);
    const [deletedExperienceIds, setDeletedExperienceIds] = useState([]);
    const [isExporting, setIsExporting] = useState(false);

    const cvRef = useRef(null);

    useEffect(() => {
        setForm(cv || {});
        setEducations(cv?.educations ? [...cv.educations] : []);
        setExperiences(cv?.experiences ? [...cv.experiences] : []);
    }, [cv]);

    const change = (field, value) => {
        setForm(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const save = () => {
        onSave({
            ...form,
            educations,
            experiences,
            deletedEducationIds,
            deletedExperienceIds
        });
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

            pdf.save(`${form.full_name || "CV"}.pdf`);
            setIsExporting(false);
        }, 100);
    };

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
                major: "",
                degree: "",
                gpa: "",
                start_date: "",
                end_date: ""
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

    return (
        <div>
            {!isExporting && (
                <div className="text-end mb-3">
                    <Button variant="primary" className="me-2" onClick={exportPDF}>
                        Xuất PDF
                    </Button>
                    <Button variant="success" onClick={save}>
                        Lưu CV
                    </Button>
                </div>
            )}

            <div ref={cvRef} style={{ background: "#ffffff", padding: isExporting ? "20px" : "0" }}>
                <Card className="shadow-lg border-0" style={{ minHeight: "100vh" }}>
                    
                    {/* TOP HEADER SECTION */}
                    <div className="bg-dark text-white p-4">
                        <Row className="align-items-center">
                            <Col md={3} xs={4} className="text-center">
                                <Image
                                    src={form.avatar || "https://via.placeholder.com/180"}
                                    roundedCircle
                                    style={{
                                        width: 140,
                                        height: 140,
                                        objectFit: "cover",
                                        border: "4px solid white"
                                    }}
                                />
                            </Col>
                            <Col md={9} xs={8}>
                                {isExporting ? (
                                    <div>
                                        <h2 className="fw-bold mb-1 text-uppercase">{form.full_name || "Họ và tên"}</h2>
                                        <h5 className="text-info opacity-100 mb-3">{form.job_title || "Vị trí ứng tuyển"}</h5>
                                        <div className="d-flex flex-wrap gap-3 fs-6 opacity-75">
                                            {form.email && <div><strong>Email:</strong> {form.email}</div>}
                                            {form.phone && <div><strong>SĐT:</strong> {form.phone}</div>}
                                            {form.expected_salary && <div><strong>Lương mong muốn:</strong> {form.expected_salary} VNĐ</div>}
                                            {form.experience_year && <div><strong>Kinh nghiệm:</strong> {form.experience_year} năm</div>}
                                        </div>
                                    </div>
                                ) : (
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-2">
                                                <Form.Label className="small text-light">Họ và tên</Form.Label>
                                                <Form.Control
                                                    placeholder="Họ và tên"
                                                    value={form.full_name || ""}
                                                    onChange={(e) => change("full_name", e.target.value)}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-2">
                                                <Form.Label className="small text-light">Vị trí làm việc</Form.Label>
                                                <Form.Control
                                                    placeholder="Vị trí làm việc"
                                                    value={form.job_title || ""}
                                                    onChange={(e) => change("job_title", e.target.value)}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-2">
                                                <Form.Label className="small text-light">Email</Form.Label>
                                                <Form.Control
                                                    value={form.email || ""}
                                                    onChange={(e) => change("email", e.target.value)}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-2">
                                                <Form.Label className="small text-light">Số điện thoại</Form.Label>
                                                <Form.Control
                                                    value={form.phone || ""}
                                                    onChange={(e) => change("phone", e.target.value)}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={4}>
                                            <Form.Group className="mb-2">
                                                <Form.Label className="small text-light">URL Avatar</Form.Label>
                                                <Form.Control
                                                    value={form.avatar || ""}
                                                    onChange={(e) => change("avatar", e.target.value)}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={4}>
                                            <Form.Group className="mb-2">
                                                <Form.Label className="small text-light">Mức lương mong muốn</Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    value={form.expected_salary || 0}
                                                    onChange={(e) => change("expected_salary", e.target.value)}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={4}>
                                            <Form.Group className="mb-2">
                                                <Form.Label className="small text-light">Kinh nghiệm (năm)</Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    value={form.experience_year || 0}
                                                    onChange={(e) => change("experience_year", e.target.value)}
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                )}
                            </Col>
                        </Row>
                    </div>

                    {/* MAIN CONTENT BODY */}
                    <div className="p-4 bg-white">
                        {isExporting ? (
                            <div className="mb-4">
                                <h3 className="fw-bold text-primary border-bottom pb-2">{form.title || "HỒ SƠ NĂNG LỰC"}</h3>
                            </div>
                        ) : (
                            <Form.Group className="mb-4">
                                <Form.Label className="fw-bold">Tiêu đề CV</Form.Label>
                                <Form.Control
                                    value={form.title || ""}
                                    onChange={(e) => change("title", e.target.value)}
                                />
                            </Form.Group>
                        )}

                        {/* GIỚI THIỆU */}
                        <div className="mb-4">
                            <h4 className="fw-bold border-bottom pb-2 text-dark">GIỚI THIỆU</h4>
                            {isExporting ? (
                                <p style={{ whiteSpace: "pre-line" }} className="text-secondary fs-6">
                                    {form.summary || "Chưa cập nhật"}
                                </p>
                            ) : (
                                <Form.Group>
                                    <Form.Control
                                        as="textarea"
                                        rows={4}
                                        value={form.summary || ""}
                                        onChange={(e) => change("summary", e.target.value)}
                                    />
                                </Form.Group>
                            )}
                        </div>

                        {/* HỌC VẤN */}
                        <div className="mb-4">
                            <h4 className="fw-bold border-bottom pb-2 text-dark">HỌC VẤN</h4>
                            {isExporting ? (
                                <div>
                                    {educations.map((edu, index) => (
                                        <div key={index} className="mb-3">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <h6 className="fw-bold mb-0 text-dark">{edu.school_name}</h6>
                                                <small className="text-muted">
                                                    {formatDate(edu.start_date)} - {formatDate(edu.end_date)}
                                                </small>
                                            </div>
                                            <div className="text-secondary fs-6">
                                                {edu.major && <span>Chuyên ngành: {edu.major}</span>}
                                                {edu.degree && <span> | Bằng cấp: {edu.degree}</span>}
                                                {edu.gpa && <span> | GPA: {edu.gpa}</span>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <>
                                    {educations.map((edu, index) => (
                                        <Card key={edu.id ?? index} className="mb-3 border shadow-sm">
                                            <Card.Body>
                                                <Row>
                                                    <Col md={6}>
                                                        <Form.Group className="mb-2">
                                                            <Form.Label>Trường</Form.Label>
                                                            <Form.Control
                                                                value={edu.school_name || ""}
                                                                onChange={(e) => changeEducation(index, "school_name", e.target.value)}
                                                            />
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md={6}>
                                                        <Form.Group className="mb-2">
                                                            <Form.Label>Chuyên ngành</Form.Label>
                                                            <Form.Control
                                                                value={edu.major || ""}
                                                                onChange={(e) => changeEducation(index, "major", e.target.value)}
                                                            />
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md={6}>
                                                        <Form.Group className="mb-2">
                                                            <Form.Label>Bằng cấp</Form.Label>
                                                            <Form.Control
                                                                value={edu.degree || ""}
                                                                onChange={(e) => changeEducation(index, "degree", e.target.value)}
                                                            />
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md={6}>
                                                        <Form.Group className="mb-2">
                                                            <Form.Label>GPA</Form.Label>
                                                            <Form.Control
                                                                value={edu.gpa || ""}
                                                                onChange={(e) => changeEducation(index, "gpa", e.target.value)}
                                                            />
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md={6}>
                                                        <Form.Group className="mb-2">
                                                            <Form.Label>Ngày bắt đầu</Form.Label>
                                                            <Form.Control
                                                                type="date"
                                                                value={edu.start_date || ""}
                                                                onChange={(e) => changeEducation(index, "start_date", e.target.value)}
                                                            />
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md={6}>
                                                        <Form.Group className="mb-2">
                                                            <Form.Label>Ngày kết thúc</Form.Label>
                                                            <Form.Control
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
                                    <Button variant="outline-primary" size="sm" className="mb-2" onClick={addEducation}>
                                        + Thêm học vấn
                                    </Button>
                                </>
                            )}
                        </div>

                        {/* KINH NGHIỆM LÀM VIỆC */}
                        <div className="mb-4">
                            <h4 className="fw-bold border-bottom pb-2 text-dark">KINH NGHIỆM LÀM VIỆC</h4>
                            {isExporting ? (
                                <div>
                                    {experiences.map((exp, index) => (
                                        <div key={index} className="mb-3">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <h6 className="fw-bold mb-0 text-dark">{exp.position} - {exp.company_name}</h6>
                                                <small className="text-muted">
                                                    {formatDate(exp.start_date)} - {formatDate(exp.end_date)}
                                                </small>
                                            </div>
                                            <p style={{ whiteSpace: "pre-line" }} className="text-secondary fs-6 mt-1">
                                                {exp.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <>
                                    {experiences.map((exp, index) => (
                                        <Card key={exp.id ?? index} className="mb-3 border shadow-sm">
                                            <Card.Body>
                                                <Row>
                                                    <Col md={6}>
                                                        <Form.Group className="mb-2">
                                                            <Form.Label>Công ty</Form.Label>
                                                            <Form.Control
                                                                value={exp.company_name || ""}
                                                                onChange={(e) => changeExperience(index, "company_name", e.target.value)}
                                                            />
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md={6}>
                                                        <Form.Group className="mb-2">
                                                            <Form.Label>Vị trí</Form.Label>
                                                            <Form.Control
                                                                value={exp.position || ""}
                                                                onChange={(e) => changeExperience(index, "position", e.target.value)}
                                                            />
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md={6}>
                                                        <Form.Group className="mb-2">
                                                            <Form.Label>Ngày bắt đầu</Form.Label>
                                                            <Form.Control
                                                                type="date"
                                                                value={exp.start_date || ""}
                                                                onChange={(e) => changeExperience(index, "start_date", e.target.value)}
                                                            />
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md={6}>
                                                        <Form.Group className="mb-2">
                                                            <Form.Label>Ngày kết thúc</Form.Label>
                                                            <Form.Control
                                                                type="date"
                                                                value={exp.end_date || ""}
                                                                onChange={(e) => changeExperience(index, "end_date", e.target.value)}
                                                            />
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md={12}>
                                                        <Form.Group className="mb-2">
                                                            <Form.Label>Mô tả công việc</Form.Label>
                                                            <Form.Control
                                                                as="textarea"
                                                                rows={3}
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
                                    <Button variant="outline-primary" size="sm" onClick={addExperience}>
                                        + Thêm kinh nghiệm
                                    </Button>
                                </>
                            )}
                        </div>

                    </div>
                </Card>
            </div>
        </div>
    );
};

export default CVTemplate3;