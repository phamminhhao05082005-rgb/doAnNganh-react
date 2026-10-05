import { useEffect, useState } from "react";
import { Form, Button, Card, Spinner, Badge, Row, Col, Container } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { authApis, endpoints } from "../../configs/Apis";

const JobForm = () => {
    const { id } = useParams();
    const nav = useNavigate();
    const [categories, setCategories] = useState([]);
    const [skills, setSkills] = useState([]);
    const [errors, setErrors] = useState({});

    const [skillPage, setSkillPage] = useState(1);
    const [hasMoreSkills, setHasMoreSkills] = useState(true);
    const [loadingSkills, setLoadingSkills] = useState(false);
    
    const [data, setData] = useState({
        category_id: "",
        title: "",
        description: "",
        requirement: "",
        salary_min: "",
        salary_max: "",
        location: "",
        working_time: "",
        experience: "",
        deadline: "",
        status: true,
        skills: []
    });

    const loadCategories = async () => {
        try {
            const res = await authApis().get(endpoints.categories);
            setCategories(res.data.data || []);
        } catch (err) {
            console.log("Lỗi load danh mục:", err);
        }
    };

    const loadSkills = async () => {
        try {
            setLoadingSkills(true);
            const res = await authApis().get(endpoints.skills, {
                params: { page: skillPage }
            });

            const newSkills = res.data.data || [];

            if (skillPage === 1) {
                setSkills(newSkills);
            } else {
                setSkills(prev => [...prev, ...newSkills]);
            }

            const currentPage = res.data.meta?.current_page || skillPage;
            const lastPage = res.data.meta?.last_page || 1;

            setHasMoreSkills(currentPage < lastPage);
        } catch (err) {
            console.log("Lỗi load kỹ năng:", err);
        } finally {
            setLoadingSkills(false);
        }
    };

    const loadJob = async () => {
        if (!id) return;
        try {
            const res = await authApis().get(endpoints.jobDetail(id));
            const job = res.data.data;
            setData({
                category_id: job.category_id || "",
                title: job.title || "",
                description: job.description || "",
                requirement: job.requirement || "",
                salary_min: job.salary_min !== undefined ? String(job.salary_min) : "",
                salary_max: job.salary_max !== undefined ? String(job.salary_max) : "",
                location: job.location || "",
                working_time: job.working_time || "", 
                experience: job.experience !== undefined ? String(job.experience) : "",
                deadline: job.deadline || "",
                status: job.status ?? true,
                skills: job.skills ? job.skills.map(s => s.id) : []
            });
        } catch (err) {
            console.log("Lỗi load thông tin công việc:", err);
        }
    };

    useEffect(() => {
        loadCategories();
        loadJob();
    }, [id]);

    useEffect(() => {
        loadSkills();
    }, [skillPage]);

    const loadMoreSkills = () => {
        if (!loadingSkills && hasMoreSkills) {
            setSkillPage(prev => prev + 1);
        }
    };

    const change = (field, value) => {
        setData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: null }));
        }
    };

    const handleNumericChange = (field, value) => {
        if (/^\d*$/.test(value)) {
            change(field, value);
        }
    };

    const toggleSkill = (skillId) => {
        let updatedSkills;
        if (data.skills.includes(skillId)) {
            updatedSkills = data.skills.filter(i => i !== skillId);
        } else {
            updatedSkills = [...data.skills, skillId];
        }
        change("skills", updatedSkills);
    };

    const validate = () => {
        const newErrors = {};

        if (!data.title.trim()) newErrors.title = "Vui lòng nhập tiêu đề";
        if (!data.category_id) newErrors.category_id = "Vui lòng chọn danh mục";
        if (!data.location.trim()) newErrors.location = "Vui lòng nhập địa điểm";
        
        if (!data.working_time.trim()) newErrors.working_time = "Vui lòng nhập thời gian làm việc";

        if (!String(data.experience).trim()) {
            newErrors.experience = "Vui lòng nhập số năm kinh nghiệm";
        } else if (!/^\d+$/.test(String(data.experience).trim())) {
            newErrors.experience = "Kinh nghiệm chỉ được điền số";
        }

        if (!String(data.salary_min).trim()) {
            newErrors.salary_min = "Vui lòng nhập lương tối thiểu";
        } else if (!/^\d+$/.test(String(data.salary_min).trim())) {
            newErrors.salary_min = "Lương tối thiểu chỉ được điền số";
        }

        if (!String(data.salary_max).trim()) {
            newErrors.salary_max = "Vui lòng nhập lương tối đa";
        } else if (!/^\d+$/.test(String(data.salary_max).trim())) {
            newErrors.salary_max = "Lương tối đa chỉ được điền số";
        }

        if (!data.deadline.trim()) newErrors.deadline = "Vui lòng chọn hạn nộp";
        if (!data.description.trim()) newErrors.description = "Vui lòng nhập mô tả";
        if (!data.requirement.trim()) newErrors.requirement = "Vui lòng nhập yêu cầu";
        if (!data.skills || data.skills.length === 0) newErrors.skills = "Vui lòng chọn ít nhất 1 kỹ năng";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const save = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        try {
            if (id) {
                await authApis().put(
                    endpoints.updateJob(id),
                    data
                );
            } else {
                await authApis().post(
                    endpoints.createJob,
                    data
                );
            }

            alert("Thành công");
            nav("/employer/jobs");
        } catch (err) {
            console.log(err.response?.data || err);
        }
    };

    return (
        <Container className="py-4">
            <Card className="shadow-sm border-0 rounded-4">
                <Card.Header className="bg-white border-bottom-0 pt-4 pb-2 px-4">
                    <h3 className="fw-bold text-primary mb-0">
                        {id ? "Cập nhật tin tuyển dụng" : "Đăng tin tuyển dụng mới"}
                    </h3>
                    <p className="text-muted mt-2 mb-0">Điền đầy đủ thông tin bên dưới để tiếp cận ứng viên tiềm năng.</p>
                </Card.Header>

                <Card.Body className="p-4">
                    <Form onSubmit={save}>
                        <h5 className="fw-bold mb-4 pb-2 border-bottom text-secondary">Thông tin chung</h5>
                        
                        <Row>
                            <Col md={12}>
                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-semibold">Tiêu đề công việc <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        size="lg"
                                        className="rounded-3"
                                        placeholder="VD: Lập trình viên Frontend (ReactJS)"
                                        value={data.title}
                                        isInvalid={!!errors.title}
                                        onChange={(e) => change("title", e.target.value)}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.title}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-semibold">Danh mục ngành nghề <span className="text-danger">*</span></Form.Label>
                                    <Form.Select
                                        className="rounded-3"
                                        value={data.category_id}
                                        isInvalid={!!errors.category_id}
                                        onChange={(e) => change("category_id", e.target.value)}
                                    >
                                        <option value="">-- Chọn danh mục phù hợp --</option>
                                        {categories.map(c => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.category_id}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-semibold">Địa điểm làm việc <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        className="rounded-3"
                                        placeholder="VD: Quận 1, TP. HCM"
                                        value={data.location}
                                        isInvalid={!!errors.location}
                                        onChange={(e) => change("location", e.target.value)}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.location}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-semibold">Thời gian làm việc <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        className="rounded-3"
                                        value={data.working_time}
                                        isInvalid={!!errors.working_time}
                                        onChange={(e) => change("working_time", e.target.value)}
                                        placeholder="VD: Full-time, Thứ 2 - Thứ 6..."
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.working_time}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-semibold">Kinh nghiệm yêu cầu (năm) <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        className="rounded-3"
                                        type="text"
                                        placeholder="VD: 1, 2, 0 (nếu không yêu cầu)"
                                        value={data.experience}
                                        isInvalid={!!errors.experience}
                                        onChange={(e) => handleNumericChange("experience", e.target.value)}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.experience}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-semibold">Hạn nhận hồ sơ <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        className="rounded-3"
                                        type="date"
                                        value={data.deadline}
                                        isInvalid={!!errors.deadline}
                                        onChange={(e) => change("deadline", e.target.value)}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.deadline}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>

                        <h5 className="fw-bold mt-2 mb-4 pb-2 border-bottom text-secondary">Mức lương dự kiến</h5>
                        
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-semibold">Lương tối thiểu (VNĐ) <span className="text-danger">*</span></Form.Label>
                                    <div className="input-group">
                                        <Form.Control
                                            className="rounded-start-3"
                                            type="text"
                                            placeholder="VD: 10000000"
                                            value={data.salary_min}
                                            isInvalid={!!errors.salary_min}
                                            onChange={(e) => handleNumericChange("salary_min", e.target.value)}
                                        />
                                        <span className="input-group-text rounded-end-3 bg-light">VNĐ</span>
                                        <Form.Control.Feedback type="invalid">
                                            {errors.salary_min}
                                        </Form.Control.Feedback>
                                    </div>
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-semibold">Lương tối đa (VNĐ) <span className="text-danger">*</span></Form.Label>
                                    <div className="input-group">
                                        <Form.Control
                                            className="rounded-start-3"
                                            type="text"
                                            placeholder="VD: 20000000"
                                            value={data.salary_max}
                                            isInvalid={!!errors.salary_max}
                                            onChange={(e) => handleNumericChange("salary_max", e.target.value)}
                                        />
                                        <span className="input-group-text rounded-end-3 bg-light">VNĐ</span>
                                        <Form.Control.Feedback type="invalid">
                                            {errors.salary_max}
                                        </Form.Control.Feedback>
                                    </div>
                                </Form.Group>
                            </Col>
                        </Row>

                        <h5 className="fw-bold mt-2 mb-4 pb-2 border-bottom text-secondary">Chi tiết công việc</h5>

                        <Form.Group className="mb-4">
                            <Form.Label className="fw-semibold">Mô tả công việc <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                className="rounded-3"
                                as="textarea"
                                rows={6}
                                placeholder="Mô tả chi tiết các nhiệm vụ, trách nhiệm mà ứng viên sẽ đảm nhận..."
                                value={data.description}
                                isInvalid={!!errors.description}
                                onChange={(e) => change("description", e.target.value)}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.description}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label className="fw-semibold">Yêu cầu ứng viên <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                className="rounded-3"
                                as="textarea"
                                rows={6}
                                placeholder="Các kỹ năng, bằng cấp, hoặc phẩm chất cần thiết cho vị trí này..."
                                value={data.requirement}
                                isInvalid={!!errors.requirement}
                                onChange={(e) => change("requirement", e.target.value)}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.requirement}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-5 bg-light p-4 rounded-4">
                            <Form.Label className="fw-bold mb-3 d-block text-dark">
                                Kỹ năng chuyên môn yêu cầu <span className="text-danger">*</span>
                                <small className="text-muted fw-normal ms-2 d-block mt-1">
                                    Chọn các thẻ kỹ năng để ứng viên dễ dàng tìm thấy tin tuyển dụng của bạn.
                                </small>
                            </Form.Label>
                            
                            <div className="d-flex flex-wrap gap-2 align-items-center">
                                {skills.map(skill => {
                                    const selected = data.skills.includes(skill.id);
                                    return (
                                        <Badge
                                            key={skill.id}
                                            bg={selected ? "primary" : "white"}
                                            text={selected ? "white" : "dark"}
                                            className={`border p-2 fs-6 rounded-pill ${selected ? 'border-primary shadow-sm' : 'border-secondary-subtle'}`}
                                            style={{ cursor: "pointer", userSelect: "none", transition: "all 0.2s" }}
                                            onClick={() => toggleSkill(skill.id)}
                                        >
                                            {selected ? "✓ " : "+ "}
                                            {skill.name}
                                        </Badge>
                                    );
                                })}

                                {hasMoreSkills && (
                                    <Button
                                        variant="outline-primary"
                                        size="sm"
                                        onClick={loadMoreSkills}
                                        disabled={loadingSkills}
                                        className="rounded-pill px-3 py-1 ms-2"
                                    >
                                        {loadingSkills ? (
                                            <>
                                                <Spinner size="sm" animation="border" className="me-2" />
                                                Đang tải...
                                            </>
                                        ) : (
                                            "+ Tải thêm kỹ năng"
                                        )}
                                    </Button>
                                )}
                            </div>
                            {errors.skills && (
                                <div className="text-danger fs-6 mt-3 fw-medium">
                                    <i className="bi bi-exclamation-circle me-1"></i> {errors.skills}
                                </div>
                            )}
                        </Form.Group>

                        <div className="d-flex justify-content-end gap-3 pt-3 border-top">
                            <Button 
                                type="button" 
                                variant="light" 
                                className="px-4 rounded-pill fw-medium"
                                onClick={() => nav("/employer/jobs")}
                            >
                                Hủy bỏ
                            </Button>
                            <Button 
                                type="submit" 
                                variant="primary" 
                                size="lg" 
                                className="px-5 rounded-pill fw-bold shadow-sm"
                            >
                                {id ? "Lưu thay đổi" : "Đăng tin ngay"}
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default JobForm;