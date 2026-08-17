import { useEffect, useState } from "react";
import { Spinner, Button, Badge, Card } from "react-bootstrap";
import { useParams, useNavigate, Link } from "react-router-dom";
import { authApis, endpoints } from "../../configs/Apis";
import CVTemplate1 from "./CVTemplate1";
import CVTemplate2 from "./CVTemplate2";
import CVTemplate3 from "./CVTemplate3";
import CVTemplate4 from "./CVTemplate4";
import CVTemplate5 from "./CVTemplate5";
import CVTemplate6 from "./CVTemplate6";
import { toast } from "react-toastify";

const CVDetail = () => {
    const { id, applicationId } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [cv, setCV] = useState(null);
    const [application, setApplication] = useState(null);

    // Xác định xem có phải Employer đang xem theo applicationId hay không
    const isEmployer = !!applicationId;
    const editable = !isEmployer; // Employer chỉ được xem, không thể chỉnh sửa

    // 1. Tải CV dành cho Student
    const loadStudentCV = async (showLoading = true) => {
        if (showLoading) setLoading(true);
        try {
            const res = await authApis().get(endpoints.cv(id));
            setCV(res.data.data || res.data);
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Không thể tải CV");
        } finally {
            if (showLoading) setLoading(false);
        }
    };

    // 2. Tải Chi tiết Hồ sơ Ứng tuyển & CV dành cho Employer
    const loadEmployerApplication = async () => {
        try {
            setLoading(true);
            // Gọi trực tiếp API detail thông qua applicationId
            const res = await authApis().get(
                endpoints.employerCvDetail(applicationId)
            );

            const appData = res.data.data || res.data;

            if (!appData) {
                toast.error("Không tìm thấy hồ sơ ứng tuyển");
                setApplication(null);
                setCV(null);
                return;
            }

            setApplication(appData);
            // Lấy thông tin CV đính kèm trong đơn ứng tuyển
            setCV(appData.cv || appData.studentCv || appData);
        } catch (err) {
            console.error(err);
            toast.error(
                err.response?.data?.message || "Không thể tải hồ sơ ứng tuyển"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isEmployer) {
            loadEmployerApplication();
        } else {
            loadStudentCV();
        }
    }, [id, applicationId]);

    // Cập nhật thông tin CV (Chỉ dùng cho Student)
    const updateCV = async (data) => {
        if (!editable) return;

        try {
            const {
                educations,
                experiences,
                deletedEducationIds,
                deletedExperienceIds,
                ...cvData
            } = data;

            await authApis().put(endpoints.cv(id), cvData);

            for (const edu of educations || []) {
                if (edu.id) {
                    await authApis().put(endpoints.cvEducation(id, edu.id), edu);
                } else {
                    await authApis().post(endpoints.cvEducations(id), edu);
                }
            }

            for (const eduId of deletedEducationIds || []) {
                await authApis().delete(endpoints.cvEducation(id, eduId));
            }

            for (const exp of experiences || []) {
                if (exp.id) {
                    await authApis().put(endpoints.cvExperience(id, exp.id), exp);
                } else {
                    await authApis().post(endpoints.cvExperiences(id), exp);
                }
            }

            for (const expId of deletedExperienceIds || []) {
                await authApis().delete(endpoints.cvExperience(id, expId));
            }

            await loadStudentCV(false);
            toast.success("Lưu CV thành công!");
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Lưu CV thất bại!");
        }
    };

    // Duyệt / Từ chối hồ sơ (Dành cho Employer)
    const updateApplicationStatus = async (status) => {
        if (!application) return;

        try {
            const res = await authApis().put(
                endpoints.updateApplicationStatus(application.id),
                { status }
            );

            const updatedStatus = res.data.data?.status || status;

            setApplication((prev) => ({
                ...prev,
                status: updatedStatus,
            }));

            if (updatedStatus === "ACCEPTED" || updatedStatus === "APPROVED") {
                toast.success("Đã duyệt ứng viên");
            } else if (updatedStatus === "REJECTED") {
                toast.success("Đã từ chối ứng viên");
            }
        } catch (err) {
            console.error(err);
            toast.error(
                err.response?.data?.message || "Không thể cập nhật trạng thái"
            );
        }
    };

    if (loading) {
        return (
            <div className="text-center mt-5">
                <Spinner animation="border" />
            </div>
        );
    }

    if (!cv) {
        return (
            <Card className="mt-4 container">
                <Card.Body>
                    <h4>Không tìm thấy CV</h4>
                    <Button
                        variant="secondary"
                        className="mt-3"
                        onClick={() => navigate(-1)}
                    >
                        Quay lại
                    </Button>
                </Card.Body>
            </Card>
        );
    }

    const templateProps = {
        cv,
        editable, // Bằng false khi là Employer -> Tất cả input/nút sửa trong template sẽ bị vô hiệu hóa
        onSave: editable ? updateCV : undefined,
        application: isEmployer ? application : null,
        onUpdateStatus: isEmployer ? updateApplicationStatus : undefined,
    };

    const templateId = Number(cv.template_id || cv.templateId || 1);

    let template;
    switch (templateId) {
        case 1:
            template = <CVTemplate1 {...templateProps} />;
            break;
        case 2:
            template = <CVTemplate2 {...templateProps} />;
            break;
        case 3:
            template = <CVTemplate3 {...templateProps} />;
            break;
        case 4:
            template = <CVTemplate4 {...templateProps} />;
            break;
        case 5:
            template = <CVTemplate5 {...templateProps} />;
            break;
        case 6:
            template = <CVTemplate6 {...templateProps} />;
            break;
        default:
            template = <CVTemplate1 {...templateProps} />;
            break;
    }

    return (
        <div className="container my-4">
            {isEmployer && application && (
                <Card className="mb-4 shadow-sm border-0 bg-light">
                    <Card.Body>
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <h5 className="mb-1 text-primary">Hồ sơ ứng tuyển</h5>
                                {application.job?.title && (
                                    <div className="text-muted">
                                        Công việc: <strong>{application.job.title}</strong>
                                    </div>
                                )}
                            </div>
                            <div className="d-flex align-items-center gap-2">
                                {(application.status === "APPROVED" ||
                                    application.status === "ACCEPTED") && (
                                    <Badge bg="success" className="px-3 py-2 fs-6">
                                        Đã duyệt
                                    </Badge>
                                )}
                                {application.status === "REJECTED" && (
                                    <Badge bg="danger" className="px-3 py-2 fs-6">
                                        Từ chối
                                    </Badge>
                                )}
                                {application.status === "PENDING" && (
                                    <Badge
                                        bg="warning"
                                        text="dark"
                                        className="px-3 py-2 fs-6"
                                    >
                                        Chờ xử lý
                                    </Badge>
                                )}
                                <Button
                                    variant="outline-secondary"
                                    size="sm"
                                    onClick={() => navigate(-1)}
                                >
                                    Quay lại
                                </Button>
                            </div>
                        </div>

                        {application.status === "PENDING" && (
                            <div className="d-flex justify-content-end gap-2 mt-3 pt-2 border-top">
                                <Button
                                    variant="outline-danger"
                                    onClick={() => updateApplicationStatus("REJECTED")}
                                >
                                    Từ chối
                                </Button>
                                <Button
                                    variant="success"
                                    onClick={() => updateApplicationStatus("ACCEPTED")}
                                >
                                    Duyệt ứng viên
                                </Button>
                            </div>
                        )}
                    </Card.Body>
                </Card>
            )}

            {template}
        </div>
    );
};

export default CVDetail;