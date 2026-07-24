import { useEffect, useState } from "react";
import {
    Card,
    Row,
    Col,
    Spinner,
    Badge,
    Button,
    Form,
    InputGroup
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { authApis, endpoints } from "../../configs/Apis";
import dayjs from "dayjs";

const StudentHome = () => {
    const [jobs, setJobs] = useState([]);
    const [categories, setCategories] = useState([]);
    const [skills, setSkills] = useState([]);

    const [loading, setLoading] = useState(false);

    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);

    const [filters, setFilters] = useState({
        keyword: "",
        category_id: "",
        skills: [], 
        salary_min: ""
    });

    const [query, setQuery] = useState({
        keyword: "",
        category_id: "",
        skills: [],
        salary_min: ""
    });

    useEffect(() => {
        loadCategories();
        loadSkills();
    }, []);

    useEffect(() => {
        loadJobs();
    }, [page, query]);

    const loadCategories = async () => {
        try {
            const res = await authApis().get(endpoints.categories);
            setCategories(res.data.data || []);
        } catch (err) {
            console.error("Lỗi load danh mục:", err);
        }
    };

    const loadSkills = async () => {
        try {
            const res = await authApis().get(endpoints.skills);
            setSkills(res.data.data || []);
        } catch (err) {
            console.error("Lỗi load kỹ năng:", err);
        }
    };

    const loadJobs = async () => {
        try {
            setLoading(true);

            
            const params = {
                page,
                ...(query.keyword && { keyword: query.keyword }),
                ...(query.category_id && { category_id: query.category_id }),
                ...(query.salary_min && { salary_min: query.salary_min }),
                ...(query.skills.length > 0 && { skills: query.skills })
            };

            const res = await authApis().get(endpoints.allJobs, { params });

            
            setJobs(res.data.data || []);
            setLastPage(res.data.meta?.last_page || res.data.last_page || 1);
        } catch (err) {
            console.error("Lỗi load danh sách việc làm:", err);
        } finally {
            setLoading(false);
        }
    };

   
    const handleCategoryChange = (e) => {
        const categoryId = e.target.value;
        setFilters((prev) => ({ ...prev, category_id: categoryId }));
        setPage(1);
        setQuery((prev) => ({ ...prev, category_id: categoryId }));
    };

    
    const handleSkillToggle = (skillId) => {
        setFilters((prev) => {
            const exists = prev.skills.includes(skillId);
            const updatedSkills = exists
                ? prev.skills.filter((id) => id !== skillId)
                : [...prev.skills, skillId];
            return { ...prev, skills: updatedSkills };
        });
    };

   
    const handleFilterSubmit = (e) => {
        if (e) e.preventDefault();
        setPage(1);
        setQuery(filters);
    };

    
    const clearFilter = () => {
        const emptyFilters = {
            keyword: "",
            category_id: "",
            skills: [],
            salary_min: ""
        };
        setFilters(emptyFilters);
        setQuery(emptyFilters);
        setPage(1);
    };

    return (
        <div className="container mt-4 mb-5">
            <h2 className="mb-4 text-primary fw-bold">Danh Sách Việc Làm</h2>

           
            <Card className="mb-4 border-0 shadow-sm">
                <Card.Body className="p-4">
                    <Form onSubmit={handleFilterSubmit}>
                        <Row className="g-3">
                            
                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label className="fw-semibold">Danh mục ngành nghề</Form.Label>
                                    <Form.Select
                                        value={filters.category_id}
                                        onChange={handleCategoryChange}
                                        className="shadow-none"
                                    >
                                        <option value="">-- Tất cả danh mục --</option>
                                        {categories.map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {c.name}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>

                            
                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label className="fw-semibold">Từ khóa tìm kiếm</Form.Label>
                                    <Form.Control
                                        placeholder="Tên công việc, vị trí, công ty..."
                                        value={filters.keyword}
                                        onChange={(e) =>
                                            setFilters({ ...filters, keyword: e.target.value })
                                        }
                                        className="shadow-none"
                                    />
                                </Form.Group>
                            </Col>

                            
                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label className="fw-semibold">Mức lương tối thiểu (VNĐ/h)</Form.Label>
                                    <InputGroup>
                                        <Form.Control
                                            type="number"
                                            placeholder="Ví dụ: 30000"
                                            value={filters.salary_min}
                                            onChange={(e) =>
                                                setFilters({ ...filters, salary_min: e.target.value })
                                            }
                                            className="shadow-none"
                                        />
                                        <InputGroup.Text>VNĐ</InputGroup.Text>
                                    </InputGroup>
                                </Form.Group>
                            </Col>

                            
                            <Col md={12}>
                                <Form.Group>
                                    <Form.Label className="fw-semibold d-block me-2">
                                        Kỹ năng yêu cầu:
                                    </Form.Label>
                                    <div className="d-flex flex-wrap gap-2 align-items-center">
                                        {skills.map((s) => {
                                            const isSelected = filters.skills.includes(s.id);
                                            return (
                                                <Badge
                                                    key={s.id}
                                                    bg={isSelected ? "primary" : "light"}
                                                    text={isSelected ? "white" : "dark"}
                                                    className="p-2 border cursor-pointer"
                                                    style={{ cursor: "pointer", userSelect: "none" }}
                                                    onClick={() => handleSkillToggle(s.id)}
                                                >
                                                    {isSelected ? "✓ " : "+ "}
                                                    {s.name}
                                                </Badge>
                                            );
                                        })}
                                    </div>
                                </Form.Group>
                            </Col>
                        </Row>

                        
                        <div className="text-end mt-4 pt-2 border-top">
                            <Button variant="secondary" className="me-2 px-4" onClick={clearFilter}>
                                Xóa bộ lọc
                            </Button>
                            <Button type="submit" variant="primary" className="px-4">
                                Lọc kết quả
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>

            
            {loading && (
                <div className="text-center my-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-2 text-muted">Đang tải danh sách việc làm...</p>
                </div>
            )}

            
            {!loading && (
                <>
                    {jobs.length === 0 ? (
                        <div className="text-center my-5 py-4 bg-light rounded">
                            <h5 className="text-muted">Không tìm thấy việc làm phù hợp.</h5>
                            <p className="text-secondary small">Hãy thử điều chỉnh lại bộ lọc của bạn.</p>
                        </div>
                    ) : (
                        <Row>
                            {jobs.map((job) => (
                                <Col md={6} lg={4} key={job.id} className="mb-4">
                                    <Card className="h-100 shadow-sm border-0 hover-shadow transition">
                                        <Card.Body className="d-flex flex-column">
                                            <div className="d-flex justify-content-between align-items-start mb-2">
                                                <Card.Title className="fw-bold mb-0 text-truncate" title={job.title}>
                                                    {job.title}
                                                </Card.Title>
                                            </div>

                                            <Card.Subtitle className="mb-2 text-secondary fw-semibold">
                                                {job.company?.name || "Công ty chưa cập nhật"}
                                            </Card.Subtitle>

                                            <div className="mb-3">
                                                <Badge bg="info" className="text-dark">
                                                    {job.category?.name || "Khác"}
                                                </Badge>
                                            </div>

                                            <div className="mt-auto space-y-2">
                                                <div className="text-success fw-bold">
                                                    {Number(job.salary_min).toLocaleString()} -{" "}
                                                    {Number(job.salary_max).toLocaleString()} VNĐ/giờ
                                                </div>

                                                <div className="text-muted small mt-1">
                                                    <strong>Địa điểm:</strong> {job.location}
                                                </div>

                                                <div className="text-muted small mt-1">
                                                    <strong>Kinh nghiệm:</strong>{" "}
                                                    {job.experience?.trim() ? job.experience : "Không yêu cầu"}
                                                </div>

                                                <div className="text-muted small mt-1">
                                                    <strong>Hạn nộp:</strong>{" "}
                                                    {dayjs(job.deadline).format("DD/MM/YYYY")}
                                                </div>

                                                {/* Danh sách skills của bài đăng */}
                                                {job.skills && job.skills.length > 0 && (
                                                    <div className="mt-2 pt-2 border-top">
                                                        <div className="d-flex flex-wrap gap-1">
                                                            {job.skills.map((sk) => (
                                                                <Badge key={sk.id} bg="secondary" className="fw-normal">
                                                                    {sk.name}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </Card.Body>

                                        <Card.Footer className="bg-white border-0 pt-0 pb-3">
                                            <Button
                                                as={Link}
                                                to={`/jobs/${job.id}`}
                                                variant="outline-primary"
                                                className="w-100 fw-semibold"
                                            >
                                                Xem chi tiết
                                            </Button>
                                        </Card.Footer>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    )}

                    
                    <div className="d-flex justify-content-center align-items-center gap-3 mt-4">
                        <Button
                            variant="outline-secondary"
                            disabled={page === 1}
                            onClick={() => setPage((p) => p - 1)}
                        >
                            Trang trước
                        </Button>

                        <span className="fw-semibold">
                            Trang {page} / {lastPage}
                        </span>

                        <Button
                            variant="outline-secondary"
                            disabled={page === lastPage}
                            onClick={() => setPage((p) => p + 1)}
                        >
                            Trang sau
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
};

export default StudentHome;