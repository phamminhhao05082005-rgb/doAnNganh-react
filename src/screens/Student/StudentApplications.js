import { useEffect, useState } from "react";
import { Card, Spinner, Table, Badge, Button, Container, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import { authApis, endpoints } from "../../configs/Apis";
import { toast } from "react-toastify";
import { FaEye, FaTimes, FaBriefcase, FaBuilding, FaFileAlt, FaCalendarAlt, FaCheckCircle, FaTimesCircle, FaClock } from "react-icons/fa";

const StudentApplications = () => {
    const [loading, setLoading] = useState(false);
    const [applications, setApplications] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [deletingId, setDeletingId] = useState(null);

    const loadApplications = async (pageNumber = 1) => {
        setLoading(true);
        try {
            const res = await authApis().get(endpoints.myApplications, {
                params: { page: pageNumber }
            });

            const newApps = res.data.data || [];

            if (pageNumber === 1) {
                setApplications(newApps);
            } else {
                setApplications(prev => [...prev, ...newApps]);
            }

            const currentPage = res.data.meta?.current_page || pageNumber;
            const lastPage = res.data.meta?.last_page || 1;
            setHasMore(currentPage < lastPage);

        } catch (err) {
            console.error(err);
            toast.error("Không thể tải danh sách ứng tuyển");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadApplications(page);
    }, [page]);

    const handleLoadMore = () => {
        if (!loading && hasMore) {
            setPage(prevPage => prevPage + 1);
        }
    };

    const removeApplication = async (id) => {
        if (!window.confirm("Bạn có chắc muốn hủy ứng tuyển? Hành động này không thể hoàn tác.")) return;

        setDeletingId(id);
        try {
            await authApis().delete(endpoints.deleteApplication(id));

            toast.success("Đã hủy ứng tuyển thành công");

            setApplications(prev => prev.filter(app => app.id !== id));

        } catch (err) {
            console.error(err);
            toast.error(
                err.response?.data?.message || "Không thể hủy ứng tuyển"
            );
        } finally {
            setDeletingId(null);
        }
    };

    const renderStatus = (status) => {
        switch (status) {
            case "PENDING":
                return (
                    <Badge bg="warning" text="dark" className="px-3 py-2 rounded-pill d-flex align-items-center justify-content-center gap-1 mx-auto" style={{ width: "fit-content" }}>
                        <FaClock size={12} /> Chờ duyệt
                    </Badge>
                );
            case "ACCEPTED":
                return (
                    <Badge bg="success" className="px-3 py-2 rounded-pill d-flex align-items-center justify-content-center gap-1 mx-auto" style={{ width: "fit-content" }}>
                        <FaCheckCircle size={12} /> Đã duyệt
                    </Badge>
                );
            case "REJECTED":
                return (
                    <Badge bg="danger" className="px-3 py-2 rounded-pill d-flex align-items-center justify-content-center gap-1 mx-auto" style={{ width: "fit-content" }}>
                        <FaTimesCircle size={12} /> Từ chối
                    </Badge>
                );
            default:
                return <Badge bg="secondary" className="px-3 py-2 rounded-pill mx-auto d-block" style={{ width: "fit-content" }}>{status}</Badge>;
        }
    };

    return (
        <Container className="py-4">
            <Card className="shadow-sm border-0 rounded-4">
                <Card.Header className="bg-white border-bottom-0 pt-4 pb-3 px-4 d-flex align-items-center gap-3">
                    <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center shadow-sm" style={{ width: "48px", height: "48px" }}>
                        <FaBriefcase size={20} />
                    </div>
                    <div>
                        <h3 className="mb-0 fw-bold text-primary">Việc làm đã ứng tuyển</h3>
                        <p className="text-muted mb-0 mt-1 small">Theo dõi trạng thái các hồ sơ bạn đã gửi đến nhà tuyển dụng</p>
                    </div>
                </Card.Header>

                <Card.Body className="p-4">
                    {!loading && applications.length === 0 ? (
                        <div className="text-center py-5 bg-light rounded-4">
                            <FaFileAlt size={48} className="text-secondary mb-3 opacity-50" />
                            <h5 className="text-muted fw-medium mb-2">
                                Bạn chưa ứng tuyển công việc nào
                            </h5>
                            <p className="text-secondary mb-4">Hãy khám phá các cơ hội việc làm và gửi CV ngay!</p>
                            <Link to="/student">
                                <Button variant="primary" className="rounded-pill px-4 shadow-sm fw-medium">
                                    Tìm việc làm ngay
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div className="table-responsive rounded-3 border shadow-sm mb-4">
                                <Table hover className="align-middle mb-0 bg-white">
                                    <thead className="bg-light">
                                        <tr>
                                            <th className="text-center py-3 text-muted fw-bold border-bottom-0" style={{ width: "5%" }}>#</th>
                                            <th className="py-3 text-muted fw-bold border-bottom-0" style={{ width: "25%" }}><FaBriefcase className="me-2" />Công việc</th>
                                            <th className="py-3 text-muted fw-bold border-bottom-0" style={{ width: "20%" }}><FaBuilding className="me-2" />Công ty</th>
                                            <th className="py-3 text-muted fw-bold border-bottom-0" style={{ width: "15%" }}><FaFileAlt className="me-2" />CV sử dụng</th>
                                            <th className="py-3 text-muted fw-bold border-bottom-0" style={{ width: "15%" }}><FaCalendarAlt className="me-2" />Ngày ứng tuyển</th>
                                            <th className="text-center py-3 text-muted fw-bold border-bottom-0" style={{ width: "10%" }}>Trạng thái</th>
                                            <th className="text-center py-3 text-muted fw-bold border-bottom-0" style={{ width: "10%" }}>Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody className="border-top-0">
                                        {applications.map((a, index) => (
                                            <tr key={a.id} className="border-bottom transition-hover">
                                                <td className="text-center fw-semibold text-muted">{index + 1}</td>
                                                <td>
                                                    <span className="fw-bold text-dark d-block text-truncate" style={{ maxWidth: "250px" }} title={a.job?.title}>
                                                        {a.job?.title || "N/A"}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className="text-secondary fw-medium d-block text-truncate" style={{ maxWidth: "200px" }} title={a.job?.company?.name}>
                                                        {a.job?.company?.name || "N/A"}
                                                    </span>
                                                </td>
                                                <td>
                                                    <Badge bg="light" text="dark" className="border fw-medium px-2 py-1 text-truncate d-inline-block" style={{ maxWidth: "150px" }} title={a.cv?.title || "CV chính"}>
                                                        {a.cv?.title || "CV chính"}
                                                    </Badge>
                                                </td>
                                                <td>
                                                    <span className="text-dark fw-medium">
                                                        {a.applied_at
                                                            ? dayjs(a.applied_at).format("DD/MM/YYYY")
                                                            : "Chưa cập nhật"}
                                                    </span>
                                                    <br />
                                                    <small className="text-muted">
                                                        {a.applied_at && dayjs(a.applied_at).format("HH:mm")}
                                                    </small>
                                                </td>
                                                <td className="text-center align-middle">
                                                    {renderStatus(a.status)}
                                                </td>
                                                <td>
                                                    <div className="d-flex gap-2 justify-content-center">
                                                        {a.job?.id && (
                                                            <OverlayTrigger placement="top" overlay={<Tooltip>Xem chi tiết việc làm</Tooltip>}>
                                                                <Link to={`/jobs/${a.job.id}`}>
                                                                    <Button size="sm" variant="outline-info" className="rounded-circle d-flex align-items-center justify-content-center border-0 shadow-sm bg-light text-info" style={{ width: "36px", height: "36px" }}>
                                                                        <FaEye size={16} />
                                                                    </Button>
                                                                </Link>
                                                            </OverlayTrigger>
                                                        )}

                                                        <OverlayTrigger placement="top" overlay={<Tooltip>{a.status !== "PENDING" ? "Chỉ thể hủy khi chờ duyệt" : "Hủy ứng tuyển"}</Tooltip>}>
                                                            <span>
                                                                <Button
                                                                    variant="outline-danger"
                                                                    size="sm"
                                                                    className="rounded-circle d-flex align-items-center justify-content-center border-0 shadow-sm bg-light text-danger"
                                                                    style={{ width: "36px", height: "36px" }}
                                                                    disabled={a.status !== "PENDING" || deletingId === a.id}
                                                                    onClick={() => removeApplication(a.id)}
                                                                >
                                                                    {deletingId === a.id ? (
                                                                        <Spinner animation="border" size="sm" />
                                                                    ) : (
                                                                        <FaTimes size={16} />
                                                                    )}
                                                                </Button>
                                                            </span>
                                                        </OverlayTrigger>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>

                            <div className="text-center mt-4 mb-2">
                                {loading && (
                                    <div className="py-3">
                                        <Spinner animation="border" variant="primary" />
                                    </div>
                                )}

                                {!loading && hasMore && applications.length > 0 && (
                                    <Button
                                        variant="outline-primary"
                                        onClick={handleLoadMore}
                                        className="px-5 py-2 rounded-pill fw-medium shadow-sm transition-hover"
                                    >
                                        Tải thêm hồ sơ...
                                    </Button>
                                )}

                                {!hasMore && applications.length > 0 && (
                                    <p className="text-muted small mt-3">Đã hiển thị tất cả hồ sơ ứng tuyển.</p>
                                )}
                            </div>
                        </>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
};

export default StudentApplications;