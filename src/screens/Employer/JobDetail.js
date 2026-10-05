import { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { authApis, endpoints } from "../../configs/Apis";
import dayjs from "dayjs";
import { Card, Spinner, Button, Badge, Modal, Form, Row, Col, Container } from "react-bootstrap";
import { MyUserContext } from "../../configs/Contexts";
import { toast } from "react-toastify";

const JobDetail = () => {
    const [showApply, setShowApply] = useState(false);
    const [cvs, setCVs] = useState([]);
    const [selectedCV, setSelectedCV] = useState("");
    const [user] = useContext(MyUserContext);
    const { id } = useParams();
    const [job, setJob] = useState(null);

    const loadJob = async () => {
        const res = await authApis().get(endpoints.jobDetail(id));
        setJob(res.data.data);
    };

    const toggleBookmark = async () => {
        try {
            if (job.bookmarked) {
                await authApis().delete(endpoints.unBookmark(job.id));
                setJob({
                    ...job,
                    bookmarked: false
                });
                toast.success("Đã bỏ lưu việc làm");
            } else {
                await authApis().post(endpoints.bookmark(job.id));
                setJob({
                    ...job,
                    bookmarked: true
                });
                alert("Đã lưu việc làm");
            }
        } catch (err) {
            console.error(err);
            alert("Không thể lưu việc làm");
        }
    };

    const openApplyModal = async () => {
        try {
            const res = await authApis().get(endpoints.cvs);
            setCVs(res.data.data || []);
            if (res.data.data.length > 0)
                setSelectedCV(res.data.data[0].id);
            setShowApply(true);
        } catch (err) {
            console.error(err);
            alert("Không tải được danh sách CV");
        }
    };

    const applyJob = async () => {
        try {
            await authApis().post(endpoints.applications, {
                job_id: job.id,
                cv_id: selectedCV
            });
            toast.success("Ứng tuyển thành công");
            setShowApply(false);
            setJob({
                ...job,
                applied: true
            });
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Ứng tuyển thất bại");
        }
    };

    useEffect(() => {
        loadJob();
    }, [id]);

    if (!job)
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "50vh" }}>
                <Spinner animation="border" variant="primary" />
            </div>
        );

    return (
        <Container className="py-4">
            <Card className="shadow-sm border-0 rounded-4">
                <Card.Body className="p-4 p-md-5">
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-start mb-4 gap-3">
                        <div>
                            <h2 className="fw-bold text-primary mb-3">{job.title}</h2>
                            <div className="d-flex flex-wrap gap-2">
                                {job.status ? (
                                    <Badge bg="success" pill className="px-3 py-2 fs-6">Đang tuyển</Badge>
                                ) : (
                                    <Badge bg="secondary" pill className="px-3 py-2 fs-6">Đã đóng</Badge>
                                )}
                                <Badge bg="info" pill className="px-3 py-2 fs-6 text-white">
                                    {job.category?.name}
                                </Badge>
                            </div>
                        </div>
                        <Link to={user?.role === "EMPLOYER" ? "/employer/jobs" : "/student"}>
                            <Button variant="outline-secondary" className="px-4 rounded-pill">
                                Quay lại
                            </Button>
                        </Link>
                    </div>

                    <div className="bg-light p-4 rounded-4 mb-5">
                        <Row className="g-4">
                            <Col md={6} lg={4}>
                                <p className="text-muted mb-1 fs-6">Mức lương</p>
                                <h5 className="text-success fw-bold mb-0">
                                    {job.salary_min.toLocaleString()}đ - {job.salary_max.toLocaleString()}đ
                                </h5>
                            </Col>
                            <Col md={6} lg={4}>
                                <p className="text-muted mb-1 fs-6">Địa điểm</p>
                                <h6 className="fw-bold mb-0">{job.location}</h6>
                            </Col>
                            <Col md={6} lg={4}>
                                <p className="text-muted mb-1 fs-6">Hạn nộp hồ sơ</p>
                                <h6 className="fw-bold text-danger mb-0">
                                    {dayjs(job.deadline).format("DD/MM/YYYY")}
                                </h6>
                            </Col>
                            <Col md={6} lg={4}>
                                <p className="text-muted mb-1 fs-6">Thời gian làm việc</p>
                                <h6 className="fw-bold mb-0">{job.working_time}</h6>
                            </Col>
                            <Col md={6} lg={4}>
                                <p className="text-muted mb-1 fs-6">Yêu cầu kinh nghiệm</p>
                                <h6 className="fw-bold mb-0">
                                    {job.experience?.trim() ? job.experience : "Không yêu cầu"}
                                </h6>
                            </Col>
                        </Row>
                    </div>

                    <div className="mb-4">
                        <h4 className="fw-bold mb-3 border-bottom pb-2">Mô tả công việc</h4>
                        <p className="text-dark" style={{ whiteSpace: "pre-wrap", lineHeight: "1.7" }}>
                            {job.description}
                        </p>
                    </div>

                    <div className="mb-4">
                        <h4 className="fw-bold mb-3 border-bottom pb-2">Yêu cầu ứng viên</h4>
                        <p className="text-dark" style={{ whiteSpace: "pre-wrap", lineHeight: "1.7" }}>
                            {job.requirement}
                        </p>
                    </div>

                    <div className="mb-5">
                        <h4 className="fw-bold mb-3 border-bottom pb-2">Kỹ năng chuyên môn</h4>
                        <div className="d-flex flex-wrap gap-2">
                            {job.skills?.length > 0 ? (
                                job.skills.map(skill => (
                                    <Badge
                                        bg="white"
                                        text="primary"
                                        className="border border-primary px-3 py-2 fs-6 rounded-pill"
                                        key={skill.id}
                                    >
                                        {skill.name}
                                    </Badge>
                                ))
                            ) : (
                                <span className="text-muted fst-italic">Không yêu cầu kỹ năng đặc thù</span>
                            )}
                        </div>
                    </div>

                    <div className="d-flex flex-wrap gap-3 pt-3 border-top justify-content-end">
                        {user?.role === "EMPLOYER" && (
                            <>
                                <Link to={`/employer/jobs/${job.id}/edit`}>
                                    <Button variant="warning" className="px-4 rounded-pill fw-bold text-dark">
                                        Chỉnh sửa tin
                                    </Button>
                                </Link>
                                <Link to={`/employer/jobs/${job.id}/applications`}>
                                    <Button variant="primary" className="px-4 rounded-pill fw-bold">
                                        Danh sách ứng tuyển
                                    </Button>
                                </Link>
                            </>
                        )}

                        {user?.role === "STUDENT" && (
                            <>
                                <Link to={`/companies/${job.company_id || job.company?.id}`}>
                                    <Button variant="info" className="px-4 rounded-pill text-white fw-bold">
                                        Thông tin công ty
                                    </Button>
                                </Link>

                                <Button
                                    variant={job.bookmarked ? "danger" : "outline-danger"}
                                    onClick={toggleBookmark}
                                    className="px-4 rounded-pill fw-bold"
                                >
                                    {job.bookmarked ? "Đã lưu việc làm" : "Lưu việc làm"}
                                </Button>

                                {!job.applied && (
                                    <Button
                                        variant="success"
                                        onClick={openApplyModal}
                                        className="px-5 rounded-pill fw-bold"
                                    >
                                        Ứng tuyển ngay
                                    </Button>
                                )}
                            </>
                        )}
                    </div>
                </Card.Body>
            </Card>

            <Modal show={showApply} onHide={() => setShowApply(false)} centered>
                <Modal.Header closeButton className="border-0 pb-0">
                    <Modal.Title className="fw-bold text-primary">Ứng tuyển công việc</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p className="text-muted mb-4">
                        Vui lòng chọn CV bạn muốn gửi đến nhà tuyển dụng cho vị trí <strong>{job.title}</strong>.
                    </p>
                    {cvs.length === 0 ? (
                        <div className="text-center py-4 text-danger bg-light rounded">
                            Bạn chưa có CV nào trong hệ thống. Hãy tạo CV trước khi ứng tuyển.
                        </div>
                    ) : (
                        <Form.Group>
                            <Form.Label className="fw-bold">Chọn CV của bạn</Form.Label>
                            <Form.Select
                                value={selectedCV}
                                onChange={(e) => setSelectedCV(e.target.value)}
                                className="py-2"
                            >
                                {cvs.map(cv => (
                                    <option key={cv.id} value={cv.id}>
                                        {cv.title}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    )}
                </Modal.Body>
                <Modal.Footer className="border-0 pt-0">
                    <Button variant="light" onClick={() => setShowApply(false)} className="px-4 rounded-pill">
                        Hủy
                    </Button>
                    <Button
                        variant="success"
                        disabled={cvs.length === 0}
                        onClick={applyJob}
                        className="px-4 rounded-pill fw-bold"
                    >
                        Xác nhận ứng tuyển
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default JobDetail;