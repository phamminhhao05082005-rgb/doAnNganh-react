import { useEffect, useState } from "react";
import { Card, Spinner, Table, Badge, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import { authApis, endpoints } from "../../configs/Apis";
import { toast } from "react-toastify";

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

            // Nếu trang 1 thì ghi đè, trang sau thì nối thêm vào danh sách cũ
            if (pageNumber === 1) {
                setApplications(newApps);
            } else {
                setApplications(prev => [...prev, ...newApps]);
            }

            // Kiểm tra phân trang dựa trên meta do Laravel Resource trả về
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

    // Xử lý khi bấm nút "Xem thêm..."
    const handleLoadMore = () => {
        if (!loading && hasMore) {
            setPage(prevPage => prevPage + 1);
        }
    };

    // Hủy ứng tuyển
    const removeApplication = async (id) => {
        if (!window.confirm("Bạn có chắc muốn hủy ứng tuyển?")) return;

        setDeletingId(id);
        try {
            await authApis().delete(endpoints.deleteApplication(id));

            toast.success("Đã hủy ứng tuyển thành công");

            // Cập nhật lại UI trực tiếp
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
                return <Badge bg="warning" text="dark">Chờ duyệt</Badge>;
            case "APPROVED":
                return <Badge bg="success">Đã duyệt</Badge>;
            case "REJECTED":
                return <Badge bg="danger">Từ chối</Badge>;
            default:
                return <Badge bg="secondary">{status}</Badge>;
        }
    };

    return (
        <Card className="shadow mt-4 border-0">
            <Card.Header className="bg-primary text-white py-3">
                <h4 className="mb-0 fw-bold">Danh sách việc làm đã ứng tuyển</h4>
            </Card.Header>

            <Card.Body className="p-4">
                {!loading && applications.length === 0 ? (
                    <h5 className="text-center text-muted py-5">
                        Bạn chưa ứng tuyển công việc nào.
                    </h5>
                ) : (
                    <>
                        <Table bordered hover responsive align="middle" className="mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th className="text-center">#</th>
                                    <th>Công việc</th>
                                    <th>Công ty</th>
                                    <th>CV sử dụng</th>
                                    <th>Ngày ứng tuyển</th>
                                    <th className="text-center">Trạng thái</th>
                                    <th className="text-center">Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {applications.map((a, index) => (
                                    <tr key={a.id}>
                                        <td className="text-center fw-bold">{index + 1}</td>
                                        <td className="fw-semibold">{a.job?.title || "N/A"}</td>
                                        <td>{a.job?.company?.name || "N/A"}</td>
                                        <td>{a.cv?.title || "CV chính"}</td>
                                        <td>
                                            {a.applied_at
                                                ? dayjs(a.applied_at).format("DD/MM/YYYY HH:mm")
                                                : "Chưa cập nhật"}
                                        </td>
                                        <td className="text-center">{renderStatus(a.status)}</td>
                                        <td className="text-center">
                                            <div className="d-flex gap-2 justify-content-center">
                                                {a.job?.id && (
                                                    <Link to={`/jobs/${a.job.id}`}>
                                                        <Button size="sm" variant="outline-primary">
                                                            Xem việc làm
                                                        </Button>
                                                    </Link>
                                                )}

                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    disabled={a.status !== "PENDING" || deletingId === a.id}
                                                    onClick={() => removeApplication(a.id)}
                                                >
                                                    {deletingId === a.id ? (
                                                        <Spinner animation="border" size="sm" />
                                                    ) : (
                                                        "Hủy ứng tuyển"
                                                    )}
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>

                        {/* Nút Xem thêm & Loading spinner */}
                        <div className="text-center mt-4">
                            {loading && (
                                <div className="py-2">
                                    <Spinner animation="border" variant="primary" />
                                </div>
                            )}

                            {!loading && hasMore && applications.length > 0 && (
                                <Button
                                    variant="outline-primary"
                                    onClick={handleLoadMore}
                                    className="px-4 py-2"
                                >
                                    Xem thêm...
                                </Button>
                            )}
                        </div>
                    </>
                )}
            </Card.Body>
        </Card>
    );
};

export default StudentApplications;