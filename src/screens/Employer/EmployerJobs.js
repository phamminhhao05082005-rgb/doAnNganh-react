import { useEffect, useState } from "react";
import { authApis, endpoints } from "../../configs/Apis";
import dayjs from "dayjs";
import { Button, Card, Pagination, Spinner, Table } from "react-bootstrap";
import { Link, useSearchParams } from "react-router-dom";

const EmployerJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [meta, setMeta] = useState(null); // Lưu thông tin phân trang từ API
    const [searchParams, setSearchParams] = useSearchParams();

    // Lấy trang hiện tại từ URL query string (ví dụ: ?page=2), mặc định là 1
    const currentPage = parseInt(searchParams.get("page") || "1", 10);

    const loadJobs = async (page = 1) => {
        setLoading(true);
        try {
            // Truyền page query param lên API
            const res = await authApis().get(`${endpoints.myJobs}?page=${page}`);
            
            // Laravel Resource Collection chuẩn khi dùng paginate() sẽ có dạng:
            // res.data.data -> danh sách items
            // res.data.meta -> thông tin phân trang (current_page, last_page, v.v.)
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
            // Tải lại dữ liệu ở trang hiện tại sau khi xóa
            loadJobs(currentPage);
        } catch (error) {
            console.error("Lỗi khi xóa công việc:", error);
        }
    };

    // Gọi lại API mỗi khi trang trên URL thay đổi
    useEffect(() => {
        loadJobs(currentPage);
    }, [currentPage]);

    // Thay đổi trang trên URL query string
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