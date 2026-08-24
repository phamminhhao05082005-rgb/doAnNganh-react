import { useEffect, useState } from "react";
import { Card, Button, Spinner, Table, Badge } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { authApis, endpoints } from "../../configs/Apis";

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

            // Trang 1 ghi đè, các trang tiếp theo nối nối vào danh sách cũ
            if (pageNumber === 1) {
                setCVs(newCVs);
            } else {
                setCVs(prev => [...prev, ...newCVs]);
            }

            // Kiểm tra phân trang dựa trên meta từ Laravel
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

    // Xử lý nút Xem thêm
    const handleLoadMore = () => {
        if (!loading && hasMore) {
            setPage(prevPage => prevPage + 1);
        }
    };

    const removeCV = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa CV này?")) return;

        setDeletingId(id);
        try {
            await authApis().delete(endpoints.cv(id));
            
            // Xóa trực tiếp khỏi state UI
            setCVs(prev => prev.filter(cv => cv.id !== id));
        } catch (err) {
            console.error(err);
            alert("Xóa thất bại");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <Card className="shadow mt-4 border-0">
            <Card.Header className="d-flex justify-content-between align-items-center bg-primary text-white py-3">
                <h4 className="mb-0 fw-bold">Quản lý CV</h4>
                <Button variant="light" as={Link} to="/student/cvs" className="fw-semibold">
                    + Tạo CV mới
                </Button>
            </Card.Header>

            <Card.Body className="p-4">
                {!loading && cvs.length === 0 ? (
                    <div className="text-center py-5">
                        <h5 className="text-muted">Bạn chưa có CV nào.</h5>
                    </div>
                ) : (
                    <>
                        <Table bordered hover responsive align="middle" className="mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th className="text-center">#</th>
                                    <th>Tiêu đề</th>
                                    <th>Mẫu CV</th>
                                    <th>Ngày tạo</th>
                                    <th className="text-center">Trạng thái</th>
                                    <th className="text-center" width="220">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cvs.map((cv, index) => (
                                    <tr key={cv.id}>
                                        <td className="text-center fw-bold">{index + 1}</td>
                                        <td className="fw-semibold">{cv.title}</td>
                                        <td>{cv.template?.name || "Mặc định"}</td>
                                        <td>
                                            {cv.created_at
                                                ? dayjs(cv.created_at).format("DD/MM/YYYY")
                                                : "N/A"}
                                        </td>
                                        <td className="text-center">
                                            {cv.status ? (
                                                <Badge bg="success">Hoạt động</Badge>
                                            ) : (
                                                <Badge bg="secondary">Ẩn</Badge>
                                            )}
                                        </td>
                                        <td className="text-center">
                                            <div className="d-flex gap-2 justify-content-center">
                                                <Button
                                                    variant="outline-primary"
                                                    as={Link}
                                                    to={`/student/cvs/${cv.id}`}
                                                    size="sm"
                                                >
                                                    Xem / Sửa
                                                </Button>
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    disabled={deletingId === cv.id}
                                                    onClick={() => removeCV(cv.id)}
                                                >
                                                    {deletingId === cv.id ? (
                                                        <Spinner animation="border" size="sm" />
                                                    ) : (
                                                        "Xóa"
                                                    )}
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>

                        {/* Nút Xem thêm & Spinner */}
                        <div className="text-center mt-4">
                            {loading && (
                                <div className="py-2">
                                    <Spinner animation="border" variant="primary" />
                                </div>
                            )}

                            {!loading && hasMore && cvs.length > 0 && (
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

export default StudentCVs;