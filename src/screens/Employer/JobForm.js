import { useEffect, useState } from "react";
import { Form, Button, Card, Spinner, Badge } from "react-bootstrap";
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
        <Card className="mt-4 shadow-sm">
            <Card.Header>
                <h3>
                    {id ? "Cập nhật tin tuyển dụng" : "Đăng tin tuyển dụng"}
                </h3>
            </Card.Header>

            <Card.Body>
                <Form onSubmit={save}>
                    <Form.Group className="mb-3">
                        <Form.Label>Tiêu đề</Form.Label>
                        <Form.Control
                            value={data.title}
                            isInvalid={!!errors.title}
                            onChange={(e) => change("title", e.target.value)}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.title}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Danh mục</Form.Label>
                        <Form.Select
                            value={data.category_id}
                            isInvalid={!!errors.category_id}
                            onChange={(e) => change("category_id", e.target.value)}
                        >
                            <option value="">Chọn danh mục</option>
                            {categories.map(c => (
                                <option key={c.id} value={c.id}>
                                    {c.name}
                                </option>
                            ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                            {errors.category_id}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Địa điểm</Form.Label>
                        <Form.Control
                            value={data.location}
                            isInvalid={!!errors.location}
                            onChange={(e) => change("location", e.target.value)}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.location}
                        </Form.Control.Feedback>
                    </Form.Group>

                    {/* FORM INPUT THỜI GIAN LÀM VIỆC */}
                    <Form.Group className="mb-3">
                        <Form.Label>Thời gian làm việc</Form.Label>
                        <Form.Control
                            value={data.working_time}
                            isInvalid={!!errors.working_time}
                            onChange={(e) => change("working_time", e.target.value)}
                            placeholder="VD: Full-time, Part-time, Thứ 2 - Thứ 6..."
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.working_time}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Kinh nghiệm (năm)</Form.Label>
                        <Form.Control
                            type="text"
                            value={data.experience}
                            isInvalid={!!errors.experience}
                            onChange={(e) => handleNumericChange("experience", e.target.value)}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.experience}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Lương tối thiểu theo giờ</Form.Label>
                        <Form.Control
                            type="text"
                            value={data.salary_min}
                            isInvalid={!!errors.salary_min}
                            onChange={(e) => handleNumericChange("salary_min", e.target.value)}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.salary_min}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Lương tối đa theo giờ</Form.Label>
                        <Form.Control
                            type="text"
                            value={data.salary_max}
                            isInvalid={!!errors.salary_max}
                            onChange={(e) => handleNumericChange("salary_max", e.target.value)}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.salary_max}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Hạn nộp</Form.Label>
                        <Form.Control
                            type="date"
                            value={data.deadline}
                            isInvalid={!!errors.deadline}
                            onChange={(e) => change("deadline", e.target.value)}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.deadline}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Mô tả</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={5}
                            value={data.description}
                            isInvalid={!!errors.description}
                            onChange={(e) => change("description", e.target.value)}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.description}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Yêu cầu</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={5}
                            value={data.requirement}
                            isInvalid={!!errors.requirement}
                            onChange={(e) => change("requirement", e.target.value)}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.requirement}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold d-block">Kỹ năng</Form.Label>
                        <div className="d-flex flex-wrap gap-2 align-items-center">
                            {skills.map(skill => {
                                const selected = data.skills.includes(skill.id);
                                return (
                                    <Badge
                                        key={skill.id}
                                        bg={selected ? "primary" : "light"}
                                        text={selected ? "white" : "dark"}
                                        className="border p-2"
                                        style={{ cursor: "pointer", userSelect: "none" }}
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
                                    className="rounded-pill px-3"
                                >
                                    {loadingSkills ? (
                                        <Spinner size="sm" animation="border" />
                                    ) : (
                                        "+ Xem thêm kỹ năng"
                                    )}
                                </Button>
                            )}
                        </div>
                        {errors.skills && (
                            <div className="text-danger fs-6 mt-1">
                                {errors.skills}
                            </div>
                        )}
                    </Form.Group>

                    <Button type="submit" variant="primary">Lưu</Button>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default JobForm;