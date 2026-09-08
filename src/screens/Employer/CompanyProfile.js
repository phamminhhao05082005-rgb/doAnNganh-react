import { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { Button, Card, Spinner, ListGroup, Modal, Form, Alert, Row, Col } from "react-bootstrap";
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
            <Card className="mb-4 shadow-sm border-0">
                <Card.Header className="d-flex justify-content-between align-items-center bg-primary text-white py-3">
                    <h4 className="mb-0 fw-bold">Hồ sơ doanh nghiệp</h4>
                    {isOwner && (
                        <Link to="/employer/company/edit" state={company}>
                            <Button variant="light" size="sm" className="fw-bold text-primary">
                                <i className="bi bi-pencil-square me-1"></i> Chỉnh sửa
                            </Button>
                        </Link>
                    )}
                </Card.Header>

                <Card.Body className="p-4">
                    <Row className="align-items-center">
                        <Col md={3} className="text-center mb-4 mb-md-0">
                            {company.logo ? (
                                <img 
                                    src={company.logo} 
                                    alt={`Logo ${company.name}`} 
                                    className="img-thumbnail shadow-sm rounded"
                                    style={{ width: "100%", maxWidth: "180px", aspectRatio: "1/1", objectFit: "contain" }}
                                />
                            ) : (
                                <div 
                                    className="bg-light d-flex align-items-center justify-content-center mx-auto img-thumbnail shadow-sm rounded" 
                                    style={{ width: "100%", maxWidth: "180px", aspectRatio: "1/1" }}
                                >
                                    <span className="text-muted fw-semibold">Chưa có Logo</span>
                                </div>
                            )}
                        </Col>
                        
                        <Col md={9}>
                            <h3 className="text-primary mb-3 fw-bold">{company.name}</h3>
                            <div className="text-secondary mb-2">
                                <i className="bi bi-person-fill me-2 text-dark"></i>
                                <strong>Người đại diện:</strong> {company.owner?.full_name}
                            </div>
                            <div className="text-secondary mb-2">
                                <i className="bi bi-envelope-fill me-2 text-dark"></i>
                                <strong>Email:</strong> {company.owner?.email}
                            </div>
                            <div className="text-secondary mb-2">
                                <i className="bi bi-telephone-fill me-2 text-dark"></i>
                                <strong>Điện thoại:</strong> {company.owner?.phone}
                            </div>
                            <div className="text-secondary mb-2">
                                <i className="bi bi-globe me-2 text-dark"></i>
                                <strong>Website:</strong> <a href={company.website} target="_blank" rel="noreferrer" className="text-decoration-none">{company.website}</a>
                            </div>
                            <div className="text-secondary mb-3">
                                <i className="bi bi-geo-alt-fill me-2 text-dark"></i>
                                <strong>Địa chỉ:</strong> {company.address}
                            </div>
                            
                            {company.description && (
                                <div className="p-3 bg-light rounded border">
                                    <h6 className="fw-bold mb-2">Mô tả công ty:</h6>
                                    <p className="mb-0 text-secondary" style={{ whiteSpace: "pre-line", fontSize: "0.95rem" }}>
                                        {company.description}
                                    </p>
                                </div>
                            )}
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            <Card className="shadow-sm border-0">
                <Card.Header className="d-flex justify-content-between align-items-center bg-white border-bottom py-3">
                    <h5 className="mb-0 fw-bold text-dark">
                        Đánh giá từ ứng viên <span className="badge bg-secondary ms-2">{reviews.length}</span>
                    </h5>
                    {user?.role === "STUDENT" && (
                        <Button variant="success" size="sm" className="fw-bold" onClick={() => handleOpenModal()}>
                            + Viết đánh giá
                        </Button>
                    )}
                </Card.Header>

                <Card.Body className="p-0">
                    {reviews.length === 0 ? (
                        <div className="text-center py-5">
                            <h6 className="text-muted mb-0">Chưa có đánh giá nào cho công ty này.</h6>
                        </div>
                    ) : (
                        <ListGroup variant="flush">
                            {reviews.map((rev) => (
                                <ListGroup.Item key={rev.id} className="p-4 border-bottom">
                                    <div className="d-flex justify-content-between align-items-start">
                                        <div className="d-flex mb-3">
                                            <img 
                                                src={rev.user?.avatar || "https://via.placeholder.com/50"} 
                                                alt="avatar" 
                                                className="rounded-circle me-3 shadow-sm border"
                                                width="50" 
                                                height="50"
                                                style={{ objectFit: "cover" }}
                                            />
                                            <div>
                                                <h6 className="mb-1 fw-bold text-dark">{rev.user?.full_name || "Ẩn danh"}</h6>
                                                <div className="d-flex align-items-center">
                                                    <span className="text-warning me-2 fs-5" style={{ letterSpacing: "2px" }}>
                                                        {renderStars(rev.rating)}
                                                    </span>
                                                    <small className="text-muted" style={{ fontSize: "0.85rem" }}>
                                                        {new Date(rev.created_at).toLocaleDateString("vi-VN")}
                                                    </small>
                                                </div>
                                            </div>
                                        </div>

                                        {user && user.id === rev.user?.id && (
                                            <div className="d-flex gap-2">
                                                <Button 
                                                    variant="outline-primary" 
                                                    size="sm"
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

                                    <div className="p-3 bg-light rounded text-dark" style={{ fontSize: "0.95rem", lineHeight: "1.6", whiteSpace: "pre-line" }}>
                                        {rev.comment}
                                    </div>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    )}
                </Card.Body>
            </Card>

            <Modal show={showReviewModal} onHide={() => setShowReviewModal(false)} centered backdrop="static">
                <Modal.Header closeButton className="bg-light">
                    <Modal.Title className="fs-5 fw-bold text-primary">
                        {editingReviewId ? "Chỉnh sửa đánh giá" : `Đánh giá ${company.name}`}
                    </Modal.Title>
                </Modal.Header>
                
                <Form onSubmit={handleReviewSubmit}>
                    <Modal.Body className="p-4">
                        {reviewError && <Alert variant="danger" className="py-2">{reviewError}</Alert>}

                        <Form.Group className="mb-4">
                            <Form.Label className="fw-bold">Số sao đánh giá <span className="text-danger">*</span></Form.Label>
                            <Form.Select 
                                value={rating} 
                                onChange={(e) => setRating(e.target.value)}
                                className="form-select-lg fs-6"
                            >
                                <option value="5">⭐⭐⭐⭐⭐ (5/5) - Tuyệt vời</option>
                                <option value="4">⭐⭐⭐⭐ (4/5) - Rất tốt</option>
                                <option value="3">⭐⭐⭐ (3/5) - Bình thường</option>
                                <option value="2">⭐⭐ (2/5) - Kém</option>
                                <option value="1">⭐ (1/5) - Rất kém</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-2">
                            <Form.Label className="fw-bold">Nội dung đánh giá <span className="text-danger">*</span></Form.Label>
                            <Form.Control 
                                as="textarea" 
                                rows={4} 
                                placeholder="Chia sẻ trải nghiệm của bạn về văn hóa công ty, quá trình phỏng vấn..."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                required
                                className="p-3"
                            />
                        </Form.Group>
                    </Modal.Body>

                    <Modal.Footer className="bg-light">
                        <Button variant="secondary" onClick={() => setShowReviewModal(false)}>
                            Hủy bỏ
                        </Button>
                        <Button variant="primary" type="submit" disabled={submitting} className="px-4">
                            {submitting ? (
                                <><Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" /> Đang xử lý...</>
                            ) : (
                                editingReviewId ? "Cập nhật đánh giá" : "Gửi đánh giá"
                            )}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </div>
    );
};

export default CompanyProfile;