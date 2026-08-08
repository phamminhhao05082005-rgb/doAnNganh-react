import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {Card, Spinner, Button, Badge, Table} from "react-bootstrap";
import dayjs from "dayjs";
import { authApis, endpoints } from "../../configs/Apis";
import { toast } from "react-toastify";

const EmployerApplications = () => {

    const { jobId } = useParams();

    const [applications, setApplications] = useState([]);

    const [loading, setLoading] = useState(true);

    const loadApplications = async () => {

        try {

            setLoading(true);

            const res = await authApis().get(
                endpoints.employerApplications(jobId)
            );

            setApplications(
                res.data.data || []
            );

        } catch (err) {

            console.error(err);

            toast.error(
                err.response?.data?.message ||
                "Không thể tải danh sách ứng tuyển"
            );

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {

        loadApplications();

    }, [jobId]);

    const getStatusBadge = (status) => {

        switch (status) {

            case "ACCEPTED":

                return (
                    <Badge bg="success">
                        Đã duyệt
                    </Badge>
                );

            case "REJECTED":

                return (
                    <Badge bg="danger">
                        Từ chối
                    </Badge>
                );

            default:

                return (
                    <Badge bg="warning" text="dark">
                        Chờ xử lý
                    </Badge>
                );

        }

    };

    if (loading) {

        return (
            <div className="text-center mt-5">

                <Spinner />

            </div>
        );

    }

    return (

        <Card className="mt-4">

            <Card.Header className="d-flex justify-content-between align-items-center">

                <h4 className="mb-0">
                    Danh sách ứng tuyển
                </h4>

                <Link to={`/employer/jobs/${jobId}`}>

                    <Button variant="secondary">
                        Quay lại
                    </Button>

                </Link>

            </Card.Header>

            <Card.Body>

                {applications.length === 0 ? (

                    <div className="text-center py-5">

                        <h5>
                            Chưa có ứng viên nào
                        </h5>

                        <p className="text-muted">
                            Hiện tại chưa có ứng viên ứng tuyển vào công việc này.
                        </p>

                    </div>

                ) : (

                    <Table
                        responsive
                        bordered
                        hover
                        className="align-middle"
                    >

                        <thead>

                            <tr>

                                <th>
                                    #
                                </th>

                                <th>
                                    Ứng viên
                                </th>

                                <th>
                                    Vị trí
                                </th>

                                <th>
                                    Kinh nghiệm
                                </th>

                                <th>
                                    Ngày ứng tuyển
                                </th>

                                <th>
                                    Trạng thái
                                </th>

                                <th>
                                    Thao tác
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {applications.map(
                                (application, index) => (

                                    <tr key={application.id}>

                                        <td>
                                            {index + 1}
                                        </td>

                                        <td>

                                            <div className="d-flex align-items-center gap-2">

                                                {application.cv?.avatar && (

                                                    <img
                                                        src={application.cv.avatar}
                                                        alt="avatar"
                                                        width="45"
                                                        height="45"
                                                        style={{
                                                            objectFit: "cover",
                                                            borderRadius: "50%"
                                                        }}
                                                    />

                                                )}

                                                <div>

                                                    <div className="fw-bold">
                                                        {application.cv?.full_name}
                                                    </div>

                                                    <small className="text-muted">
                                                        {application.cv?.email}
                                                    </small>

                                                </div>

                                            </div>

                                        </td>

                                        <td>
                                            {application.cv?.job_title || "—"}
                                        </td>

                                        <td>
                                            {application.cv?.experience_year ?? 0} năm
                                        </td>

                                        <td>

                                            {application.applied_at
                                                ? dayjs(application.applied_at)
                                                    .format("DD/MM/YYYY HH:mm")
                                                : "—"}

                                        </td>

                                        <td>

                                            {getStatusBadge(
                                                application.status
                                            )}

                                        </td>

                                        <td>

                                            <Link
                                                to={`/employer/jobs/${jobId}/applications/${application.id}`}
                                            >

                                                <Button
                                                    variant="primary"
                                                    size="sm"
                                                >
                                                    Xem CV
                                                </Button>

                                            </Link>

                                        </td>

                                    </tr>

                                )
                            )}

                        </tbody>

                    </Table>

                )}

            </Card.Body>

        </Card>

    );

};

export default EmployerApplications;