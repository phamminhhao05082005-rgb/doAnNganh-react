import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
    Card,
    Spinner,
    Button,
    Badge,
    Table,
    Modal,
    ProgressBar,
    Pagination
} from "react-bootstrap";
import { authApis, endpoints } from "../../configs/Apis";
import { toast } from "react-toastify";
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

const EmployerApplications = () => {
    const { jobId } = useParams();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [perPage, setPerPage] = useState(10);

    const [evaluating, setEvaluating] = useState(false);
    const [selectedAiData, setSelectedAiData] = useState(null);
    const [showAiModal, setShowAiModal] = useState(false);

    const loadApplications = async (page = 1) => {
        try {
            setLoading(true);
            const res = await authApis().get(
                `${endpoints.employerApplications(jobId)}?page=${page}`
            );

            const items = res.data.data || [];
            const meta = res.data.meta || res.data;

            setApplications(items);
            setCurrentPage(meta.current_page || page);
            setTotalPages(meta.last_page || 1);
            if (meta.per_page) setPerPage(meta.per_page);
        } catch (err) {
            console.error(err);
            toast.error(
                err.response?.data?.message ||
                "Không thể tải danh sách ứng tuyển"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadApplications(currentPage);
    }, [jobId, currentPage]);

    useEffect(() => {
        const echo = new Echo({
            broadcaster: 'reverb',
            key: 'esr1fcutaadnmqb0dndo',
            wsHost: '127.0.0.1',
            wsPort: 8081,
            wssPort: 8081,
            forceTLS: false,
            enabledTransports: ['ws', 'wss'],
        });

        const channel = echo.channel(`job.${jobId}`);

        channel.listen('.ai.evaluated', (e) => {
            toast.success("AI đã phân tích xong! Đang tự động cập nhật...");
            setEvaluating(false);
            loadApplications(currentPage);
        });

        return () => {
            channel.stopListening('.ai.evaluated');
            echo.leave(`job.${jobId}`);
        };
    }, [jobId, currentPage]);

    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages && pageNumber !== currentPage) {
            setCurrentPage(pageNumber);
        }
    };

    const handleEvaluateAi = async (force = false) => {
        try {
            setEvaluating(true);
            toast.info("Đang gửi yêu cầu phân tích CV cho AI...");

            const res = await authApis().post(
                endpoints.evaluateJobCvs(jobId),
                { force }
            );

            toast.success(res.data.message || "Hệ thống đang xử lý ngầm. Vui lòng tải lại trang sau ít phút để xem kết quả.");

        } catch (err) {
            console.error(err);
            toast.error(
                err.response?.data?.message || "Lỗi khi gửi yêu cầu đánh giá"
            );
            setEvaluating(false);
        }
    };

    const handleOpenAiDetails = (app) => {
        if (!app.ai_evaluation) {
            toast.warning("Hồ sơ này chưa có kết quả đánh giá AI.");
            return;
        }

        let parsedEvaluation = app.ai_evaluation;
        if (typeof app.ai_evaluation === "string") {
            try {
                parsedEvaluation = JSON.parse(app.ai_evaluation);
            } catch (e) {
                console.error("Lỗi parse AI evaluation:", e);
            }
        }

        setSelectedAiData({
            candidateName: app.cv?.full_name,
            score: app.ai_score,
            evaluation: parsedEvaluation
        });
        setShowAiModal(true);
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case "ACCEPTED":
                return <Badge bg="success">Đã duyệt</Badge>;
            case "REJECTED":
                return <Badge bg="danger">Từ chối</Badge>;
            default:
                return <Badge bg="warning" text="dark">Chờ xử lý</Badge>;
        }
    };

    const getScoreBadge = (score) => {
        if (score === null || score === undefined) {
            return <Badge bg="secondary">Chưa lọc</Badge>;
        }
        if (score >= 80) return <Badge bg="success">{score}/100 - Rất phù hợp</Badge>;
        if (score >= 50) return <Badge bg="warning" text="dark">{score}/100 - Khá</Badge>;
        return <Badge bg="danger">{score}/100 - Thấp</Badge>;
    };

    if (loading) {
        return (
            <div className="text-center mt-5">
                <Spinner animation="border" />
            </div>
        );
    }

    return (
        <>
            <Card className="mt-4">
                <Card.Header className="d-flex justify-content-between align-items-center">
                    <h4 className="mb-0">Danh sách ứng tuyển</h4>

                    <div className="d-flex gap-2">
                        <Button
                            variant="purple"
                            style={{ backgroundColor: "#6f42c1", color: "#fff" }}
                            onClick={() => handleEvaluateAi(false)}
                            disabled={evaluating || applications.length === 0}
                        >
                            {evaluating ? (
                                <>
                                    <Spinner size="sm" className="me-2" />
                                    Đang gửi yêu cầu...
                                </>
                            ) : (
                                "✨ Lọc CV bằng AI"
                            )}
                        </Button>

                        <Link to={`/employer/jobs/${jobId}`}>
                            <Button variant="secondary">Quay lại</Button>
                        </Link>
                    </div>
                </Card.Header>

                <Card.Body>
                    {applications.length === 0 ? (
                        <div className="text-center py-5">
                            <h5>Chưa có ứng viên nào</h5>
                            <p className="text-muted">
                                Hiện tại chưa có ứng viên ứng tuyển vào công việc này.
                            </p>
                        </div>
                    ) : (
                        <>
                            <Table responsive bordered hover className="align-middle">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Ứng viên</th>
                                        <th>Vị trí</th>
                                        <th>Kinh nghiệm</th>
                                        <th>Điểm Phù Hợp (AI)</th>
                                        <th>Trạng thái</th>
                                        <th>Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {applications.map((application, index) => (
                                        <tr key={application.id}>
                                            <td>{(currentPage - 1) * perPage + index + 1}</td>
                                            <td>
                                                <div className="d-flex align-items-center gap-2">
                                                    {application.cv?.avatar && (
                                                        <img
                                                            src={application.cv.avatar}
                                                            alt="avatar"
                                                            width="45"
                                                            height="45"
                                                            style={{
                                                                objectFit: "cover",
                                                                borderRadius: "50%"
                                                            }}
                                                        />
                                                    )}
                                                    <div>
                                                        <div className="fw-bold">
                                                            {application.cv?.full_name}
                                                        </div>
                                                        <small className="text-muted">
                                                            {application.cv?.email}
                                                        </small>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>{application.cv?.job_title || "—"}</td>
                                            <td>{application.cv?.experience_year ?? 0} năm</td>

                                            <td>
                                                <div className="d-flex align-items-center gap-2">
                                                    {getScoreBadge(application.ai_score)}
                                                    {application.ai_evaluation && (
                                                        <Button
                                                            variant="outline-info"
                                                            size="sm"
                                                            onClick={() => handleOpenAiDetails(application)}
                                                        >
                                                            Chi tiết
                                                        </Button>
                                                    )}
                                                </div>
                                            </td>

                                            <td>{getStatusBadge(application.status)}</td>
                                            <td>
                                                <Link to={`/employer/applications/${application.id}/cv`}>
                                                    <Button variant="primary" size="sm">
                                                        Xem CV
                                                    </Button>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>

                            {totalPages > 1 && (
                                <div className="d-flex justify-content-center mt-4">
                                    <Pagination>
                                        <Pagination.First
                                            onClick={() => handlePageChange(1)}
                                            disabled={currentPage === 1}
                                        />
                                        <Pagination.Prev
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1}
                                        />

                                        {[...Array(totalPages)].map((_, idx) => {
                                            const page = idx + 1;
                                            return (
                                                <Pagination.Item
                                                    key={page}
                                                    active={page === currentPage}
                                                    onClick={() => handlePageChange(page)}
                                                >
                                                    {page}
                                                </Pagination.Item>
                                            );
                                        })}

                                        <Pagination.Next
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                        />
                                        <Pagination.Last
                                            onClick={() => handlePageChange(totalPages)}
                                            disabled={currentPage === totalPages}
                                        />
                                    </Pagination>
                                </div>
                            )}
                        </>
                    )}
                </Card.Body>
            </Card>

            <Modal show={showAiModal} onHide={() => setShowAiModal(false)} size="lg" centered>
                <Modal.Header closeButton className="bg-light">
                    <Modal.Title className="h5">
                        🤖 Kết quả đánh giá AI: <span className="text-primary">{selectedAiData?.candidateName}</span>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedAiData && (
                        <div>
                            <div className="mb-4 text-center">
                                <h6 className="mb-1 fw-bold">Mức độ phù hợp công việc</h6>
                                <div className="display-6 fw-bold text-primary mb-2">
                                    {selectedAiData.score}%
                                </div>
                                <ProgressBar
                                    now={selectedAiData.score}
                                    variant={selectedAiData.score >= 80 ? "success" : selectedAiData.score >= 50 ? "warning" : "danger"}
                                    style={{ height: "10px" }}
                                />
                            </div>

                            <div className="p-3 bg-light rounded mb-3">
                                <h6>📌 Nhận xét chung:</h6>
                                <p className="mb-0 text-dark">{selectedAiData.evaluation?.summary}</p>
                            </div>

                            <div className="row">
                                <div className="col-md-6">
                                    <div className="p-3 border border-success rounded h-100">
                                        <h6 className="text-success fw-bold">✅ Điểm mạnh Phù hợp:</h6>
                                        <ul className="mb-0 ps-3">
                                            {selectedAiData.evaluation?.strengths?.map((item, idx) => (
                                                <li key={idx} className="mb-1">{item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="p-3 border border-danger rounded h-100">
                                        <h6 className="text-danger fw-bold">⚠️ Điểm hạn chế / Còn thiếu:</h6>
                                        <ul className="mb-0 ps-3">
                                            {selectedAiData.evaluation?.weaknesses?.map((item, idx) => (
                                                <li key={idx} className="mb-1">{item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowAiModal(false)}>
                        Đóng
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default EmployerApplications;