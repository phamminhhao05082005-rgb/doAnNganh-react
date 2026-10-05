import { useEffect, useState } from "react";
import { authApis, endpoints } from "../../configs/Apis";
import dayjs from "dayjs";
import { Button, Card, Pagination, Spinner, Table, Badge, OverlayTrigger, Tooltip, Container } from "react-bootstrap";
import { Link, useSearchParams } from "react-router-dom";
import { FaPlus, FaEye, FaEdit, FaTrashAlt } from "react-icons/fa";

const EmployerJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [meta, setMeta] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();

    const currentPage = parseInt(searchParams.get("page") || "1", 10);

    const loadJobs = async (page = 1) => {
        setLoading(true);
        try {
            const res = await authApis().get(`${endpoints.myJobs}?page=${page}`);
            setJobs(res.data.data);
            setMeta(res.data.meta);
        } catch (error) {
            console.error("Lỗi khi tải danh sách công việc:", error);
        } finally {
            setLoading(false);
        }
    };

    const deleteJob = async (id) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa tin tuyển dụng này? Hành động này không thể hoàn tác.")) return;

        try {
            await authApis().delete(endpoints.deleteJob(id));
            loadJobs(currentPage);
        } catch (error) {
            console.error("Lỗi khi xóa công việc:", error);
        }
    };

    useEffect(() => {
        loadJobs(currentPage);
    }, [currentPage]);

    const handlePageChange = (page) => {
        setSearchParams({ page });
    };

    return (
        <Container className="py-4">
            <Card className="shadow-sm border-0 rounded-4">
                <Card.Header className="bg-white border-bottom-0 pt-4 pb-3 px-4 d-flex justify-content-between align-items-center">
                    <h3 className="fw-bold text-primary mb-0">Quản lý tin tuyển dụng</h3>
                    <Link to="/employer/jobs/create">
                        <Button variant="primary" className="rounded-pill px-4 fw-bold shadow-sm d-flex align-items-center gap-2">
                            <FaPlus /> Đăng tin mới
                        </Button>
                    </Link>
                </Card.Header>

                <Card.Body className="p-4">
                    {loading ? (
                        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "300px" }}>
                            <Spinner animation="border" variant="primary" />
                        </div>
                    ) : (
                        <>
                            <div className="table-responsive rounded-3 border shadow-sm">
                                <Table hover className="align-middle mb-0 bg-white">
                                    <thead className="bg-light">
                                        <tr>
                                            <th className="text-center py-3 text-muted fw-bold" style={{ width: "5%" }}>#</th>
                                            <th className="py-3 text-muted fw-bold" style={{ width: "25%" }}>Tiêu đề công việc</th>
                                            <th className="py-3 text-muted fw-bold" style={{ width: "20%" }}>Địa điểm</th>
                                            <th className="py-3 text-muted fw-bold" style={{ width: "15%" }}>Mức lương</th>
                                            <th className="py-3 text-muted fw-bold text-center" style={{ width: "10%" }}>Hạn nộp</th>
                                            <th className="py-3 text-muted fw-bold text-center" style={{ width: "10%" }}>Trạng thái</th>
                                            <th className="py-3 text-muted fw-bold text-center" style={{ width: "15%" }}>Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody className="border-top-0">
                                        {jobs.length === 0 ? (
                                            <tr>
                                                <td colSpan={7} className="text-center py-5 text-muted">
                                                    <div className="d-flex flex-column align-items-center">
                                                        <span className="fs-5 mb-2 fw-medium">Chưa có tin tuyển dụng nào</span>
                                                        <p className="mb-0 text-secondary">Hãy đăng tin tuyển dụng đầu tiên của bạn!</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            jobs.map((job, index) => (
                                                <tr key={job.id} className="border-bottom">
                                                    <td className="text-center text-muted fw-semibold">
                                                        {(currentPage - 1) * (meta?.per_page || 10) + index + 1}
                                                    </td>
                                                    <td>
                                                        <span className="fw-bold text-dark d-block text-truncate" style={{ maxWidth: "250px" }} title={job.title}>
                                                            {job.title}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <div className="d-flex align-items-center">
                                                            <span className="text-truncate text-secondary fw-medium" style={{ maxWidth: "200px" }} title={job.location}>
                                                                {job.location}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <span className="fw-bold text-success">
                                                            {job.salary_min?.toLocaleString()}đ - {job.salary_max?.toLocaleString()}đ
                                                        </span>
                                                    </td>
                                                    <td className="text-center">
                                                        <span className={dayjs(job.deadline).isBefore(dayjs()) ? "text-danger fw-bold" : "text-dark fw-medium"}>
                                                            {dayjs(job.deadline).format("DD/MM/YYYY")}
                                                        </span>
                                                    </td>
                                                    <td className="text-center">
                                                        {job.status ? (
                                                            <Badge bg="success" className="px-3 py-2 fw-medium rounded-pill shadow-sm">Đang mở</Badge>
                                                        ) : (
                                                            <Badge bg="secondary" className="px-3 py-2 fw-medium rounded-pill shadow-sm">Đã đóng</Badge>
                                                        )}
                                                    </td>
                                                    <td>
                                                        <div className="d-flex justify-content-center gap-2">
                                                            <OverlayTrigger placement="top" overlay={<Tooltip>Xem chi tiết</Tooltip>}>
                                                                <Link to={`/jobs/${job.id}`}>
                                                                    <Button size="sm" variant="outline-info" className="rounded-circle d-flex align-items-center justify-content-center border-0 shadow-sm bg-light" style={{ width: "36px", height: "36px" }}>
                                                                        <FaEye size={16} />
                                                                    </Button>
                                                                </Link>
                                                            </OverlayTrigger>

                                                            <OverlayTrigger placement="top" overlay={<Tooltip>Chỉnh sửa</Tooltip>}>
                                                                <Link to={`/employer/jobs/${job.id}/edit`}>
                                                                    <Button size="sm" variant="outline-warning" className="rounded-circle d-flex align-items-center justify-content-center border-0 shadow-sm bg-light" style={{ width: "36px", height: "36px" }}>
                                                                        <FaEdit size={16} />
                                                                    </Button>
                                                                </Link>
                                                            </OverlayTrigger>

                                                            <OverlayTrigger placement="top" overlay={<Tooltip>Xóa</Tooltip>}>
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline-danger"
                                                                    className="rounded-circle d-flex align-items-center justify-content-center border-0 shadow-sm bg-light"
                                                                    style={{ width: "36px", height: "36px" }}
                                                                    onClick={() => deleteJob(job.id)}
                                                                >
                                                                    <FaTrashAlt size={16} />
                                                                </Button>
                                                            </OverlayTrigger>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </Table>
                            </div>

                            {meta && meta.last_page > 1 && (
                                <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
                                    <span className="text-muted fw-medium fs-6">
                                        Đang hiển thị trang <strong className="text-primary">{currentPage}</strong> trên tổng số <strong className="text-primary">{meta.last_page}</strong> trang
                                    </span>
                                    <Pagination className="mb-0 shadow-sm rounded">
                                        <Pagination.First disabled={currentPage === 1} onClick={() => handlePageChange(1)} />
                                        <Pagination.Prev disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)} />

                                        {Array.from({ length: meta.last_page }, (_, index) => {
                                            const pageNumber = index + 1;
                                            return (
                                                <Pagination.Item
                                                    key={pageNumber}
                                                    active={pageNumber === currentPage}
                                                    onClick={() => handlePageChange(pageNumber)}
                                                    className={pageNumber === currentPage ? "fw-bold" : ""}
                                                >
                                                    {pageNumber}
                                                </Pagination.Item>
                                            );
                                        })}

                                        <Pagination.Next disabled={currentPage === meta.last_page} onClick={() => handlePageChange(currentPage + 1)} />
                                        <Pagination.Last disabled={currentPage === meta.last_page} onClick={() => handlePageChange(meta.last_page)} />
                                    </Pagination>
                                </div>
                            )}
                        </>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
};

export default EmployerJobs;