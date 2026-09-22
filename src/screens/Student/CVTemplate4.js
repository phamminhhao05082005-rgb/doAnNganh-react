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

const CVTemplate4 = ({ cv, onSave, editable = true }) => {
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
                    <Button variant="primary" className={editable ? "me-2" : ""} onClick={exportPDF}>
                        Xuất PDF
                    </Button>
                    {editable && (
                        <Button variant="success" onClick={save}>
                            Lưu CV
                        </Button>
                    )}
                </div>
            )}

            <div ref={cvRef} style={{ background: "#ffffff", padding: isExporting ? "20px" : "0" }}>
                <Card className="shadow-lg border-0" style={{ minHeight: "100vh" }}>
                    <div className="p-4" style={{ backgroundColor: "#1e293b", color: "#ffffff" }}>
                        <Row className="align-items-center">
                            <Col md={3} xs={3} className="text-center">
                                <Image
                                    src={form.avatar || "https://via.placeholder.com/180"}
                                    roundedCircle
                                    style={{
                                        width: 130,
                                        height: 130,
                                        objectFit: "cover",
                                        border: "3px solid #38bdf8"
                                    }}
                                />
                            </Col>
                            <Col md={9} xs={9}>
                                {!editable || isExporting ? (
                                    <div>
                                        <h1 className="fw-bold mb-1 text-uppercase" style={{ letterSpacing: "1px" }}>{form.full_name || "Họ và tên"}</h1>
                                        <h5 className="text-info fw-normal mb-3">{form.job_title || "Vị trí ứng tuyển"}</h5>
                                        <div className="d-flex flex-wrap gap-3 fs-6 opacity-75">
                                            {form.email && <span>📧 {form.email}</span>}
                                            {form.phone && <span>📞 {form.phone}</span>}
                                            {form.experience_year && <span>💼 {form.experience_year} năm kinh nghiệm</span>}
                                            {form.expected_salary && <span>💰 {form.expected_salary} VNĐ</span>}
                                        </div>
                                    </div>
                                ) : (
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-2">
                                                <Form.Control
                                                    placeholder="Họ và tên"
                                                    value={form.full_name || ""}
                                                    onChange={(e) => change("full_name", e.target.value)}
                                                />
                                            </Form.Group>
                                            <Form.Group className="mb-2">
                                                <Form.Control
                                                    placeholder="Vị trí làm việc"
                                                    value={form.job_title || ""}
                                                    onChange={(e) => change("job_title", e.target.value)}
                                                />
                                            </Form.Group>
                                            
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-2">
                                                <Form.Control
                                                    placeholder="Email"
                                                    value={form.email || ""}
                                                    onChange={(e) => change("email", e.target.value)}
                                                />
                                            </Form.Group>
                                            <Form.Group className="mb-2">
                                                <Form.Control
                                                    placeholder="Số điện thoại"
                                                    value={form.phone || ""}
                                                    onChange={(e) => change("phone", e.target.value)}
                                                />
                                            </Form.Group>
                                            <Row>
                                                <Col md={6}>
                                                    <Form.Group className="mb-2">
                                                        <Form.Control
                                                            type="number"
                                                            placeholder="Lương mong muốn"
                                                            value={form.expected_salary || 0}
                                                            onChange={(e) => change("expected_salary", e.target.value)}
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col md={6}>
                                                    <Form.Group className="mb-2">
                                                        <Form.Control
                                                            type="number"
                                                            placeholder="Kinh nghiệm (năm)"
                                                            value={form.experience_year || 0}
                                                            onChange={(e) => change("experience_year", e.target.value)}
                                                        />
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                )}
                            </Col>
                        </Row>
                    </div>

                    <div className="p-4 bg-white">
                        {!editable || isExporting ? (
                            <div className="mb-4">
                                <h3 className="fw-bold text-dark border-start border-4 border-info ps-3">{form.title || "HỒ SƠ NĂNG LỰC"}</h3>
                            </div>
                        ) : (
                            <Form.Group className="mb-4">
                                <Form.Label className="fw-bold text-dark">Tiêu đề CV</Form.Label>
                                <Form.Control
                                    value={form.title || ""}
                                    onChange={(e) => change("title", e.target.value)}
                                />
                            </Form.Group>
                        )}

                        <div className="mb-4">
                            <h5 className="fw-bold text-uppercase border-bottom pb-2 text-primary">Giới thiệu bản thân</h5>
                            {!editable || isExporting ? (
                                <p style={{ whiteSpace: "pre-line" }} className="text-secondary fs-6 leading-relaxed">
                                    {form.summary || "Chưa cập nhật"}
                                </p>
                            ) : (
                                <Form.Group>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        value={form.summary || ""}
                                        onChange={(e) => change("summary", e.target.value)}
                                    />
                                </Form.Group>
                            )}
                        </div>

                        <Row>
                            <Col md={6} xs={6}>
                                <h5 className="fw-bold text-uppercase border-bottom pb-2 text-primary">Học vấn</h5>
                                {!editable || isExporting ? (
                                    <div>
                                        {educations.map((edu, index) => (
                                            <div key={index} className="mb-3 p-3 bg-light rounded border-start border-3 border-primary">
                                                <div className="fw-bold text-dark fs-6">{edu.school_name}</div>
                                                <div className="text-primary small fw-semibold">
                                                    {formatDate(edu.start_date)} - {formatDate(edu.end_date)}
                                                </div>
                                                <div className="text-muted small mt-1">
                                                    {edu.major && <div>Chuyên ngành: {edu.major}</div>}
                                                    {edu.degree && <div>Bằng cấp: {edu.degree}</div>}
                                                    {edu.gpa && <div>GPA: {edu.gpa}</div>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <>
                                        {educations.map((edu, index) => (
                                            <Card key={edu.id ?? index} className="mb-3 border shadow-sm">
                                                <Card.Body>
                                                    <Form.Group className="mb-2">
                                                        <Form.Label>Trường</Form.Label>
                                                        <Form.Control
                                                            value={edu.school_name || ""}
                                                            onChange={(e) => changeEducation(index, "school_name", e.target.value)}
                                                        />
                                                    </Form.Group>
                                                    <Form.Group className="mb-2">
                                                        <Form.Label>Chuyên ngành</Form.Label>
                                                        <Form.Control
                                                            value={edu.major || ""}
                                                            onChange={(e) => changeEducation(index, "major", e.target.value)}
                                                        />
                                                    </Form.Group>
                                                    <Row>
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
                                                    </Row>
                                                    <Row>
                                                        <Col md={6}>
                                                            <Form.Group className="mb-2">
                                                                <Form.Label>Từ ngày</Form.Label>
                                                                <Form.Control
                                                                    type="date"
                                                                    value={edu.start_date || ""}
                                                                    onChange={(e) => changeEducation(index, "start_date", e.target.value)}
                                                                />
                                                            </Form.Group>
                                                        </Col>
                                                        <Col md={6}>
                                                            <Form.Group className="mb-2">
                                                                <Form.Label>Đến ngày</Form.Label>
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
                                        <Button variant="outline-primary" size="sm" className="mb-4" onClick={addEducation}>
                                            + Thêm học vấn
                                        </Button>
                                    </>
                                )}
                            </Col>

                            <Col md={6} xs={6}>
                                <h5 className="fw-bold text-uppercase border-bottom pb-2 text-primary">Kinh nghiệm làm việc</h5>
                                {!editable || isExporting ? (
                                    <div>
                                        {experiences.map((exp, index) => (
                                            <div key={index} className="mb-3 p-3 bg-light rounded border-start border-3 border-info">
                                                <div className="fw-bold text-dark fs-6">{exp.position}</div>
                                                <div className="text-info small fw-semibold">
                                                    {exp.company_name} | {formatDate(exp.start_date)} - {formatDate(exp.end_date)}
                                                </div>
                                                <p style={{ whiteSpace: "pre-line" }} className="text-secondary small mt-2 mb-0">
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
                                                    <Form.Group className="mb-2">
                                                        <Form.Label>Công ty</Form.Label>
                                                        <Form.Control
                                                            value={exp.company_name || ""}
                                                            onChange={(e) => changeExperience(index, "company_name", e.target.value)}
                                                        />
                                                    </Form.Group>
                                                    <Form.Group className="mb-2">
                                                        <Form.Label>Vị trí</Form.Label>
                                                        <Form.Control
                                                            value={exp.position || ""}
                                                            onChange={(e) => changeExperience(index, "position", e.target.value)}
                                                        />
                                                    </Form.Group>
                                                    <Row>
                                                        <Col md={6}>
                                                            <Form.Group className="mb-2">
                                                                <Form.Label>Từ ngày</Form.Label>
                                                                <Form.Control
                                                                    type="date"
                                                                    value={exp.start_date || ""}
                                                                    onChange={(e) => changeExperience(index, "start_date", e.target.value)}
                                                                />
                                                            </Form.Group>
                                                        </Col>
                                                        <Col md={6}>
                                                            <Form.Group className="mb-2">
                                                                <Form.Label>Đến ngày</Form.Label>
                                                                <Form.Control
                                                                    type="date"
                                                                    value={exp.end_date || ""}
                                                                    onChange={(e) => changeExperience(index, "end_date", e.target.value)}
                                                                />
                                                            </Form.Group>
                                                        </Col>
                                                    </Row>
                                                    <Form.Group className="mb-2">
                                                        <Form.Label>Mô tả công việc</Form.Label>
                                                        <Form.Control
                                                            as="textarea"
                                                            rows={2}
                                                            value={exp.description || ""}
                                                            onChange={(e) => changeExperience(index, "description", e.target.value)}
                                                        />
                                                    </Form.Group>
                                                    <div className="text-end mt-2">
                                                        <Button variant="outline-danger" size="sm" onClick={() => removeExperience(index)}>
                                                            Xóa
                                                        </Button>
                                                    </div>
                                                </Card.Body>
                                            </Card>
                                        ))}
                                        <Button variant="outline-primary" size="sm" className="mb-4" onClick={addExperience}>
                                            + Thêm kinh nghiệm
                                        </Button>
                                    </>
                                )}
                            </Col>
                        </Row>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default CVTemplate4;