import { useEffect, useState } from "react";
import { Card, Row, Col, Spinner, Badge, Button, Form, InputGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import { authApis, endpoints } from "../../configs/Apis";
import dayjs from "dayjs";
import { useContext } from "react";
import { MyUserContext } from "../../configs/Contexts";

const StudentHome = () => {
    const [user] = useContext(MyUserContext);

    const [jobs, setJobs] = useState([]);
    const [categories, setCategories] = useState([]);
    const [skills, setSkills] = useState([]);

    const [loading, setLoading] = useState(false);

    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

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
        if (hasMore || page === 1)
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

            const newJobs = res.data.data || [];

            if (page === 1)
                setJobs(newJobs);
            else
                setJobs(prev => [...prev, ...newJobs]);

            const currentPage =
                res.data.meta?.current_page || page;

            const lastPage =
                res.data.meta?.last_page || 1;

            setHasMore(currentPage < lastPage);

        } catch (err) {
            console.error("Lỗi load danh sách việc làm:", err);
        } finally {
            setLoading(false);
        }
    };

    const bookmarkJob = async (jobId) => {

        try {

            await authApis().post(
                endpoints.bookmark(jobId)
            );

            setJobs(current =>
                current.map(j =>
                    j.id === jobId
                        ? {
                            ...j,
                            bookmarked: true
                        }
                        : j
                )
            );

            alert("Đã lưu việc làm");

        } catch (err) {

            console.error(err);

            alert("Không thể lưu việc làm");
        }
    };

    const handleCategoryChange = (e) => {
        const categoryId = e.target.value;

        setFilters(prev => ({
            ...prev,
            category_id: categoryId
        }));

        setJobs([]);
        setHasMore(true);
        setPage(1);

        setQuery(prev => ({
            ...prev,
            category_id: categoryId
        }));
    };

    const handleSkillToggle = (skillId) => {
        setFilters(prev => {
            const exists = prev.skills.includes(skillId);

            const updatedSkills = exists
                ? prev.skills.filter(id => id !== skillId)
                : [...prev.skills, skillId];

            return {
                ...prev,
                skills: updatedSkills
            };
        });
    };

    const handleFilterSubmit = (e) => {
        e.preventDefault();

        setJobs([]);
        setHasMore(true);
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
        setJobs([]);
        setHasMore(true);
        setPage(1);
        setQuery(emptyFilters);
    };

    const loadMore = () => {
        if (!loading && hasMore)
            setPage(prev => prev + 1);
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
                                    <Form.Label className="fw-semibold">
                                        Danh mục ngành nghề
                                    </Form.Label>

                                    <Form.Select
                                        value={filters.category_id}
                                        onChange={handleCategoryChange}
                                    >
                                        <option value="">
                                            -- Tất cả danh mục --
                                        </option>

                                        {categories.map(c => (
                                            <option key={c.id} value={c.id}>
                                                {c.name}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>

                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label className="fw-semibold">
                                        Từ khóa tìm kiếm
                                    </Form.Label>

                                    <Form.Control
                                        placeholder="Tên công việc, vị trí, công ty..."
                                        value={filters.keyword}
                                        onChange={(e) =>
                                            setFilters(prev => ({
                                                ...prev,
                                                keyword: e.target.value
                                            }))
                                        }
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label className="fw-semibold">
                                        Mức lương tối thiểu (VNĐ/giờ)
                                    </Form.Label>

                                    <InputGroup>
                                        <Form.Control
                                            type="number"
                                            placeholder="Ví dụ: 30000"
                                            value={filters.salary_min}
                                            onChange={(e) =>
                                                setFilters(prev => ({
                                                    ...prev,
                                                    salary_min: e.target.value
                                                }))
                                            }
                                        />
                                        <InputGroup.Text>
                                            VNĐ
                                        </InputGroup.Text>
                                    </InputGroup>
                                </Form.Group>
                            </Col>

                            <Col md={12}>
                                <Form.Group>
                                    <Form.Label className="fw-semibold d-block">
                                        Kỹ năng yêu cầu
                                    </Form.Label>

                                    <div className="d-flex flex-wrap gap-2">

                                        {filters.skills.length > 0 && (
                                            <div className="w-100 mb-2">
                                                <small className="fw-bold text-primary">
                                                    Đã chọn:
                                                </small>

                                                <div className="d-flex flex-wrap gap-2 mt-2">
                                                    {filters.skills.map(id => {
                                                        const skill = skills.find(s => s.id === id);

                                                        if (!skill) return null;

                                                        return (
                                                            <Badge
                                                                key={id}
                                                                bg="primary"
                                                                style={{ cursor: "pointer" }}
                                                                onClick={() => handleSkillToggle(id)}
                                                            >
                                                                {skill.name} ✕
                                                            </Badge>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}

                                        {skills.map(s => {
                                            const selected =
                                                filters.skills.includes(s.id);

                                            return (
                                                <Badge
                                                    key={s.id}
                                                    bg={selected ? "primary" : "light"}
                                                    text={selected ? "white" : "dark"}
                                                    className="border p-2"
                                                    style={{
                                                        cursor: "pointer",
                                                        userSelect: "none"
                                                    }}
                                                    onClick={() => handleSkillToggle(s.id)}
                                                >
                                                    {selected ? "✓ " : "+ "}
                                                    {s.name}
                                                </Badge>
                                            );
                                        })}
                                    </div>
                                </Form.Group>
                            </Col>

                        </Row>

                        <div className="text-end mt-4 border-top pt-3">
                            <Button
                                variant="secondary"
                                className="me-2"
                                onClick={clearFilter}
                            >
                                Xóa bộ lọc
                            </Button>

                            <Button
                                type="submit"
                                variant="primary"
                            >
                                Lọc kết quả
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>

            {jobs.length === 0 && !loading && (
                <div className="text-center py-5">
                    <h5>Không tìm thấy việc làm phù hợp.</h5>
                </div>
            )}

            <Row>
                {jobs.map(job => (
                    <Col md={6} lg={4} key={job.id} className="mb-4">

                        <Card className="h-100 shadow-sm">

                            <Card.Body className="d-flex flex-column">



                                <div className="d-flex justify-content-between align-items-start mb-2">

                                    <Card.Title
                                        className="fw-bold mb-0 flex-grow-1 me-2"
                                        title={job.title}
                                    >
                                        {job.title}
                                    </Card.Title>

                                    {
                                        user?.role === "STUDENT" && (

                                            <Button
                                                size="sm"
                                                variant={
                                                    job.bookmarked
                                                        ? "danger"
                                                        : "outline-danger"
                                                }
                                                disabled={job.bookmarked}
                                                onClick={() => bookmarkJob(job.id)}
                                                className="flex-shrink-0"
                                            >
                                                {job.bookmarked ? "Đã lưu" : "Lưu"}
                                            </Button>

                                        )
                                    }

                                </div>

                                <Card.Subtitle className="text-muted mb-2">
                                    {job.company?.name || "Công ty"}
                                </Card.Subtitle>

                                <Badge
                                    bg="info"
                                    className="text-dark mb-3"
                                >
                                    {job.category?.name || "Khác"}
                                </Badge>

                                <div className="mt-auto">

                                    <div className="fw-bold text-success">
                                        {Number(job.salary_min).toLocaleString()} -
                                        {" "}
                                        {Number(job.salary_max).toLocaleString()}
                                        {" "}VNĐ/giờ
                                    </div>

                                    <div className="small text-muted mt-2">
                                        <b>Địa điểm:</b> {job.location}
                                    </div>

                                    <div className="small text-muted">
                                        <b>Kinh nghiệm:</b>{" "}
                                        {job.experience?.trim()
                                            ? job.experience
                                            : "Không yêu cầu"}
                                    </div>

                                    <div className="small text-muted">
                                        <b>Hạn nộp:</b>{" "}
                                        {dayjs(job.deadline).format("DD/MM/YYYY")}
                                    </div>

                                    {job.skills?.length > 0 && (
                                        <div className="mt-3 border-top pt-2">

                                            <div className="d-flex flex-wrap gap-1">

                                                {job.skills.map(skill => (
                                                    <Badge
                                                        key={skill.id}
                                                        bg="secondary"
                                                    >
                                                        {skill.name}
                                                    </Badge>
                                                ))}

                                            </div>

                                        </div>
                                    )}

                                </div>

                            </Card.Body>

                            <Card.Footer className="bg-white border-0">

                                <Button
                                    as={Link}
                                    to={`/jobs/${job.id}`}
                                    variant="outline-primary"
                                    className="w-100"
                                >
                                    Xem chi tiết
                                </Button>

                            </Card.Footer>

                        </Card>

                    </Col>
                ))}
            </Row>

            {hasMore && jobs.length > 0 && (
                <div className="text-center mt-4">

                    <Button
                        variant="success"
                        onClick={loadMore}
                        disabled={loading}
                    >
                        {loading
                            ? (
                                <>
                                    <Spinner
                                        size="sm"
                                        animation="border"
                                        className="me-2"
                                    />
                                    Đang tải...
                                </>
                            )
                            : "Xem thêm..."
                        }
                    </Button>

                </div>
            )}

            {loading && page === 1 && (
                <div className="text-center mt-5">
                    <Spinner animation="border" />
                </div>
            )}
        </div>
    );
};

export default StudentHome;