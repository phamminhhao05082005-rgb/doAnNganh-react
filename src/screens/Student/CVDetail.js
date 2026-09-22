import { useEffect, useState } from "react";
import { Spinner, Button, Badge, Card } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
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

    const isEmployer = !!applicationId;
    const editable = !isEmployer;

    const isApplicationObject = (data) => {
        return Boolean(data && (data.cv || data.job || data.job_id || data.student_id));
    };

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

    const loadEmployerApplication = async () => {
        try {
            setLoading(true);
            const res = await authApis().get(
                endpoints.employerCvDetail(applicationId)
            );

            const resData = res.data.data || res.data;

            if (!resData) {
                toast.error("Không tìm thấy dữ liệu");
                setApplication(null);
                setCV(null);
                return;
            }

            if (isApplicationObject(resData)) {
                const appStatus = String(resData.status || "PENDING").toUpperCase();
                setApplication({
                    ...resData,
                    status: appStatus,
                });

                const targetCv = resData.cv || resData;
                const cvId = targetCv?.id || id;

                if (cvId && targetCv && !targetCv.educations) {
                    try {
                        const cvRes = await authApis().get(endpoints.cv(cvId));
                        setCV(cvRes.data.data || cvRes.data);
                    } catch (cvErr) {
                        setCV(targetCv);
                    }
                } else {
                    setCV(targetCv);
                }
            } else {
                setCV(resData);
                setApplication(null);
            }
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

            const requests = [];

            for (const edu of educations || []) {
                if (edu.id) {
                    requests.push(authApis().put(endpoints.cvEducation(id, edu.id), edu));
                } else {
                    requests.push(authApis().post(endpoints.cvEducations(id), edu));
                }
            }

            for (const eduId of deletedEducationIds || []) {
                requests.push(authApis().delete(endpoints.cvEducation(id, eduId)));
            }

            
            for (const exp of experiences || []) {
                if (exp.id) {
                    requests.push(authApis().put(endpoints.cvExperience(id, exp.id), exp));
                } else {
                    requests.push(authApis().post(endpoints.cvExperiences(id), exp));
                }
            }

            for (const expId of deletedExperienceIds || []) {
                requests.push(authApis().delete(endpoints.cvExperience(id, expId)));
            }

            
            await Promise.all(requests);

            await loadStudentCV(false);
            toast.success("Lưu CV thành công!");
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Lưu CV thất bại!");
        }
    };

    
    const updateApplicationStatus = async (status) => {
        if (!application?.id) return;

        try {
            const res = await authApis().put(
                endpoints.updateApplicationStatus(application.id),
                { status }
            );

            const rawStatus = res.data.data?.status || status;
            const updatedStatus = String(rawStatus).toUpperCase();

            setApplication((prev) => ({
                ...prev,
                status: updatedStatus,
            }));

            if (["ACCEPTED", "APPROVED"].includes(updatedStatus)) {
                toast.success("Đã duyệt ứng viên");
            } else if (["REJECTED", "REJECT"].includes(updatedStatus)) {
                toast.success("Đã từ chối ứng viên");
            }
        } catch (err) {
            console.error(err);
            toast.error(
                err.response?.data?.message || "Không thể cập nhật trạng thái"
            );
        }
    };

    
    const renderStatusBadge = (status) => {
        const uppercaseStatus = String(status || "").toUpperCase();
        if (["APPROVED", "ACCEPTED"].includes(uppercaseStatus)) {
            return <Badge bg="success" className="px-3 py-2 fs-6">Đã duyệt</Badge>;
        }
        if (["REJECTED", "REJECT"].includes(uppercaseStatus)) {
            return <Badge bg="danger" className="px-3 py-2 fs-6">Từ chối</Badge>;
        }
        return <Badge bg="warning" text="dark" className="px-3 py-2 fs-6">Chờ xử lý</Badge>;
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
        editable,
        onSave: editable ? updateCV : undefined,
        application: isEmployer ? application : null,
        onUpdateStatus: isEmployer ? updateApplicationStatus : undefined,
    };

    const templateId = Number(cv.template_id || cv.templateId || 1);

    let template;
    switch (templateId) {
        case 1: template = <CVTemplate1 {...templateProps} />; break;
        case 2: template = <CVTemplate2 {...templateProps} />; break;
        case 3: template = <CVTemplate3 {...templateProps} />; break;
        case 4: template = <CVTemplate4 {...templateProps} />; break;
        case 5: template = <CVTemplate5 {...templateProps} />; break;
        case 6: template = <CVTemplate6 {...templateProps} />; break;
        default: template = <CVTemplate1 {...templateProps} />; break;
    }

    const hasValidApplication = isApplicationObject(application);

    return (
        <div className="container my-4">
            {isEmployer && (
                <div className="mb-3">
                    <Button variant="outline-secondary" size="sm" onClick={() => navigate(-1)}>
                        &larr; Quay lại
                    </Button>
                </div>
            )}

            {isEmployer && hasValidApplication && (
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
                                {renderStatusBadge(application.status)}
                            </div>
                        </div>

                        {["PENDING", "WAITING"].includes(application.status) && (
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