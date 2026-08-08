import { useEffect, useState } from "react";
import {Card, Spinner, Table, Badge, Button} from "react-bootstrap";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import { authApis, endpoints } from "../../configs/Apis";
import { toast } from "react-toastify";

const StudentApplications = () => {

    const [loading, setLoading] = useState(true);

    const [applications, setApplications] = useState([]);

    const loadApplications = async () => {

        try {

            const res = await authApis().get(
                endpoints.myApplications
            );

            setApplications(res.data.data || []);

        } catch (err) {

            console.error(err);

            alert("Không thể tải danh sách ứng tuyển");

        } finally {

            setLoading(false);

        }

    };

    const removeApplication = async (id) => {

        if (
            !window.confirm(
                "Bạn có chắc muốn hủy ứng tuyển?"
            )
        ) {
            return;
        }

        try {

            await authApis().delete(
                endpoints.deleteApplication(id)
            );

            toast.success(
                "Đã hủy ứng tuyển"
            );

            loadApplications();

        } catch (err) {

            console.error(err);

            toast.error(
                err.response?.data?.message ||
                "Không thể hủy ứng tuyển"
            );

        }

    };

    useEffect(() => {

        loadApplications();

    }, []);

    const renderStatus = (status) => {

        switch (status) {

            case "PENDING":

                return (
                    <Badge bg="warning">
                        Chờ duyệt
                    </Badge>
                );

            case "APPROVED":

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
                    <Badge bg="secondary">
                        {status}
                    </Badge>
                );
        }

    };

    if (loading)

        return (
            <div className="text-center mt-5">
                <Spinner animation="border" />
            </div>
        );

    return (

        <Card className="shadow mt-4">

            <Card.Header>

                <h3>
                    Danh sách việc làm đã ứng tuyển
                </h3>

            </Card.Header>

            <Card.Body>

                {

                    applications.length === 0 ?

                        <h5 className="text-center py-5">

                            Bạn chưa ứng tuyển công việc nào.

                        </h5>

                        :

                        <Table
                            bordered
                            hover
                            responsive
                        >

                            <thead>

                                <tr>

                                    <th>#</th>

                                    <th>Công việc</th>

                                    <th>Công ty</th>

                                    <th>CV sử dụng</th>

                                    <th>Ngày ứng tuyển</th>

                                    <th>Trạng thái</th>

                                    <th></th>

                                </tr>

                            </thead>

                            <tbody>

                                {

                                    applications.map((a, index) => (

                                        <tr key={a.id}>

                                            <td>

                                                {index + 1}

                                            </td>

                                            <td>

                                                {a.job?.title}

                                            </td>

                                            <td>

                                                {a.job?.company?.name}

                                            </td>

                                            <td>

                                                {a.cv?.title}

                                            </td>

                                            <td>

                                                {

                                                    dayjs(a.applied_at).format(
                                                        "DD/MM/YYYY HH:mm"
                                                    )

                                                }

                                            </td>

                                            <td>

                                                {

                                                    renderStatus(
                                                        a.status
                                                    )

                                                }

                                            </td>

                                            <td>

                                                <Link
                                                    to={`/jobs/${a.job.id}`}
                                                >

                                                    <Button
                                                        size="sm"
                                                    >
                                                        Xem việc làm
                                                    </Button>

                                                </Link>

                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    disabled={
                                                        a.status !== "PENDING"
                                                    }
                                                    onClick={() =>
                                                        removeApplication(a.id)
                                                    }
                                                >
                                                    Hủy ứng tuyển
                                                </Button>

                                            </td>

                                        </tr>

                                    ))

                                }

                            </tbody>

                        </Table>

                }

            </Card.Body>

        </Card>

    );

};

export default StudentApplications;