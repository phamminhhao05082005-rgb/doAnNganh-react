import { useEffect, useState } from "react";
import { Card, Button, Spinner, Table, Badge, Container, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { authApis, endpoints } from "../../configs/Apis";
import { FaPlus, FaIdCard, FaFileAlt, FaPalette, FaCalendarAlt, FaPen, FaTrashAlt, FaCheckCircle, FaEyeSlash } from "react-icons/fa";

const StudentCVs = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [cvs, setCVs] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [deletingId, setDeletingId] = useState(null);

    const loadCVs = async (pageNumber = 1) => {
        setLoading(true);
        try {
            const res = await authApis().get(endpoints.cvs, {
                params: { page: pageNumber }
            });

            const newCVs = res.data.data || [];

            if (pageNumber === 1) {
                setCVs(newCVs);
            } else {
                setCVs(prev => [...prev, ...newCVs]);
            }

            const currentPage = res.data.meta?.current_page || pageNumber;
            const lastPage = res.data.meta?.last_page || 1;
            setHasMore(currentPage < lastPage);

        } catch (err) {
            console.error(err);
            alert("Không thể tải danh sách CV");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCVs(page);
    }, [page]);

    const handleLoadMore = () => {
        if (!loading && hasMore) {
            setPage(prevPage => prevPage + 1);
        }
    };

    const removeCV = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa CV này? Hành động này không thể hoàn tác.")) return;

        setDeletingId(id);
        try {
            await authApis().delete(endpoints.cv(id));
            
            setCVs(prev => prev.filter(cv => cv.id !== id));
        } catch (err) {
            console.error(err);
            alert("Xóa thất bại");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <Container className="py-4">
            <Card className="shadow-sm border-0 rounded-4">
                <Card.Header className="bg-white border-bottom-0 pt-4 pb-3 px-4 d-flex justify-content-between align-items-center flex-wrap gap-3">
                    <div className="d-flex align-items-center gap-3">
                        <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center shadow-sm" style={{ width: "48px", height: "48px" }}>
                            <FaIdCard size={22} />
                        </div>
                        <div>
                            <h3 className="mb-0 fw-bold text-primary">Quản lý CV</h3>
                            <p className="text-muted mb-0 mt-1 small">Tạo và quản lý các hồ sơ xin việc của bạn</p>
                        </div>
                    </div>
                    <Button variant="primary" as={Link} to="/student/cvs" className="rounded-pill px-4 fw-bold shadow-sm d-flex align-items-center gap-2">
                        <FaPlus /> Tạo CV mới
                    </Button>
                </Card.Header>

                <Card.Body className="p-4">
                    {!loading && cvs.length === 0 ? (
                        <div className="text-center py-5 bg-light rounded-4">
                            <FaFileAlt size={48} className="text-secondary mb-3 opacity-50" />
                            <h5 className="text-muted fw-medium mb-2">Bạn chưa có CV nào trong hệ thống</h5>
                            <p className="text-secondary mb-4">Hãy tạo CV đầu tiên để sẵn sàng ứng tuyển các công việc hấp dẫn!</p>
                            <Link to="/student/cvs">
                                <Button variant="primary" className="rounded-pill px-4 shadow-sm fw-medium">
                                    <FaPlus className="me-2" /> Tạo CV ngay
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
                                            <th className="py-3 text-muted fw-bold border-bottom-0" style={{ width: "35%" }}><FaFileAlt className="me-2" />Tiêu đề CV</th>
                                            <th className="py-3 text-muted fw-bold border-bottom-0" style={{ width: "20%" }}><FaPalette className="me-2" />Mẫu CV</th>
                                            <th className="py-3 text-muted fw-bold border-bottom-0" style={{ width: "15%" }}><FaCalendarAlt className="me-2" />Ngày tạo</th>
                                            <th className="text-center py-3 text-muted fw-bold border-bottom-0" style={{ width: "10%" }}>Trạng thái</th>
                                            <th className="text-center py-3 text-muted fw-bold border-bottom-0" style={{ width: "15%" }}>Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody className="border-top-0">
                                        {cvs.map((cv, index) => (
                                            <tr key={cv.id} className="border-bottom transition-hover">
                                                <td className="text-center fw-semibold text-muted">{index + 1}</td>
                                                <td>
                                                    <span className="fw-bold text-dark d-block text-truncate" style={{ maxWidth: "300px" }} title={cv.title}>
                                                        {cv.title}
                                                    </span>
                                                </td>
                                                <td>
                                                    <Badge bg="light" text="dark" className="border fw-medium px-3 py-2 rounded-pill text-truncate d-inline-block" style={{ maxWidth: "150px" }}>
                                                        {cv.template?.name || "Mặc định"}
                                                    </Badge>
                                                </td>
                                                <td>
                                                    <span className="text-dark fw-medium">
                                                        {cv.created_at
                                                            ? dayjs(cv.created_at).format("DD/MM/YYYY")
                                                            : "Chưa cập nhật"}
                                                    </span>
                                                </td>
                                                <td className="text-center align-middle">
                                                    {cv.status ? (
                                                        <Badge bg="success" className="px-3 py-2 rounded-pill d-flex align-items-center justify-content-center gap-1 mx-auto" style={{ width: "fit-content" }}>
                                                            <FaCheckCircle size={12} /> Hoạt động
                                                        </Badge>
                                                    ) : (
                                                        <Badge bg="secondary" className="px-3 py-2 rounded-pill d-flex align-items-center justify-content-center gap-1 mx-auto" style={{ width: "fit-content" }}>
                                                            <FaEyeSlash size={12} /> Đã ẩn
                                                        </Badge>
                                                    )}
                                                </td>
                                                <td>
                                                    <div className="d-flex gap-2 justify-content-center">
                                                        <OverlayTrigger placement="top" overlay={<Tooltip>Xem / Cập nhật</Tooltip>}>
                                                            <Link to={`/student/cvs/${cv.id}`}>
                                                                <Button size="sm" variant="outline-primary" className="rounded-circle d-flex align-items-center justify-content-center border-0 shadow-sm bg-light text-primary" style={{ width: "36px", height: "36px" }}>
                                                                    <FaPen size={16} />
                                                                </Button>
                                                            </Link>
                                                        </OverlayTrigger>

                                                        <OverlayTrigger placement="top" overlay={<Tooltip>Xóa CV</Tooltip>}>
                                                            <span>
                                                                <Button
                                                                    variant="outline-danger"
                                                                    size="sm"
                                                                    className="rounded-circle d-flex align-items-center justify-content-center border-0 shadow-sm bg-light text-danger"
                                                                    style={{ width: "36px", height: "36px" }}
                                                                    disabled={deletingId === cv.id}
                                                                    onClick={() => removeCV(cv.id)}
                                                                >
                                                                    {deletingId === cv.id ? (
                                                                        <Spinner animation="border" size="sm" />
                                                                    ) : (
                                                                        <FaTrashAlt size={16} />
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

                                {!loading && hasMore && cvs.length > 0 && (
                                    <Button
                                        variant="outline-primary"
                                        onClick={handleLoadMore}
                                        className="px-5 py-2 rounded-pill fw-medium shadow-sm transition-hover"
                                    >
                                        Tải thêm CV...
                                    </Button>
                                )}

                                {!hasMore && cvs.length > 0 && (
                                    <p className="text-muted small mt-3">Đã hiển thị tất cả hồ sơ CV của bạn.</p>
                                )}
                            </div>
                        </>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
};

export default StudentCVs;