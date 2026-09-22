import { useEffect, useState } from "react";
import { Card, Button, Spinner, Badge, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { authApis, endpoints } from "../../configs/Apis";
import dayjs from "dayjs";
import { toast } from "react-toastify";

const StudentBookmarks = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const loadBookmarks = async (pageNumber = 1) => {
        setLoading(true);
        try {
            const res = await authApis().get(endpoints.bookmarks, {
                params: { page: pageNumber }
            });

            const newJobs = res.data.data || [];

            
            if (pageNumber === 1) {
                setJobs(newJobs);
            } else {
                setJobs(prev => [...prev, ...newJobs]);
            }

            
            const currentPage = res.data.meta?.current_page || pageNumber;
            const lastPage = res.data.meta?.last_page || 1;
            setHasMore(currentPage < lastPage);

        } catch (err) {
            console.error(err);
            toast.error("Không thể tải danh sách việc làm đã lưu");
        } finally {
            setLoading(false);
        }
    };

    
    useEffect(() => {
        loadBookmarks(page);
    }, [page]);

    
    const handleLoadMore = () => {
        if (!loading && hasMore) {
            setPage(prevPage => prevPage + 1);
        }
    };

   
    const removeBookmark = async (jobId) => {
        if (!window.confirm("Bạn có chắc chắn muốn bỏ lưu việc làm này?")) return;

        setDeletingId(jobId);
        try {
            await authApis().delete(endpoints.unBookmark(jobId));

            
            setJobs(prev => prev.filter(job => job.id !== jobId));

            toast.success("Đã bỏ lưu việc làm");
        } catch (err) {
            console.error(err);
            toast.error("Bỏ lưu thất bại, vui lòng thử lại");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="container py-4">
            <h2 className="mb-4 text-primary font-weight-bold">Việc Làm Đã Lưu</h2>

            
            {!loading && jobs.length === 0 && (
                <Card className="text-center p-4 shadow-sm">
                    <Card.Body>
                        <p className="text-muted mb-0">Bạn chưa lưu việc làm nào.</p>
                    </Card.Body>
                </Card>
            )}

            
            <Row>
                {jobs.map(job => (
                    <Col md={6} lg={6} className="mb-4" key={job.id}>
                        <Card className="h-100 shadow-sm border-0">
                            <Card.Body className="d-flex flex-column">
                                <h5 className="card-title text-dark font-weight-bold mb-2">
                                    {job.title}
                                </h5>

                                <p className="mb-1 text-muted">
                                    <strong className="text-dark">Doanh nghiệp:</strong> {job.company?.name || "N/A"}
                                </p>

                                <p className="mb-1 text-muted">
                                    <strong className="text-dark">Địa điểm:</strong> {job.location || "Toàn quốc"}
                                </p>

                                <p className="mb-1 text-muted">
                                    <strong className="text-dark">Mức lương:</strong>{" "}
                                    {job.salary_min && job.salary_max
                                        ? `${Number(job.salary_min).toLocaleString()} - ${Number(job.salary_max).toLocaleString()} VNĐ`
                                        : "Thỏa thuận"}
                                </p>

                                <p className="mb-3 text-muted">
                                    <strong className="text-dark">Hạn nộp:</strong>{" "}
                                    {job.deadline ? dayjs(job.deadline).format("DD/MM/YYYY") : "Chưa xác định"}
                                </p>

                                
                                <div className="mb-3">
                                    {job.skills && job.skills.length > 0 ? (
                                        job.skills.map(skill => (
                                            <Badge bg="primary" className="me-1 mb-1 fw-normal" key={skill.id}>
                                                {skill.name}
                                            </Badge>
                                        ))
                                    ) : (
                                        <small className="text-muted">Không yêu cầu kỹ năng cụ thể</small>
                                    )}
                                </div>

                                
                                <div className="mt-auto pt-2 d-flex gap-2">
                                    <Link to={`/jobs/${job.id}`} className="flex-fill">
                                        <Button variant="primary" className="w-100">
                                            Xem chi tiết
                                        </Button>
                                    </Link>

                                    <Button
                                        variant="outline-danger"
                                        disabled={deletingId === job.id}
                                        onClick={() => removeBookmark(job.id)}
                                    >
                                        {deletingId === job.id ? (
                                            <Spinner animation="border" size="sm" />
                                        ) : (
                                            "Xóa"
                                        )}
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

           
            <div className="text-center my-4">
                {loading && (
                    <div className="py-2">
                        <Spinner animation="border" variant="primary" />
                    </div>
                )}

                {!loading && hasMore && jobs.length > 0 && (
                    <Button variant="outline-primary" onClick={handleLoadMore} className="px-4 py-2">
                        Xem thêm...
                    </Button>
                )}
            </div>
        </div>
    );
};

export default StudentBookmarks;