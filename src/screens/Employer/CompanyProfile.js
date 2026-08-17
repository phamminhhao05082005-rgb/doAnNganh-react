import { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { 
    Button, Card, Spinner, ListGroup, 
    Modal, Form, Alert 
} from "react-bootstrap";
import { authApis, endpoints } from "../../configs/Apis";
import { MyUserContext } from "../../configs/Contexts";

const CompanyProfile = () => {
    const { companyId } = useParams();
    const [company, setCompany] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user] = useContext(MyUserContext);

    const [showReviewModal, setShowReviewModal] = useState(false);
    const [editingReviewId, setEditingReviewId] = useState(null);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [reviewError, setReviewError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const loadCompany = async () => {
        if (companyId === "undefined") return;

        setLoading(true);
        try {
            const url = companyId 
                ? endpoints.getCompanyById(companyId)
                : endpoints.myCompany;

            const res = await authApis().get(url);
            const companyData = res.data.data || res.data;
            setCompany(companyData);

            if (companyData?.id) {
                loadReviews(companyData.id);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const loadReviews = async (cId) => {
        try {
            const res = await authApis().get(endpoints.companyReviews(cId));
            setReviews(res.data.data || []);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        loadCompany();
    }, [companyId]);

    const handleOpenModal = (review = null) => {
        setReviewError("");
        if (review) {
            setEditingReviewId(review.id);
            setRating(review.rating);
            setComment(review.comment);
        } else {
            setEditingReviewId(null);
            setRating(5);
            setComment("");
        }
        setShowReviewModal(true);
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        setReviewError("");
        setSubmitting(true);

        try {
            if (editingReviewId) {
                await authApis().put(endpoints.updateReview(editingReviewId), {
                    rating: parseInt(rating),
                    comment: comment
                });
            } else {
                await authApis().post(endpoints.addReview, {
                    company_id: company.id,
                    rating: parseInt(rating),
                    comment: comment
                });
            }

            loadReviews(company.id);
            setShowReviewModal(false);
            setComment("");
            setRating(5);
            setEditingReviewId(null);
        } catch (error) {
            const msg = error.response?.data?.message || "Có lỗi xảy ra!";
            setReviewError(msg);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteReview = async (reviewId) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa đánh giá này không?")) return;

        try {
            await authApis().delete(endpoints.deleteReview(reviewId));
            loadReviews(company.id);
        } catch (error) {
            alert(error.response?.data?.message || "Không thể xóa đánh giá này!");
        }
    };

    const renderStars = (num) => {
        return "★".repeat(num) + "☆".repeat(5 - num);
    };

    if (loading) return <Spinner className="mt-5 d-block mx-auto" animation="border" />;
    if (!company) return <Alert variant="danger" className="mt-4">Không tìm thấy thông tin công ty!</Alert>;

    const isOwner = user?.role === "EMPLOYER" && !companyId;

    return (
        <div className="container mt-4 mb-5">
            <Card className="mb-4 shadow-sm">
                <Card.Header className="d-flex justify-content-between align-items-center bg-primary text-white">
                    <h3 className="mb-0">Thông tin doanh nghiệp</h3>
                    {isOwner && (
                        <Link to="/employer/company/edit" state={company}>
                            <Button variant="light" size="sm">Chỉnh sửa</Button>
                        </Link>
                    )}
                </Card.Header>

                <Card.Body>
                    <p><b>Tên công ty:</b> {company.name}</p>
                    <p><b>Người đại diện:</b> {company.owner?.full_name}</p>
                    <p><b>Email:</b> {company.owner?.email}</p>
                    <p><b>Điện thoại:</b> {company.owner?.phone}</p>
                    <p><b>Website:</b> <a href={company.website} target="_blank" rel="noreferrer">{company.website}</a></p>
                    <p><b>Địa chỉ:</b> {company.address}</p>
                    <p><b>Mô tả:</b> {company.description}</p>
                </Card.Body>
            </Card>

            <Card className="shadow-sm">
                <Card.Header className="d-flex justify-content-between align-items-center bg-light">
                    <h4 className="mb-0">Đánh giá từ ứng viên ({reviews.length})</h4>
                    {user?.role === "STUDENT" && (
                        <Button variant="success" onClick={() => handleOpenModal()}>
                            + Viết đánh giá
                        </Button>
                    )}
                </Card.Header>

                <Card.Body>
                    {reviews.length === 0 ? (
                        <p className="text-muted text-center my-3">Chưa có đánh giá nào cho công ty này.</p>
                    ) : (
                        <ListGroup variant="flush">
                            {reviews.map((rev) => (
                                <ListGroup.Item key={rev.id} className="py-3">
                                    <div className="d-flex justify-content-between align-items-start">
                                        <div className="d-flex align-items-center mb-2">
                                            <img 
                                                src={rev.user?.avatar || "https://via.placeholder.com/40"} 
                                                alt="avatar" 
                                                className="rounded-circle me-2"
                                                width="40" 
                                                height="40" 
                                            />
                                            <div>
                                                <strong className="d-block">{rev.user?.full_name || "Ẩn danh"}</strong>
                                                <span className="text-warning me-2">{renderStars(rev.rating)}</span>
                                                <small className="text-muted">
                                                    {new Date(rev.created_at).toLocaleDateString("vi-VN")}
                                                </small>
                                            </div>
                                        </div>

                                        {user && user.id === rev.user?.id && (
                                            <div>
                                                <Button 
                                                    variant="outline-warning" 
                                                    size="sm"
                                                    className="me-2"
                                                    onClick={() => handleOpenModal(rev)}
                                                >
                                                    Sửa
                                                </Button>
                                                <Button 
                                                    variant="outline-danger" 
                                                    size="sm"
                                                    onClick={() => handleDeleteReview(rev.id)}
                                                >
                                                    Xóa
                                                </Button>
                                            </div>
                                        )}
                                    </div>

                                    <p className="mb-0 mt-2 text-secondary" style={{ whiteSpace: "pre-line" }}>
                                        {rev.comment}
                                    </p>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    )}
                </Card.Body>
            </Card>

            <Modal show={showReviewModal} onHide={() => setShowReviewModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{editingReviewId ? "Chỉnh sửa đánh giá" : `Đánh giá ${company.name}`}</Modal.Title>
                </Modal.Header>
                
                <Form onSubmit={handleReviewSubmit}>
                    <Modal.Body>
                        {reviewError && <Alert variant="danger">{reviewError}</Alert>}

                        <Form.Group className="mb-3">
                            <Form.Label><b>Số sao đánh giá:</b></Form.Label>
                            <Form.Select 
                                value={rating} 
                                onChange={(e) => setRating(e.target.value)}
                            >
                                <option value="5">5 Sao - Rất tốt</option>
                                <option value="4">4 Sao - Tốt</option>
                                <option value="3">3 Sao - Bình thường</option>
                                <option value="2">2 Sao - Kém</option>
                                <option value="1">1 Sao - Rất kém</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label><b>Nội dung đánh giá:</b></Form.Label>
                            <Form.Control 
                                as="textarea" 
                                rows={4} 
                                placeholder="Chia sẻ trải nghiệm ứng tuyển hoặc làm việc của bạn..."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                required
                            />
                        </Form.Group>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowReviewModal(false)}>
                            Hủy
                        </Button>
                        <Button variant="primary" type="submit" disabled={submitting}>
                            {submitting ? "Đang xử lý..." : editingReviewId ? "Cập nhật" : "Gửi đánh giá"}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </div>
    );
};

export default CompanyProfile;