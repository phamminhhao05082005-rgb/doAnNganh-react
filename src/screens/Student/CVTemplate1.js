import { Card, Row, Col, Image, Form, Button } from "react-bootstrap";
import { useEffect, useState, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import dayjs from "dayjs";

const CVTemplate1 = ({
    cv,
    onSave,
    editable = true
}) => {
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
        if (item?.id) {
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
        if (item?.id) {
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
                    <Button
                        variant="primary"
                        className={editable ? "me-2" : ""}
                        onClick={exportPDF}
                    >
                        Xuất PDF
                    </Button>

                    {editable && (
                        <Button
                            variant="success"
                            onClick={save}
                        >
                            Lưu CV
                        </Button>
                    )}
                </div>
            )}

            <div ref={cvRef} style={{ background: "#ffffff", padding: isExporting ? "20px" : "0" }}>
                <Card className="shadow-lg border-0" style={{ minHeight: "100vh" }}>
                    <Row className="g-0">
                        <Col md={4} xs={4} className="bg-dark text-white p-4">
                            <div className="text-center mb-4">
                                <Image
                                    src={form.avatar || "https://via.placeholder.com/180"}
                                    roundedCircle
                                    style={{
                                        width: 150,
                                        height: 150,
                                        objectFit: "cover",
                                        border: "4px solid white"
                                    }}
                                />
                                {!editable || isExporting ? (
                                    <div className="mt-3">
                                        <h4 className="fw-bold mb-1">{form.full_name || "Họ và tên"}</h4>
                                        <div className="text-light opacity-75">{form.job_title || "Vị trí ứng tuyển"}</div>
                                    </div>
                                ) : (
                                    <>
                                        <Form.Group className="mt-3">
                                            <Form.Control
                                                placeholder="Họ và tên"
                                                value={form.full_name || ""}
                                                onChange={(e) => change("full_name", e.target.value)}
                                            />
                                        </Form.Group>
                                        <Form.Group className="mt-2">
                                            <Form.Control
                                                placeholder="Vị trí làm việc"
                                                value={form.job_title || ""}
                                                onChange={(e) => change("job_title", e.target.value)}
                                            />
                                        </Form.Group>
                                    </>
                                )}
                            </div>

                            <hr className="bg-light" />

                            <h5 className="fw-bold mb-3">THÔNG TIN LIÊN HỆ</h5>
                            {!editable || isExporting ? (
                                <div className="lh-lg fs-6">
                                    {form.email && <div><strong>Email:</strong> {form.email}</div>}
                                    {form.phone && <div><strong>SĐT:</strong> {form.phone}</div>}
                                    {form.expected_salary && <div><strong>Lương mong muốn:</strong> {form.expected_salary} VNĐ</div>}
                                    {form.experience_year !== undefined && <div><strong>Kinh nghiệm:</strong> {form.experience_year} năm</div>}
                                </div>
                            ) : (
                                <>
                                    <Form.Group className="mb-2">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control
                                            value={form.email || ""}
                                            onChange={(e) => change("email", e.target.value)}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-2">
                                        <Form.Label>Số điện thoại</Form.Label>
                                        <Form.Control
                                            value={form.phone || ""}
                                            onChange={(e) => change("phone", e.target.value)}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-2">
                                        <Form.Label>URL Avatar</Form.Label>
                                        <Form.Control
                                            value={form.avatar || ""}
                                            onChange={(e) => change("avatar", e.target.value)}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-2">
                                        <Form.Label>Mức lương mong muốn</Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={form.expected_salary || 0}
                                            onChange={(e) => change("expected_salary", e.target.value)}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-2">
                                        <Form.Label>Kinh nghiệm (năm)</Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={form.experience_year || 0}
                                            onChange={(e) => change("experience_year", e.target.value)}
                                        />
                                    </Form.Group>
                                </>
                            )}
                        </Col>

                        <Col md={8} xs={8} className="p-4 bg-white">
                            {!editable || isExporting ? (
                                <div className="mb-4">
                                    <h2 className="fw-bold text-primary">{form.title || "HỒ SƠ NĂNG LỰC"}</h2>
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

                            <h4 className="fw-bold border-bottom pb-2 text-dark">GIỚI THIỆU</h4>
                            {!editable || isExporting ? (
                                <p style={{ whiteSpace: "pre-line" }} className="text-secondary fs-6">
                                    {form.summary || "Chưa cập nhật phần giới thiệu bản thân."}
                                </p>
                            ) : (
                                <Form.Group className="mb-4">
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        value={form.summary || ""}
                                        onChange={(e) => change("summary", e.target.value)}
                                    />
                                </Form.Group>
                            )}

                            <h4 className="fw-bold border-bottom pb-2 text-dark mt-4">HỌC VẤN</h4>
                            {!editable || isExporting ? (
                                <div>
                                    {educations.map((edu, index) => (
                                        <div key={index} className="mb-3">
                                            <div className="fw-bold text-dark">{edu.school_name}</div>
                                            <div className="text-primary">{edu.major} {edu.degree ? `- ${edu.degree}` : ""}</div>
                                            <div className="text-muted small">
                                                {formatDate(edu.start_date)} - {formatDate(edu.end_date) || "Hiện tại"}
                                                {edu.gpa && ` | GPA: ${edu.gpa}`}
                                            </div>
                                        </div>
                                    ))}
                                    {educations.length === 0 && <p className="text-muted">Chưa có thông tin học vấn.</p>}
                                </div>
                            ) : (
                                <div>
                                    {educations.map((edu, index) => (
                                        <Card key={index} className="mb-3 p-3 bg-light border">
                                            <Row className="g-2">
                                                <Col md={6}>
                                                    <Form.Group>
                                                        <Form.Label className="small fw-bold">Trường</Form.Label>
                                                        <Form.Control
                                                            size="sm"
                                                            value={edu.school_name || ""}
                                                            onChange={(e) => changeEducation(index, "school_name", e.target.value)}
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col md={6}>
                                                    <Form.Group>
                                                        <Form.Label className="small fw-bold">Chuyên ngành</Form.Label>
                                                        <Form.Control
                                                            size="sm"
                                                            value={edu.major || ""}
                                                            onChange={(e) => changeEducation(index, "major", e.target.value)}
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col md={4}>
                                                    <Form.Group>
                                                        <Form.Label className="small fw-bold">Bằng cấp</Form.Label>
                                                        <Form.Control
                                                            size="sm"
                                                            value={edu.degree || ""}
                                                            onChange={(e) => changeEducation(index, "degree", e.target.value)}
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col md={2}>
                                                    <Form.Group>
                                                        <Form.Label className="small fw-bold">GPA</Form.Label>
                                                        <Form.Control
                                                            size="sm"
                                                            value={edu.gpa || ""}
                                                            onChange={(e) => changeEducation(index, "gpa", e.target.value)}
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col md={3}>
                                                    <Form.Group>
                                                        <Form.Label className="small fw-bold">Bắt đầu</Form.Label>
                                                        <Form.Control
                                                            type="date"
                                                            size="sm"
                                                            value={edu.start_date ? edu.start_date.substring(0, 10) : ""}
                                                            onChange={(e) => changeEducation(index, "start_date", e.target.value)}
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col md={3}>
                                                    <Form.Group>
                                                        <Form.Label className="small fw-bold">Kết thúc</Form.Label>
                                                        <Form.Control
                                                            type="date"
                                                            size="sm"
                                                            value={edu.end_date ? edu.end_date.substring(0, 10) : ""}
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
                                        </Card>
                                    ))}
                                    <Button variant="outline-primary" size="sm" onClick={addEducation}>
                                        + Thêm Học Vấn
                                    </Button>
                                </div>
                            )}

                            <h4 className="fw-bold border-bottom pb-2 text-dark mt-4">KINH NGHIỆM LÀM VIỆC</h4>
                            {!editable || isExporting ? (
                                <div>
                                    {experiences.map((exp, index) => (
                                        <div key={index} className="mb-3">
                                            <div className="fw-bold text-dark">{exp.position}</div>
                                            <div className="text-primary">{exp.company_name}</div>
                                            <div className="text-muted small mb-1">
                                                {formatDate(exp.start_date)} - {formatDate(exp.end_date) || "Hiện tại"}
                                            </div>
                                            <p style={{ whiteSpace: "pre-line" }} className="text-secondary small">
                                                {exp.description}
                                            </p>
                                        </div>
                                    ))}
                                    {experiences.length === 0 && <p className="text-muted">Chưa có thông tin kinh nghiệm.</p>}
                                </div>
                            ) : (
                                <div>
                                    {experiences.map((exp, index) => (
                                        <Card key={index} className="mb-3 p-3 bg-light border">
                                            <Row className="g-2">
                                                <Col md={6}>
                                                    <Form.Group>
                                                        <Form.Label className="small fw-bold">Công ty</Form.Label>
                                                        <Form.Control
                                                            size="sm"
                                                            value={exp.company_name || ""}
                                                            onChange={(e) => changeExperience(index, "company_name", e.target.value)}
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col md={6}>
                                                    <Form.Group>
                                                        <Form.Label className="small fw-bold">Vị trí</Form.Label>
                                                        <Form.Control
                                                            size="sm"
                                                            value={exp.position || ""}
                                                            onChange={(e) => changeExperience(index, "position", e.target.value)}
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col md={6}>
                                                    <Form.Group>
                                                        <Form.Label className="small fw-bold">Bắt đầu</Form.Label>
                                                        <Form.Control
                                                            type="date"
                                                            size="sm"
                                                            value={exp.start_date ? exp.start_date.substring(0, 10) : ""}
                                                            onChange={(e) => changeExperience(index, "start_date", e.target.value)}
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col md={6}>
                                                    <Form.Group>
                                                        <Form.Label className="small fw-bold">Kết thúc</Form.Label>
                                                        <Form.Control
                                                            type="date"
                                                            size="sm"
                                                            value={exp.end_date ? exp.end_date.substring(0, 10) : ""}
                                                            onChange={(e) => changeExperience(index, "end_date", e.target.value)}
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col md={12}>
                                                    <Form.Group>
                                                        <Form.Label className="small fw-bold">Mô tả công việc</Form.Label>
                                                        <Form.Control
                                                            as="textarea"
                                                            rows={2}
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
                                        </Card>
                                    ))}
                                    <Button variant="outline-primary" size="sm" onClick={addExperience}>
                                        + Thêm Kinh Nghiệm
                                    </Button>
                                </div>
                            )}
                        </Col>
                    </Row>
                </Card>
            </div>
        </div>
    );
};

export default CVTemplate1; 