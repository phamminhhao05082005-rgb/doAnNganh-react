import { useEffect, useState } from "react";
import { authApis, endpoints } from "../../configs/Apis";
import dayjs from "dayjs";
import { Button, Card, Pagination, Spinner, Table } from "react-bootstrap";
import { Link, useSearchParams } from "react-router-dom";

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
        if (!window.confirm("Bạn có chắc muốn xóa?")) return;

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
        <Card className="mt-4">
            <Card.Header className="d-flex justify-content-between align-items-center">
                <h3>Quản lý tin tuyển dụng</h3>
                <Link to="/employer/jobs/create">
                    <Button>+ Đăng tin</Button>
                </Link>
            </Card.Header>

            <Card.Body>
                {loading ? (
                    <div className="text-center my-5">
                        <Spinner animation="border" variant="primary" />
                    </div>
                ) : (
                    <>
                        <Table striped bordered hover responsive>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Tiêu đề</th>
                                    <th>Địa điểm</th>
                                    <th>Lương theo giờ</th>
                                    <th>Hạn</th>
                                    <th>Trạng thái</th>
                                    <th width="230">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {jobs.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="text-center">
                                            Chưa có tin tuyển dụng
                                        </td>
                                    </tr>
                                ) : (
                                    jobs.map((job) => (
                                        <tr key={job.id}>
                                            <td>{job.id}</td>
                                            <td>{job.title}</td>
                                            <td>{job.location}</td>
                                            <td>
                                                {job.salary_min?.toLocaleString()}đ -{" "}
                                                {job.salary_max?.toLocaleString()}đ
                                            </td>
                                            <td>
                                                {dayjs(job.deadline).format("DD/MM/YYYY")}
                                            </td>
                                            <td>
                                                {job.status ? (
                                                    <span className="badge bg-success">
                                                        Đang tuyển
                                                    </span>
                                                ) : (
                                                    <span className="badge bg-danger">
                                                        Đã đóng
                                                    </span>
                                                )}
                                            </td>
                                            <td>
                                                <Link to={`/jobs/${job.id}`}>
                                                    <Button size="sm" variant="info">
                                                        Xem
                                                    </Button>
                                                </Link>{" "}
                                                <Link to={`/employer/jobs/${job.id}/edit`}>
                                                    <Button size="sm" variant="warning">
                                                        Sửa
                                                    </Button>
                                                </Link>{" "}
                                                <Button
                                                    size="sm"
                                                    variant="danger"
                                                    onClick={() => deleteJob(job.id)}
                                                >
                                                    Xóa
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </Table>

                        {/* Thanh Phân Trang */}
                        {meta && meta.last_page > 1 && (
                            <div className="d-flex justify-content-center mt-3">
                                <Pagination>
                                    <Pagination.First
                                        disabled={currentPage === 1}
                                        onClick={() => handlePageChange(1)}
                                    />
                                    <Pagination.Prev
                                        disabled={currentPage === 1}
                                        onClick={() => handlePageChange(currentPage - 1)}
                                    />

                                    {Array.from({ length: meta.last_page }, (_, index) => {
                                        const pageNumber = index + 1;
                                        return (
                                            <Pagination.Item
                                                key={pageNumber}
                                                active={pageNumber === currentPage}
                                                onClick={() => handlePageChange(pageNumber)}
                                            >
                                                {pageNumber}
                                            </Pagination.Item>
                                        );
                                    })}

                                    <Pagination.Next
                                        disabled={currentPage === meta.last_page}
                                        onClick={() => handlePageChange(currentPage + 1)}
                                    />
                                    <Pagination.Last
                                        disabled={currentPage === meta.last_page}
                                        onClick={() => handlePageChange(meta.last_page)}
                                    />
                                </Pagination>
                            </div>
                        )}
                    </>
                )}
            </Card.Body>
        </Card>
    );
};

export default EmployerJobs;