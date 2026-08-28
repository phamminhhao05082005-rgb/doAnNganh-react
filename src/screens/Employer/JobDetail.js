import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { authApis, endpoints } from "../../configs/Apis";
import dayjs from "dayjs";
import { Card, Spinner, Button, Badge, Modal, Form } from "react-bootstrap";
import { useContext } from "react";
import { MyUserContext } from "../../configs/Contexts";
import { toast } from "react-toastify";

const JobDetail = () => {

    const [showApply, setShowApply] = useState(false);

    const [cvs, setCVs] = useState([]);

    const [selectedCV, setSelectedCV] = useState("");

    const [user] = useContext(MyUserContext);

    const { id } = useParams();

    const [job, setJob] = useState(null);

    const loadJob = async () => {
        console.log(endpoints.jobDetail(id));

        const res = await authApis().get(
            endpoints.jobDetail(id)
        );

        setJob(res.data.data);
    }

    const toggleBookmark = async () => {

        try {

            if (job.bookmarked) {

                await authApis().delete(
                    endpoints.unBookmark(job.id)
                );

                setJob({
                    ...job,
                    bookmarked: false
                });

                toast.success("Đã bỏ lưu việc làm");

            } else {

                await authApis().post(
                    endpoints.bookmark(job.id)
                );

                setJob({
                    ...job,
                    bookmarked: true
                });

                alert("Đã lưu việc làm");
            }

        } catch (err) {

            console.error(err);

            alert("Không thể lưu việc làm");
        }
    };

    const openApplyModal = async () => {

        try {

            const res = await authApis().get(
                endpoints.cvs
            );

            setCVs(res.data.data || []);

            if (res.data.data.length > 0)
                setSelectedCV(res.data.data[0].id);

            setShowApply(true);

        } catch (err) {

            console.error(err);

            alert("Không tải được danh sách CV");

        }

    };

    const applyJob = async () => {

        try {

            await authApis().post(
                endpoints.applications,
                {
                    job_id: job.id,
                    cv_id: selectedCV
                }
            );

            toast.success("Ứng tuyển thành công");

            setShowApply(false);

            setJob({
                ...job,
                applied: true
            });

        } catch (err) {

            console.error(err);

            toast.error(
                err.response?.data?.message ||
                "Ứng tuyển thất bại"
            );

        }

    };

    useEffect(() => {

        loadJob();

    }, [id]);

    if (!job)
        return <Spinner className="mt-5" />;

    return (



        <Card className="mt-4">

            <Card.Header className="d-flex justify-content-between">

                <h3>

                    Chi tiết tin tuyển dụng

                </h3>

                <Link
                    to={
                        user?.role === "EMPLOYER"
                            ? "/employer/jobs"
                            : "/student"
                    }
                >
                    <Button variant="secondary">
                        Quay lại
                    </Button>
                </Link>

            </Card.Header>

            <Card.Body>

                <h4>

                    {job.title}

                </h4>

                <hr />

                <p>

                    <b>Danh mục:</b>

                    {" "}

                    {job.category?.name}

                </p>

                <p>

                    <b>Địa điểm:</b>

                    {" "}

                    {job.location}

                </p>

                <p>

                    <b>Kinh nghiệm:</b>

                    {" "}

                    {job.experience?.trim()
                        ? job.experience
                        : "Không yêu cầu"}

                </p>

                <p>

                    <b>Lương theo giờ:</b>

                    {" "}

                    {job.salary_min.toLocaleString()}đ

                    {" - "}

                    {job.salary_max.toLocaleString()}đ

                </p>

                <p>

                    <b>Hạn nộp:</b>

                    {" "}

                    {dayjs(job.deadline).format("DD/MM/YYYY")}

                </p>

                <p>

                    <b>Trạng thái:</b>

                    {" "}

                    {

                        job.status ?

                            <Badge bg="success">

                                Đang tuyển

                            </Badge>

                            :

                            <Badge bg="danger">

                                Đã đóng

                            </Badge>

                    }

                </p>

                <hr />

                <h5>

                    Mô tả công việc

                </h5>

                <p>

                    {job.description}

                </p>

                <hr />

                <h5>

                    Yêu cầu

                </h5>

                <p>

                    {job.requirement}

                </p>

                <hr />

                <h5>

                    Kỹ năng yêu cầu

                </h5>

                {

                    job.skills?.length > 0 ?

                        job.skills.map(skill => (

                            <Badge
                                bg="primary"
                                className="me-2"
                                key={skill.id}
                            >

                                {skill.name}

                            </Badge>

                        ))

                        :

                        <p>

                            Không có

                        </p>

                }

                <hr />

                <hr />

                <div className="d-flex gap-2">

                    {user?.role === "EMPLOYER" && (
                        <>
                            <Link to={`/employer/jobs/${job.id}/edit`}>
                                <Button variant="warning">
                                    Chỉnh sửa
                                </Button>
                            </Link>

                            <Link to={`/employer/jobs/${job.id}/applications`}>
                                <Button variant="primary">
                                    Danh sách ứng tuyển
                                </Button>
                            </Link>
                        </>
                    )}

                    {user?.role === "STUDENT" && (
                        <>
                            <Link to={`/companies/${job.company_id || job.company?.id}`}>
                                <Button variant="info" className="text-white">
                                    Xem thông tin công ty
                                </Button>
                            </Link>

                            {!job.applied && (
                                <Button
                                    variant="success"
                                    onClick={openApplyModal}
                                >
                                    Ứng tuyển
                                </Button>
                            )}

                            <Button
                                variant={
                                    job.bookmarked
                                        ? "danger"
                                        : "outline-danger"
                                }
                                onClick={toggleBookmark}
                            >
                                {
                                    job.bookmarked
                                        ? "Bỏ lưu"
                                        : "Lưu việc làm"
                                }
                            </Button>

                        </>
                    )}

                </div>

            </Card.Body>


            <Modal
                show={showApply}
                onHide={() => setShowApply(false)}
            >

                <Modal.Header closeButton>

                    <Modal.Title>

                        Chọn CV để ứng tuyển

                    </Modal.Title>

                </Modal.Header>

                <Modal.Body>

                    {
                        cvs.length === 0 ?

                            <p>

                                Bạn chưa có CV.
                                Hãy tạo CV trước.

                            </p>

                            :

                            <Form.Group>

                                <Form.Label>

                                    CV

                                </Form.Label>

                                <Form.Select

                                    value={selectedCV}

                                    onChange={(e) =>
                                        setSelectedCV(e.target.value)
                                    }

                                >

                                    {
                                        cvs.map(cv => (

                                            <option
                                                key={cv.id}
                                                value={cv.id}
                                            >

                                                {cv.title}

                                            </option>

                                        ))
                                    }

                                </Form.Select>

                            </Form.Group>

                    }

                </Modal.Body>

                <Modal.Footer>

                    <Button
                        variant="secondary"
                        onClick={() => setShowApply(false)}
                    >
                        Hủy
                    </Button>

                    <Button

                        variant="success"

                        disabled={
                            cvs.length === 0
                        }

                        onClick={applyJob}

                    >

                        Xác nhận ứng tuyển

                    </Button>

                </Modal.Footer>

            </Modal>
        </Card>

    )

}

export default JobDetail;